import { AddNFTsDto } from "../../dto/nfts/addNFTsDto";
import NFTs, { INFTs } from "../../entity/NFTs";
import { APIError } from "../../utils/error";

export const insertNFTs_Matic = async (addNFTsDto: AddNFTsDto) => {
    if (!addNFTsDto)
        throw new APIError(400, { message: 'Mendatory fields are empty' });

    //TODO: Need to put web3(onchain) validation here 

    const nft: INFTs = new NFTs();
    nft.user = addNFTsDto.user;
    nft.amount = addNFTsDto.amount;
    nft.currencyType = "MATIC";
    await nft.save();
}

export const insertNFTs = async (addNFTsDto: AddNFTsDto) => {
    if (!addNFTsDto)
        throw new APIError(400, { message: 'Mendatory fields are empty' });

    //TODO: Need to put web3(onchain) validation here 

    const nft: INFTs = new NFTs();
    nft.user = addNFTsDto.user;
    nft.amount = addNFTsDto.amount;
    nft.currencyType = "ETH";
    await nft.save();
}