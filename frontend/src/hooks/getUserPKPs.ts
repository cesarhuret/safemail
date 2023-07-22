import { AuthMethod } from "@lit-protocol/types";

export const getUserPKPs = async (litProvider: any, authMethod: AuthMethod) => {
    const pkps = await litProvider.fetchPKPsThroughRelayer(authMethod);
    
    let pkp = pkps[pkps.length - 1];

    if (!pkp?.publicKey) {
      try {
        await litProvider.mintPKPThroughRelayer(authMethod);

        pkp = (
          await litProvider.fetchPKPsThroughRelayer(authMethod)
        )[0];
      } catch (e) {
        console.log(e);
        return null;
      }
    }

    return pkp;
}