# Asset holder reward payout
#### For the Stellar Network, built using the [stellar-sdk](https://github.com/stellar/js-stellar-sdk)

This is a simple Node.js application that allows you to fetch the holders of a Stellar asset and initiate payouts to them. You can use this tool to reward the asset holders of your choice by modifying the configuration in the .env file.

## Getting Started
Follow these steps to get started with the NodeJS Stellar Asset Holders Rewards application.

### Prerequisites
- Node.js: Make sure you have Node.js installed on your system. You can download it from [NodeJS.org](https://nodejs.org/).

### Installation
1. Clone this repository:
```bash
    git clone https://github.com/Stellar-Cannacoin/NodeJS_Stellar_assetholders_rewards.git
```
2. Change to the project directory:
```bash
    cd NodeJS_Stellar_assetholders_rewards
```
3. Install the project dependencies:
```bash
    npm install
```

### Configuration
Before you can use the application, you need to configure it by modifying the .env file. The .env file should have the following structure:

```
CODE="YOUR_ASSET_CODE"
ISSUER="YOUR_ASSET_ISSUER_PUBLIC_KEY"
PAYOUT_CODE="PAYOUT_ASSET_CODE"
PAYOUT_ISSUER="PAYOUT_ASSET_ISSUER"
REWARD="PAYOUT_AMOUNT_PER_HOLDER"
REWARD_MEMO="PAYOUT_MEMO"
PUBLIC="YOUR_STELLAR_PUBLIC_KEY"
SECRET="YOUR_STELLAR_SECRET_KEY"
NETWORK="https://horizon.stellar.org/"
```

- **CODE:** Replace with the code of the Stellar asset you want to distribute rewards for. (fetch eligable airdrop wallets). One can setup to scan ex for holders of an NFT and then airdrop them a specific Stellar asset.
- **ISSUER:** Replace with the public key of the asset issuer.
- **PAYOUT_CODE:** Replace with the code of the Stellar asset you want to distribute rewards **in.**
- **PAYOUT_ISSUER:** Replace with the public key of the asset issuer you want to distrubyte rewards **in.**
- **REWARD** Replace with amount you want to reward each asset holder
- **REWARD_MEMO** Replace with memo attached to payout
- **PUBLIC:** Replace with your Stellar public key.
- **SECRET:** Replace with your Stellar secret key.
- **NETWORK** Keep as is, or switch over to [Soroban](https://horizon-futurenet.stellar.org) / [Horizon](https://developers.stellar.org/api/horizon) testnet

Make sure you have the necessary Lumens (XLM) in the account associated with the PUBLIC and SECRET keys to cover transaction fees.

### Usage
After configuring the .env file, you can run the application:
```bash
node app.js
```
The application will fetch the asset holders and initiate payouts according to the configuration in the .env file.

## Todo
- [ ] Remove the usage of [Stellar.expert](https://stellar.expert) due to the blocking and rate limiting of IP's
- [ ] Update the app to TypeScript
- [ ] Include mock data
- [ ] Create unit tests

## Contributing
If you would like to contribute to this project or report issues, please open an issue or create a pull request on the GitHub repository.

## Acknowledgments
- Special thanks to the Stellar Development Foundation for providing the tools and infrastructure to work with the Stellar network.

Happy rewarding your asset holders with Stellar! 🚀🌟
