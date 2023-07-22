import { utils } from "ethers";
import { execWithLitABI } from "../abi/execWithLit";
import config from "../config.json";
import { GelatoRelay, SponsoredCallRequest } from "@gelatonetwork/relay-sdk";
import { PKPEthersWallet } from "@lit-protocol/pkp-ethers";
import { getUserPKPs } from "./getUserPKPs";
import { ProviderType } from "@lit-protocol/constants";

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

  const chain = JSON.parse(localStorage.getItem("chain") || "{}");

  console.log(chain);

  const relay = new GelatoRelay();

  const { signatures, response } = await litNodeClient.executeJs({
    ipfsId: config.signMessage.cid,
    // code: litActionCode,
    authSig,
    jsParams: {
      chain: chain.litName,
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

  if (chain.litName !== "celo") {
    const request: SponsoredCallRequest = {
      chainId: chain.id,
      target: chain.module,
      data: encodedData,
    };

    const testTx = await relay.sponsoredCall(request, chain.gelato);

    let interval = setInterval(async () => {
      const res = await fetch(
        "https://api.gelato.digital/tasks/status/" + testTx.taskId
      );
      const result = await res.json();

      console.log(result);

      if (
        result.task?.transactionHash &&
        result.task?.taskState == "ExecSuccess"
      ) {
        const txHash = result.task?.transactionHash;
        return { txHash, success: true };
        clearInterval(interval);
      } else if (result.task?.taskState == "Cancelled") {
        clearInterval(interval);
        return { success: false, error: "Cancelled" };
      }
    }, 2000);

  } else {

    const client = new LitAuthClient({
      litRelayConfig: {
        relayApiKey: config.lit.apiKey,
      },
    });

    client.initProvider(ProviderType.Google, {
      redirectUri: window.location.origin + window.location.pathname,
    });

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

    const litProvider = client.getProvider(ProviderType.Google);

    let pkp = await getUserPKPs(litProvider, authMethod);

    const wallet: any = new PKPEthersWallet({
      controllerAuthSig: authSig,
      pkpPubKey: pkp.publicKey,
      rpc: chain.rpc_endpoint,
    });
    await wallet.init();

    console.log(wallet);

    const res = await wallet.sendTransaction({
      to: chain.module,
      data: encodedData
    })

    return {success: true, txHash: (await res.wait(1)).transactionHash};
  }
};
