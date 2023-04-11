import { IUsers } from "../../entity/Users";

export interface AddZakatRequestDto {
    user: IUsers['_id'];
    address: string;
    amount: number;
    duration: number;
    identityCard?: Express.Multer.File;
}