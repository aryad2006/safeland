// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.24;

import "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/ReentrancyGuardUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/PausableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";

interface ISafeLandNFT {
    function ownerOf(uint256 tokenId) external view returns (address);
    function canTransfer(uint256 tokenId) external view returns (bool);
    function transferProperty(uint256 tokenId, address to, string calldata txType, bytes32 documentHash, address notary) external;
}

/**
 * @title SafeLandEscrow
 * @author SafeLand Morocco
 * @notice Smart-Escrow — Séquestre atomique pour les ventes foncières
 * @dev Gère le flux de paiement avec fractionnement fiscal automatique (At-the-Source).
 *      - 4% → DGI (Droits d'enregistrement)
 *      - 1% → ANCFCC (Frais de conservation)
 *      - Solde → Vendeur
 */
contract SafeLandEscrow is
    AccessControlUpgradeable,
    ReentrancyGuardUpgradeable,
    PausableUpgradeable,
    UUPSUpgradeable
{
    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");
    bytes32 public constant NOTARY_ROLE = keccak256("NOTARY_ROLE");

    // ─── Configuration fiscale ────────────────────────────
    uint256 public constant DGI_FEE_BPS = 400;       // 4% droits d'enregistrement
    uint256 public constant ANCFCC_FEE_BPS = 100;     // 1% conservation foncière
    uint256 public constant BPS_DENOMINATOR = 10000;

    // ─── Platform fee (configurable, revenue operateur) ──
    uint256 public platformFeeBps;                     // 0-100 BPS (0-1%), defaut 10 = 0.1%
    address public platformWallet;

    // ─── Adresses de collecte ─────────────────────────────
    address public dgiWallet;       // Trésor Public (DGI)
    address public ancfccWallet;    // ANCFCC

    // ─── Référence au contrat NFT ─────────────────────────
    ISafeLandNFT public nftContract;

    // ─── Structure d'une transaction ──────────────────────
    enum EscrowStatus { Created, SellerSigned, BuyerFunded, NotarySigned, Completed, Cancelled }

    struct EscrowDeal {
        uint256 tokenId;
        address seller;
        address buyer;
        address notary;
        uint256 salePrice;         // en wei
        uint256 deposit;           // montant déposé par l'acheteur
        bytes32 documentHash;
        EscrowStatus status;
        uint256 createdAt;
        uint256 completedAt;
    }

    // ─── État ─────────────────────────────────────────────
    uint256 private _dealCounter;
    mapping(uint256 => EscrowDeal) private _deals;
    mapping(uint256 => uint256) private _tokenToDeal;  // tokenId → dealId actif

    // ─── Événements ───────────────────────────────────────
    event DealCreated(uint256 indexed dealId, uint256 indexed tokenId, address seller, address buyer, uint256 price);
    event SellerSigned(uint256 indexed dealId);
    event BuyerFunded(uint256 indexed dealId, uint256 amount);
    event NotaryValidated(uint256 indexed dealId);
    event DealCompleted(uint256 indexed dealId, uint256 dgiAmount, uint256 ancfccAmount, uint256 platformFee, uint256 sellerNet);
    event PlatformFeeCollected(uint256 indexed dealId, uint256 amount, address wallet);
    event PlatformFeeUpdated(uint256 oldBps, uint256 newBps);
    event DealCancelled(uint256 indexed dealId, string reason);

    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() {
        _disableInitializers();
    }

    // ─── Initialisation ──────────────────────────────────
    function initialize(
        address admin,
        address _nftContract,
        address _dgiWallet,
        address _ancfccWallet
    ) public initializer {
        __AccessControl_init();
        __ReentrancyGuard_init();
        __Pausable_init();
        __UUPSUpgradeable_init();

        _grantRole(DEFAULT_ADMIN_ROLE, admin);
        _grantRole(ADMIN_ROLE, admin);

        require(_nftContract != address(0), "Escrow: zero NFT address");
        require(_dgiWallet != address(0), "Escrow: zero DGI address");
        require(_ancfccWallet != address(0), "Escrow: zero ANCFCC address");

        nftContract = ISafeLandNFT(_nftContract);
        dgiWallet = _dgiWallet;
        ancfccWallet = _ancfccWallet;
    }

    // ─── Créer un escrow ──────────────────────────────────
    /**
     * @notice Un notaire initie une vente
     */
    function createDeal(
        uint256 tokenId,
        address seller,
        address buyer,
        uint256 salePrice,
        bytes32 documentHash
    ) external onlyRole(NOTARY_ROLE) whenNotPaused returns (uint256) {
        require(seller != buyer, "Escrow: seller is buyer");
        require(nftContract.ownerOf(tokenId) == seller, "Escrow: not owner");
        require(nftContract.canTransfer(tokenId), "Escrow: token not transferable");
        require(salePrice > 0, "Escrow: zero price");
        require(_tokenToDeal[tokenId] == 0, "Escrow: deal already active");

        unchecked { _dealCounter++; }
        uint256 dealId = _dealCounter;

        _deals[dealId] = EscrowDeal({
            tokenId: tokenId,
            seller: seller,
            buyer: buyer,
            notary: msg.sender,
            salePrice: salePrice,
            deposit: 0,
            documentHash: documentHash,
            status: EscrowStatus.Created,
            createdAt: block.timestamp,
            completedAt: 0
        });

        _tokenToDeal[tokenId] = dealId;

        emit DealCreated(dealId, tokenId, seller, buyer, salePrice);
        return dealId;
    }

    // ─── Le vendeur signe ─────────────────────────────────
    function sellerSign(uint256 dealId) external {
        EscrowDeal storage deal = _deals[dealId];
        require(deal.status == EscrowStatus.Created, "Escrow: wrong status");
        require(msg.sender == deal.seller, "Escrow: not seller");

        deal.status = EscrowStatus.SellerSigned;
        emit SellerSigned(dealId);
    }

    // ─── L'acheteur dépose les fonds ──────────────────────
    function buyerDeposit(uint256 dealId) external payable nonReentrant {
        EscrowDeal storage deal = _deals[dealId];
        require(deal.status == EscrowStatus.SellerSigned, "Escrow: seller must sign first");
        require(msg.sender == deal.buyer, "Escrow: not buyer");
        require(msg.value == deal.salePrice, "Escrow: wrong amount");

        deal.deposit = msg.value;
        deal.status = EscrowStatus.BuyerFunded;
        emit BuyerFunded(dealId, msg.value);
    }

    // ─── Le notaire valide et déclenche le transfert ──────
    /**
     * @notice Validation finale : fractionnement fiscal + transfert NFT
     */
    function notaryComplete(uint256 dealId) external onlyRole(NOTARY_ROLE) nonReentrant whenNotPaused {
        EscrowDeal storage deal = _deals[dealId];
        require(deal.status == EscrowStatus.BuyerFunded, "Escrow: not funded");
        require(msg.sender == deal.notary, "Escrow: not assigned notary");

        uint256 price = deal.salePrice;
        uint256 tokenId = deal.tokenId;
        address seller = deal.seller;
        address buyer = deal.buyer;
        bytes32 docHash = deal.documentHash;
        address notary = deal.notary;

        // Fractionnement fiscal At-the-Source + platform fee
        uint256 dgiAmount;
        uint256 ancfccAmount;
        uint256 platformFee;
        uint256 sellerNet;
        unchecked {
            dgiAmount = (price * DGI_FEE_BPS) / BPS_DENOMINATOR;
            ancfccAmount = (price * ANCFCC_FEE_BPS) / BPS_DENOMINATOR;
            platformFee = (price * platformFeeBps) / BPS_DENOMINATOR;
            sellerNet = price - dgiAmount - ancfccAmount - platformFee;
        }

        // Effects avant interactions (CEI pattern)
        deal.status = EscrowStatus.Completed;
        deal.completedAt = block.timestamp;
        _tokenToDeal[tokenId] = 0;

        // Transfert NFT AVANT les paiements (CEI strict)
        nftContract.transferProperty(
            tokenId,
            buyer,
            "sale",
            docHash,
            notary
        );

        // Paiements — apres transfert NFT reussi
        _safeTransfer(dgiWallet, dgiAmount);
        _safeTransfer(ancfccWallet, ancfccAmount);
        if (platformFee > 0 && platformWallet != address(0)) {
            _safeTransfer(platformWallet, platformFee);
            emit PlatformFeeCollected(dealId, platformFee, platformWallet);
        } else {
            sellerNet += platformFee; // Si pas de platform wallet, tout au vendeur
            platformFee = 0;
        }
        _safeTransfer(seller, sellerNet);

        emit DealCompleted(dealId, dgiAmount, ancfccAmount, platformFee, sellerNet);
    }

    // ─── Annulation ───────────────────────────────────────
    function cancelDeal(uint256 dealId, string calldata reason) external nonReentrant {
        EscrowDeal storage deal = _deals[dealId];
        require(
            msg.sender == deal.notary || hasRole(ADMIN_ROLE, msg.sender),
            "Escrow: not authorized"
        );
        require(deal.status != EscrowStatus.Completed, "Escrow: already completed");

        // Effects avant interactions (CEI pattern)
        uint256 tokenId = deal.tokenId;
        address buyer = deal.buyer;
        uint256 refund = deal.deposit;

        deal.status = EscrowStatus.Cancelled;
        _tokenToDeal[tokenId] = 0;

        // Rembourser l'acheteur si des fonds ont été déposés
        if (refund > 0) {
            deal.deposit = 0;
            _safeTransfer(buyer, refund);
        }

        emit DealCancelled(dealId, reason);
    }

    // ─── Vues ─────────────────────────────────────────────
    function getDeal(uint256 dealId) external view returns (EscrowDeal memory) {
        return _deals[dealId];
    }

    function getActiveDeal(uint256 tokenId) external view returns (uint256) {
        return _tokenToDeal[tokenId];
    }

    function totalDeals() external view returns (uint256) {
        return _dealCounter;
    }

    // ─── Admin ────────────────────────────────────────────
    function setDgiWallet(address wallet) external onlyRole(ADMIN_ROLE) {
        require(wallet != address(0), "Escrow: zero address");
        dgiWallet = wallet;
    }

    function setAncfccWallet(address wallet) external onlyRole(ADMIN_ROLE) {
        require(wallet != address(0), "Escrow: zero address");
        ancfccWallet = wallet;
    }

    /**
     * @notice Configure le platform fee (0-100 BPS, soit 0-1%)
     * @param feeBps Fee en basis points (10 = 0.1%)
     * @param wallet Adresse de collecte (adresse zero = desactive)
     */
    function setPlatformFee(uint256 feeBps, address wallet) external onlyRole(ADMIN_ROLE) {
        require(feeBps <= 100, "Escrow: fee too high (max 1%)");
        uint256 oldBps = platformFeeBps;
        platformFeeBps = feeBps;
        platformWallet = wallet;
        emit PlatformFeeUpdated(oldBps, feeBps);
    }

    function pause() external onlyRole(ADMIN_ROLE) { _pause(); }
    function unpause() external onlyRole(ADMIN_ROLE) { _unpause(); }

    // ─── Interne ──────────────────────────────────────────
    function _safeTransfer(address to, uint256 amount) private {
        (bool ok, ) = payable(to).call{value: amount}("");
        require(ok, "Escrow: transfer failed");
    }

    function _authorizeUpgrade(address) internal override onlyRole(ADMIN_ROLE) {}

    // SC-M1: Storage gap pour futures upgrades
    uint256[50] private __gap;
}
