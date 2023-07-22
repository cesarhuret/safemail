// SPDX-License-Identifier: LGPL-3.0-only
pragma solidity ^0.8.0;

import "./interfaces/Enum.sol";
import "./interfaces/IGnosisSafe.sol";

contract LitModule {

    address public safeOwner;

    constructor(address _safeOwner) {
        safeOwner = _safeOwner;
    }

    function execWithLit(address _to, uint256 _amount, bytes memory _data, address _safe, Enum.Operation _op, bytes memory signature) public {
        bytes32 hash = keccak256(abi.encodePacked("\x19Ethereum Signed Message:\n32", keccak256(abi.encodePacked(_safe, _to, _amount, _data))));

        (bytes32 r, bytes32 s, uint8 v) = splitSignature(signature);

        require(ecrecover(hash, v, r, s) == safeOwner);

        require(IGnosisSafe(_safe).execTransactionFromModule(_to, _amount, _data, _op));
    }

    function splitSignature(
        bytes memory sig
    ) public pure returns (bytes32 r, bytes32 s, uint8 v) {
        require(sig.length == 65, "invalid signature length");

        assembly {
            /*
            First 32 bytes stores the length of the signature

            add(sig, 32) = pointer of sig + 32
            effectively, skips first 32 bytes of signature

            mload(p) loads next 32 bytes starting at the memory address p into memory
            */

            // first 32 bytes, after the length prefix
            r := mload(add(sig, 32))
            // second 32 bytes
            s := mload(add(sig, 64))
            // final byte (first byte of the next 32 bytes)
            v := byte(0, mload(add(sig, 96)))
        }

        // implicitly return (r, s, v)
    }

}