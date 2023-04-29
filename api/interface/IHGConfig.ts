export interface Config {
    wish: string;
    tag?: string;
    negative_prompt?: string;
    model: string
    ref: string;
    height?: number;
    width?: number;
    num_inference_steps?: number;
    guidance_scale?: number;

}


