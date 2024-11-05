import { CookieOptions, Request, Response } from 'express';
import { v4 as generateId } from 'uuid';
import bcrypt from 'bcrypt';

import { TokenExpiration } from 'schemas/enums/tokens'
import { IRegisterUserRequest } from 'schemas/types/authentication';

import db from 'db';
import services from 'services';
import config from 'config';

const REFRESH_COOKIE_OPTIONS: CookieOptions = {
    httpOnly: true,
    secure: config.isProduction, // Whether https is being used
    sameSite: config.isProduction ? 'strict' : 'lax',
    domain: config.baseDomain,
    path: '/',
    maxAge: TokenExpiration.Refresh,
}

const register = async (req: Request, res: Response) => {
    try {
        const { email, password } = (req as IRegisterUserRequest).credentials;

        const tokenPayload = {
            email,
            id: generateId()
        };

        const { accessToken, refreshToken } = services.jwt.createTokens(tokenPayload);

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = {
            ...tokenPayload,
            refreshToken,
            password: hashedPassword
        }

        await db.service.mutations.users.create(newUser);

        res.cookie('refreshToken', refreshToken, REFRESH_COOKIE_OPTIONS)
            .status(201)
            .json({ message: `User with email: ${email} successfully created`, accessToken });

    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
    }
};

const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        // Get user by email
        const userDocument = await db.service.queries.users.getByField('email', email);

        // Validate if user exists
        if (!userDocument) {
            return res.status(404).json({ message: 'Email or password are invalid' });
        }

        // Validate if password is correct
        const isPasswordValid = await bcrypt.compare(password, userDocument.password);

        if (!isPasswordValid) {
            return res.status(400).json({ message: 'Email or password are invalid' });
        }

        // Create JWT tokens
        const tokenPayload = {
            id: userDocument.id,
            email: userDocument.email
        };

        const { accessToken, refreshToken } = services.jwt.createTokens(tokenPayload);

        // Update user's refresh token in the database
        await db.service.mutations.users.update(userDocument.id, 'refreshToken', refreshToken);

        // Set refresh token as a cookie and send access token in the response
        res.cookie('refreshToken', refreshToken, REFRESH_COOKIE_OPTIONS)
            .status(200)
            .json({ accessToken });

    } catch (error) {
        res.status(500).json({ message: 'Internal server error', error });
    }
};

const signOut = async (req: Request, res: Response) => {
    const cookies = req.cookies;

    if (!cookies?.refreshToken) {
        return res.status(204).json({ message: 'No token present' });
    }

    res.clearCookie('refreshToken', {
        httpOnly: REFRESH_COOKIE_OPTIONS.httpOnly,
        secure: REFRESH_COOKIE_OPTIONS.secure
    }).json({ message: 'User logged out!' });
}

const authentication = {
    register,
    signOut,
    login
}

export default authentication;