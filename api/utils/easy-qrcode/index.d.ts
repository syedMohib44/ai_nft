declare module 'easyqrcode-nodejs' {

    interface IQrCodeOptions {
        options: any,
        path?: string,
    }

    class QrCodeClass {
        constructor(options: IQrCodeOptions, path?: string);
        saveImage(path: string): () => void;
        QRCode(options: any) : () => any;
    }
    export = QrCodeClass;
}