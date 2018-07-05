'use strict'

import fs from 'fs';
import path from 'path'; 
import complexFilter from 'complex-filter';
import through2 from 'through2';
import Observable from 'zen-observable';
import { IpfsConnector } from '@akashaproject/ipfs-connector';
import { OIPJS } from 'oip-js';
import { Stream } from 'stream';
import download from 'go-ipfs-dep';



class Downloader {
    constructor(IPFS_config, OIPJS_config){

        this._ipfs = IpfsConnector.getInstance()
        this._oipjs = new OIPJS(OIPJS_config);

        
        this._ipfs.start().then((api) => {
            console.log('post start')
            var _this = this
            _this._ipfs.api.apiClient.swarm.connect('/ip4/100.67.96.46/tcp/4001/ipfs/QmZTFgNnrzUgoM9k464gotLLxnX72BLwvHR9goK9d9BtHm', function (err) {
            console.log('post connect')    
            if (err) {
                  throw err
                }
            
               console.log('pre-ready') 
               _this._ipfs_ready = true
              })
        })
        this._ipfs.REQUEST_TIMEOUT = 10000000000000;
    }
        
    shutdown() {
        this._ipfs.stop();
    }

    download(artifact_ID, download_Location, filter_function){
        console.log('ready')
        return new Promise((resolve, reject) => {
            var attemptDownload = () => {
                console.log('delay?')
                if (!this._ipfs_ready){
                    setTimeout(attemptDownload, 1000)
                    return
                }
                console.log('ready')

                if (!artifact_ID)
                    reject(new Error("Artifact ID is undefined!"))

                this._oipjs.Index.getArtifactFromID(artifact_ID, (artifact) => {
                    // on success
                    console.log(artifact);

                    var filesToDownload = artifact.getFiles();

                    this.downloadFile(filesToDownload[0],download_Location).then((info) => {
                        console.log(info);
                    })
                    console.log(download_Location)
                }, (error) => {
                    reject(error)
                })
            }

            attemptDownload()
        })
    }
    
    downloadFile(artifact_file, download_Location){
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
    }
}


module.exports = Downloader;