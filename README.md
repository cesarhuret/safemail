# SafeMail
Decentralized Email <> Email transfers using Lit Protocol and the Safe SDK.

### Short Description
SafeMail is a simple way to send tokens to any google email address, even if they're not in crypto yet. No private keys, no wallets, just a google sign-in. Fund it with some tokens and you're good to go.

### Why this?
Sending transactions on Ethereum can be complex for the average non-crypto user. ETH addresses, wallets, gas, etc are all huge turnoffs, and although we've successfully been able to abstract some layers of this, there are many ways to go. In order to bring the next billion users to crypto, we need to reduce the learning curve to get into crypto.

## Architecture
SafeMail is a simple way to send tokens to any google email address, even if they're not in crypto yet. No private keys, no wallets, just a google sign-in. Fund it with some tokens and you're good to go.

#### Safe 
By leveraging Safe's Create2 contracts, a safe can be derived from a specific email address, and consistently computed using the same email address and owner. By using Account Abstraction and smart contract wallets, we can avoid needing private keys. Furthermore, we use the Gelato SDK to automate the execution of transactions, so that the user doesn't need to pay gas fees.

#### Lit Protocol
Lit Protocol enables us to use Lit Actions - computing JS code stored on IPFS in a decentralized way. This allows to securely verify if an OAUTH token is valid and corresponds to the right email address (OAUTH tokens are valid for 1 hour). From that verification, we can get the safe address that wants to be used, and send execute any transaction from that safe to a recipient email address.
