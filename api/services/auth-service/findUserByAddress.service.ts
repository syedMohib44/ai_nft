import Web3 from "web3";
import Users from "../../entity/Users"
import { APIError } from "../../utils/error";

export const findUserByAddress = async (address: string) => {
    if (!Web3.utils.isAddress(address))
        throw new APIError(400, {
            message: 'Address is invalid',
            error: 'invalid_send_to_address'
        });
    const user = await Users.exists({ address });
    if (!user)
        throw new APIError(404, { message: 'User cannot be found' });

    return true;
}