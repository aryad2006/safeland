// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.24;

/**
 * @title MockTimelockTarget
 * @notice Simple counter contract used as target for Timelock tests
 */
contract MockTimelockTarget {
    uint256 public value;
    address public lastCaller;

    event ValueChanged(uint256 newValue, address caller);

    function setValue(uint256 _value) external {
        value = _value;
        lastCaller = msg.sender;
        emit ValueChanged(_value, msg.sender);
    }

    function failingFunction() external pure {
        revert("MockTarget: forced failure");
    }

    receive() external payable {}
}
