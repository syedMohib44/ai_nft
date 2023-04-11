import moment from "moment";
import { config } from "../../config";
import AuthVerification from "../../entity/AuthVerification";
import { nanoid } from 'nanoid';
import Users, { IUsers } from "../../entity/Users";
import { verifyGoogleCaptcha } from "../../libs/google/verifyCaptcha";
import { sendMail } from "../../libs/mail/mail";
import { APIError } from "../../utils/error";


interface ForgotPasswordDto {
    username: string;
    googleCaptcha: string;
    ipAddress: string;
}

const sendPasswordVerificationEmail = (user: IUsers, code: string) =>
    sendMail({
        subject: 'Request For Password Reset',
        to: user.username as string,
        template: 'password-change-verification',
        context: {
            fullName: user.fullName,
            url: config.client_url.owner_url + '/reset-password?code=' + code
        }
    });


export const forgotPassword = async ({ username, googleCaptcha, ipAddress }: ForgotPasswordDto) => {
    const isCaptchaValid = await verifyGoogleCaptcha(googleCaptcha, ipAddress);
    if (!isCaptchaValid) {
        throw new APIError(400, { message: 'Invalid Captcha' });
    }

    const user = await Users.findOne({ username });

    if (!user || !username || username.length === 0) {
        throw new APIError(404, { message: 'User not found' });
    }

    const expiryDate = moment.utc().add(2, 'hours').format('YYYY-MM-DD HH:mm:ss');

    const passwordVerification = new AuthVerification();
    passwordVerification.code = nanoid();
    passwordVerification.expiryDate = expiryDate;
    passwordVerification.user = user;
    await passwordVerification.save();

    sendPasswordVerificationEmail(user, passwordVerification.code);
}