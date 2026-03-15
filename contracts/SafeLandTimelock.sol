// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.24;

import "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/ReentrancyGuardUpgradeable.sol";

/**
 * @title SafeLandTimelock
 * @author SafeLand Morocco
 * @notice Timelock pour les opérations admin critiques des contrats SafeLand
 * @dev Impose un délai minimum entre la proposition et l'exécution
 *      des appels admin (upgrades, pause, changements de rôles, etc.).
 *
 *      Conforme à la recommandation d'audit : "Ajouter un timelock sur les fonctions admin critiques"
 *
 *      Workflow :
 *        1. Un PROPOSER propose une opération → schedule()
 *        2. Le délai s'écoule (MIN_DELAY ≤ delay)
 *        3. Un EXECUTOR exécute l'opération → execute()
 *        4. Optionnel : un CANCELLER peut annuler → cancel()
 */
contract SafeLandTimelock is AccessControlUpgradeable, UUPSUpgradeable, ReentrancyGuardUpgradeable {
    // ─── Rôles ────────────────────────────────────────────
    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");
    bytes32 public constant PROPOSER_ROLE = keccak256("PROPOSER_ROLE");
    bytes32 public constant EXECUTOR_ROLE = keccak256("EXECUTOR_ROLE");
    bytes32 public constant CANCELLER_ROLE = keccak256("CANCELLER_ROLE");

    // ─── Config ───────────────────────────────────────────
    uint256 public constant MIN_DELAY = 1 days;
    uint256 public constant MAX_DELAY = 30 days;
    uint256 public constant GRACE_PERIOD = 14 days;

    // ─── Structures ───────────────────────────────────────
    enum OperationStatus { None, Pending, Executed, Cancelled }

    struct Operation {
        address target;
        uint256 value;
        bytes data;
        uint256 readyTimestamp;
        OperationStatus status;
        address proposer;
        string description;
    }

    // ─── État ─────────────────────────────────────────────
    mapping(bytes32 => Operation) private _operations;
    uint256 public operationCount;

    // ─── Événements ───────────────────────────────────────
    event OperationScheduled(
        bytes32 indexed operationId,
        address indexed target,
        uint256 value,
        bytes data,
        uint256 readyTimestamp,
        string description
    );

    event OperationExecuted(
        bytes32 indexed operationId,
        address indexed target,
        uint256 value,
        bytes returnData
    );

    event OperationCancelled(bytes32 indexed operationId);
    event MinDelayChange(uint256 oldDelay, uint256 newDelay);

    // ─── Errors ───────────────────────────────────────────
    error TimelockInvalidDelay(uint256 delay, uint256 minDelay, uint256 maxDelay);
    error TimelockOperationAlreadyScheduled(bytes32 operationId);
    error TimelockOperationNotPending(bytes32 operationId);
    error TimelockOperationNotReady(bytes32 operationId, uint256 readyTimestamp);
    error TimelockOperationExpired(bytes32 operationId);
    error TimelockCallFailed(address target, bytes data);

    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() {
        _disableInitializers();
    }

    // ─── Initialisation ──────────────────────────────────
    function initialize(
        address admin,
        address[] memory proposers,
        address[] memory executors
    ) public initializer {
        __AccessControl_init();
        __UUPSUpgradeable_init();
        __ReentrancyGuard_init();

        _grantRole(DEFAULT_ADMIN_ROLE, admin);
        _grantRole(ADMIN_ROLE, admin);
        _grantRole(CANCELLER_ROLE, admin);

        for (uint256 i; i < proposers.length; ) {
            _grantRole(PROPOSER_ROLE, proposers[i]);
            unchecked { ++i; }
        }

        for (uint256 i; i < executors.length; ) {
            _grantRole(EXECUTOR_ROLE, executors[i]);
            unchecked { ++i; }
        }
    }

    // ─── Views ────────────────────────────────────────────

    /**
     * @notice Calcule l'identifiant unique d'une opération
     */
    function hashOperation(
        address target,
        uint256 value,
        bytes calldata data,
        bytes32 salt
    ) public pure returns (bytes32) {
        return keccak256(abi.encode(target, value, data, salt));
    }

    /**
     * @notice Vérifie si une opération est en attente
     */
    function isOperationPending(bytes32 operationId) public view returns (bool) {
        return _operations[operationId].status == OperationStatus.Pending;
    }

    /**
     * @notice Vérifie si une opération est prête à être exécutée
     */
    function isOperationReady(bytes32 operationId) public view returns (bool) {
        Operation storage op = _operations[operationId];
        return op.status == OperationStatus.Pending &&
               block.timestamp >= op.readyTimestamp &&
               block.timestamp <= op.readyTimestamp + GRACE_PERIOD;
    }

    /**
     * @notice Vérifie si une opération a été exécutée
     */
    function isOperationDone(bytes32 operationId) public view returns (bool) {
        return _operations[operationId].status == OperationStatus.Executed;
    }

    /**
     * @notice Retourne les détails d'une opération
     */
    function getOperation(bytes32 operationId) external view returns (
        address target,
        uint256 value,
        bytes memory data,
        uint256 readyTimestamp,
        OperationStatus status,
        address proposer,
        string memory description
    ) {
        Operation storage op = _operations[operationId];
        return (op.target, op.value, op.data, op.readyTimestamp, op.status, op.proposer, op.description);
    }

    // ─── Actions ──────────────────────────────────────────

    /**
     * @notice Planifie une opération avec un délai
     * @param target Adresse du contrat cible
     * @param value Montant ETH à envoyer
     * @param data Calldata encodée de la fonction à appeler
     * @param salt Sel unique pour différencier les opérations identiques
     * @param delay Délai en secondes avant exécution (≥ MIN_DELAY)
     * @param description Description lisible de l'opération
     */
    function schedule(
        address target,
        uint256 value,
        bytes calldata data,
        bytes32 salt,
        uint256 delay,
        string calldata description
    ) external onlyRole(PROPOSER_ROLE) returns (bytes32) {
        require(target != address(0), "Timelock: zero target");

        if (delay < MIN_DELAY || delay > MAX_DELAY) {
            revert TimelockInvalidDelay(delay, MIN_DELAY, MAX_DELAY);
        }

        bytes32 operationId = hashOperation(target, value, data, salt);

        if (_operations[operationId].status != OperationStatus.None) {
            revert TimelockOperationAlreadyScheduled(operationId);
        }

        uint256 readyTimestamp = block.timestamp + delay;

        _operations[operationId] = Operation({
            target: target,
            value: value,
            data: data,
            readyTimestamp: readyTimestamp,
            status: OperationStatus.Pending,
            proposer: msg.sender,
            description: description
        });

        unchecked { ++operationCount; }

        emit OperationScheduled(operationId, target, value, data, readyTimestamp, description);

        return operationId;
    }

    /**
     * @notice Exécute une opération planifiée après le délai
     * @param target Adresse du contrat cible (doit matcher l'opération)
     * @param value Montant ETH
     * @param data Calldata encodée
     * @param salt Sel utilisé lors du schedule
     */
    function execute(
        address target,
        uint256 value,
        bytes calldata data,
        bytes32 salt
    ) external payable onlyRole(EXECUTOR_ROLE) nonReentrant returns (bytes memory) {
        bytes32 operationId = hashOperation(target, value, data, salt);
        Operation storage op = _operations[operationId];

        if (op.status != OperationStatus.Pending) {
            revert TimelockOperationNotPending(operationId);
        }

        if (block.timestamp < op.readyTimestamp) {
            revert TimelockOperationNotReady(operationId, op.readyTimestamp);
        }

        if (block.timestamp > op.readyTimestamp + GRACE_PERIOD) {
            revert TimelockOperationExpired(operationId);
        }

        op.status = OperationStatus.Executed;

        (bool success, bytes memory returnData) = target.call{value: value}(data);
        if (!success) {
            revert TimelockCallFailed(target, data);
        }

        emit OperationExecuted(operationId, target, value, returnData);

        return returnData;
    }

    /**
     * @notice Annule une opération planifiée
     * @param operationId Identifiant de l'opération à annuler
     */
    function cancel(bytes32 operationId) external onlyRole(CANCELLER_ROLE) {
        if (_operations[operationId].status != OperationStatus.Pending) {
            revert TimelockOperationNotPending(operationId);
        }

        _operations[operationId].status = OperationStatus.Cancelled;

        emit OperationCancelled(operationId);
    }

    // ─── Receive ETH ──────────────────────────────────────
    receive() external payable {}

    // ─── UUPS ─────────────────────────────────────────────
    function _authorizeUpgrade(address) internal override onlyRole(ADMIN_ROLE) {}

    // SC-M1: Storage gap pour futures upgrades
    uint256[50] private __gap;
}
