import { utils } from "ethers";
import config from "../config.json";

export const getSignedSafeAddress = async ({litNodeClient, authSig, accessToken}: any) => {
    const { signatures, response } = await litNodeClient.executeJs({
        ipfsId: config.signEmail.cid,
        authSig,
        jsParams: {
          chainConfig: config.chainConfig,
          access_token: accessToken,
          publicKey: config.signEmail.pkp,
          pkp: {
            pkpEthAddress: config.signEmail.address,
            pkpPublicKey: config.signEmail.pkp
          },
          factoryAddress: config.factory,
          owner: config.signTxn.address,
        },
    });

    console.log("signatures: ", signatures);
    const sig = signatures.sig1;
    const encodedSig = utils.joinSignature({
      r: "0x" + sig.r,
      s: "0x" + sig.s,
      v: sig.recid,
    });
      
    return { signature: encodedSig };
  
}