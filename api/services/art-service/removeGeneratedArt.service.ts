import fs from 'fs';
import GeneratedArts, { IGeneratedArts } from "../../entity/GeneratedArts";
import { APIError } from "../../utils/error";
import { RemoveAllArtDto, RemoveArtDto } from "../../dto/art/removeArtDto";


export const removeGeneratedArt = async (removeArtDto: RemoveArtDto) => {
    const generatedArt = await GeneratedArts.findOne({ user: removeArtDto.user, tag: removeArtDto.tag })
        .populate({ path: 'user', match: { address: 'removeArtDto.address' }, select: 'address isActive' });

    if (!generatedArt || !generatedArt.user)
        throw new APIError(400, { message: 'Art not found' });

    if (fs.existsSync(`${generatedArt.tag}.png`))
        fs.unlinkSync(`${generatedArt.tag}.png`);

    await generatedArt.delete();
}

export const removeAllArtByUser = async (removeArtDto: RemoveAllArtDto) => {
    const generatedArts: IGeneratedArts[] = await GeneratedArts.find({ user: removeArtDto.user })
        .populate({ path: 'user', match: { address: 'removeArtDto.address' }, select: 'address isActive' });

    if (!generatedArts)
        throw new APIError(400, { message: 'Art not found' });

    for (const generatedArt of generatedArts) {
        if (!generatedArt.user)
            continue;

        if (fs.existsSync(`${generatedArt.tag}.png`))
            fs.unlinkSync(`${generatedArt.tag}.png`);
        await generatedArt.delete();
    }
}