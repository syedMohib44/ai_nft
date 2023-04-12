import { IUsers } from "../../entity/Users";

export interface AddArtDto {
    user: IUsers['_id'];
    /**
     * You wish is AI command
     */
    wish: string;
    tag: number;
}