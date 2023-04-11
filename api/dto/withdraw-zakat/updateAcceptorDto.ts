import { IUsers } from "../../entity/Users";

export interface UpdateZakatRequestDto {
    user: IUsers['_id'];
    address: string;
    amount?: number;
    duration?: number;
    identityCard?: Express.Multer.File;
}