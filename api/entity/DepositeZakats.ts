import { Schema, Document, model } from 'mongoose';
import paginate from 'mongoose-paginate-v2';
import { IUsers } from './Users';

export interface IDepositeZakats extends Document {
    _id: any;
    user: IUsers;
    amount: number;
    txId: string;
    currencyType: string;
}

const depositeZakatSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'Users', required: true },
    amount: { type: Number, require: true, default: 0 },
    txId: { type: String, require: true },
    currencyType: { type: String, require: true }
}, { timestamps: true })

depositeZakatSchema.plugin(paginate);

export default model<IDepositeZakats>('DepositeZakats', depositeZakatSchema);