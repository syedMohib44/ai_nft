export interface JWTPAYLOAD {
    userId: string;
    address: string;
    username: string;
    profilePic?: string;
    typeOfUser: 'admin' | 'user';
    token?: string;
}