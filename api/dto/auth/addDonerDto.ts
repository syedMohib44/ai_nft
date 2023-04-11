export interface AddDonerDto {
    address: string;
    firstName: string;
    lastName: string;
    password: string;
    confirmPassword: string;
    username: string;
    profilePic?: Express.Multer.File;
    doner: true;
}

// export interface AddOwnerWithCardDto extends AddOwnerDto {
//     card: {
//         number: string;
//         /**
//          * Format: MMYYYY, Example: 022020
//          */
//         expiry: string;
//         security_code: string;
//         // name?: string;
//     };
// }
