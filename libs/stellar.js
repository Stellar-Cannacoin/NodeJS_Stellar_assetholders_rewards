/**
 * Name: stellar.js
 * Description: Handle Stellar Network functions
 */

/**
 * Setup .env file to fetch credentials used
 */
require('dotenv').config()

/**
 * Create a Stellar-SDK transaction array which can be iterated and submitted
 * @param { String } code Asset code
 * @param { String } issuer Asset issuer
 * @param { Array } accounts Array of receiving account id's
 * @param { Float } balance Amount to pay out
 * @param { String } memo Memo to be included in the transaction
 * @returns Array [[Object], [Object]]
 */
const buildTransactionEnvelope = (code, issuer, accounts, balance, memo) => {
    return new Promise((resolve, reject) => {

    })
}

/**
 * Submit transaction to network
 * @param { Array } transactions Stellar Transaction array
 * @returns Promise
 */
const submitTransaction = (transactions) => {
    return new Promise((resolve, reject) => {

    })
}

/**
 * 
 * @param { Object } error Stellar error Object
 * @returns Promise
 */
const bumpTransaction = (error) => {
    return new Promise((resolve, reject) => {

    })
}

/**
 * Export functions to make them availble to
 * other parts of the program
 */
module.exports = {
    buildTransactionEnvelope,
    submitTransaction
}