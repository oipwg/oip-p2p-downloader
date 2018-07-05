var Downloader = require('./lib/app.js');

var dl = new Downloader()

dl.download("e0113b", __dirname + "/data")


process.on('SIGINT', function() {
    console.log("Shutting down IPFS Node");
    dl.shutdown();
    process.exit();
});