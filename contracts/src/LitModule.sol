// SPDX-License-Identifier: LGPL-3.0-only
pragma solidity ^0.8.0;

import "./interfaces/Enum.sol";
import "./interfaces/IGnosisSafe.sol";

contract LitModule {

    address public safeOwner;

    constructor(address _safeOwner) {
        safeOwner = _safeOwner;
    }

    function mailOnFire(address _to, uint256 _amount, bytes calldata _data, address _safe, Enum.Operation _op) public {
        require(IGnosisSafe(_safe).execTransactionFromModule(_to, _amount, _data, _op));
    }

}