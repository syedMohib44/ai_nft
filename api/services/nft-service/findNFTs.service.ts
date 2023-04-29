import { IUsers } from "../../entity/Users";
import { IGetOptionsWithPaginate } from "../../interface/IGetOptions";
import { APIError } from "../../utils/error";
import NFTs from "../../entity/NFTs";

export interface FindNFT_OptionPaginate extends IGetOptionsWithPaginate {
    userId?: IUsers['_id'];
    address?: string;
    //https://gitlab.com/supergized/salonrestapiexpressmongo/-/blob/master/api/services/business-service/showBusiness.service.ts
    populate?: { path: 'generatedarts.user', select: 'firstName lastName isActive' },
    lean?: true
}


export const findAllNFTs = async (options: FindNFT_OptionPaginate) => {
    const query = {
        populate: 'generatedarts',
        select: 'user'
    };
    if (options.userId)
        Object.assign(query, { user: options.userId });
    if (options.address)
        Object.assign(query, { address: options.address });

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

    const nfts = await NFTs.paginate(query, { ...options, populate: { path: 'generateArt', select: 'user minted wish', populate: { path: 'user', select: 'firstName lastName isActive' } } });
    return nfts;
}

export const findAllNFT_ById = async (_id: number) => {
    const nfts = await NFTs.findOne({ _id }).populate({ path: 'generateArt', select: 'user minted wish' })
    if (!nfts)
        throw new APIError(404, { message: "NFT cannot be found" });
    return nfts;
}