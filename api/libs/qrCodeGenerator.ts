import { Attachment } from 'nodemailer/lib/mailer';
// tslint:disable-next-line: no-var-requires
const QRCode = require('easyqrcodejs-nodejs');
//import QrCodeClass from 'easyqrcode-nodejs';

interface IOptions {
    text?: string;
    width?: number | 256;
    height?: number | 256;
    colorDark?: string | '#000000';
    colorLight?: string | '#ffffff';
    dotScale?: number | 1;
    format?: 'PNG' | 'JPG'; // 'PNG', 'JPG'
    /**
     *  ZLIB compression level (0-9). default is 6
     */
    compressionLevel?: 6;
    /**
     * An object specifying the quality (0 to 1). default is 0.75. (JPGs only)
     */
    quality?: number | 0.75;
}

export const generateQrCodes = async (products: any[]) => {
    const attachments: Attachment[] = [];
    const options: IOptions = {
        text: '',
        format: 'PNG'
    };
    for (const productItem of products) {
        options.text = productItem.name;
        const qrCode = new QRCode(options);

        qrCode.saveImage({
            path: 'client/src/public/qrCode-images/' + productItem.name
        });
        const qrCodeAttachment = {
            filename: productItem.name + options.format,
            path: 'client/src/public/qrCode-images/' + productItem.name,
            cid: productItem.name + '@inzilo.com' // same cid value as in the html img src
        };
        attachments.push(qrCodeAttachment);
    }
    return attachments;
};


export const generateSingleQrCode = async (adName: string, companyName: string, adId: string) => {
    const options: IOptions = {
        text: companyName + '-' + adName,
        width: 180,
        height: 180,
        format: 'PNG'
    };
    const qrCode = new QRCode(options);
    const path = 'public/qrCode-images/' + companyName + '/' + adId + '.png';
    qrCode.saveImage({
        path
    }).then((data: any) => {
        console.log("`q-premium1.png` has been Created!" + {...data});
    });
    const qrCodeAttachment = {
        filename: adName + '.png',
        path,
        cid: adName + '@' // same cid value as in the html img src
    };
    const attachments: Attachment = qrCodeAttachment;
    return attachments;
};

/**
 * Get standard base64 image data url text: 'data:image/png;base64, ...'
 */
export const generateBase64QrCodes = (codes: string[] = []) => {
    const data = codes.map(code => {
        const options: IOptions = {
            text: code
        };

        const qrcode = new QRCode(options);
        return qrcode.toDataURL() as Promise<string>;
    });

    return Promise.all(data);
};
