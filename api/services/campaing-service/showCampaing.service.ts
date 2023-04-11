import { ShowCamapingOptionPaginate } from "../../controllers/campaing.controller";
import Campaings from "../../entity/ZakatRequests"
import { IGetOptionsWithPaginate } from "../../interface/IGetOptions";
import { APIError } from "../../utils/error";

export const showCampaingById = async (_id: string) => {
    const campaing = await Campaings.findOne({ _id });
    if (!campaing)
        throw new APIError(404, { message: 'Camaping not found' });

    return campaing;
}

export const showCamapings = async (options: ShowCamapingOptionPaginate) => {
    //const campaings = await Campaings.find({ product: productId });

    const query = {
    };
    if (options.productId)
        Object.assign(query, { product: options.productId });

    if (options.q) {
        const usersCount = await Campaings.countDocuments({ $text: { $search: options.q } });
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
                    { name: re }
                ]
            });
        }
    }

    const campaings = await Campaings.paginate(query, options);
    return campaings;
}