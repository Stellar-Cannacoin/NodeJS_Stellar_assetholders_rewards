

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
PUBLIC="YOUR_STELLAR_PUBLIC_KEY"
SECRET="YOUR_STELLAR_SECRET_KEY"
```

- **CODE:** Replace with the code of the Stellar asset you want to distribute rewards for.
- **ISSUER:** Replace with the public key of the asset issuer.
- **PAYOUT_CODE:** Replace with the code of the Stellar asset you want to distribute rewards **in.**
- **PAYOUT_ISSUER:** Replace with the public key of the asset issuer you want to distrubyte rewards **in.**
- **PUBLIC:** Replace with your Stellar public key.
- **SECRET:** Replace with your Stellar secret key.

Make sure you have the necessary Lumens (XLM) in the account associated with the PUBLIC and SECRET keys to cover transaction fees.

### Usage
After configuring the .env file, you can run the application:
```bash
node app.js
```
The application will fetch the asset holders and initiate payouts according to the configuration in the .env file.

## Contributing
If you would like to contribute to this project or report issues, please open an issue or create a pull request on the GitHub repository.

## Acknowledgments
- Special thanks to the Stellar Development Foundation for providing the tools and infrastructure to work with the Stellar network.

Happy rewarding your asset holders with Stellar! 🚀🌟