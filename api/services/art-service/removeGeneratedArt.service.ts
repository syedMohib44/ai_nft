import fs from 'fs';
import GeneratedArts from "../../entity/GeneratedArts";
import { APIError } from "../../utils/error";
import { RemoveArtDto } from "../../dto/art/removeArtDto";


export const removeGeneratedArt = async (removeArtDto: RemoveArtDto) => {
    const generatedArt = await GeneratedArts.findOne({ tag: removeArtDto.tag });
    if (!generatedArt)
        throw new APIError(400, { message: 'Art not found' });
    fs.unlinkSync(`${generatedArt.tag}.png`);
    await generatedArt.delete();
}