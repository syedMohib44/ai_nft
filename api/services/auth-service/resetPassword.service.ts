import moment from 'moment';
import bcryptjs from 'bcryptjs';
import Users, { IUsers } from '../../entity/Users';
import { sendMail } from '../../libs/mail/mail';
import { APIError } from '../../utils/error';
import AuthVerification from '../../entity/AuthVerification';

const isLinkExpired = (expiryDate: string): boolean => {
    const expiryDateM = moment.utc(expiryDate);
    const isExpired = moment.utc().isAfter(expiryDateM);

    return isExpired;
};

const sendPasswordChangeNotification = (user: IUsers) => {
    return sendMail({
        subject: 'Your password has been changed',
        to: user.username as string,
        text: `Dear ${user.fullName}, your password has been updated.`
    });
};


/**
 * Used to reset password after user forgets password
 * @param code unique code
 * @param newPassword
 */
export const resetPassword = async (code: string, newPassword: string, confirmPassword: string) => {
    if (!newPassword || newPassword.length < 8) {
        throw new APIError(400, { message: 'Password must have a minimum length of 8 characters' });
    }
    if (newPassword !== confirmPassword) {
        throw new APIError(400, { message: 'New password and confirm password do not match' });
    }

    const savedPwdChangeVerify = await AuthVerification.findOne({ code });

    if (!savedPwdChangeVerify || savedPwdChangeVerify.isVerified) {
        throw new APIError(400, { message: 'Link expired or bad request' });
    }

    if (isLinkExpired(savedPwdChangeVerify.expiryDate)) {
        throw new APIError(400, { message: 'Link expired' });
    }

    const user = await Users.findOne({ _id: savedPwdChangeVerify.user });
    if (!user) {
        throw new APIError(400, { message: 'Link expired or bad request' });
    }

    // update user password
    user.password = bcryptjs.hashSync(newPassword);
    await user.save();

    // update password change verification
    savedPwdChangeVerify.isVerified = true;
    savedPwdChangeVerify.verifiedAt = moment.utc().format('YYYY-MM-DD HH:mm:ss');
    await savedPwdChangeVerify.save();

    sendPasswordChangeNotification(user);
};