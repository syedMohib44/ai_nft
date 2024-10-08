import * as jwt from 'jsonwebtoken';
import { isValidate } from './validatePassword.service';
import { APIError } from '../../utils/error';
import Users, { AuthToken } from '../../entity/Users';
import { AddAuthenticationDto } from '../../dto/auth/authenticationDto';
import { JWTPAYLOAD } from '../../interface/JWTPayload';
import { config } from '../../config';
import moment from 'moment';
import { appendImagePath } from '../../utils/image-append';
import Web3 from 'web3';

export const authenticateUser = async (addAuthenticationDto: AddAuthenticationDto) => {
    if (!Web3.utils.isAddress(addAuthenticationDto.address))
        throw new APIError(400, {
            message: 'Address is invalid',
            error: 'invalid_send_to_address'
        });

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
        .findOne({ address: addAuthenticationDto.address });

    if (!user || !user.password) throw new APIError(401, {
        message: 'Invalid Username or Password'
    });

    if (!user.isActive)
        throw new APIError(400, { message: 'Email is not verified' });

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

    // TODO: Will remove refresh token from db.
    const token = jwt.sign(payload, config.jwt_secret as string, { expiresIn: config.jwt_life });
    const refreshToken = jwt.sign(payload, config.refresh_jwt_secret as string, { expiresIn: config.refresh_jwt_life });
    user.lastLogin = moment.utc().format();
    user.token = { accessToken: '', refreshToken: refreshToken, kind: 'ainft' };
    await user.save();

    return { token, refreshToken };
}


export const preProcessingGO = async (username: string, address: string, payloadOf: AuthToken['kind']) => {
    const user = await Users.findOne({
        username,
        'token.kind': payloadOf
    });
    if (!user) throw new APIError(401, {
        message: 'Invalid Username or Password'
    });

    const payload: JWTPAYLOAD = {
        userId: user._id,
        username: user.username,
        token: user.token.accessToken,
        address: address,
        typeOfUser: 'user'
    };
    const token = jwt.sign(payload, config.jwt_secret as string, { expiresIn: config.jwt_life });
    return token;
};