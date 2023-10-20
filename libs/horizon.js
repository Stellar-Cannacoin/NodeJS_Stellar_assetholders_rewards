/**
 * Name: horizon.js
 * Description: Handle API requests to and from Stellar Horizon API
 */

const axios = require("axios")
const { buildTransactionEnvelope } = require("./stellar")

/**
 * Define base URL for the network used
 */
const network = 'https://api.stellar.expert'

/**
 * Writable array in which will contain the returned
 * asset holders
 */
let returnArray = []

/**
 * Initialize the airdrop
 * @param { String } code Asset code
 * @param { String } issuer Asset issuer
 * @returns Promise
 */
const runtime = (code, issuer) => {
    return new Promise(async (resolve, reject) => {
        /**
         * Run function to fetch asset holders
         */
        assetHolders(code, issuer, false).then(async accounts => {
            /**
             * TODO:
             *      - Enable calculation based on asset balance
             *      - Build transaction envelope (build, max 100 transactions)
             *      - Submit transaction to network
             *      - Return status to the user
             */
            console.log('Assets holders (count):', accounts.length)

            /**
             * Make the code a bit easier to read, just simple variable
             * setups
             */
            let amount = parseFloat(213).toFixed(7)
            let memo = 'Memo goes here'

            /**
             * Wait for our returned 2D Stellar Array[]
             */
            let stellarArray = await buildTransactionEnvelope(code, issuer, accounts, amount, memo)

            /**
             * TODO:
             *      - Loop entire Array[]
             *      - Return child Array of Array[]
             *      - Submit child Array[] to the network
             *      - Return status
             */


            /**
             * Return status from the network
             */
            return resolve('All done')
        })
        .catch(error => {
            /**
             * Fetch function errors and return them to 
             * user
             */
            console.log(error)
            return reject(error)
        })
    })
}

/**
 * Loop through the the asset holders and return them
 * @param { String } code Asset code
 * @param { String } issuer Asset issuer
 * @param { String } nextUrl Next cursor path or default: false
 * @returns Array
 */
const assetHolders = (code, issuer, nextUrl) => {
    /**
     * Set cursor `nextUrl` if exists, if not; defaults back to `false`
     */
    var page = nextUrl

    /**
     * Check to see if the cursor has been initialized
     */
    if (!nextUrl) {
        /**
         * Set API page path
         */
        page = `/explorer/public/asset/${code}-${issuer}/holders?limit=100&order=desc`
    }
    
    /**
     * Call Horizon API using Axios
     */
    return axios.get(network + page).then((response) => {
        /**
         * Manage return array
         */
        returnArray = returnArray.concat(response.data._embedded.records)

        /**
         * Check to see if the returned next cursor is equals
         * if not, fetch next list of asset holders
         */
        if (nextUrl != response.data._links.next.href) {
            /**
             * Rerun the fetch function
             */
            return assetHolders(code, issuer, response.data._links.next.href)
        } else {
            /**
             * No more pagination, return the array
             */
            return returnArray
        }
    }).catch( function(error) {
        /**
         * If error presents, return current array
         */
        return returnArray
    })
}

/**
 * Verify is the Stellar account have established a trustline to the 
 * payout asset fetched from the .env file
 * @param { String } account Stellar account id
 * @returns 
 */
const verifyTrustline = (account) => {
    return new Promise(async (resolve, reject) => {

    })
}

/**
 * Outdate / duplicate function, do not use
 * @param { String } code Asset code
 * @param { String } issuer Asset issuer
 * @returns Promise
 */
// const runtime = (code, issuer) => {
//     return new Promise(async (resolve, reject) => {
//         try {
//             console.log('Started running')
//             await returnAssetHolders(code, issuer)
//             console.log('Finished running')
//         } catch (error) {
//             console.log(error)
//             return reject(error)
//         }
//     })
// }

/**
 * Export functions to make them availble to
 * other parts of the program
 */
module.exports = {
    runtime
}