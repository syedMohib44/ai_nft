import fs from "fs";
import { HfInference } from "@huggingface/inference";
import { Config } from "../../interface/IHGConfig";
import { Options } from "../../interface/IHGOptions";
import { AddArtDto } from "../../dto/art/addArtDto";
import GeneratedArts, { IGeneratedArts } from "../../entity/GeneratedArts";
import { APIError } from "../../utils/error";
import crypto from 'crypto';


const generate = async (config: Config, options?: Options) => {
    const hgInterface = new HfInference(config.ref);
    console.log('running');
    const blob = await hgInterface.textToImage({
        inputs: config.wish,
        negative_prompt: config.negative_prompt,
        model: config.model,
    }, { ...options });

    const arrayBuffer = await blob.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
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
    config.wish = generateArt.wish;
    config.tag = generateArt.tag;
    await generate(config, options);
    await generateArt.save();
}