import { IGeneratedArts } from "../../entity/GeneratedArts";
import { IUsers } from "../../entity/Users";

export interface AddNFTsDto {
    user: IUsers['_id'];
    generateArt: IGeneratedArts['_id'];
    /**
     * You wish is AI command
     */
    wish: string;
    txId: string;
    tokenId: number;
    amount: number;
}