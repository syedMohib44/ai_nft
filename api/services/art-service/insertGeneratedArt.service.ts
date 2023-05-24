import fs from "fs";
import { HfInference } from "@huggingface/inference";
import { Config } from "../../interface/IHGConfig";
import { Options } from "../../interface/IHGOptions";
import { AddArtDto } from "../../dto/art/addArtDto";
import GeneratedArts, { IGeneratedArts } from "../../entity/GeneratedArts";
import { APIError } from "../../utils/error";
import crypto from 'crypto';
import { config } from "../../config";
const ipfs_uploader = require('../../utils/ipfs-uploader.cjs')
// import uploadToIPFS from 'ipfs-uploader';

const generate = async (config: Config, options?: Options) => {
    const hgInterface = new HfInference(config.ref);
    const parameters = {};
    if (config.width)
        Object.assign(parameters, { width: +config.width });
    if (config.height)
        Object.assign(parameters, { height: +config.height });
    if (config.guidance_scale)
        Object.assign(parameters, { guidance_scale: +config.guidance_scale });
    if (config.num_inference_steps)
        Object.assign(parameters, { num_inference_steps: +config.num_inference_steps });

    console.log('running', parameters);

    const blob = await hgInterface.textToImage({
        inputs: config.wish,
        model: config.model,
        parameters
    }, { ...options });

    const arrayBuffer = await blob.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // const gateway = 'https://ipfs.io/ipfs/';
    // https://ainft.infura-ipfs.io/ipfs/QmaQmxgenxezrszNuyPE7gMSUPTpHe7QFFKL5W6WtDwkeb
    // const apiKey = `Basic ${Buffer.from(`${config.infura_ipfs.api_key}:${config.infura_ipfs.api_secret}`).toString("base64")}`;
    // const cid = await ipfs_uploader.uploadToIPFS(buffer, apiKey);
    // console.log(cid);

    fs.writeFileSync(`${config.tag}.png`, buffer);

    console.log('Ran successfully');
}

const artExists = async (generatedArt: IGeneratedArts[], tag: string) => {
    return generatedArt.some((art) => art.tag == tag);
}

export const insertGeneratedArt = async (addArtDto: AddArtDto, config: Config, options?: Options) => {
    const tagHash = crypto.createHash('md5').update(`${addArtDto.wish}${Date.now()}`).digest('hex');

    const generatedArts: IGeneratedArts[] = await GeneratedArts.find();
    const generatedArt = await artExists(generatedArts, tagHash);

    if (generatedArt)
        throw new APIError(400, { message: 'Art already exists' });

    const generateArt = new GeneratedArts()
    generateArt.user = addArtDto.user;
    generateArt.tag = tagHash;
    generateArt.wish = addArtDto.wish;
    generateArt.name = addArtDto.name;
    generateArt.description = addArtDto.description;
    config.wish = generateArt.wish;
    config.tag = generateArt.tag;
    await generate(config, options);
    await generateArt.save();
}

export const insertImageToIPFS = async (tag: string) => {
    const generatedArt = await GeneratedArts.findOne({ tag });
    if (!generatedArt)
        throw new APIError(404, { message: 'Art not found' });
    const file = fs.readFileSync(`${generatedArt.tag}.png`);
    // https://ainft.infura-ipfs.io/ipfs/QmaQmxgenxezrszNuyPE7gMSUPTpHe7QFFKL5W6WtDwkeb
    // QmPDNoFdgdnH5wsdHK7U7ycgvRwjQ8nfTwDp1Yqu6YnjH2
    const apiKey = `Basic ${Buffer.from(`${config.infura_ipfs.api_key}:${config.infura_ipfs.api_secret}`).toString("base64")}`;
    const cid = await ipfs_uploader.uploadToIPFS(file, apiKey);

    console.log(cid);
}