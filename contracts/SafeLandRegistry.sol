// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.24;

import "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";

/**
 * @title SafeLandRegistry
 * @author SafeLand Morocco
 * @notice Registre central — Index, statistiques et recherches globales
 * @dev Complète SafeLandNFT avec des index de recherche par ville, propriétaire, etc.
 */
contract SafeLandRegistry is AccessControlUpgradeable, UUPSUpgradeable {
    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");
    bytes32 public constant OPERATOR_ROLE = keccak256("OPERATOR_ROLE");
    bytes32 private constant _JUSTICE_OVERRIDE_HASH = keccak256("justice_override");

    // ─── Statistiques ─────────────────────────────────────
    struct GlobalStats {
        uint256 totalProperties;
        uint256 totalTransactions;
        uint256 totalEncumbrances;
        uint256 fraudAttemptsPrevented;
        uint256 justicOverrides;
    }

    GlobalStats public stats;

    // ─── Index ────────────────────────────────────────────
    mapping(string => uint256[]) private _byCity;
    mapping(address => uint256[]) private _byOwner;
    mapping(string => uint256[]) private _byType;    // "villa", "terrain", etc.

    // ─── Événements ───────────────────────────────────────
    event PropertyRegistered(uint256 indexed tokenId, string city, string propertyType, address owner);
    event TransactionRecorded(uint256 indexed tokenId, address from, address to, string txType);
    event FraudPrevented(uint256 indexed tokenId, string reason);

    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() {
        _disableInitializers();
    }

    // ─── Initialisation ──────────────────────────────────
    function initialize(address admin) public initializer {
        __AccessControl_init();
        __UUPSUpgradeable_init();
        _grantRole(DEFAULT_ADMIN_ROLE, admin);
        _grantRole(ADMIN_ROLE, admin);
        _grantRole(OPERATOR_ROLE, admin);
    }

    // ─── Enregistrement ───────────────────────────────────
    function registerProperty(
        uint256 tokenId,
        string calldata city,
        string calldata propertyType,
        address owner
    ) external onlyRole(OPERATOR_ROLE) {
        _byCity[city].push(tokenId);
        _byOwner[owner].push(tokenId);
        _byType[propertyType].push(tokenId);
        unchecked { stats.totalProperties++; }
        emit PropertyRegistered(tokenId, city, propertyType, owner);
    }

    function recordTransaction(
        uint256 tokenId,
        address from,
        address to,
        string calldata txType
    ) external onlyRole(OPERATOR_ROLE) {
        _removeFromOwner(from, tokenId);
        _byOwner[to].push(tokenId);
        unchecked { stats.totalTransactions++; }

        if (keccak256(bytes(txType)) == _JUSTICE_OVERRIDE_HASH) {
            unchecked { stats.justicOverrides++; }
        }

        emit TransactionRecorded(tokenId, from, to, txType);
    }

    function recordFraudPrevented(uint256 tokenId, string calldata reason)
        external onlyRole(OPERATOR_ROLE)
    {
        unchecked { stats.fraudAttemptsPrevented++; }
        emit FraudPrevented(tokenId, reason);
    }

    // ─── Vues ─────────────────────────────────────────────
    function getByCity(string calldata city) external view returns (uint256[] memory) {
        return _byCity[city];
    }

    function getByOwner(address owner) external view returns (uint256[] memory) {
        return _byOwner[owner];
    }

    function getByType(string calldata propertyType) external view returns (uint256[] memory) {
        return _byType[propertyType];
    }

    function getStats() external view returns (GlobalStats memory) {
        return stats;
    }

    // ─── Interne ──────────────────────────────────────────
    function _removeFromOwner(address owner, uint256 tokenId) private {
        uint256[] storage arr = _byOwner[owner];
        uint256 len = arr.length;
        for (uint256 i = 0; i < len;) {
            if (arr[i] == tokenId) {
                arr[i] = arr[len - 1];
                arr.pop();
                return;
            }
            unchecked { ++i; }
        }
    }

    function _authorizeUpgrade(address) internal override onlyRole(ADMIN_ROLE) {}
}
