import { AddNFTsDto } from "../../dto/nfts/addNFTsDto";
import GeneratedImages from "../../entity/GeneratedArts";
import NFTs, { INFTs } from "../../entity/NFTs";
import { APIError } from "../../utils/error";

export const insertNFTs_Matic = async (addNFTsDto: AddNFTsDto) => {
    if (!addNFTsDto)
        throw new APIError(400, { message: 'Mendatory fields are empty' });

    //TODO: Need to put web3(onchain) validation here 
    const generatedImage = await GeneratedImages.exists({ _id: addNFTsDto.generateArt, user: addNFTsDto.user });
    if (!generatedImage)
        throw new APIError(400, { message: 'Art donot exists' });

    const nft: INFTs = new NFTs();
    nft.generateArt = addNFTsDto.generateArt;
    nft.amount = addNFTsDto.amount;
    nft.tokenId = addNFTsDto.tokenId;
    nft.txId = addNFTsDto.txId;
    nft.currencyType = "MATIC";
    await nft.save();
}

export const insertNFTs = async (addNFTsDto: AddNFTsDto) => {
    if (!addNFTsDto)
        throw new APIError(400, { message: 'Mendatory fields are empty' });

    //TODO: Need to put web3(onchain) validation here 
    const generatedImage = await GeneratedImages.findOne({ _id: addNFTsDto.generateArt, user: addNFTsDto.user });
    if (!generatedImage)
        throw new APIError(400, { message: 'Art donot exists' });

    const nft: INFTs = new NFTs();
    nft.generateArt = generatedImage._id;
    nft.txId = addNFTsDto.txId;
    nft.tokenId = addNFTsDto.tokenId;
    nft.amount = addNFTsDto.amount;
    nft.currencyType = "ETH";
    generatedImage.minted = true;
    await nft.save();
}