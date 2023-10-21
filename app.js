const { runtime } = require("./libs/horizon")

/**
 * Setup .env file to fetch credentials used
 */
require('dotenv').config()

/**
 * Start application
 */
try {
    runtime(process.env.CODE, process.env.ISSUER)
} catch (error) {
    console.log('Runtime error:', error)
}