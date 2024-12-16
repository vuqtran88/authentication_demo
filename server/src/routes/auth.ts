import { Router } from 'express';
import { User } from '../models/Users';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { authMiddleware, verifyTokenWithZod } from '../middleware/authMiddleware';
import { create } from 'domain';

const router = Router();

// Example API endpoint
router.post('/users', async (req, res) => {

    try {
    const { email, userName, firstName, lastName, password } = req.body;
    
    const user = await User.findOne({ email: email });

    if (user) {
        console.log(`User ${email} already exists`);
        res.status(400).json({
            success: false,
            message: 'User already exists',
        });
        return;
    }

    const createdUser = await User.create({
        email: email,
        password: password,
        userName: userName,
        firstName: firstName,
        lastName: lastName
    });

    console.log('User created', createdUser);

    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
        });
        return;
    }
    
    res.status(201).json({
        success: true,
        message: 'User created',
    });
});

router.post('/users/login', async (req, res) => {
    try {

    const { email, password } = req.body;

    const user = await User.findOne({ email: email });

    if (!user) {
        res.status(400).json({
            success: false,
            message: "Failed to authenticate"
        })
        return;    
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
        res.status(400).json({
            success: false,
            message: "Failed to authenticate"
        })
        return;
    }

    const accessToken = jwt.sign(
        { 
            id: user._id,
            email: user.email,
            role: user.role 
        }, process.env.ACCESS_TOKEN_SECRET!, { expiresIn: '1m' });
    
    const refreshToken = jwt.sign(
        { 
            id: user._id,
            email: user.email,
            role: user.role 
        }, process.env.REFRESH_TOKEN_SECRET!, { expiresIn: '1d' });
    
    res.cookie('auth_token', refreshToken, 
        { 
            maxAge: 3600000,
            httpOnly: true,
            sameSite: 'none',
            path: '/',
            secure: true,
        });

    res.status(200).json({
        accessToken: accessToken,
        ...user.toObject()
    });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
        });
        return;
    }
});

router.post('/users/logout', authMiddleware, async (_req, res) => {
    res.clearCookie('auth_token');
    res.status(200).json({
        success: true,
        message: 'User logged out',
    });
});

router.post('/users/refresh', async (req, res) => {
    const refreshToken = req.cookies.auth_token;

    if (!refreshToken) {
        res.status(401).json({
            success: false,
            message: 'Unauthorized',
        });
        return;
    }

    try {

        const decoded = verifyTokenWithZod(refreshToken, process.env.REFRESH_TOKEN_SECRET!);
        const accessToken = jwt.sign(decoded, process.env.ACCESS_TOKEN_SECRET!, { expiresIn: '1m' });

        res.status(200).json({
            accessToken: accessToken,
        });
    } catch (error) {
        res.status(401).json({
            success: false,
            message: 'Unauthorized',
        });
    }
});

// router.get('/users/me', authMiddleware, async (req: RequestWithUser, res) => {
//     const userId = req.userId;

//     const user = await User.findById(userId)

//     if (!user) {
//         res.status(401).json({
//             success: false,
//             message: 'Cannot find user',
//         });
//         return;
//     }

//     const { password, ...sanitizedUser } = user.toObject();
    
//     res.status(200).json({ sanitizedUser });
// });

export default router;