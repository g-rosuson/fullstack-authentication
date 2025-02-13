import { Request, Response } from 'express';
import { v4 as generateId } from 'uuid';
import bcrypt from 'bcrypt';

import db from 'db';
import services from 'services';
import { authenticationResponse, genericResponse } from 'api/response';

const register = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        const userDocument = await db.service.queries.users.getByField('email', email);

        if (userDocument) {
            return genericResponse.conflict(res);
        }

        const tokenPayload = {
            email,
            id: generateId(),
        };

        const { accessToken, refreshToken } = services.jwt.createTokens(tokenPayload);

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = {
            ...tokenPayload,
            refreshToken,
            password: hashedPassword,
        };

        await db.service.mutations.users.create(newUser);

        // Determine user data to send to the front-end
        const userPayload = {
            refreshToken,
            accessToken,
            email,
            id: tokenPayload.id,
        };

        // Set refresh token as a cookie and send user data to front-end
        authenticationResponse.success(res, userPayload);
    } catch (error) {
        genericResponse.internalError(res);
    }
};

const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        // Get user by email
        const userDocument = await db.service.queries.users.getByField('email', email);

        // Validate if user exists
        if (!userDocument) {
            return genericResponse.notFound(res, 'email or password are invalid');
        }

        // Validate if password is correct
        const isPasswordValid = await bcrypt.compare(password, userDocument.password);

        if (!isPasswordValid) {
            return genericResponse.notFound(res, 'email or password are invalid');
        }

        // Create JWT tokens
        const tokenPayload = {
            id: userDocument.id,
            email: userDocument.email,
        };

        const { accessToken, refreshToken } = services.jwt.createTokens(tokenPayload);

        // Update user's refresh token in the database
        await db.service.mutations.users.update(userDocument.id, 'refreshToken', refreshToken);

        // Determine user data to send to the front-end
        const userPayload = {
            refreshToken,
            accessToken,
            email,
            id: tokenPayload.id,
        };

        // Set refresh token as a cookie and send user data to front-end
        authenticationResponse.success(res, userPayload);
    } catch (error) {
        genericResponse.internalError(res);
    }
};

const signOut = async (req: Request, res: Response) => {
    const cookies = req.cookies;

    if (!cookies?.refreshToken) {
        return genericResponse.badRequest(res, 'logged out without token');
    }

    authenticationResponse.logout(res);
};

const authentication = {
    register,
    signOut,
    login,
};

export default authentication;
