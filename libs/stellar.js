/**
 * Name: stellar.js
 * Description: Handle Stellar Network functions
 */

/**
 * Setup .env file to fetch credentials used
 */
require('dotenv').config()

const stellar = require('stellar-sdk')

/**
 * Stellar SDK Runtime setup (server and network connection to the chain)
 */
const server = new stellar.Server(process.env.NETWORK)

/**
 * Stellar SDK Source account load
 */
const sourceKeypair = stellar.Keypair.fromSecret(process.env.SECRET)
const sourcePublicKey = sourceKeypair.publicKey()

/**
 * Check if the network response is an fee error
 * @param { Object } error Stellar SDK error
 * @returns Boolean
 */
const isFeeError = (error) => {
    return (
      error.response !== undefined &&
      error.status === 400 &&
      error.extras
    )
}

/**
 * Create a Stellar-SDK transaction array which can be iterated and submitted
 * @param { Array } accounts Array of receiving account id's
 * @returns Array
 */
const buildTransactionEnvelope = (accounts) => {
    return new Promise(async (resolve, reject) => {
        /**
         * Declare return objects and variables
         */
        let stellaroperations = []

        /**
         * Loop entire fetched array and set the correct settings
         * in order to submit a fully working transaction block to the
         * network.
         */
        await Promise.all(accounts.map(async holder => {
            /**
             * Check if the NFT holders have the needed trust for the
             * payout asset. If the holder dosent have the trust it will be skipped
             * this due to Stellar block transactions crashing if one operation fails
             * in the submitted block.
             */
            let trust = await verifyTrustline(holder.account)
            if (!trust) {
                return
            }

            /**
             * Create and generate the Stellar SDK transaction array which will be
             * submitted to the network.
             */
            stellaroperations.push(
                stellar.Operation.payment({
                    destination: holder.account,
                    asset: new stellar.Asset(process.env.PAYOUT_CODE, process.env.PAYOUT_ISSUER),
                    amount: parseFloat(process.env.REWARD).toFixed(7),
                    fee: '50000'
                })
            )
        }))

        /**
         * Resolve the full operations array and return it
         */
        return resolve(stellaroperations)
    })
}

/**
 * Submit transaction to network
 * @param { Array } transactions Stellar Transaction array
 * @returns Promise
 */
const submitTransaction = (transactions) => {
    return new Promise((resolve, reject) => {
        server.loadAccount(sourcePublicKey).then(async account => {
            console.log("[StellarSDK]: Creating & signing transaction")

            /**
             * Set full block transaction fee
             */
            let fee = parseFloat(transactions.length*10000).toFixed(0)

            /**
             * Setup transaction builder
             */
            const txBuilder = new stellar.TransactionBuilder(account, {fee: fee, networkPassphrase: stellar.Networks.PUBLIC})
            
            /**
             * Add transactions
             */
            txBuilder.operations = transactions

            /**
             * Set Memo if it's set in the .env file
             */
            if (process.env.REWARD_MEMO) {
                txBuilder.addMemo(stellar.Memo.text(process.env.REWARD_MEMO))
            }

            /**
             * Set submission timeout
             */
            txBuilder.setTimeout(0)
            
            /**
             * Build the transaction
             */
            const transaction = txBuilder.build()

            /**
             * Sign transaction
             */
            transaction.sign(sourceKeypair)

            /**
             * Submit transaction and return status response 
             * from the network
             */
            return await server.submitTransaction(transaction)
        })
        .then(data => {
            console.log("[StellarSDK]: Transaction block successfully submitted to the chain")

            /**
             * Resolve network status
             */
            return resolve(data)
        })
        .catch(async error => {
            console.log("Returned error (XDR): ", error.config.data.split('tx=')[1])

            /**
             * Catch network error and look for fee errors,
             * if there is fee errors, run `bumpTransaction()` in order to resubmut the transaction
             * with higher fees (due to surge fees on the network).
             */
            if (!error.config.data) {
                console.log('[StellarSDK]: Failed to read XDR')
                return reject(error)
            }
            
            /**
             * Try to rerun our trandsaction with a higher fee
             */
            try {
                /**
                 * Query error XDR to the network
                 */
                let data = await bumpTransaction(error)

                /**
                 * Return response from the network
                 */
                return resolve(data)
            } catch (error) {
                /**
                 * Something else is causing the transaction to fail
                 */
                console.log(error)
                return reject(error)
            }
    
        })
    })
}

/**
 * Submit transaction to the network with a higher fee to avoid timing out
 * @param { Object } error Stellar SDK error
 * @returns Promise
 */
const bumpTransaction = (error) => {
    return new Promise((resolve, reject) => {
        /**
         * Generate and split up error response XDR to
         * be resubmitted
         */
        const transaction = new stellar.TransactionBuilder.fromXDR(decodeURIComponent(error.config.data.split('tx=')[1]), stellar.Networks.PUBLIC)
        
        /**
         * Retry submission to network
         */
        server.submitTransaction(transaction).catch(function (error) {
            /**
             * Check if the error is a fee error
             */
            if (isFeeError(error)) {
                let bump = new stellar.TransactionBuilder.buildFeeBumpTransaction(
                    sourceKeypair,
                    "50000" * 10,
                    transaction,
                    stellar.Networks.PUBLIC
                )

                /**
                 * Sign the bump transaction
                 */
                bump.sign(sourceKeypair)

                /**
                 * Submit and return response from the network
                 */
                return server.submitTransaction(bump)
            }
        }).then(() => {
            /**
             * Transaction bump worked
             */
            resolve(true)
        }).catch(error => {
            /**
             * Something else failed / or the transaction is broken
             */
            console.log(error)
            console.log("Returned error: ", error.config.data.split('tx=')[1])
            resolve(false)
            return
        });
    })
}

/**
 * Verify is the Stellar account have established a trustline to the 
 * payout asset fetched from the .env file
 * @param { String } account Stellar account id
 * @returns 
 */
const verifyTrustline = (id) => {
    return new Promise(async (resolve, reject) => {
        /**
         * Check if the sender matches any holders, and exclude them
         */
        if (id == process.env.PUBLIC) {
            return resolve(false)
        }

        /**
         * Load asset holder account to check for balances
         */
        let account = await server.loadAccount(id)

        /**
         * Filter out balances to check if any matches the payout code & issuer
         */
        let balance = account.balances.filter(balance => balance.asset_code == process.env.PAYOUT_CODE && balance.asset_issuer == process.env.PAYOUT_ISSUER)

        /**
         * If the returned array is empty, that means there was no match
         */
        if (balance.length == 0) {
            return resolve(false)
        }

        /**
         * Return success state
         */
        return resolve(true)
    })
}

/**
 * Export functions to make them availble to
 * other parts of the program
 */
module.exports = {
    buildTransactionEnvelope,
    submitTransaction,
    verifyTrustline
}