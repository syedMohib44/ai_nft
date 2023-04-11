import { IUsers } from "../../entity/Users";
import { IGetOptionsWithPaginate } from "../../interface/IGetOptions";
import { APIError } from "../../utils/error";
import NFTs from "../../entity/NFTs";

interface FindNFT_OptionPaginate extends IGetOptionsWithPaginate {
    userId?: IUsers['_id'];
}


export const findAllNFTs = async (options: FindNFT_OptionPaginate) => {
    const query = {
        populate: 'users',
        select: 'firstName lastName isActive doner profilePic'
    };
    if (options.userId)
        Object.assign(query, { product: options.userId });

    if (options.q) {
        const usersCount = await NFTs.countDocuments({ $text: { $search: options.q } });
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

    const withdrawZakats = await NFTs.paginate(query, options);
    return withdrawZakats;
}

export const findAllNFT_ById = async (_id: number) => {
    const nfts = await NFTs.findOne({ _id }).populate({ path: 'users', select: 'firstName lastName isActive doner profilePic' })
    if (!nfts)
        throw new APIError(404, { message: "Zakat cannot be found" });
    return nfts;
}