// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.24;

import "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/ReentrancyGuardUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";

interface ISafeLandNFTJustice {
    function freezeByJustice(uint256 tokenId, bytes32 judgmentHash) external;
    function justiceOverride(uint256 tokenId, address newOwner, bytes32 judgmentHash, string calldata uri) external;
    function ownerOf(uint256 tokenId) external view returns (address);
    function isFrozenByJustice(uint256 tokenId) external view returns (bool);
}

/**
 * @title SafeLandJustice
 * @author SafeLand Morocco
 * @notice Contrat judiciaire — Justice Override, Gel & Social Recovery
 * @dev Gère les interventions du Ministère de la Justice sur les titres fonciers.
 *      Accessible uniquement via Multi-Sig judiciaire.
 *      Mécanismes :
 *        1. Gel judiciaire (freeze)
 *        2. Burn & Remint (Justice Override)
 *        3. Social Recovery (récupération de clés perdues)
 */
contract SafeLandJustice is
    AccessControlUpgradeable,
    ReentrancyGuardUpgradeable,
    UUPSUpgradeable
{
    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");
    bytes32 public constant JUDGE_ROLE = keccak256("JUDGE_ROLE");
    bytes32 public constant CONSERVATOR_ROLE = keccak256("CONSERVATOR_ROLE");

    ISafeLandNFTJustice public nftContract;

    // ─── Multi-Sig judiciaire ─────────────────────────────
    uint256 public requiredSignatures;  // M dans M-of-N

    struct JusticeAction {
        uint256 tokenId;
        address newOwner;            // address(0) si simple gel
        bytes32 judgmentHash;
        string newUri;
        ActionType actionType;
        uint256 signatures;
        bool executed;
        uint256 createdAt;
        mapping(address => bool) hasSigned;
    }

    enum ActionType { Freeze, BurnRemint, SocialRecovery }

    uint256 private _actionCounter;
    mapping(uint256 => JusticeAction) private _actions;

    // ─── Social Recovery ──────────────────────────────────
    struct RecoveryRequest {
        uint256 tokenId;
        address currentOwner;
        address newWallet;
        address verifiedBy;          // Notaire ou Conservateur ayant vérifié l'identité
        bool executed;
        uint256 createdAt;
    }

    uint256 private _recoveryCounter;
    mapping(uint256 => RecoveryRequest) private _recoveries;

    // ─── Événements ───────────────────────────────────────
    event ActionProposed(uint256 indexed actionId, ActionType actionType, uint256 tokenId, address proposedBy);
    event ActionSigned(uint256 indexed actionId, address signer, uint256 totalSignatures);
    event ActionExecuted(uint256 indexed actionId, ActionType actionType, uint256 tokenId);
    event RecoveryRequested(uint256 indexed recoveryId, uint256 tokenId, address currentOwner, address newWallet);
    event RecoveryExecuted(uint256 indexed recoveryId, uint256 tokenId, address newWallet);

    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() {
        _disableInitializers();
    }

    // ─── Initialisation ──────────────────────────────────
    function initialize(
        address admin,
        address _nftContract,
        uint256 _requiredSignatures
    ) public initializer {
        __AccessControl_init();
        __ReentrancyGuard_init();
        __UUPSUpgradeable_init();

        _grantRole(DEFAULT_ADMIN_ROLE, admin);
        _grantRole(ADMIN_ROLE, admin);

        nftContract = ISafeLandNFTJustice(_nftContract);
        requiredSignatures = _requiredSignatures;
    }

    // ─── Proposer une action judiciaire ───────────────────
    /**
     * @notice Un juge propose une action (gel, burn & remint, ou social recovery)
     */
    function proposeAction(
        uint256 tokenId,
        address newOwner,
        bytes32 judgmentHash,
        string calldata newUri,
        ActionType actionType
    ) external onlyRole(JUDGE_ROLE) returns (uint256) {
        unchecked { _actionCounter++; }
        uint256 actionId = _actionCounter;

        JusticeAction storage action = _actions[actionId];
        action.tokenId = tokenId;
        action.newOwner = newOwner;
        action.judgmentHash = judgmentHash;
        action.newUri = newUri;
        action.actionType = actionType;
        action.signatures = 1;
        action.hasSigned[msg.sender] = true;
        action.createdAt = block.timestamp;

        emit ActionProposed(actionId, actionType, tokenId, msg.sender);
        return actionId;
    }

    // ─── Signer une action (Multi-Sig) ────────────────────
    function signAction(uint256 actionId) external onlyRole(JUDGE_ROLE) {
        JusticeAction storage action = _actions[actionId];
        require(!action.executed, "Justice: already executed");
        require(!action.hasSigned[msg.sender], "Justice: already signed");

        action.hasSigned[msg.sender] = true;
        unchecked { action.signatures++; }

        emit ActionSigned(actionId, msg.sender, action.signatures);
    }

    // ─── Exécuter l'action (quand M signatures atteintes) ─
    function executeAction(uint256 actionId) external onlyRole(JUDGE_ROLE) nonReentrant {
        JusticeAction storage action = _actions[actionId];
        require(!action.executed, "Justice: already executed");
        require(action.signatures >= requiredSignatures, "Justice: not enough signatures");

        // Cache storage reads
        uint256 tokenId = action.tokenId;
        bytes32 judgmentHash = action.judgmentHash;
        ActionType actionType = action.actionType;

        // SC-M2: Appels externes AVANT de marquer executed
        // Si l'appel reverte, executed reste false
        if (actionType == ActionType.Freeze) {
            nftContract.freezeByJustice(tokenId, judgmentHash);
        } else {
            // BurnRemint et SocialRecovery ont le même traitement
            nftContract.justiceOverride(
                tokenId,
                action.newOwner,
                judgmentHash,
                action.newUri
            );
        }

        action.executed = true;

        emit ActionExecuted(actionId, actionType, tokenId);
    }

    // ─── Social Recovery (Notaire / Conservateur) ─────────
    /**
     * @notice Un notaire ou conservateur initie une récupération après vérification d'identité
     */
    function requestRecovery(
        uint256 tokenId,
        address newWallet
    ) external returns (uint256) {
        require(
            hasRole(CONSERVATOR_ROLE, msg.sender) || hasRole(JUDGE_ROLE, msg.sender),
            "Justice: not authorized"
        );
        require(newWallet != address(0), "Justice: zero address");

        address currentOwner = nftContract.ownerOf(tokenId);

        unchecked { _recoveryCounter++; }
        uint256 recoveryId = _recoveryCounter;

        _recoveries[recoveryId] = RecoveryRequest({
            tokenId: tokenId,
            currentOwner: currentOwner,
            newWallet: newWallet,
            verifiedBy: msg.sender,
            executed: false,
            createdAt: block.timestamp
        });

        emit RecoveryRequested(recoveryId, tokenId, currentOwner, newWallet);
        return recoveryId;
    }

    // ─── Exécuter un recovery ─────────────────────────────
    /**
     * @notice SC-C3: Exécute une récupération de wallet après vérification
     */
    function executeRecovery(uint256 recoveryId) external onlyRole(JUDGE_ROLE) nonReentrant {
        RecoveryRequest storage recovery = _recoveries[recoveryId];
        require(!recovery.executed, "Justice: recovery already executed");
        require(recovery.newWallet != address(0), "Justice: invalid recovery");

        nftContract.justiceOverride(
            recovery.tokenId,
            recovery.newWallet,
            bytes32(recoveryId),
            ""
        );

        recovery.executed = true;

        emit RecoveryExecuted(recoveryId, recovery.tokenId, recovery.newWallet);
    }

    // ─── Vues ─────────────────────────────────────────────
    function getAction(uint256 actionId) external view returns (
        uint256 tokenId,
        address newOwner,
        bytes32 judgmentHash,
        ActionType actionType,
        uint256 signatures,
        bool executed
    ) {
        JusticeAction storage a = _actions[actionId];
        return (a.tokenId, a.newOwner, a.judgmentHash, a.actionType, a.signatures, a.executed);
    }

    function getRecovery(uint256 recoveryId) external view returns (RecoveryRequest memory) {
        return _recoveries[recoveryId];
    }

    function setRequiredSignatures(uint256 n) external onlyRole(ADMIN_ROLE) {
        require(n > 0, "Justice: zero");
        requiredSignatures = n;
    }

    function totalActions() external view returns (uint256) {
        return _actionCounter;
    }

    function _authorizeUpgrade(address) internal override onlyRole(ADMIN_ROLE) {}

    // SC-M1: Storage gap pour futures upgrades
    uint256[50] private __gap;
}
