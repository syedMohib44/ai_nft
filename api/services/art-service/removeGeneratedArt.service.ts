import fs from 'fs';
import GeneratedArts, { IGeneratedArts } from "../../entity/GeneratedArts";
import { APIError } from "../../utils/error";
import { RemoveArtDto } from "../../dto/art/removeArtDto";
import Web3 from 'web3';


export const removeGeneratedArt = async (removeArtDto: RemoveArtDto) => {
    if (!Web3.utils.isAddress(removeArtDto.address))
        throw new APIError(400, {
            message: 'Address is invalid',
            error: 'invalid_send_to_address'
        });
    const generatedArt = await GeneratedArts.findOne({ user: removeArtDto.user, address: removeArtDto.address, tag: removeArtDto.tag });
    if (!generatedArt)
        throw new APIError(400, { message: 'Art not found' });

    if (fs.existsSync(`${generatedArt.tag}.png`))
        fs.unlinkSync(`${generatedArt.tag}.png`);

    await generatedArt.delete();
}

export const removeAllArtByUser = async (removeArtDto: RemoveArtDto) => {
    if (!Web3.utils.isAddress(removeArtDto.address))
        throw new APIError(400, {
            message: 'Address is invalid',
            error: 'invalid_send_to_address'
        });
    const generatedArts: IGeneratedArts[] = await GeneratedArts.find({ user: removeArtDto.user, address: removeArtDto.address });
    if (!generatedArts)
        throw new APIError(400, { message: 'Art not found' });

    for (const generatedArt of generatedArts) {
        if (fs.existsSync(`${generatedArt.tag}.png`))
            fs.unlinkSync(`${generatedArt.tag}.png`);
        await generatedArt.delete();
    }
}