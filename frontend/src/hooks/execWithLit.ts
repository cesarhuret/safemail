import { utils } from "ethers";
import { execWithLitABI } from "../abi/execWithLit";
import config from "../config.json";
import { GelatoRelay, SponsoredCallRequest } from "@gelatonetwork/relay-sdk";

export const execWithLit = async (
  module: string,
  litNodeClient: any,
  factoryAddress: string,
  txData: any,
  wallet: any,
  authSig: any,
  authMethod: any
) => {

    const relay = new GelatoRelay();

  const { signatures, response } = await litNodeClient.executeJs({
    ipfsId: config.signMessage.cid,
    // code: litActionCode,
    authSig,
    jsParams: {
      publicKey: config.signMessage.pkp,
      access_token: authMethod.accessToken,
      factoryAddress,
      safeAddress: txData.from,
      to: txData.to,
      value: txData.value,
      data: txData.data,
      owner: config.signTxn.address,
    },
  });

  console.log(response);

  console.log("signatures: ", signatures);
  const sig = signatures.sig1;
  const encodedSig = utils.joinSignature({
    r: "0x" + sig.r,
    s: "0x" + sig.s,
    v: sig.recid,
  });

  console.log(encodedSig);

  const message = utils.arrayify(
    utils.solidityKeccak256(
      ["address", "address", "uint256", "bytes"],
      [txData.from, txData.to, txData.value, utils.arrayify(txData.data)]
    )
  );

  const recoveredAddressViaMessage = utils.verifyMessage(message, encodedSig);

  console.log(recoveredAddressViaMessage);

  const iface = new utils.Interface([execWithLitABI]);

  const encodedData = iface.encodeFunctionData("execWithLit", [
    txData.to,
    txData.value,
    utils.arrayify(txData.data),
    txData.from,
    0,
    encodedSig,
  ]);

  console.log(encodedData);

  const request: SponsoredCallRequest = {
    chainId: 5,
    target: module,
    data: encodedData,
  };


  return await relay.sponsoredCall(request, config.gelato);
};
