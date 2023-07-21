import { createBrowserRouter, Outlet } from "react-router-dom";
import { App } from "./pages";
import { Layout } from "./components";
import { isSignInRedirect, LitAuthClient } from "@lit-protocol/lit-auth-client";
import { ProviderType } from "@lit-protocol/constants";
import { AuthMethod } from "@lit-protocol/types";
import { PKPEthersWallet } from "@lit-protocol/pkp-ethers";

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
                          relayApiKey: "ec8d2250312234b05e2746aa7e2ebd9d",
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
                                rpc: "https://chain-rpc.litprotocol.com/http"
                            })
                            await wallet.init();

                            console.log(wallet);
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