import { IUsers } from "../../entity/Users";

export interface UpdateArtDto {
    user: IUsers['_id'];
    tag: string;
    address: string;
    /**
    * @type string(Optional)
    * @description:  Name of the image
    */
    name?: string;
    /**
     * @type string(Optional)
     * @description: Brief sentence explaining the image
     */
    description?: string;
}