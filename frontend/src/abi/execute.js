export const executeABI = {
    inputs: [
      { type: "address", name: "to" },
      { type: "uint256", name: "value" },
      { type: "bytes", name: "data" },
      { type: "uint8", name: "operation" },
      { type: "uint256", name: "safeTxGas" },
      { type: "uint256", name: "baseGas" },
      { type: "uint256", name: "gasPrice" },
      { type: "address", name: "gasToken" },
      { type: "address", name: "refundReceiver" },
      { type: "bytes", name: "signatures" },
    ],
    outputs: [{ type: "bool" }],
    name: "execTransaction",
    type: "function",
    stateMutability: "payable",
  };