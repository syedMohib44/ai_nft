// import fs from "fs";
// import { HfInference } from "@huggingface/inference";
// // import { create } from 'ipfs-http-client'



// // const run = async () => {
// //     const imagesDir = './src/images'

// //     const files = fs.readdirSync(imagesDir)
// //     const gateway = 'https://ipfs.io/ipfs/'
// //     const ipfs = await IPFS.create()


// //     for (let file of files) {
// //         const buffer = fs.readFileSync(`${imagesDir}/${file}`)
// //         const result = await ipfs.add(buffer)
// //         console.log(result)
// //         console.log(gateway + result.path)
// //     }
// // }

// // const fs = require('fs')

// const run = async () => {
//     // const files = fs.readdirSync(img.png)
//     // const { create } = await import('ipfs-core')
//     // const { HfInference } = await import("@huggingface/inference");

//     // const gateway = 'https://ipfs.io/ipfs/'
//     // const ipfs = await create();

//     // // for (let file of files) {
//     // const buffer = fs.readFileSync('img.png')
//     // const result = await ipfs.add(buffer)
//     // console.log(gateway + result.path)
//     // }

//     const inference = new HfInference('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');
//     console.log('running');
//     const blob = await inference.textToImage({
//         inputs: 'Batman',
//         negative_prompt: '18+',
//         model: 'stabilityai/stable-diffusion-2',
//     }, { use_gpu: true, use_cache: false });

//     const arrayBuffer = await blob.arrayBuffer();
//     const buffer = Buffer.from(arrayBuffer);
//     fs.writeFileSync('img.png', buffer);
//     // const readImg = fs.readFileSync('img.png')
//     // console.log(readImg)

//     // const utf = await blob.stream().getReader().read();
//     // console.log(utf, blob);

//     // const d = await inference.imageSegmentation({ data: readImg, model: 'stabilityai/stable-diffusion-2' }, { use_gpu: true });
//     // console.log(d);
//     // const dd = await inference.imageSegmentation({ data: blob, model: 'stabilityai/stable-diffusion-2' });
//     // console.log(dd);
//     console.log('Ran successfully');
// }
// run();
import mongoose from 'mongoose';
import http from 'http';
import { App, PORT, MONGO_URI, IS_DEV_MODE } from './api/config/expressSetup';

const server = http.createServer(new App().app);
server.listen(PORT);

server.on('listening', () => {
    mongoose.set('debug', IS_DEV_MODE);
    mongoose.connect(MONGO_URI, {
        autoIndex: IS_DEV_MODE
        
    });
    mongoose.connection.once('open', () => {
        console.info('Connected to Mongo via Mongoose');
    });
    mongoose.connection.on('error', (err) => {
        console.error('Unable to connect to Mongo via Mongoose', err);
    });
});