/**
 * Name: horizon.js
 * Description: Handle API requests to and from Stellar Horizon API
 */

/**
 * Import axios in order to make REST requests to Horizon
 */
const axios = require("axios")

/**
 * Import StellarSDK custom helper functions
 */
const { buildTransactionEnvelope, submitTransaction } = require("./stellar")

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
         * Set payment array chunk size (max 100 operations per transaction)
         */
        let chunkSize = 99

        /**
         * Array used to split up payment array into chunks from `chunkSize`
         */
        let chunkArray = []
        /**
         * Run function to fetch asset holders
         */
        assetHolders(code, issuer, false).then(async accounts => {
            /**
             * Wait for our returned 2D Stellar Array[]
             */
            let operations = await buildTransactionEnvelope(accounts)

            /**
             * TODO:
             *      - Loop entire Array[] (x)
             *      - Return child Array of Array[]
             *      - Submit child Array[] to the network
             *      - Return status
             */

            for (let i = 0; i < operations.length; i += chunkSize) {
                const chunk = operations.slice(i, i + chunkSize)
                chunkArray.push(chunk)
            }
            /**
             * Set our counter variable
             */
            let counter = 1

            /**
             * Iterate through the chunk array to fetch the transaction blocks
             */
            for (let block of chunkArray) {
                console.log("[StellarSDK]: Processing block #"+counter+" with transactions:", block.length)

                /**
                 * Submit transaction to the network using custom helper function
                 */
                await submitTransaction(block)

                console.log("[StellarSDK]: Block #"+counter+" success")

                /**
                 * Update counter (purely for logging purposes)
                 */
                counter++
            }
        })
        .catch(error => {
            /**
             * Fetch function errors and return them to 
             * user
             */
            console.log(error)
            console.log("Returned error: ", error.config.data.split('tx=')[1])
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
 * Export functions to make them availble to
 * other parts of the program
 */
module.exports = {
    runtime
}