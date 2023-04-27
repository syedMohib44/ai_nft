import { IUsers } from "../../entity/Users";

export interface AddArtDto {
    user: IUsers['_id'];
    address: string;
    /**
     * You wish is AI command
     */
    wish: string;
    name: string;
    description: string;
}