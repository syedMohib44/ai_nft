import { Schema, Document, model } from 'mongoose';

export interface ISuperAdmin extends Document {
    _id: any;
    email: string;
    password: string;
    lastLogin?: Date;
    refreshToken?: string;
}

const SuperAdminSchema = new Schema({
    email: { type: String, required: true, unique: true, trim: true, lowercase: true },
    password: { type: String, required: true, minlength: 8, maxlength: 255 },
    lastLogin: { type: Date },
    refreshToken: { type: String },
}, { timestamps: true });

SuperAdminSchema.virtual('fullName').get(function (this: any) {
    return `${this.firstName} ${this.lastName}`;
});

export default model<ISuperAdmin>('SuperAdmin', SuperAdminSchema);
