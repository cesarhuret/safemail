import { createBrowserRouter, Outlet } from "react-router-dom";
import { App, Dashboard } from "./pages";
import { Layout } from "./components";
import { isSignInRedirect, LitAuthClient } from "@lit-protocol/lit-auth-client";
import { ProviderType } from "@lit-protocol/constants";
import { AuthMethod } from "@lit-protocol/types";
import { PKPEthersWallet } from "@lit-protocol/pkp-ethers";
import { createSafe, getSafeTransaction, getSignedSafeAddress, getSignedTransaction, execWithLit } from "./hooks";
import { providers, utils } from "ethers";
import config from "./config.json";
import { getSafeAddress } from "./hooks/predictSafe";
import { parseEther } from "@ethersproject/units";

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
                          relayApiKey: config.lit.apiKey
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

                            const ethProvider = new providers.JsonRpcProvider("https://eth-goerli.g.alchemy.com/v2/75qiyn1_EpxCn93X5tD7yEtmcXUM_Udw");

                            wallet = new PKPEthersWallet({
                                controllerAuthSig: authSig,
                                pkpPubKey: pkp.publicKey,
                                rpc: "https://eth-goerli.g.alchemy.com/v2/75qiyn1_EpxCn93X5tD7yEtmcXUM_Udw"
                            })
                            await wallet.init();

                            console.log(wallet);

                            const salt = utils.id(email);

                            const owner = config.signTxn.address;

                            const safe = await getSafeAddress(email);

                            console.log(safe);

                            const code = await ethProvider.getCode(safe);
                            if (code == '0x') {
                                const createSafeTx = await createSafe({
                                    owner,
                                    wallet,
                                    salt
                                })
                                
                                console.log(createSafeTx);

                                const signedEmail = await getSignedSafeAddress({
                                    litNodeClient,
                                    authSig,
                                    accessToken: authMethod.accessToken,
                                });
    
                                console.log(signedEmail);
    
                                console.log(utils.verifyMessage(safe, signedEmail.signature));
    
                                const enableModule = await getSafeTransaction({
                                    owner,
                                    to: safe,
                                    value: utils.parseEther("0"),
                                    data:
                                      "0x610b5925000000000000000000000000" + config.module.slice(2),
                                });
    
                                console.log(enableModule);
                      
                                const enableModuleTx = await getSignedTransaction({
                                    litNodeClient,
                                    provider: ethProvider,
                                    authSig,
                                    data: enableModule.data,
                                    toAddress: safe,
                                    pkp: {
                                      pkpEthAddress: config.signTxn.address,
                                      pkpPublicKey: config.signTxn.pkp,
                                    },
                                    accessToken: authMethod.accessToken,
                                    email,
                                    safeSignature: signedEmail.signature,
                                });
                      
                                console.log(await enableModuleTx.result.wait(1));
                            }
                            
                            // const testTx = await execWithLit(
                            //     config.module,
                            //     litNodeClient,
                            //     config.factory,
                            //     {
                            //       from: safe,
                            //       to: wallet.address, // erc20 contract address goes here
                            //       value: parseEther("0.0001"),
                            //       data: '0x',
                            //     },
                            //     wallet,
                            //     authSig,
                            //     authMethod,
                            //   );
                
                            // console.log(testTx)

                            return { wallet, client, email }

                        }
                    }
                    return null;
                }
            },
            {
                path: "/:email",
                element: <Dashboard />,
                id: "dashboard",
            }
        ]
    }
])

export default router;