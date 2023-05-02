import { Schema, model, Document } from 'mongoose';
import paginate from 'mongoose-paginate-v2';

export const typeOfUsers = ['admin', 'user'] as const;
export type typeOfUser = typeof typeOfUsers[number];

const oAuthKinds = ['google', 'ainft'] as const;
export interface AuthToken {
    accessToken?: string;
    refreshToken: string;
    kind: typeof oAuthKinds[number];
}

export interface IUsers extends Document {
    address: string;
    firstName: string;
    lastName: string;
    username: string;
    password?: string;
    google: string;
    isActive: boolean;
    token: AuthToken;
    typeOfUser: typeOfUser;
    lastLogin: string;
    profilePic?: string;
    gravatar: (size: number) => string;
    fullName: string;
}



const UserSchema = new Schema({
    address: { type: String, required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    username: { type: String, required: true, unique: true, trim: true, lowercase: true },
    password: { type: String, required: false, minlength: 8, maxlength: 255 },
    google: { type: String, required: false },
    token: {
        accessToken: { type: String, required: false },
        refreshToken: { type: String, required: false },
        kind: { type: String, enum: oAuthKinds, required: false },
    },
    isActive: { type: Boolean, required: true, default: false },
    typeOfUser: { type: String, enum: typeOfUsers, required: true, trim: true },
    lastLogin: { type: String, required: false },
    profilePic: { type: String, required: false }
}, { timestamps: true });



UserSchema.plugin(paginate);

UserSchema.methods.gravatar = function (size: number = 200) {
    if (!this.email) {
        return `https://gravatar.com/avatar/?s=${size}&d=retro`;
    }
}

// UserSchema.methods.gravatar = function (size: number = 200) {
//     if (!this.email) {
//         return `https://gravatar.com/avatar/?s=${size}&d=retro`;
//     }
//     const md5 = crypto.createHash('md5').update(this.email).digest('hex');
//     return `https://gravatar.com/avatar/${md5}?s=${size}&d=retro`;
// };

UserSchema.virtual('fullName').get(function (this: any) {
    return `${this.firstName} ${this.lastName}`;
});

export default model<IUsers>('Users', UserSchema);