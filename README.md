# Prepare the project

Install dependencies

`$ yarn`

Complile the contract

`$ npx hardhat compile`

Test your contract:

`$ npx hardhat --network ganache test`

# Deploy your contract locally

First we have to generate a test environment with fake accounts

`$ npx hardhat node`

Add one of the accounts on your metamask (choose the localhost 8545 network)
keep it alive and run in an other tab

`$ npx hardhat run scripts/deploy.ts --network localhost`

Run the web app (if you already have thing in your .env, comment it before)

`$ yarn dev`

# Deploy online and test it

Create an app on [Alchemy](https://www.alchemy.com/)
Fill the `.env` file with your informations:

```dosini
#To follow your transaction (polygon supported)
ETHERSCAN_API_KEY=ABC123ABC123ABC123ABC123ABC123ABC1

#metamask account public key
PRIVATE_KEY=0xabc123abc123abc123abc123abc123abc123abc123abc123abc123abc123abc1
#metamask account private key
#If you want tu use the direct Ethereum

NEXT_PUBLIC_ROPSTEN_URL=https://eth-ropsten.alchemyapi.io/v2/<YOUR ALCHEMY KEY>
#Alchemy deploy app url
NEXT_PUBLIC_ETHER_MAINNET_URL=https://eth-mainnet.alchemyapi.io/v2/<YOUR ALCHEMY KEY>

#If you want tu use the direct polygon layer 2 solution for Ethereum

NEXT_PUBLIC_POLYGON_MUMBAI_ALCHEMY_URL=https://polygon-mumbai.g.alchemy.com/v2/<YOUR ALCHEMY KEY>
#Alchemy deploy app url
NEXT_PUBLIC_POLYGON_MAINNET_ALCHEMY_URL=https://polygon-mainnet.g.alchemy.com/v2/<YOUR ALCHEMY KEY>
```

## Deploy your contract on Alchemy with testnet mode:

In the `.env` file set `NEXT_PUBLIC_CHAIN_ENV` as `test`

### Ehtereum chain

- In the `.env` file set `NEXT_PUBLIC_TESTNET` as `ROPSTEN_ALCHEMY`
- `$ npx hardhat run scripts/deploy.ts --network ropsten`

## Polygon chain

- In the `.env` file set `NEXT_PUBLIC_TESTNET` as `POLYGON_ALCHEMY`
- `$ npx hardhat run scripts/deploy.ts --network mumbai`

Now you can run the app

`$ yarn dev`

Follow your transactions in testing mode https://polygonscan.com/ for Polygon sidechain or https://ropsten.etherscan.io/ for Ethereum chain
Follow your transactions in production mode https://polygonscan.com/ for Polygon sidechain or https://rinkeby.etherscan.io/ for Ethereum chain

Get test tokens https://faucet.polygon.technology/ for polygon sidechain or https://moonborrow.com/
