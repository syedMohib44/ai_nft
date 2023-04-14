import multer from "multer";
import { nanoid } from "nanoid";
import fs from 'fs';

export const generateRandomString = (length: number, options?: { type?: 'char' | 'number' }) => {
    let result = '';
    let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    if (options && options.type) {
        switch (options.type) {
            case 'char':
                characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
                break;
            case 'number':
                characters = '0123456789';
        }
    }
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
};

export const capitalize = (word: string) => {
    if (!word || !word.length) {
        return '';
    }
    return word[0].toUpperCase() + word.slice(1);
};

/**
 * sleep simulation
 * @param time time in ms
 */
export const sleep = (time: number) => {
    return new Promise(res => setTimeout(res, time));
};


export const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const product = req.body.productId ? req.body.productId : '';
        const name = req.body.name ? req.body.name : '';
        const path = `./client/src/public/uploads/${req.body.businessName}/${product}/${name}`
        fs.mkdirSync(path, { recursive: true });
        return cb(null, path);
    },

    // By default, multer removes file extensions so let's add them back
    filename: function (req, file, cb) {
        return cb(null, nanoid(6) + file.originalname);
    }
});
