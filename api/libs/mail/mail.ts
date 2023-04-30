import nodemailer from 'nodemailer';
// tslint:disable-next-line: no-var-requires
const hbs = require('nodemailer-express-handlebars');
import { create } from 'express-handlebars';
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
    //https://ethereal.email/create
    //TODO: Will replace port 587 with 465 when purchase our own sever.
    const transporter = nodemailer.createTransport({
        host: config.mail.host,
        port: 587, //true for 465, false for other ports
        secure: false,
        auth: {
            user: 'christian33@ethereal.email', //config.mail.username,
            pass: 'b2tuFSEhTkAVpHgjHH' //config.mail.password
        }
    });

    if (mailOptions.template) {
        const viewEngine = {
            defaultLayout: undefined,
            partialsDir: 'public/partials/',
        };
        const hbsOptions = {
            viewEngine: create(viewEngine),
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
