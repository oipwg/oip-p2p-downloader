var IPFS = require('go-ipfs-dep');

var node = new IPFS()

const validCID = 'QmY3wmeJuc31xjRBVEKGepB4qjapyMdQkDJisJUT7e8Gw5'

node.on('ready', () => {
 
    node.files.get(validCID, function (err, files) {
        files.forEach((file) => {
          console.log(file.path)
          console.log(file.content.toString('utf8'))
        })
      })

})

