import bcrypt from 'bcryptjs';
import Joi from '@hapi/joi';
import moment from 'moment';
import { validate } from '../../libs/validator/validate';
import Users, { IUsers } from '../../entity/Users';
import { AddUserDto } from '../../dto/auth/addUserDto';
import { APIError } from '../../utils/error';
import { config } from '../../config';
import { generateRandomString } from '../../utils/commonHelper';
import { sendMail } from '../../libs/mail/mail';
import { FileOperation } from '../../libs/fileOperation';

export const insertUser = async (addUserDto: AddUserDto) => {
    await UserSignupValidation(addUserDto);

    // save user
    // const tempPassword = generateRandomString(8);
    if (addUserDto.password !== addUserDto.confirmPassword)
        throw new APIError(400, { 'message': "Password does not match" });

    //if (config.mode === 'dev') {
    //     console.log('Password is', tempPassword);
    // }
    const hashedPassword = await bcrypt.hash(addUserDto.password, bcrypt.genSaltSync(10));
    const user = new Users();
    user.address = addUserDto.address;
    user.firstName = addUserDto.firstName;
    user.lastName = addUserDto.lastName;
    user.username = addUserDto.username;
    user.isActive = true;
    if (addUserDto.profilePic) {
        const fileOP = new FileOperation();
        const image = fileOP.fastUploadFile(addUserDto.profilePic);
        user.profilePic = image;
    }

    user.password = hashedPassword;
    user.typeOfUser = 'user';
    const savedUser = await user.save();

    // sendSuccessSignupMail(user);

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
    password: Joi.string()
        .required(),
    confirmPassword: Joi.string()
        .required(),
    address: Joi.string()
        .required(),
    profilePic: Joi.object()
        .optional()
};

export const UserSignupValidation = async (value: AddUserDto) => {
    const schema = Joi.object(ownerSchema);

    const { error } = validate(schema, value);
    if (error) throw error;

    if (await usernameExists(value.username)) {
        throw new APIError(400, {
            message: 'Email exists'
        });
    }
};