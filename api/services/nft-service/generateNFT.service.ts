import fs from "fs";
import { HfInference } from "@huggingface/inference";
import { Config } from "../../interface/IHGConfig";
import { Options } from "../../interface/IHGOptions";


export const generate = async (config: Config, options?: Options) => {
    const inference = new HfInference(config.ref);
    console.log('running');
    const blob = await inference.textToImage({
        inputs: config.wish,
        negative_prompt: config.negative_prompt,
        model: config.model,
    }, { ...options });

    const arrayBuffer = await blob.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    fs.writeFileSync('img.png', buffer);

    console.log('Ran successfully');
}