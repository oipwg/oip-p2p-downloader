'use strict'

import fs from 'fs';
import path from 'path'; 
import complexFilter from 'complex-filter';
import through2 from 'through2';
import Observable from 'zen-observable';
import { IpfsConnector } from '@akashaproject/ipfs-connector';
import { OIPJS } from 'oip-js';



class Downloader {
    constructor(IPFS_config, OIPJS_config){

        this._ipfs = IpfsConnector.getInstance()
        this._oipjs = new OIPJS(OIPJS_config);

        
        this._ipfs.start().then((api) => {
            this._ipfs_ready = true
        })
        this._ipfs.REQUEST_TIMEOUT = 1 * 1000000000;
    }
        
    shutdown() {
        this._ipfs.stop();
    }

    download(artifact_ID, download_Location, filter_function){
        return new Promise((resolve, reject) => {
            var attemptDownload = () => {
                if (!this._ipfs_ready){
                    setTimeout(attemptDownload, 1000)
                    return
                }

                if (!artifact_ID)
                    reject(new Error("Artifact ID is undefined!"))

                this._oipjs.Index.getArtifactFromID(artifact_ID, (artifact) => {
                    // on success
                    console.log(artifact);

                    var filesToDownload = artifact.getFiles();

                    // for (var f in filesToDownload){
                    //     this.downloadFile(filesToDownload[f]).then(() => {

                    //     })
                    // }
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
            resolve("")

            this._ipfs.api.getFile('zb2rhjDjm6tU24fwEnRSdVx6azrYUKjereY1c325VqR5vdaDQ').then((file => {
                fs.writeFileSync('keyimg_ci2007-11-27-5_s.jpg', file );

            } ))

        })
    }
}

module.exports = Downloader;