import * as jwt from 'jsonwebtoken';
import { isValidate } from './validatePassword.service';
import { APIError } from '../../utils/error';
import Users from '../../entity/Users';
import { AddAuthenticationDto } from '../../dto/auth/authenticationDto';
import { JWTPAYLOAD } from '../../interface/JWTPayload';
import { config } from '../../config';
import moment from 'moment';
import { appendImagePath } from '../../utils/image-append';

export const authenticateUser = async (addAuthenticationDto: AddAuthenticationDto) => {

    const tokens = await preProcessing(addAuthenticationDto);
    return tokens;
};

export const logoutUser = async (userId: string) => {
    await Users.updateOne({ _id: userId }, { $unset: { refreshToken: 1 } });
};

export const refreshToken = async (refreshToken: string) => {

    const user = await Users.findOne({ refreshToken });
    if (!user || !user.isActive)
        throw new APIError(400, { message: "Cannot access the site please contact moderator" });
    const tokenDetails = jwt.verify(refreshToken, config.refresh_jwt_secret as string) as Record<string, any>;
    const payload: JWTPAYLOAD = {
        userId: tokenDetails._id,
        typeOfUser: tokenDetails.typeOfUser,
        profilePic: tokenDetails.profilePic,
        username: tokenDetails.username,
        address: tokenDetails.address
    };
    const token = jwt.sign(payload, config.jwt_secret, { expiresIn: config.jwt_life });
    return token;
};


async function preProcessing(addAuthenticationDto: AddAuthenticationDto) {
    const user = await Users
        .findOne({ username: addAuthenticationDto.username });
    // //.lean()
    // .populate({
    //     path: 'business',
    //     select: 'name isActive'
    // });
    if (!user) throw new APIError(401, {
        message: 'Invalid Username or Password'
    });

    const isValid = await isValidate(addAuthenticationDto.password, user.password);
    if (!isValid) throw new APIError(401, {
        message: 'Invalid Username or Password'
    });


    const payload: JWTPAYLOAD = {
        userId: user._id,
        typeOfUser: user.typeOfUser,
        profilePic: user.profilePic,
        username: user.username,
        address: user.address
    };

    const token = jwt.sign(payload, config.jwt_secret as string, { expiresIn: config.jwt_life });
    const refreshToken = jwt.sign(payload, config.refresh_jwt_secret as string, { expiresIn: config.refresh_jwt_life });
    user.lastLogin = moment.utc().format();
    user.refreshToken = refreshToken;
    await user.save();

    return { token, refreshToken };
}
