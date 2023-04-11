import { PaginateOptions } from 'mongoose';

export interface IGetOptions {
    /**
  * Search for any term like ?q=<anything>
  */
    q?: string;
    /**
     * Search for specific terms like ?firstName=<string>&lastName=<string>  
     */
    search?: any;
    /**
     * key is string and assigning value can be any type like 'count': 1 
     * This will help to create our own options without changing in backend.
     */
    [key: string]: any;
}

export interface IGetOptionsWithPaginate extends IGetOptions, PaginateOptions {
}