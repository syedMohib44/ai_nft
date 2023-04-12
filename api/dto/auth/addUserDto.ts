export interface AddUserDto {
    address: string;
    firstName: string;
    lastName: string;
    username: string;
    password: string;
    confirmPassword: string;
    profilePic?: Express.Multer.File;
}