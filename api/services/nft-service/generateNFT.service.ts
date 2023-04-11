import fs from "fs";
import { HfInference } from "@huggingface/inference";

interface Config {
    wish: string;
    negative_prompt?: string;
    model: string
    ref: string;
}

interface Options {
    retry_on_error?: boolean;
    use_cache?: boolean;
    dont_load_model?: boolean;
    use_gpu?: boolean;
    wait_for_model?: boolean;
}

export const generate = async (config: Config, options: Options) => {
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