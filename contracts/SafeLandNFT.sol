// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.24;

import "@openzeppelin/contracts-upgradeable/token/ERC721/ERC721Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC721/extensions/ERC721URIStorageUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC721/extensions/ERC721EnumerableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/PausableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/ReentrancyGuardUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";

/**
 * @title SafeLandNFT
 * @author SafeLand Morocco
 * @notice Contrat principal — Titre Foncier NFT (ERC-721)
 * @dev Chaque NFT représente un titre foncier unique sur la blockchain souveraine.
 *      Conforme Loi 39-08 (Conservation Foncière) et Loi 43-20 (Signature Électronique).
 */
contract SafeLandNFT is
    ERC721Upgradeable,
    ERC721URIStorageUpgradeable,
    ERC721EnumerableUpgradeable,
    AccessControlUpgradeable,
    PausableUpgradeable,
    ReentrancyGuardUpgradeable,
    UUPSUpgradeable
{
    // ─── Rôles ────────────────────────────────────────────
    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");
    bytes32 public constant AGENT_ROLE = keccak256("AGENT_ROLE");
    bytes32 public constant NOTARY_ROLE = keccak256("NOTARY_ROLE");
    bytes32 public constant JUSTICE_ROLE = keccak256("JUSTICE_ROLE");
    bytes32 public constant UPGRADER_ROLE = keccak256("UPGRADER_ROLE");

    // Hashes pré-calculés pour comparaisons de type d'encumbrance
    bytes32 private constant _HYPOTHEQUE_HASH = keccak256("hypotheque");
    bytes32 private constant _SAISIE_HASH = keccak256("saisie");
    bytes32 private constant _SAFE_LOCK_HASH = keccak256("safe_lock");

    // ─── Structures ───────────────────────────────────────
    struct PropertyData {
        string titreFoncier;      // Numéro titre foncier ANCFCC
        string propertyType;       // "villa", "appartement", "terrain", "melk", "soulaliyate"
        uint256 surface;           // Surface en m²
        string city;
        string district;
        int256 latitude;           // GPS × 1e6
        int256 longitude;          // GPS × 1e6
        uint256 creationDate;
        address validator;         // Agent ayant validé
        bool isActive;
        bytes32 documentHash;      // Hash SHA-256 des documents scellés
    }

    struct TransactionRecord {
        address from;
        address to;
        uint256 timestamp;
        string txType;             // "creation", "sale", "inheritance", "justice_override"
        bytes32 documentHash;
        address notary;            // Notaire ayant certifié
    }

    struct Encumbrance {
        string encType;            // "hypotheque", "servitude", "saisie", "safe_lock"
        address creditor;
        uint256 amount;            // Montant en wei (MAD × 1e18)
        uint256 startDate;
        uint256 endDate;           // 0 = illimité
        bool isActive;
    }

    // ─── État ─────────────────────────────────────────────
    uint256 private _tokenIdCounter;

    mapping(uint256 => PropertyData) private _properties;
    mapping(uint256 => TransactionRecord[]) private _history;
    mapping(uint256 => Encumbrance[]) private _encumbrances;
    mapping(string => uint256) private _titreFoncierToToken;
    mapping(uint256 => bool) private _transferLocked;       // Safe-Lock / Travel Lock
    mapping(uint256 => bool) private _frozenByJustice;      // Justice Override freeze

    // ─── Événements ───────────────────────────────────────
    event PropertyCreated(uint256 indexed tokenId, string titreFoncier, address owner, address validator);
    event PropertyTransferred(uint256 indexed tokenId, address indexed from, address indexed to, string txType);
    event EncumbranceAdded(uint256 indexed tokenId, string encType, address creditor);
    event EncumbranceRemoved(uint256 indexed tokenId, uint256 index);
    event TransferLocked(uint256 indexed tokenId, string reason);
    event TransferUnlocked(uint256 indexed tokenId);
    event PropertyFrozenByJustice(uint256 indexed tokenId, bytes32 judgmentHash);
    event PropertyBurned(uint256 indexed tokenId, bytes32 judgmentHash);

    // ─── Modificateurs ────────────────────────────────────
    modifier whenNotLocked(uint256 tokenId) {
        require(!_transferLocked[tokenId], "SafeLand: transfer locked");
        require(!_frozenByJustice[tokenId], "SafeLand: frozen by justice");
        _;
    }

    modifier tokenExists(uint256 tokenId) {
        require(_exists(tokenId), "SafeLand: token does not exist");
        _;
    }

    // ─── Initialisation ──────────────────────────────────
    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() {
        _disableInitializers();
    }

    function initialize(address admin) public initializer {
        __ERC721_init("SafeLand Property", "SLFND");
        __ERC721URIStorage_init();
        __ERC721Enumerable_init();
        __AccessControl_init();
        __Pausable_init();
        __ReentrancyGuard_init();
        __UUPSUpgradeable_init();

        _grantRole(DEFAULT_ADMIN_ROLE, admin);
        _grantRole(ADMIN_ROLE, admin);
        _grantRole(UPGRADER_ROLE, admin);
        // _tokenIdCounter reste à 0, premier mint donne tokenId=1 (après ++)
        // 0 sert de sentinelle "inexistant" dans _titreFoncierToToken
    }

    // ─── Création de propriété ────────────────────────────
    /**
     * @notice Crée un nouveau NFT foncier
     * @param to Propriétaire
     * @param titreFoncier Numéro officiel ANCFCC
     * @param propertyType Type de bien
     * @param surface Surface m²
     * @param city Ville
     * @param district Quartier
     * @param latitude GPS × 1e6
     * @param longitude GPS × 1e6
     * @param uri Métadonnées IPFS (CID)
     * @param documentHash Hash SHA-256 du dossier scellé
     */
    function createProperty(
        address to,
        string calldata titreFoncier,
        string calldata propertyType,
        uint256 surface,
        string calldata city,
        string calldata district,
        int256 latitude,
        int256 longitude,
        string calldata uri,
        bytes32 documentHash
    ) external onlyRole(AGENT_ROLE) whenNotPaused nonReentrant returns (uint256) {
        require(to != address(0), "SafeLand: zero address");
        require(bytes(titreFoncier).length > 0, "SafeLand: empty titre");
        require(_titreFoncierToToken[titreFoncier] == 0, "SafeLand: titre exists");
        require(surface > 0, "SafeLand: zero surface");

        unchecked { _tokenIdCounter++; }
        uint256 tokenId = _tokenIdCounter;

        _safeMint(to, tokenId);
        _setTokenURI(tokenId, uri);

        _properties[tokenId] = PropertyData({
            titreFoncier: titreFoncier,
            propertyType: propertyType,
            surface: surface,
            city: city,
            district: district,
            latitude: latitude,
            longitude: longitude,
            creationDate: block.timestamp,
            validator: msg.sender,
            isActive: true,
            documentHash: documentHash
        });

        _titreFoncierToToken[titreFoncier] = tokenId;

        _history[tokenId].push(TransactionRecord({
            from: address(0),
            to: to,
            timestamp: block.timestamp,
            txType: "creation",
            documentHash: documentHash,
            notary: address(0)
        }));

        emit PropertyCreated(tokenId, titreFoncier, to, msg.sender);
        return tokenId;
    }

    // ─── Transfert de propriété ───────────────────────────
    /**
     * @notice Transfère un titre foncier (requiert Agent + pas de verrou)
     */
    function transferProperty(
        uint256 tokenId,
        address to,
        string calldata txType,
        bytes32 documentHash,
        address notary
    ) external onlyRole(AGENT_ROLE) whenNotPaused whenNotLocked(tokenId) tokenExists(tokenId) nonReentrant {
        require(to != address(0), "SafeLand: zero address");

        address from = ownerOf(tokenId);
        _update(to, tokenId, from);

        _history[tokenId].push(TransactionRecord({
            from: from,
            to: to,
            timestamp: block.timestamp,
            txType: txType,
            documentHash: documentHash,
            notary: notary
        }));

        emit PropertyTransferred(tokenId, from, to, txType);
    }

    // ─── Charges (hypothèques, servitudes…) ───────────────
    function addEncumbrance(
        uint256 tokenId,
        string calldata encType,
        address creditor,
        uint256 amount,
        uint256 endDate
    ) external onlyRole(AGENT_ROLE) tokenExists(tokenId) {
        _encumbrances[tokenId].push(Encumbrance({
            encType: encType,
            creditor: creditor,
            amount: amount,
            startDate: block.timestamp,
            endDate: endDate,
            isActive: true
        }));

        // Auto-lock si hypothèque ou saisie
        if (_isLockingEncumbrance(encType)) {
            _transferLocked[tokenId] = true;
            emit TransferLocked(tokenId, encType);
        }

        emit EncumbranceAdded(tokenId, encType, creditor);
    }

    function removeEncumbrance(
        uint256 tokenId,
        uint256 index
    ) external onlyRole(AGENT_ROLE) tokenExists(tokenId) {
        require(index < _encumbrances[tokenId].length, "SafeLand: bad index");
        _encumbrances[tokenId][index].isActive = false;

        // Débloquer si plus aucune charge bloquante
        if (!_hasActiveLockingEncumbrance(tokenId)) {
            _transferLocked[tokenId] = false;
            emit TransferUnlocked(tokenId);
        }

        emit EncumbranceRemoved(tokenId, index);
    }

    // ─── Travel Lock / Safe-Lock ──────────────────────────
    /**
     * @notice Verrou anti-spoliation (Travel Lock MRE / Panic Button admin)
     */
    function lockTransfer(uint256 tokenId, string calldata reason) external tokenExists(tokenId) {
        require(
            ownerOf(tokenId) == msg.sender || hasRole(ADMIN_ROLE, msg.sender),
            "SafeLand: not owner or admin"
        );
        _transferLocked[tokenId] = true;
        emit TransferLocked(tokenId, reason);
    }

    function unlockTransfer(uint256 tokenId) external tokenExists(tokenId) {
        require(
            ownerOf(tokenId) == msg.sender || hasRole(ADMIN_ROLE, msg.sender),
            "SafeLand: not owner or admin"
        );
        _transferLocked[tokenId] = false;
        emit TransferUnlocked(tokenId);
    }

    // ─── Justice Override ─────────────────────────────────
    /**
     * @notice Gel judiciaire d'un titre
     */
    function freezeByJustice(uint256 tokenId, bytes32 judgmentHash)
        external onlyRole(JUSTICE_ROLE) tokenExists(tokenId)
    {
        _frozenByJustice[tokenId] = true;
        emit PropertyFrozenByJustice(tokenId, judgmentHash);
    }

    /**
     * @notice Burn & Remint — Destruction et réémission par ordre judiciaire
     * @param tokenId NFT frauduleux à détruire
     * @param newOwner Propriétaire légitime
     * @param judgmentHash Hash du jugement
     */
    function justiceOverride(
        uint256 tokenId,
        address newOwner,
        bytes32 judgmentHash,
        string calldata uri
    ) external onlyRole(JUSTICE_ROLE) tokenExists(tokenId) nonReentrant {
        require(newOwner != address(0), "SafeLand: zero address");

        PropertyData memory prop = _properties[tokenId];
        address previousOwner = ownerOf(tokenId);

        // Burn
        _frozenByJustice[tokenId] = false;
        _transferLocked[tokenId] = false;
        _burn(tokenId);
        emit PropertyBurned(tokenId, judgmentHash);

        // Remint avec le même tokenId
        _safeMint(newOwner, tokenId);
        _setTokenURI(tokenId, uri);

        // Restaurer les données de la propriété
        prop.isActive = true;
        _properties[tokenId] = prop;

        _history[tokenId].push(TransactionRecord({
            from: previousOwner,
            to: newOwner,
            timestamp: block.timestamp,
            txType: "justice_override",
            documentHash: judgmentHash,
            notary: msg.sender
        }));

        emit PropertyTransferred(tokenId, previousOwner, newOwner, "justice_override");
    }

    // ─── Pause globale (Panic Button) ─────────────────────
    function pause() external onlyRole(ADMIN_ROLE) {
        _pause();
    }

    function unpause() external onlyRole(ADMIN_ROLE) {
        _unpause();
    }

    // ─── Vues ─────────────────────────────────────────────
    function getProperty(uint256 tokenId) external view tokenExists(tokenId) returns (PropertyData memory) {
        return _properties[tokenId];
    }

    function getHistory(uint256 tokenId) external view tokenExists(tokenId) returns (TransactionRecord[] memory) {
        return _history[tokenId];
    }

    function getEncumbrances(uint256 tokenId) external view tokenExists(tokenId) returns (Encumbrance[] memory) {
        return _encumbrances[tokenId];
    }

    function findByTitreFoncier(string calldata titreFoncier) external view returns (uint256) {
        uint256 tokenId = _titreFoncierToToken[titreFoncier];
        require(tokenId != 0, "SafeLand: titre not found");
        return tokenId;
    }

    function canTransfer(uint256 tokenId) external view returns (bool) {
        return _exists(tokenId) && !_transferLocked[tokenId] && !_frozenByJustice[tokenId] && !paused();
    }

    function isLocked(uint256 tokenId) external view returns (bool) {
        return _transferLocked[tokenId];
    }

    function isFrozenByJustice(uint256 tokenId) external view returns (bool) {
        return _frozenByJustice[tokenId];
    }

    function totalMinted() external view returns (uint256) {
        return _tokenIdCounter;
    }

    // ─── Helpers internes ─────────────────────────────────
    function _isLockingEncumbrance(string calldata encType) private pure returns (bool) {
        bytes32 h = keccak256(bytes(encType));
        return h == _HYPOTHEQUE_HASH || h == _SAISIE_HASH || h == _SAFE_LOCK_HASH;
    }

    function _hasActiveLockingEncumbrance(uint256 tokenId) private view returns (bool) {
        Encumbrance[] storage encs = _encumbrances[tokenId];
        uint256 len = encs.length;
        for (uint256 i = 0; i < len;) {
            if (encs[i].isActive && _isLockingEncumbranceStored(encs[i].encType)) {
                return true;
            }
            unchecked { ++i; }
        }
        return false;
    }

    function _isLockingEncumbranceStored(string storage encType) private pure returns (bool) {
        bytes32 h = keccak256(bytes(encType));
        return h == _HYPOTHEQUE_HASH || h == _SAISIE_HASH || h == _SAFE_LOCK_HASH;
    }

    function _exists(uint256 tokenId) internal view returns (bool) {
        return _ownerOf(tokenId) != address(0);
    }

    // ─── Overrides requis ─────────────────────────────────
    function _authorizeUpgrade(address) internal override onlyRole(UPGRADER_ROLE) {}

    // SC-M1: Storage gap pour futures upgrades
    uint256[50] private __gap;

    function _update(address to, uint256 tokenId, address auth)
        internal override(ERC721Upgradeable, ERC721EnumerableUpgradeable)
        returns (address)
    {
        return super._update(to, tokenId, auth);
    }

    function _increaseBalance(address account, uint128 value)
        internal override(ERC721Upgradeable, ERC721EnumerableUpgradeable)
    {
        super._increaseBalance(account, value);
    }

    function tokenURI(uint256 tokenId) public view override(ERC721Upgradeable, ERC721URIStorageUpgradeable) returns (string memory) {
        return super.tokenURI(tokenId);
    }

    function supportsInterface(bytes4 interfaceId)
        public view override(ERC721Upgradeable, ERC721EnumerableUpgradeable, ERC721URIStorageUpgradeable, AccessControlUpgradeable) returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}
