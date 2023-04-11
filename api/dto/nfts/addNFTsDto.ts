import { IUsers } from "../../entity/Users";

export interface AddNFTsDto {
    user: IUsers['_id'];
    /**
     * You wish is AI command
     */
    wish: string;
    amount: number;
}