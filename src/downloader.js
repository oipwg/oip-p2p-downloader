'use strict'

import fs from 'fs';
import path from 'path'; 
import complexFilter from 'complex-filter';
import through2 from 'through2';
import Observable from 'zen-observable';
import IPFS from 'ipfs';
import { OIPJS } from 'oip-js';
import { artifacts } from 'oip-js';


class Downloader {
    constructor(IPFS_config, OIPJS_config){
        this._ipfs = new IPFS(IPFS_config); ({
            host: 'gateway.ipfs.io',
            port: 443,
            protocol: 'https'
            

        })
        const selected = artifacts.filter(filter)

        selected.forEach((artifact) => {
            const p = new Promise((res, rej) => {
                const artifactLocation = artifact.getLocation()
                const artifactPath = path.resolve(jobPath, artifactLocation)
                if (!fs.existsSync(artifactPath))
                    fs.mkdirSync(artifactPath)
                let files = artifact.getFiles()
                const selectedFiles = files.filter((file) => {
                    return downloadInfo.allowedFiles.indexOf(file.getFilename()) !== -1
                })
                selectedFiles.forEach((file) => {
                    const ipfsFilePath = artifact.getLocation() + '/' + file.getFilename()
                    const filePath = path.resolve(artifactPath, file.getDisplayName())
                    const readStream = ipfsDownload.files.getReadableStream(ipfsFilePath)
                    downloads.push(
                        {
                            task: () => {
                                return new Observable((observer) => {
                                    let downloaded = 0
                                    const totalDownload = file.getFilesize()
                                    observer.next(`Progress: ${filesize(downloaded, {base: 10})}/${filesize(totalDownload, {base: 10})}`)
                                    readStream
                                        .on('error', (err) => {
                                            console.log('Error in getting the data')
                                            throw err
                                        })
                                        .pipe(through2.obj((data, enc, next) => {
                                            const writeStream = fs.createWriteStream(filePath)
                                            data.content
                                                .on('data', (dataFlow) => {
                                                    downloaded += dataFlow.length
                                                    observer.next(`Progress: ${filesize(downloaded, {base: 10})}/${filesize(totalDownload, {base: 10})}`)
                                                })
                                                .on('error', (err) => {
                                                    console.log('Error in getting the data')
                                                    throw err
                                                })
                                                .pipe(writeStream)
                                                .on('finish', () => {
                                                    const manifest = `${artifactLocation} : ${file.getFilename()}\n`
                                                    fs.appendFileSync(manifestFilePath, manifest)
                                                    observer.complete()
                                                })
                                                .on('error', (err) => {
                                                    console.log('Error in processing the data')
                                                    throw err
                                                })
                                        }))
                                        .on('error', (err) => {
                                            console.log('Error in retrieving the data')
                                            console.log(err)
                                            throw err
                                        })
                                })
                            }
                        }
                    )
                })
                res()
            })
            promises.push(p)
        })
    }
}
module.exports = Downloader;