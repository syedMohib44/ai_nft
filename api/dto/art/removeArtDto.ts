import { IUsers } from "../../entity/Users";

export interface RemoveArtDto {
    user: IUsers['_id'];
    tag: string;
}