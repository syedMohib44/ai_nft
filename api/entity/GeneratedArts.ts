import { Schema, Document, model } from 'mongoose';
import paginate from 'mongoose-paginate-v2';
import { IUsers } from './Users';

export interface IGeneratedArts extends Document {
    _id: any;
    user: IUsers['_id'];
    wish: string;
    minted: boolean;
    tag: number;
}

const GeneratedArtsSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'Users', required: true },
    wish: { type: String, require: true },
    minted: { type: Boolean, require: true, default: false },
    tag: { type: Number, require: true },
}, { timestamps: true });

GeneratedArtsSchema.plugin(paginate);

export default model<IGeneratedArts>('GeneratedArts', GeneratedArtsSchema);