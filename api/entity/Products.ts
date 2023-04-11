import { Types, Document, model, Schema } from 'mongoose';
import { IBusinesses } from './Businesses';
const paginate = require('mongoose-paginate-v2');


export interface IProducts extends Document {
    _id: any;
    name: string;
    price: string;
    productPic?: string;
    business: IBusinesses['_id'];
}

const productSchema = new Schema({
    name: { type: String, required: true, unique: true },
    price: { type: String, required: true },
    business: { type: Types.ObjectId, ref: 'Businesses' },
    productPic: { type: String, required: false },
});
productSchema.plugin(paginate);

export default model<IProducts>('Products', productSchema);