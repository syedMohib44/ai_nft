import { Schema, Document, model } from 'mongoose';
import paginate from 'mongoose-paginate-v2';
import { IUsers } from './Users';

export interface IZakatRequests extends Document {
    _id: any;
    user: IUsers['_id'];
    amount: number;
    duration: number;
    identityCard: string;
}

const zakatRequestSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'Users', required: true },
    amount: { type: Number, require: true, default: 0 },
    duration: { type: Number, require: true, default: 0 },
    identityCard: { type: Number, require: true }
}, { timestamps: true })

zakatRequestSchema.plugin(paginate);

export default model<IZakatRequests>('ZakatRequests', zakatRequestSchema);