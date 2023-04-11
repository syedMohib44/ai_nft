import { IUsers } from "../../entity/Users";

export interface UpdateNFTsDto {
    user: IUsers['_id'];
    /**
     * You wish is AI command
     */
    wish: string;
}