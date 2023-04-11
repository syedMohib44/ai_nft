import { Schema, Document, model } from 'mongoose';
import paginate from 'mongoose-paginate-v2';
import { IUsers } from './Users';

export interface INFTs extends Document {
    _id: any;
    user: IUsers;
    amount: number;
    txId: string;
    currencyType: string;
}

const NFTsSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'Users', required: true },
    amount: { type: Number, require: true, default: 0 },
    txId: { type: String, require: true },
    currencyType: { type: String, require: true }
}, { timestamps: true })

NFTsSchema.plugin(paginate);

export default model<INFTs>('NFTs', NFTsSchema);