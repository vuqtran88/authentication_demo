import { Request } from 'express';


interface CustomRequest extends Request {
    user?: IUser | null;
}

export interface IUser {
    userName: string;
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    role: string;
    createdAt: Date;
}