import DepositeZakats from "../../entity/DepositeZakats";
import { IUsers } from "../../entity/Users";
import { IGetOptionsWithPaginate } from "../../interface/IGetOptions";
import { APIError } from "../../utils/error";

interface FindDepositedOptionPaginate extends IGetOptionsWithPaginate {
    userId?: IUsers['_id'];
}

export const findAllDepositedZakat = async (options: FindDepositedOptionPaginate) => {
    const query = {
        populate: 'users',
        select: 'firstName lastName isActive doner profilePic'
    };
    if (options.userId)
        Object.assign(query, { product: options.userId });

    if (options.q) {
        const usersCount = await DepositeZakats.countDocuments({ $text: { $search: options.q } });
        if (usersCount !== 0) { // non-partial matched
            Object.assign(query, {
                $text: {
                    $search: options.q,
                    $caseSensitive: false
                }
            });
        } else { // check partial matched
            const re = new RegExp(options.q, 'i');

            Object.assign(query, {
                $or: [
                    { username: re }
                ]
            });
        }
    }

    const depositeZakats = await DepositeZakats.paginate(query, options);
    return depositeZakats;
}

export const findAllDepositedZakatById = async (_id: number) => {
    const zakatDeposited = await DepositeZakats.findOne({ _id }).populate({ path: 'users', select: 'firstName lastName isActive doner profilePic' })
    if (!zakatDeposited)
        throw new APIError(404, { message: "Zakat cannot be found" });
    return zakatDeposited;
}