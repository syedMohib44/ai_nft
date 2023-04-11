import { Schema, Document, model, Model, PaginateModel } from 'mongoose';
import paginate from 'mongoose-paginate-v2';
const aggregatePaginate = require('mongoose-aggregate-paginate-v2');
import { Address, IAddress } from './Address';

export interface IBusinesses extends Document {
    _id: any;
    name: string;
    isActive?: boolean;
    logo?: string;
    type?: string;
    resizedLogos?: IResizedLogo[];
    hoursOfOperations: IBusinessHours[];
    address: IAddress;
    timezone?: string
    createdAt?: string;
    updatedAt?: string;
}

export interface IResizedLogo {
    logo: string;
    /**
     * 192x192, 512x512 etc..
     */
    size: string;
}

export interface IBusinessHours {
    day: string;
    from: string;
    to: string;
}

export interface IBusinessesModel extends Model<IBusinesses>, PaginateModel<IBusinesses> {
    /**
     * type support for mongoose aggregate paginate
     */
    aggregatePaginate: (query: any, options: any) => any;
}


const BusinessesHoursSchema = new Schema({
    day: { type: String, required: true },
    from: { type: String, required: true },
    to: { type: String, required: true }
});

const BusinessesSchema = new Schema({
    name: { type: String, unique: true, required: true }, //trim: true Will cause error if value is given in split " "
    isActive: { type: Boolean, default: false, required: false },
    logo: { type: String, required: false },
    timezone: { type: String, required: false, trim: true },
    resizedLogos: [{
        logo: { type: String, required: true },
        size: { type: String, required: true },
    }],
    address: Address,
    type: { type: String, required: false },
    hoursOfOperations: [BusinessesHoursSchema]
}, { timestamps: true });

/**
 * It just specify the attributes of address should be in text(string).
 * To understand text index visit https://docs.mongodb.com/manual/core/index-text/
 */
BusinessesSchema.index({
    name: 'text',
    'address.city': 'text',
    'address.street': 'text',
    'address.zipcode': 'text',
    type: 1
});
BusinessesSchema.plugin(paginate);

export default model<IBusinesses, IBusinessesModel>('Businesses', BusinessesSchema);