import { typeOfToken } from "../../utils/tokens";

export interface AddDonationDto {
    amount: number;
    token: typeOfToken;
}