import { utils } from "ethers";
import { execWithLitABI } from "../abi/execWithLit";
import config from "../config.json";
import { GelatoRelay, SponsoredCallRequest } from "@gelatonetwork/relay-sdk";

export const execWithLit = async (
  module: string,
  factoryAddress: string,
  txData: any
) => {
  const litNodeClient = new LitNodeClient({
    litNetwork: "serrano",
    debug: false,
  });

  await litNodeClient.connect();

  const authMethod = JSON.parse(localStorage.getItem("authMethod") || "{}");

  const { authSig } = await litNodeClient.signSessionKey({
    authMethods: [authMethod],
    expiration: new Date(Date.now() + 1000 * 60 * 60 * 24).toISOString(),
    resources: [],
    chainId: 5,
  });

  const chain = JSON.parse(localStorage.getItem('chain') || '{}');

  console.log(chain)

  const relay = new GelatoRelay();

  const { signatures, response } = await litNodeClient.executeJs({
    ipfsId: config.signMessage.cid,
    // code: litActionCode,
    authSig,
    jsParams: {
      chain: chain.gnosisName,
      publicKey: config.signMessage.pkp,
      access_token: authMethod.accessToken,
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
    chainId: chain.id,
    target: chain.module,
    data: encodedData,
  };

  return await relay.sponsoredCall(request, chain.gelato);
};
