import Businesses from "../../entity/Businesses"
import { IGetOptionsWithPaginate } from "../../interface/IGetOptions";
import { APIError } from "../../utils/error";


export const showBusinessById = async (_id: string) => {
    const business = await Businesses.findOne({ _id });

    if (!business)
        throw new APIError(404, { message: 'Business not found' });

    return business;
}

export const showAllBusinesses = async (options: IGetOptionsWithPaginate) => {
    const query = {
    };

    if (options.q) {
        const usersCount = await Businesses.countDocuments({ $text: { $search: options.q } });
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
                    { firstName: re },
                    { lastName: re },
                    { email: re },
                ]
            });
        }
    }
    const businesses = await Businesses.paginate(query, options);
    return businesses;
}


export const de_ActivateBusiness = async (businessId: string, isActive: boolean) =>
    await Businesses.findByIdAndUpdate({ _id: businessId }, { isActive });