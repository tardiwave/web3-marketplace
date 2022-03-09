# Getting Started

## Prepare the project
Install dependencies

`$ yarn`

Complile the contract

`$ npx hardhat compile`

Test your contract:

`$ npx hardhat --network ganache test`

## Deploy your contract locally

First we have to generate a test environment with fake accounts

`$ npx hardhat node`

Add one of the accounts on your metamask (choose the localhost 8545 network)
keep it alive and run in an other tab

`$ npx hardhat run scripts/deploy.js --network localhost`

Run the web app (if you already have thing in your .env, comment it before)

`$ yarn dev`

## Deploy online and test it

Create an app on [Alchemy](https://www.alchemy.com/)
Fill the `.env` file with your informations:

```dosini
ETHERSCAN_API_KEY=ABC123ABC123ABC123ABC123ABC123ABC1
#metamask account public key
PRIVATE_KEY=0xabc123abc123abc123abc123abc123abc123abc123abc123abc123abc123abc1
#metamask account private key
NEXT_PUBLIC_ROPSTEN_URL=https://eth-ropsten.alchemyapi.io/v2/<YOUR ALCHEMY KEY>
#Alchemy app url
```

Deploy your contract on Alchemy:

`$ npx hardhat run scripts/deploy.ts --network ropsten`

Run the web app

`$ yarn dev`
