import { Schema, model, Document } from 'mongoose';
import { IUsers } from './Users';

export interface IAuthVerificationSchema extends Document {
    isVerified: boolean;
    verifiedAt: string;
    expiryDate: string;
    user?: IUsers;
    code: string;
}

const AuthVerificationSchema = new Schema({
    isVerified: { type: Boolean, default: false },
    verifiedAt: { type: Date },
    expiryDate: { type: Date, required: true },
    user: { type: Schema.Types.ObjectId, ref: 'Users' },
    code: { type: String, required: true }
});

export default model<IAuthVerificationSchema>('AuthVerification', AuthVerificationSchema);
