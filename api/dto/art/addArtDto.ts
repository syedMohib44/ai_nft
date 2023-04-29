import { IUsers } from "../../entity/Users";

export interface AddArtDto {
    user: IUsers['_id'];
    address: string;
    /**
     * @type string(Required)
     * @description: You wish is AI command
     */
    wish: string;
    /**
     * @type string(Required)
     * @description:  Name of the image
     */
    name: string;
    /**
     * @type string(Required)
     * @description: Brief sentence explaining the image
     */
    description: string;
}