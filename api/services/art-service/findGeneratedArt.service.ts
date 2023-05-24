import GeneratedArts from "../../entity/GeneratedArts";
import { APIError } from "../../utils/error";
import { IUsers } from "../../entity/Users";
import { IGetOptionsWithPaginate } from "../../interface/IGetOptions";


export interface FindArt_OptionPaginate extends IGetOptionsWithPaginate {
    userId?: IUsers['_id'];
    address?: string;
}

export const findAllArts = async (options: FindArt_OptionPaginate) => {
    const query = {};
    if (options.userId)
        Object.assign(query, { user: options.userId });
    if (options.address)
        Object.assign(query, { user: options.address });
    console.log(options)
    if (options.q) {
        const usersCount = await GeneratedArts.countDocuments({ $text: { $search: options.q } });
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

    const arts = await GeneratedArts.paginate(query, { ...options, populate: { path: 'user', select: 'firstName lastName isActive' } });
    return arts;
}

export const findAllArtsById = async (_id: number) => {
    const nfts = await GeneratedArts.findOne({ _id }).populate({ path: 'users', select: 'firstName lastName isActive ' })
    if (!nfts)
        throw new APIError(404, { message: "Art cannot be found" });
    return nfts;
}