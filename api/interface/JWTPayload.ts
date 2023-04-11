export interface JWTPAYLOAD {
    userId: string;
    address: string;
    username: string;
    profilePic?: string;
    typeOfUser: 'doner' | 'acceptor' | 'admin' | 'superadmin';
    token?: string;
}