import nodemailer from 'nodemailer';
// tslint:disable-next-line: no-var-requires
const hbs = require('nodemailer-express-handlebars');
import handlebars from 'express-handlebars';
import { Attachment } from 'nodemailer/lib/mailer';
import { config } from '../../config';

export interface IMailOptions {
    to: string;
    subject: string;
    from?: string;
    bcc?: string | string[];
    cc?: string;
    text?: string;
    attachments?: Attachment[];
    image_url?: string;
    template?: string;
    context?: object;
}

export const sendMail = (mailOptions: IMailOptions) => {
    const transporter = nodemailer.createTransport({
        host: config.mail.host,
        port: 465,
        secure: true,
        auth: {
            user: config.mail.username,
            pass: config.mail.password
        }
    });

    if (mailOptions.template) {
        const viewEngine = {
            defaultLayout: undefined,
            partialsDir: 'public/partials/',
        };
        const hbsOptions = {
            viewEngine: handlebars.create(viewEngine),
            viewPath: 'public/mail_templates',
        };
        transporter.use('compile', hbs(hbsOptions));
    }

    mailOptions.from = config.mail.username;

    // attach logo
    const logoAttachment = {
        filename: 'DA-logo.png',
        path: 'public/images/logo/DA-logo.png',
        cid: 'DAlogo@da.com' // same cid value as in the html img src
    };

    if (mailOptions.attachments) {
        mailOptions.attachments.push(logoAttachment);
    } else {
        mailOptions.attachments = [logoAttachment];
    }

    return transporter.sendMail(mailOptions);
};
