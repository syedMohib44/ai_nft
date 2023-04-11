import { IUsers } from "../../entity/Users";

export interface DepositeZakatDto {
    user: IUsers['_id'];
    address: string;
    amount: number;
    duration: number;
}