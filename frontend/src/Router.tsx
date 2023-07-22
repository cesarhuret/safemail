import { createBrowserRouter, Outlet } from "react-router-dom";
import { App } from "./pages";
import { Layout } from "./components";
import { isSignInRedirect, LitAuthClient } from "@lit-protocol/lit-auth-client";
import { ProviderType } from "@lit-protocol/constants";
import { AuthMethod } from "@lit-protocol/types";
import { PKPEthersWallet } from "@lit-protocol/pkp-ethers";
import { createSafe, getSafeTransaction } from "./hooks";
import { utils } from "ethers";

const router = createBrowserRouter([
    {
        path: "/",
        element: <Layout />,
        id: "root",
        children: [
            {
                path: "/ok",
                element: <App />,
                id: "app",
                loader: async ({ params }) => {
                    const client = new LitAuthClient({
                        litRelayConfig: {
                          relayApiKey: "64DDCA6B-B48C-4871-B516-FB05AAD885A1_cesar",
                        },
                    });

                    client.initProvider(ProviderType.Google, {
                        redirectUri: window.location.origin + window.location.pathname,
                    }); 
  
                    let wallet, email, ethAddress;

                    if(isSignInRedirect(window.location.href)) {

                        const id_token = new URL(window.location.href).searchParams.get('id_token');

                        email = await fetch("https://oauth2.googleapis.com/tokeninfo?id_token=" + id_token)
                            .then(res => res.json())
                            .then(res => res.email);

                        console.log(email)

                        const litNodeClient = new LitNodeClient({
                            litNetwork: 'serrano',
                            debug: false,
                        });
                        await litNodeClient.connect();
                        
                        // Get the provider that was used to sign in
                        const provider = client.getProvider(
                          ProviderType.Google,
                        );
                        
                        if(provider != null) {
                          // Get auth method object that has the OAuth token from redirect callback
                            const authMethod: AuthMethod = await provider.authenticate();
                                
                            let pkps = await provider.fetchPKPsThroughRelayer(authMethod);
                        
                            let pkp = pkps[pkps.length - 1];

                            if(!pkp?.publicKey) {
                                try {
                                    await provider.mintPKPThroughRelayer(authMethod);
                        
                                    pkp = (await provider.fetchPKPsThroughRelayer(authMethod))[0];
                                    
                                } catch (e) {
                                    console.log(e);
                                    return null;
                                }
                            }
                        
                            const { authSig } = await litNodeClient.signSessionKey({
                                authMethods: [authMethod],
                                expiration: new Date(Date.now() + 1000 * 60 * 60 * 24).toISOString(),
                                resources: [],
                            });

                            wallet = new PKPEthersWallet({
                                controllerAuthSig: authSig,
                                pkpPubKey: pkp.publicKey,
                                rpc: "https://eth-goerli.g.alchemy.com/v2/75qiyn1_EpxCn93X5tD7yEtmcXUM_Udw"
                            })
                            await wallet.init();

                            console.log(wallet);

                            const salt = utils.id(email + Math.random().toString().substring(2, 5));

                            const owner = "0x550EA83854f01a573A463c202cb77439dAb9dD38"

                            const safe = await createSafe({
                                owner,
                                wallet,
                                salt,
                            })

                            console.log(safe);

                            return { wallet, client, email }
                        }
                    }
                    return null;
                }
            }
        ]
    }
])

export default router;