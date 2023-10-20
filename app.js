const { runtime } = require("./libs/horizon");


// .then(data => {
//     console.log(data)
// })
// .catch(error => {
//     console.log('error:', error)
// })


/**
 * Setup out runtime functions and variables
 * 
 * TODO:
 *      - Setup up try/catch to catch errors
 *      - Run logic to trigger fetching of asset holders
 */
try {
    runtime('AlienheadZPK', 'GDGW7H5LVBHURQY6LXMQK2TW6SZLXIFVY6AH4Z63LE4P36VTGXASY4TE')
} catch (error) {
    console.log('runtime error:', error)
}