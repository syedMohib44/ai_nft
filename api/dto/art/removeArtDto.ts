import { IUsers } from "../../entity/Users";

export interface RemoveArtDto {
    user: IUsers['_id'];
    address: string;
    tag: string;
}

export interface RemoveAllArtDto {
    user: IUsers['_id'];
    address: string;
}