// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.24;

import "@openzeppelin/contracts-upgradeable/token/ERC1155/ERC1155Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/ReentrancyGuardUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";

/**
 * @title SafeLandFridda
 * @author SafeLand Morocco
 * @notice Moteur de succession automatisé — Fridda (ERC-1155)
 * @dev Gère la distribution des parts successorales conformément au Code de la Famille marocain.
 *      Chaque titre foncier (tokenId ERC-721) devient un ensemble de parts ERC-1155.
 *      Les héritiers reçoivent des parts proportionnelles à leurs droits légaux.
 */
contract SafeLandFridda is
    ERC1155Upgradeable,
    AccessControlUpgradeable,
    ReentrancyGuardUpgradeable,
    UUPSUpgradeable
{
    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");
    bytes32 public constant NOTARY_ROLE = keccak256("NOTARY_ROLE");

    // ─── Structures ───────────────────────────────────────
    struct SuccessionDossier {
        uint256 nftTokenId;          // Référence au SafeLandNFT
        address deceasedOwner;       // Ancien propriétaire (de cujus)
        uint256 totalShares;         // Total parts (ex: 24 pour faciliter les fractions islamiques)
        address[] heirs;             // Liste des héritiers
        uint256[] shares;            // Parts correspondantes
        bytes32 actDecesCID;         // CID IPFS de l'acte de décès
        bytes32 friddaDocCID;        // CID IPFS du document Fridda (notarié)
        bool isFinalized;
        uint256 createdAt;
        uint256 finalizedAt;
    }

    enum VoteType { Sell, Rent, Renovate }

    struct Proposal {
        uint256 dossierId;
        VoteType voteType;
        string description;
        uint256 votesFor;            // Somme des parts ayant voté pour
        uint256 votesAgainst;
        uint256 totalEligible;       // Total des parts
        uint256 quorumBps;           // Quorum en BPS (6667 = 2/3)
        uint256 deadline;
        bool executed;
        mapping(address => bool) hasVoted;
    }

    // ─── État ─────────────────────────────────────────────
    uint256 private _dossierCounter;
    uint256 private _proposalCounter;

    mapping(uint256 => SuccessionDossier) private _dossiers;
    mapping(uint256 => Proposal) private _proposals;
    mapping(uint256 => uint256) private _nftToDossier;  // nftTokenId → dossierId

    // ─── Événements ───────────────────────────────────────
    event SuccessionOpened(uint256 indexed dossierId, uint256 indexed nftTokenId, address deceased);
    event SharesDistributed(uint256 indexed dossierId, address[] heirs, uint256[] shares);
    event SuccessionFinalized(uint256 indexed dossierId);
    event ProposalCreated(uint256 indexed proposalId, uint256 indexed dossierId, VoteType voteType);
    event VoteCast(uint256 indexed proposalId, address voter, bool inFavor, uint256 weight);
    event ProposalExecuted(uint256 indexed proposalId);

    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() {
        _disableInitializers();
    }

    // ─── Initialisation ──────────────────────────────────
    function initialize(address admin, string calldata metadataUri) public initializer {
        __ERC1155_init(metadataUri);
        __AccessControl_init();
        __ReentrancyGuard_init();
        __UUPSUpgradeable_init();

        _grantRole(DEFAULT_ADMIN_ROLE, admin);
        _grantRole(ADMIN_ROLE, admin);
    }

    // ─── Ouvrir une succession ────────────────────────────
    /**
     * @notice Le notaire ouvre un dossier de succession
     * @param nftTokenId ID du titre foncier (SafeLandNFT)
     * @param deceasedOwner Adresse du propriétaire décédé
     * @param totalShares Total des parts (recommandé: 24 pour la répartition islamique)
     * @param actDecesCID Hash IPFS de l'acte de décès
     * @param friddaDocCID Hash IPFS du document Fridda
     */
    function openSuccession(
        uint256 nftTokenId,
        address deceasedOwner,
        uint256 totalShares,
        bytes32 actDecesCID,
        bytes32 friddaDocCID
    ) external onlyRole(NOTARY_ROLE) returns (uint256) {
        require(_nftToDossier[nftTokenId] == 0, "Fridda: succession already open");
        require(totalShares > 0, "Fridda: zero shares");

        unchecked { _dossierCounter++; }
        uint256 dossierId = _dossierCounter;

        _dossiers[dossierId] = SuccessionDossier({
            nftTokenId: nftTokenId,
            deceasedOwner: deceasedOwner,
            totalShares: totalShares,
            heirs: new address[](0),
            shares: new uint256[](0),
            actDecesCID: actDecesCID,
            friddaDocCID: friddaDocCID,
            isFinalized: false,
            createdAt: block.timestamp,
            finalizedAt: 0
        });

        _nftToDossier[nftTokenId] = dossierId;

        emit SuccessionOpened(dossierId, nftTokenId, deceasedOwner);
        return dossierId;
    }

    // ─── Distribuer les parts ─────────────────────────────
    /**
     * @notice Le notaire distribue les parts aux héritiers
     * @dev La somme des parts doit égaler totalShares
     */
    function distributeShares(
        uint256 dossierId,
        address[] calldata heirs,
        uint256[] calldata shares
    ) external onlyRole(NOTARY_ROLE) nonReentrant {
        SuccessionDossier storage dossier = _dossiers[dossierId];
        require(!dossier.isFinalized, "Fridda: already finalized");
        require(heirs.length == shares.length, "Fridda: length mismatch");
        require(heirs.length > 0, "Fridda: no heirs");

        // Vérifier que le total est correct
        uint256 sum = 0;
        uint256 heirsLen = heirs.length;
        for (uint256 i = 0; i < heirsLen;) {
            require(heirs[i] != address(0), "Fridda: zero address heir");
            require(shares[i] > 0, "Fridda: zero share");
            unchecked { sum += shares[i]; ++i; }
        }
        require(sum == dossier.totalShares, "Fridda: shares mismatch total");

        // Stocker les héritiers
        dossier.heirs = heirs;
        dossier.shares = shares;

        // Mint ERC-1155 : chaque héritier reçoit ses parts (tokenId = dossierId)
        for (uint256 i = 0; i < heirsLen;) {
            _mint(heirs[i], dossierId, shares[i], "");
            unchecked { ++i; }
        }

        emit SharesDistributed(dossierId, heirs, shares);
    }

    // ─── Finaliser la succession ──────────────────────────
    function finalizeSuccession(uint256 dossierId) external onlyRole(NOTARY_ROLE) {
        SuccessionDossier storage dossier = _dossiers[dossierId];
        require(!dossier.isFinalized, "Fridda: already finalized");
        require(dossier.heirs.length > 0, "Fridda: no shares distributed");

        dossier.isFinalized = true;
        dossier.finalizedAt = block.timestamp;

        emit SuccessionFinalized(dossierId);
    }

    // ─── Gouvernance de l'indivision ──────────────────────
    /**
     * @notice Un héritier crée une proposition (vente, location, rénovation)
     * @param dossierId ID du dossier de succession
     * @param voteType Type de vote
     * @param description Description de la proposition
     * @param quorumBps Quorum requis en BPS (6667 = 2/3 pour actes de disposition)
     * @param durationDays Durée du vote en jours
     */
    function createProposal(
        uint256 dossierId,
        VoteType voteType,
        string calldata description,
        uint256 quorumBps,
        uint256 durationDays
    ) external returns (uint256) {
        require(_dossiers[dossierId].isFinalized, "Fridda: not finalized");
        require(balanceOf(msg.sender, dossierId) > 0, "Fridda: not an heir");
        require(quorumBps > 0 && quorumBps <= 10000, "Fridda: invalid quorum");

        unchecked { _proposalCounter++; }
        uint256 proposalId = _proposalCounter;

        Proposal storage prop = _proposals[proposalId];
        prop.dossierId = dossierId;
        prop.voteType = voteType;
        prop.description = description;
        prop.totalEligible = _dossiers[dossierId].totalShares;
        prop.quorumBps = quorumBps;
        prop.deadline = block.timestamp + (durationDays * 1 days);

        emit ProposalCreated(proposalId, dossierId, voteType);
        return proposalId;
    }

    /**
     * @notice Un héritier vote (poids = nombre de parts détenues)
     */
    function vote(uint256 proposalId, bool inFavor) external {
        Proposal storage prop = _proposals[proposalId];
        require(block.timestamp < prop.deadline, "Fridda: vote ended");
        require(!prop.hasVoted[msg.sender], "Fridda: already voted");

        uint256 dossierId = prop.dossierId;
        uint256 weight = balanceOf(msg.sender, dossierId);
        require(weight > 0, "Fridda: no voting power");

        prop.hasVoted[msg.sender] = true;

        if (inFavor) {
            unchecked { prop.votesFor += weight; }
        } else {
            unchecked { prop.votesAgainst += weight; }
        }

        emit VoteCast(proposalId, msg.sender, inFavor, weight);
    }

    /**
     * @notice Exécuter une proposition approuvée
     */
    function executeProposal(uint256 proposalId) external onlyRole(NOTARY_ROLE) {
        Proposal storage prop = _proposals[proposalId];
        require(block.timestamp >= prop.deadline, "Fridda: vote not ended");
        require(!prop.executed, "Fridda: already executed");

        uint256 totalEligible = prop.totalEligible;
        uint256 quorumBps = prop.quorumBps;
        uint256 required;
        unchecked { required = (totalEligible * quorumBps) / 10000; }
        require(prop.votesFor >= required, "Fridda: quorum not met");

        prop.executed = true;
        emit ProposalExecuted(proposalId);
    }

    // ─── Vues ─────────────────────────────────────────────
    function getDossier(uint256 dossierId) external view returns (
        uint256 nftTokenId,
        address deceasedOwner,
        uint256 totalShares,
        address[] memory heirs,
        uint256[] memory shares,
        bool isFinalized
    ) {
        SuccessionDossier storage d = _dossiers[dossierId];
        return (d.nftTokenId, d.deceasedOwner, d.totalShares, d.heirs, d.shares, d.isFinalized);
    }

    function getProposal(uint256 proposalId) external view returns (
        uint256 dossierId,
        VoteType voteType,
        string memory description,
        uint256 votesFor,
        uint256 votesAgainst,
        uint256 quorumBps,
        uint256 deadline,
        bool executed
    ) {
        Proposal storage p = _proposals[proposalId];
        return (p.dossierId, p.voteType, p.description, p.votesFor, p.votesAgainst, p.quorumBps, p.deadline, p.executed);
    }

    function getDossierByNft(uint256 nftTokenId) external view returns (uint256) {
        return _nftToDossier[nftTokenId];
    }

    function totalDossiers() external view returns (uint256) {
        return _dossierCounter;
    }

    // ─── Overrides ────────────────────────────────────────
    function supportsInterface(bytes4 interfaceId)
        public view override(ERC1155Upgradeable, AccessControlUpgradeable) returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }

    function _authorizeUpgrade(address) internal override onlyRole(ADMIN_ROLE) {}
}
