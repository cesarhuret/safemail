import { createBrowserRouter, Outlet } from "react-router-dom";
import { App, Dashboard } from "./pages";
import { Layout } from "./components";
import { isSignInRedirect, LitAuthClient } from "@lit-protocol/lit-auth-client";
import { ProviderType } from "@lit-protocol/constants";
import { AuthMethod } from "@lit-protocol/types";
import { PKPEthersWallet } from "@lit-protocol/pkp-ethers";
import {
  createSafe,
  getSafeTransaction,
  getSignedSafeAddress,
  getSignedTransaction,
  execWithLit,
  getUserPKPs,
} from "./hooks";
import { providers, utils } from "ethers";
import config from "./config.json";
import { getSafeAddress } from "./hooks/predictSafe";
import { parseEther } from "@ethersproject/units";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    id: "root",
    loader: async ({ params }) => {
      try {
        const localAuthMethod = localStorage.getItem("authMethod");
        const localGoogle = localStorage.getItem("google");

        if (isSignInRedirect(window.location.href)) {
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

          const litProvider = client.getProvider(ProviderType.Google);

          if (litProvider != null) {
            const authMethod: AuthMethod = await litProvider.authenticate();

            await getUserPKPs(litProvider, authMethod);

            const google = await fetch(
              "https://oauth2.googleapis.com/tokeninfo?id_token=" +
                authMethod.accessToken,
              {
                method: "GET",
                mode: "cors",
              }
            ).then((res) => res.json());

            console.log(authMethod);

            const { authSig } = await litNodeClient.signSessionKey({
              authMethods: [authMethod],
              expiration: new Date(
                Date.now() + 1000 * 60 * 60 * 24
              ).toISOString(),
              resources: [],
            });

            console.log(authSig);

            const provider = new providers.JsonRpcProvider(
              config.chainConfig.rpc
            );

            const safe = await getSafeAddress(google.email);

            const code = await provider.getCode(safe);
            if (code == "0x") {
                const createSafeTx = await createSafe({
                  owner: config.signTxn.address,
                  wallet: "",
                  salt: utils.id(google.email),
                });

                console.log(createSafeTx);

                const signedEmail = await getSignedSafeAddress({
                  litNodeClient,
                  authSig,
                  accessToken: authMethod.accessToken,
                });

                console.log(signedEmail);

                console.log(utils.verifyMessage(safe, signedEmail.signature));

                const enableModule = await getSafeTransaction({
                  owner: config.signTxn.address,
                  to: safe,
                  value: utils.parseEther("0"),
                  data:
                    "0x610b5925000000000000000000000000" +
                    config.module.slice(2),
                });

                console.log(enableModule);

                const enableModuleTx = await getSignedTransaction({
                  litNodeClient,
                  provider,
                  authSig,
                  data: enableModule.data,
                  toAddress: safe,
                  pkp: {
                    pkpEthAddress: config.signTxn.address,
                    pkpPublicKey: config.signTxn.pkp,
                  },
                  accessToken: authMethod.accessToken,
                  email: google.email,
                  safeSignature: signedEmail.signature,
                });

                console.log(await enableModuleTx.result.wait(1));
            }

            localStorage.setItem("authMethod", JSON.stringify(authMethod));
            localStorage.setItem("google", JSON.stringify(google));

            return {
              safe: await getSafeAddress(google.email),
              email: google.email,
            };
          }
        } else if (localAuthMethod && localGoogle) {
          const google = await fetch(
            "https://oauth2.googleapis.com/tokeninfo?id_token=" +
              JSON.parse(localAuthMethod).accessToken,
            {
              method: "GET",
              mode: "cors",
            }
          ).then((res) => res.json());

          if (google?.error == "invalid_token") {
            localStorage.removeItem("authMethod");
            localStorage.removeItem("google");
          }

          const safe = await getSafeAddress(google?.email);
          console.log(safe);
          return { safe, email: google.email };
        }

        return null;
      } catch (e) {
        return null;
      }
    },
    children: [
      {
        path: "/",
        element: <App />,
      },
      {
        path: "/:email",
        element: <Dashboard />,
      },
    ],
  },
]);

export default router;
