import { IUsers } from "../../entity/Users";

export interface UpdateArtDto {
    user: IUsers['_id'];
    tag: string;
    address: string;
    name?: string;
    description?: string;
}