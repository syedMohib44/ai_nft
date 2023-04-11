import bcrypt from 'bcryptjs';
import Joi from '@hapi/joi';
import moment from 'moment';
import { validate } from '../../libs/validator/validate';
import Users, { IUsers } from '../../entity/Users';
import { AddDonerDto } from '../../dto/auth/addDonerDto';
import { APIError } from '../../utils/error';
import { config } from '../../config';
import Business from '../../entity/Businesses';
import { generateRandomString } from '../../utils/commonHelper';
import { sendMail } from '../../libs/mail/mail';
import Businesses from '../../entity/Businesses';
import { FileOperation } from '../../libs/fileOperation';

export const insertUserAsDoner = async (addDonerDto: AddDonerDto) => {
    await donerSignupValidation(addDonerDto);

    // save user
    // const tempPassword = generateRandomString(8);
    if (addDonerDto.password !== addDonerDto.confirmPassword)
        throw new APIError(400, { 'message': "Password does not match" });

    //if (config.mode === 'dev') {
    //     console.log('Password is', tempPassword);
    // }
    const hashedPassword = await bcrypt.hash(addDonerDto.password, bcrypt.genSaltSync(10));
    const user = new Users();
    user.firstName = addDonerDto.firstName;
    user.address = addDonerDto.address;
    user.lastName = addDonerDto.lastName;
    user.username = addDonerDto.username;
    user.isActive = true;
    if (addDonerDto.profilePic) {
        const fileOP = new FileOperation();
        const image = fileOP.fastUploadFile(addDonerDto.profilePic);
        user.profilePic = image;
    }

    user.password = hashedPassword;
    user.typeOfUser = 'doner';
    user.doner = true;
    const savedUser = await user.save();

    sendSuccessSignupMail(user);

    return { user: savedUser };
};

export const sendSuccessSignupMail = (user: IUsers, bcc: string | string[] = []) => {
    sendMail({
        subject: 'Sign In',
        to: user.username,
        template: 'owner-signup',
        context: {
            fullName: user.fullName,
            username: user.username,
            signinUrl: config.client_url.owner_url + '/signin'
        },
        bcc,
    })
        .then(console.log)
        .catch(console.error);
};

export const usernameExists = async (username: string): Promise<boolean> => {
    const alreadyExists = await Users.findOne({ username });
    return alreadyExists ? true : false;
};

export const ownerSchema = {
    firstName: Joi.string()
        .required(),
    lastName: Joi.string()
        .required(),
    username: Joi.string()
        .email()
        .required(),
    businessName: Joi.string()
        .required(),
    profilePic: Joi.object()
        .optional()
};

export const donerSignupValidation = async (value: AddDonerDto) => {
    const schema = Joi.object(ownerSchema);

    const { error } = validate(schema, value);
    if (error) throw error;

    if (await usernameExists(value.username)) {
        throw new APIError(400, {
            message: 'Email exists'
        });
    }
};
