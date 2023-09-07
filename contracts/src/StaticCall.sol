// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface IERC20 {
    function balanceOf(address account) external view returns (uint256);
}

contract StaticCall {
    function getERC20Balance() external view returns (uint256) {
        return IERC20(0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48).balanceOf(0x7d6703218ab83D5255e4532101deB294eA1b9d27);
    }
}