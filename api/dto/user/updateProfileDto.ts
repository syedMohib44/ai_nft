export interface UpdateProfileDto {
    phone?: string;
    firstName?: string;
    lastName?: string;
    profilePic?: Express.Multer.File;
}