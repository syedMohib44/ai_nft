import { Schema, Document, model } from 'mongoose';
import paginate from 'mongoose-paginate-v2';
import { IGeneratedArts } from './GeneratedArts';
import { IUsers } from './Users';

export interface INFTs extends Document {
    _id: any;
    generateArt: IGeneratedArts['_id'];
    amount: number;
    tokenId: number;
    txId: string;
    currencyType: string;
}

const NFTsSchema = new Schema({
    generateArt: { type: Schema.Types.ObjectId, ref: 'GeneratedArts', required: true },
    tokenId: { type: Number, require: true, default: 0 },
    txId: { type: String, require: true },
    amount: { type: Number, require: true, default: 0 },
    currencyType: { type: String, require: true }
}, { timestamps: true })

NFTsSchema.plugin(paginate);

export default model<INFTs>('NFTs', NFTsSchema);