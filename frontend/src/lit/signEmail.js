const go = async () => {
  try {
    const url =
      "https://oauth2.googleapis.com/tokeninfo?id_token=" + access_token;
  
    const response = await fetch(url);
  
    const email = (await response.json()).email;

    const saltNonce = ethers.utils.id(email);

    const factoryContract = new ethers.Contract(
      factoryAddress,
      [{
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
      }],
      new ethers.providers.JsonRpcProvider(
        "https://bsc.blockpi.network/v1/rpc/public"
      )
    );
  
    const safeAddress = await factoryContract.callStatic.createProxyWithNonce(
      "0x3E5c63644E683549055b9Be8653de26E0B4CD36E",
      ethers.utils.arrayify(
        `0xb63e800d0000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000140000000000000000000000000f48f2b2d2a534e402487b3ee7c18c33aec0fe5e40000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000001000000000000000000000000${owner.slice(
          2
        )}0000000000000000000000000000000000000000000000000000000000000000`
      ),
      saltNonce
    );
  
    const toSign = ethers.utils.arrayify(
      ethers.utils.hashMessage(
        safeAddress
      )
    );
  
    const sigShare = await Lit.Actions.signEcdsa({
      toSign,
      publicKey,
      sigName: "sig1",
    });
  } catch (e) {
    LitActions.setResponse({response: JSON.stringify({error: e})})
  }
};

go();