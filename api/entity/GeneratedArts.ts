import { Schema, Document, model } from 'mongoose';
import paginate from 'mongoose-paginate-v2';
import { IUsers } from './Users';

export interface IGeneratedArts extends Document {
    _id: any;
    user: IUsers['_id'];
    wish: string;
    name: string;
    description: string;
    minted: boolean;
    tag: string;
}

const GeneratedArtsSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'Users', required: true },
    wish: { type: String, require: true },
    name: { type: String, require: true },
    description: { type: String, require: true },
    minted: { type: Boolean, require: true, default: false },
    tag: { type: String, require: true },
}, { timestamps: true });

GeneratedArtsSchema.plugin(paginate);

export default model<IGeneratedArts>('GeneratedArts', GeneratedArtsSchema);