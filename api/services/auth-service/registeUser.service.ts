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
import Web3 from 'web3';
import AuthVerification from '../../entity/AuthVerification';
import { nanoid } from 'nanoid';


export const insertUser = async (addUserDto: AddUserDto) => {
    if (!Web3.utils.isAddress(addUserDto.address))
        throw new APIError(400, {
            message: 'Address is invalid',
            error: 'invalid_send_to_address'
        });
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
    user.isActive = false;
    if (addUserDto.profilePic) {
        const fileOP = new FileOperation();
        const image = fileOP.fastUploadFile(addUserDto.profilePic);
        user.profilePic = image;
    }

    user.password = hashedPassword;
    user.typeOfUser = 'user';
    const savedUser = await user.save();

 
    const expiryDate = moment.utc().add(2, 'hours').format('YYYY-MM-DD HH:mm:ss');

    const authVerification = new AuthVerification();
    authVerification.code = nanoid();
    authVerification.expiryDate = expiryDate;
    authVerification.user = user;
    await authVerification.save();

    // sendSuccessSignupMail(user, authVerification.code);

    return { user: savedUser };
};

export const sendSuccessSignupMail = (user: IUsers, code: string, bcc: string | string[] = []) => {
    sendMail({
        subject: 'Sign In',
        to: user.username,
        template: 'owner-signup',
        context: {
            fullName: user.fullName,
            username: user.username,
            verification: config.client_url.owner_url + '/verify-email?code=' + code
        },
        bcc,
    })
        .then(console.log)
        .catch(console.error);
};

const usernameExists = async (username: string, address: string): Promise<boolean> => {
    const alreadyExists = await Users.findOne({
        $or: [
            { username },
            { address }
        ]
    });
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

    if (await usernameExists(value.username, value.address)) {
        throw new APIError(400, {
            message: 'Email exists'
        });
    }
};