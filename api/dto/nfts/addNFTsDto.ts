import { IGeneratedArts } from "../../entity/GeneratedArts";
import { IUsers } from "../../entity/Users";

export interface AddNFTsDto {
    user: IUsers['_id'];
    address: string;
    generateArt: IGeneratedArts['_id'];
    txId: string;
    hash?: string;
    tokenId: number;
    put: boolean;
    amount: number;
}