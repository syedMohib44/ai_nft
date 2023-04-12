import fs from "fs";
import { HfInference } from "@huggingface/inference";
import { Config } from "../../interface/IHGConfig";
import { Options } from "../../interface/IHGOptions";
import { AddArtDto } from "../../dto/art/addArtDto";
import GeneratedArts, { IGeneratedArts } from "../../entity/GeneratedArts";
import { APIError } from "../../utils/error";


const generate = async (config: Config, options?: Options) => {
    const inference = new HfInference(config.ref);
    console.log('running');
    const blob = await inference.textToImage({
        inputs: config.wish,
        negative_prompt: config.negative_prompt,
        model: config.model,
    }, { ...options });

    const arrayBuffer = await blob.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    fs.writeFileSync(`${config.tag}.png`, buffer);

    console.log('Ran successfully');
}

const artExists = async (generatedArt: IGeneratedArts[], tag: number) => {
    return generatedArt.some((art) => art.tag == tag);
}

export const insertGeneratedArt = async (addArtDto: AddArtDto, config: Config, options?: Options) => {
    // const generatedArt = await GeneratedArts.findOne({ user: addArtDto.user, tag: addArtDto.tag });
    const generatedArts: IGeneratedArts[] = await GeneratedArts.find();
    const generatedArt = await artExists(generatedArts, addArtDto.tag);
    if (generatedArt)
        throw new APIError(400, { message: 'Art already exists' });
    const generateArt = new GeneratedArts()
    generateArt.user = addArtDto.user;
    generateArt.tag = generatedArts.length + 1;
    generateArt.wish = addArtDto.wish;
    config.wish = generateArt.wish;
    config.tag = generateArt.tag;
    await generate(config, options);
    await generateArt.save();
}