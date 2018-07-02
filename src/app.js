'use strict'

import fs from 'fs';
import path from 'path'; 
import complexFilter from 'complex-filter';
import through2 from 'through2';
import Observable from 'zen-observable';
import IPFS from 'ipfs';
import { OIPJS } from 'oip-js';


class Downloader {
    constructor(IPFS_config, OIPJS_config){
        this._ipfs = new IPFS(IPFS_config);
        this._oipjs = new OIPJS(OIPJS_config);

        
        this._ipfs.on('ready', () => {
            this._ipfs_ready = true
        })
    }
        

       download(artifact_ID, download_Location, filter_function){
        return new Promise((resolve, reject) => {
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
        })
    }
    
    downloadFile(artifact_file, download_Location){
        return new Promise((resolve, reject) => {
            resolve("test")
        })
    }
}

module.exports = Downloader;