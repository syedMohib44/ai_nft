import Web3 from "web3";
import { UpdateArtDto } from "../../dto/art/updateArtDto";
import GeneratedArts from "../../entity/GeneratedArts"
import { APIError } from "../../utils/error";

export const updateGeneratedArt = async (updateArtDto: UpdateArtDto) => {
    const generatedArt = await GeneratedArts.findOne({ user: updateArtDto.user, tag: updateArtDto.tag, minted: false })
        .populate({ path: 'user', match: { address: updateArtDto.address }, select: 'address isActive' });

        if (!generatedArt || !generatedArt.user)
        throw new APIError(400, { message: 'Art cannot be found or already minted' })

    generatedArt.name = updateArtDto.name || generatedArt.description;
    generatedArt.description = updateArtDto.description || generatedArt.description;

    await generatedArt.save();
}