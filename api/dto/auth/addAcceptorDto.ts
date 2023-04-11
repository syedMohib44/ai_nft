export interface AddAcceptorDto {
    address: string;
    firstName: string;
    lastName: string;
    username: string;
    password: string;
    confirmPassword: string;
    profilePic?: Express.Multer.File;
    doner: false;
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
