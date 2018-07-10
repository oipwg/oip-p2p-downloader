var Downloader = require('./lib/app.js');
var pkjson = require('./package.json')
var chalk = require('chalk')
var figlet = require('figlet')
const fs = require('fs-extra')

var init = figlet.textSync(`OIP P2P Downloader`, {horizontalLayout: 'fitted'})

console.log(chalk.grey(init))
console.log(`\t\t\t\t\t\t\t  ${chalk.cyan("version " + pkjson.version)} ${chalk.hex("#FF6E1E")("by Anthony Howl from the OIPWG")}`)

const store = this.__dirname + '/data';

fs.ensureDir(store, err => {
  console.log(err) // => null
})

fs.ensureDir(store)
.then(() => {
  console.log('success!')
})
.catch(err => {
  console.error(err)
})


async function example (store) {
  try {
    await fs.ensureDir(store)
    console.log('success!')
  } catch (err) {
    console.error(err)
  }
}



var dl = new Downloader()

dl.download("e0113b", __dirname + '/data')



process.on('SIGINT', function() {
    console.log(" Shutting down IPFS Node");
    dl.shutdown();
    process.exit();
});