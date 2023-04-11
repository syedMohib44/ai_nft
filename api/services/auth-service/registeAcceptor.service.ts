import bcrypt from 'bcryptjs';
import Joi from '@hapi/joi';
import moment from 'moment';
import { validate } from '../../libs/validator/validate';
import Users, { IUsers } from '../../entity/Users';
import { AddAcceptorDto } from '../../dto/auth/addAcceptorDto';
import { APIError } from '../../utils/error';
import { config } from '../../config';
import Business from '../../entity/Businesses';
import { generateRandomString } from '../../utils/commonHelper';
import { sendMail } from '../../libs/mail/mail';
import Businesses from '../../entity/Businesses';
import { FileOperation } from '../../libs/fileOperation';

export const insertUserAsAcceptor = async (addAcceptorDto: AddAcceptorDto) => {
    await AcceptorSignupValidation(addAcceptorDto);

    // save user
    // const tempPassword = generateRandomString(8);
    if (addAcceptorDto.password !== addAcceptorDto.confirmPassword)
        throw new APIError(400, { 'message': "Password does not match" });

    //if (config.mode === 'dev') {
    //     console.log('Password is', tempPassword);
    // }
    const hashedPassword = await bcrypt.hash(addAcceptorDto.password, bcrypt.genSaltSync(10));
    const user = new Users();
    user.address = addAcceptorDto.address;
    user.firstName = addAcceptorDto.firstName;
    user.lastName = addAcceptorDto.lastName;
    user.username = addAcceptorDto.username;
    user.isActive = true;
    if (addAcceptorDto.profilePic) {
        const fileOP = new FileOperation();
        const image = fileOP.fastUploadFile(addAcceptorDto.profilePic);
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

export const AcceptorSignupValidation = async (value: AddAcceptorDto) => {
    const schema = Joi.object(ownerSchema);

    const { error } = validate(schema, value);
    if (error) throw error;

    if (await usernameExists(value.username)) {
        throw new APIError(400, {
            message: 'Email exists'
        });
    }
};