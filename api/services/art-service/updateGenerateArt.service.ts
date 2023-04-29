import Web3 from "web3";
import { UpdateArtDto } from "../../dto/art/updateArtDto";
import GeneratedArts from "../../entity/GeneratedArts"
import { APIError } from "../../utils/error";

export const updateGeneratedArt = async (updateArtDto: UpdateArtDto) => {
    const generatedArt = await GeneratedArts.findOne({ _id: updateArtDto.user, address: updateArtDto.address, tag: updateArtDto.tag, minted: false });
    if (!generatedArt)
        throw new APIError(400, { message: 'Art cannot be found or already minted' })

    generatedArt.name = updateArtDto.name || generatedArt.description;
    generatedArt.description = updateArtDto.description || generatedArt.description;

    await generatedArt.save();
}