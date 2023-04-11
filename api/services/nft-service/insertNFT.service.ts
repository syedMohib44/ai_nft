import { AddNFTsDto } from "../../dto/withdraw-zakat/AddNFTsDto";
import { AddZakatRequestDto } from "../../dto/zakat-request/addAcceptorDto";
import NFTs from "../../entity/NFTs";
import ZakatRequests, { IZakatRequests } from "../../entity/ZakatRequests";
import { FileOperation } from "../../libs/fileOperation";
import { APIError } from "../../utils/error";

export const insertNFTs_Matic = async (addNFTsDto: AddNFTsDto) => {
    if (!addNFTsDto)
        throw new APIError(400, { message: 'Mendatory fields are empty' });

    //TODO: Need to put web3(onchain) validation here 

    const nft = new NFTs();
    nft.user = addNFTsDto.user;
    nft.amount = addNFTsDto.amount;
    nft.currencyType = "MATIC";
    await nft.save();
}

export const insertNFTs = async (addNFTsDto: AddNFTsDto) => {
    if (!addNFTsDto)
        throw new APIError(400, { message: 'Mendatory fields are empty' });

    //TODO: Need to put web3(onchain) validation here 

    const nft = new NFTs();
    nft.user = addNFTsDto.user;
    nft.amount = addNFTsDto.amount;
    nft.currencyType = "ZKT";
    await nft.save();
}