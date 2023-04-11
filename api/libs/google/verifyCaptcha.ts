import { config } from '../../config';
import request from 'superagent';

export const verifyGoogleCaptcha = async (gRecaptchaResponse: string, ipAddress: string): Promise<boolean> => {
    try {
        const { body } = await request
            .post('https://www.google.com/recaptcha/api/siteverify')
            .type('form')
            .send({
                secret: config.google.captcha_secret_key,
                response: gRecaptchaResponse,
                remoteip: ipAddress
            });
        return body.success;
    } catch (err) {
        return false;
    }
};