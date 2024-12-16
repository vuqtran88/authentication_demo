import { Request, Response, NextFunction, RequestHandler } from 'express';
import jwt from 'jsonwebtoken';
import { IUser } from '../models/Users';
import { z, ZodRawShape } from 'zod';

interface CustomRequest extends Request {
    user?: IUser | null;
}

const userSchema = z.object({
    userName: z.string(),
    firstName: z.string(),
    lastName: z.string(),
    email: z.string().email(),
    password: z.string(),
    role: z.enum(["user", "admin"]),
    createdAt: z.string().transform((val) => new Date(val)),
});


export function verifyTokenWithZod(token: string, secret: string): IUser {
    try {
        const decoded = jwt.verify(token, secret);
        return userSchema.parse(decoded);
    } catch (error) {
        console.error("Invalid token or payload", error);
        throw new Error("Invalid token or payload");
    }
}

export const authMiddleware: RequestHandler = (req: CustomRequest, res, next) : void  => {

    const accessToken = req.header('Authorization')?.replace('Bearer ', '');

    if (!accessToken) {
        console.log('authrization header ', req.header('Authorization'));
        console.log('No token provided');
        res.status(401).json({ message: 'Unauthorized: No token provided' });
        return;
    }

    try {
        const user = verifyTokenWithZod(accessToken, process.env.ACCESS_TOKEN_SECRET!);
        req.user = user; // Attach decoded token to the request
        next(); // Proceed to the next middleware or route handler
    } catch (err) {
        console.log('Unauthorized: Invalid token');
        res.status(401).json({ message: 'Unauthorized: Invalid token' });
        return;
    }
}
