const go = async () => {
    try {
      const url =
        "https://oauth2.googleapis.com/tokeninfo?id_token=" + access_token;
    
      const response = await fetch(url);
    
      const email = (await response.json()).email;

      const salt = ethers.utils.id(email);
    
      const toSign = ethers.utils.arrayify(
        ethers.utils.hashMessage(
          ethers.utils.arrayify(
            ethers.utils.solidityKeccak256(
              ["bytes32", "address", "uint256", "bytes"],
              [salt, to, value, ethers.utils.arrayify(data)]
            )
          )
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