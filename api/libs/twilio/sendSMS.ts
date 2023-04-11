import twilio from 'twilio';

import { MessageListInstanceCreateOptions, MessageInstance } from 'twilio/lib/rest/api/v2010/account/message';
import { config } from '../../config';

// TWILIO config
const accountSid = 'ACxxxxxxxxxxxxxxxxx';//config.twilio.account_sid;
const authToken = 'xxxxxxxxxxxxxxxxx';//config.twilio.auth_token;
const fromNumber = 'xxxxxxxxxxxxxxxxx';//config.twilio.phone;
const client = twilio(accountSid, authToken);

export interface ISMSOptions {
    message: string;
    phoneNumber: string;
    mediaUrl?: string[];
}

// Create promise and SNS service object
export const sendSMS = (smsOptions: ISMSOptions): Promise<MessageInstance> => {
    try {
        const obj: MessageListInstanceCreateOptions = {
            body: smsOptions.message,
            from: fromNumber,
            to: '+1' + smsOptions.phoneNumber,
        };

        if (smsOptions.mediaUrl) {
            obj.mediaUrl = smsOptions.mediaUrl;
        }

        return client.messages.create(obj);
    } catch (err) {
        throw err;
    }
};
