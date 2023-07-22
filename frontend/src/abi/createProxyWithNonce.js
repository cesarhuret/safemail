export const createProxyWithNonce = {
    inputs: [
      { internalType: "address", name: "_singleton", type: "address" },
      { internalType: "bytes", name: "initializer", type: "bytes" },
      { internalType: "uint256", name: "saltNonce", type: "uint256" },
    ],
    name: "createProxyWithNonce",
    outputs: [
      {
        internalType: "contract GnosisSafeProxy",
        name: "proxy",
        type: "address",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  };