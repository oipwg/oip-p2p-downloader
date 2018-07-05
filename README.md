# oip-p2p-downloader

A tool for downloading directly off IPFS through OIP

``` Npm install ```
``` Npm test ```


App.js

```   downloadFile(artifact_file, download_Location){
        return new Promise((resolve, reject) => {
            // resolve("")
            var downloadedBytes = 0
            var totalBytes = 0
            this._ipfs.api.apiClient.files.stat('/ipfs/'+'Qmc251CiKsYz74ho3wF9ituiAmUBt5QtEVjdvJSY32ETwa', (err, stats) => {
                console.log(err)
            totalBytes = stats.size;
              var stream = this._ipfs.api.apiClient.files.catReadableStream('Qmc251CiKsYz74ho3wF9ituiAmUBt5QtEVjdvJSY32ETwa')
            
            
            console.log("pre stream")
            var ws = fs.createWriteStream('Ti_a4h_h4_170e13um18K_27nov07.mrc');
            if (stream.readable) {
                console.log("readable")
                stream.on('error', (err) => {
                        console.error(err)
                    }).on('data', (data) => {
                        downloadedBytes += data.length;
                        
                        console.log(downloadedBytes + '/' + totalBytes + " - " + Math.round(downloadedBytes/totalBytes*100000)/1000 + "%")
                        ws.write(data);
                    }).on('end', () => {
                    console.log("end")
                        ws.end();
                    })

            }})
        })
    } ```
    
    replace ``` Qmc251CiKsYz74ho3wF9ituiAmUBt5QtEVjdvJSY32ETwa ``` with whatever ipfs hash you require
    
    make sure to change  ``` var ws = fs.createWriteStream('Ti_a4h_h4_170e13um18K_27nov07.mrc'); ``` to match the name of what is being downloaded
