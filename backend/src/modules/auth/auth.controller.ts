import { MongoServerError } from 'mongodb';
import { Request, Response } from 'express';
import { v4 as generateId } from 'uuid';
import bcrypt from 'bcrypt';
import { verify } from 'jsonwebtoken';

import { authenticationResponse, response } from 'response';
import { parseSchema } from 'lib/validation';
import jwtService from 'services/jwt';
import config from 'config';
import db from 'db';

import { type AuthenticationPayload } from './auth.schemas';
import schema, { type JWTPayload } from 'shared/schemas';

/**
 * Attempts to create a new user document using atomic insertion.
 * If the email is already registered, responds with a 409 Conflict.
 * On success, returns user payload and sets an httpOnly refresh-token cookie.
 */
const register = async (req: Request<unknown, unknown, AuthenticationPayload>, res: Response) => {
    try {
        const { email, password } = req.body;

        const tokenPayload = {
            email,
            id: generateId(),
        };

        const { accessToken, refreshToken } = jwtService.createTokens(tokenPayload);
        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = {
            ...tokenPayload,
            password: hashedPassword,
        };

        // Attempt to insert the user directly — assuming a unique index on `email`
        await db.service.mutations.users.create(newUser);

        const userPayload = {
            refreshToken,
            accessToken,
            email,
            id: tokenPayload.id,
        };

        authenticationResponse.success(res, userPayload);
    } catch (error) {
        if (error instanceof MongoServerError && error.code === 11000) {
            return response.conflict(res);
        }

        response.internalError(res);
    }
};

/**
 * Validates the login details and sends the user payload and a httpOnly refresh-token cookie to the browser.
 */
const login = async (req: Request<unknown, unknown, AuthenticationPayload>, res: Response) => {
    try {
        const { email, password } = req.body;

        // Get user by email
        const userDocument = await db.service.queries.users.getByEmail(email);

        // Validate if user exists
        if (!userDocument) {
            return response.notFound(res, 'email or password are invalid');
        }

        // Validate if password is correct
        const isPasswordValid = await bcrypt.compare(password, userDocument.password);

        if (!isPasswordValid) {
            return response.notFound(res, 'email or password are invalid');
        }

        // Create JWT tokens
        const tokenPayload = {
            id: userDocument.id,
            email: userDocument.email,
        };

        const { accessToken, refreshToken } = jwtService.createTokens(tokenPayload);

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
        response.internalError(res);
    }
};

/**
 * Clears the refresh-token cookie from the browser.
 */
const logout = async (req: Request, res: Response) => {
    const cookies = req.cookies;

    if (!cookies?.refreshToken) {
        return response.badRequest(res, { message: 'logged out without token' });
    }

    authenticationResponse.logout(res);
};

/**
 * Sends a new access-token to the browser when the refresh-token
 * contained in a httpOnly cookie is valid.
 */
const renewAccessToken = async (req: Request, res: Response) => {
    try {
        // Validate that refresh-token cookie is set
        if (!req.cookies?.refreshToken) {
            return response.badRequest(res, { message: 'token not present' });
        }

        // Validate and decode the refresh-token
        // Note: When the JWT is invalid "verify" throws an error
        const decoded = verify(req.cookies.refreshToken, config.refreshTokenSecret);

        // Validate the refresh JWT structure
        const result = parseSchema<JWTPayload>(schema.jwt, decoded);

        if (!result.success) {
            return response.internalError(res, 'token payload structure invalid');
        }

        // Create a new access-token and send it to the browser
        const { accessToken } = jwtService.createTokens(result.data);

        const userData = {
            accessToken,
            email: result.data.email,
            id: result.data.id,
        };

        response.success(res, userData);
    } catch (error) {
        response.notAuthorised(res);
    }
};

export { renewAccessToken, register, logout, login };
