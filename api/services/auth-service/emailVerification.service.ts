import moment from 'moment';
import { nanoid } from 'nanoid';
import Users, { IUsers } from '../../entity/Users';
import { sendMail } from '../../libs/mail/mail';
import { APIError } from '../../utils/error';
import AuthVerification from '../../entity/AuthVerification';
import { config } from '../../config';

const isLinkExpired = (expiryDate: string): boolean => {
    const expiryDateM = moment.utc(expiryDate);
    const isExpired = moment.utc().isAfter(expiryDateM);

    return isExpired;
};

const sendVerifyEmailNotification = (user: IUsers) => {
    return sendMail({
        subject: 'Verification Mail',
        to: user.username as string,
        text: `Dear ${user.fullName}, your email has been verified.`
    });
};


/**
 * Verify email
 * @param code unique code
 */
export const verifyEmail = async (code: string) => {
    const authVerify = await AuthVerification.findOne({ code });

    if (!authVerify || authVerify.isVerified)
        throw new APIError(400, { message: 'Link expired or bad request' });

    if (isLinkExpired(authVerify.expiryDate))
        throw new APIError(400, { message: 'Link expired' });

    const user = await Users.findOne({ _id: authVerify.user });
    if (!user)
        throw new APIError(400, { message: 'Link expired or bad request' });
    if (user.isActive)
        throw new APIError(400, { message: 'User already verified' });
        
    user.isActive = true;
    await user.save();

    // update password change verification
    authVerify.isVerified = true;
    authVerify.verifiedAt = moment.utc().format('YYYY-MM-DD HH:mm:ss');
    await authVerify.save();

    // sendVerifyEmailNotification(user);
};

export const resendVerificationEmail = async (address: string) => {
    const user = await Users.findOne({ address });
    if (!user)
        throw new APIError(400, { message: 'User is not registered' });

    if (user.isActive)
        throw new APIError(400, { message: 'User already verified' });

    const expiryDate = moment.utc().add(2, 'hours').format('YYYY-MM-DD HH:mm:ss');

    const authVerification = new AuthVerification();
    authVerification.code = nanoid();
    authVerification.expiryDate = expiryDate;
    authVerification.user = user;
    await authVerification.save();
    // await resendVerificationMail(user, authVerification.code);
}

export const resendVerificationMail = async (user: IUsers, code: string, bcc: string | string[] = []) => {
    sendMail({
        subject: 'Verification Email',
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