const { runtime } = require("./libs/horizon");
const { verifyTrustline } = require("./libs/stellar");

/**
 * Setup .env file to fetch credentials used
 */
require('dotenv').config()

/**
 * Setup out runtime functions and variables
 * 
 * TODO:
 *      - Setup up try/catch to catch errors
 *      - Run logic to trigger fetching of asset holders
 */
try {
    runtime(process.env.CODE, process.env.ISSUER)
    // verifyTrustline('GCWC3TUIPQOHYX3ES5K6HVHWU3KTMYB5ZPJALWIZA33VUVBSDJG2HABM')
    // .then(data => {
    //     if (!data) {
    //         return console.log("NOT FOUND")
    //     }
    //     return console.log("FOUND")
    // })
} catch (error) {
    console.log('runtime error:', error)
}