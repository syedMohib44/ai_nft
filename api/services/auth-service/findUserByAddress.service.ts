import Web3 from "web3";
import Users from "../../entity/Users"
import { APIError } from "../../utils/error";

enum REGISTER_STATUS {
    INACTIVE_UNREGISTERED = 1,
    INACTIVE_REGISTERED = 2,
    ACTIVE_REGISTERED = 3
}

export const findUserByAddress = async (address: string) => {
    if (!Web3.utils.isAddress(address))
        throw new APIError(400, {
            message: 'Address is invalid',
            error: 'invalid_send_to_address'
        });
    const user = await Users.findOne({ address });
    if (!user)
        throw new APIError(404, { message: 'User cannot be found' });
    if (user.google)
        return REGISTER_STATUS.INACTIVE_UNREGISTERED;
    else if (!user.isActive)
        return REGISTER_STATUS.INACTIVE_REGISTERED

    return REGISTER_STATUS.ACTIVE_REGISTERED
}