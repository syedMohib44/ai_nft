import { PaginateResult } from 'mongoose';
import { config } from '../config';

/**
 * Appends images full path to output generated from mongoose-paginate library
 * @param paginateRes Mongoose Pagination response
 * @param key key for which image full path is to be added
 * @param cache Default: true, set to false to load new image
 */
export function appendImgPathForPagination<T>
    (paginateRes: PaginateResult<T>, key: keyof T, cache?: boolean): PaginateResult<T> {
    paginateRes.docs = paginateRes.docs.map(obj => appendImagePath(obj, key, cache));

    return paginateRes;
}

/**
 * adds base url to partial image path
 * @param obj object
 * @param key object key to which image should be added
 * @param cache Default: true, set to false to load new image
 */
const addFullURLToObj = (obj: any, key: any, cache: boolean = true) => {
    if (!obj[key]) {
        return null;
    }

    let filePath = config.ssh.url + obj[key];
    if (!cache) {
        filePath += `?${Date.now()}`;
    }
    return filePath;
};

export function appendImagePath<T extends any>(obj: T, key: keyof T, cache?: boolean): T {
    if (!obj || !key || !Object.prototype.hasOwnProperty.call(obj, key)) return obj;
    const obj1 = Object.assign({}, obj);

    if (obj1[key]) {
        obj1[key] = addFullURLToObj(obj1, key, cache) as any;
    }

    return obj1;
}

export function appendImagePathInArr<T extends any>(arr: T[], key: keyof T[any], cache?: boolean) {
    if (Array.isArray(arr)) {
        return arr.map(obj => appendImagePath(obj, key, cache));
    }

    return [];
}