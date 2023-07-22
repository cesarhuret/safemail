import { utils } from "ethers";
import { serialize } from "@ethersproject/transactions";
import config from "../config.json";

export const getSignedTransaction = async ({litNodeClient, provider, authSig, data, toAddress, accessToken, safeSignature, email}: any) => {
    
  const chain = JSON.parse(localStorage.getItem('chain') || '{}')

  console.log(chain)

  const { signatures, response } = await litNodeClient.executeJs({
      ipfsId: config.signTxn.cid,
      authSig,
      jsParams: {
        access_token: accessToken,
        pkp: {
          pkpEthAddress: config.signTxn.address,
          pkpPublicKey: config.signTxn.pkp
        },
        chain: chain.litName,
        gasPrice: utils.parseUnits(chain.gasPrice, "gwei").toHexString(),
        toAddress,
        safeSignature,
        factoryAddress: config.factory,
        data,
        email,
        chainId: chain.id
      },
  });

  console.log(response)

  console.log("signatures: ", signatures);
  const sig = signatures.sig1;
  const encodedSig = utils.joinSignature({
    r: "0x" + sig.r,
    s: "0x" + sig.s,
    v: sig.recid,
  });
  
  const { txParams } = response;

  const txn = serialize(txParams, encodedSig);
  
  const result = await provider.sendTransaction(txn);
  
  return { result };

}