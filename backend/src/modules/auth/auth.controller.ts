import bcrypt from 'bcrypt';
import { Request, Response } from 'express';
import { verify } from 'jsonwebtoken';
import { MongoServerError } from 'mongodb';

import { CreateUserPayload, RegisterUserPayload } from 'modules/shared/types/user';

import config from 'aop/config';
import response from 'api/response';
import { parseSchema } from 'lib/validation';

import utils from './utils';
import messages from 'constants/messages';
import names from 'constants/names';

import { JwtPayload, LoginUserPayload } from './types';

import { jwtPayloadSchema } from './schemas';
import jwtService from 'services/jwt';

/**
 * Attempts to create a new user document using atomic insertion.
 * If the email is already registered, it responds with a 409 Conflict.
 * On success, it responds with an JWT access-token and sets a httpOnly
 * refresh-token cookie.
 */
const register = async (req: Request<unknown, unknown, RegisterUserPayload>, res: Response) => {
    try {
        const { firstName, lastName, email, password } = req.body;

        // Create a new user
        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser: CreateUserPayload = {
            firstName,
            lastName,
            password: hashedPassword,
            email,
        };

        // Note: Collection is indexed so duplicate emails will throw a duplicate key error
        const insertResponse = await req.context.db.user.create(newUser);

        // Create JWT tokens
        const tokenPayload: JwtPayload = {
            firstName,
            lastName,
            email,
            id: insertResponse.insertedId.toString(),
        };

        const { accessToken, refreshToken } = jwtService.createTokens(tokenPayload);

        // Send a refresh-token to the client in a httpOnly cookie
        res.cookie(names.refreshTokenCookie, refreshToken, utils.getRefreshCookieOptions());

        response.success(res, accessToken);
    } catch (error) {
        if (error instanceof MongoServerError && error.code === 11000) {
            return response.conflict(res, messages.error.authorisationConflict);
        }

        response.internalError(res, messages.error.internalServerError);
    }
};

/**
 * Validates the login details and sends the user payload and a httpOnly refresh-token cookie to the browser.
 */
const login = async (req: Request<unknown, unknown, LoginUserPayload>, res: Response) => {
    try {
        const { email, password } = req.body;

        // Get user by email
        const userDocument = await req.context.db.user.getByEmail(email);

        // Validate if user exists
        if (!userDocument) {
            return response.notFound(res, messages.error.invalidCredentials);
        }

        // Validate if password is correct
        const isPasswordValid = await bcrypt.compare(password, userDocument.password);

        if (!isPasswordValid) {
            return response.notFound(res, messages.error.invalidCredentials);
        }

        // Create JWT tokens
        const tokenPayload: JwtPayload = {
            firstName: userDocument.firstName,
            lastName: userDocument.lastName,
            email: userDocument.email,
            id: userDocument._id.toString(),
        };

        const { accessToken, refreshToken } = jwtService.createTokens(tokenPayload);

        // Set refresh token as a httpOnly cookie and send user data to front-end
        res.cookie(names.refreshTokenCookie, refreshToken, utils.getRefreshCookieOptions());

        response.success(res, accessToken);
    } catch (error) {
        response.internalError(res, messages.error.internalServerError);
    }
};

/**
 * Clears the refresh-token cookie from the browser.
 */
const logout = async (_req: Request, res: Response) => {
    res.clearCookie(names.refreshTokenCookie, utils.getRefreshCookieOptions(false));

    response.success(res);
};

/**
 * Sends a new access-token to the browser when the refresh-token
 * contained in a httpOnly cookie is valid.
 */
const renewAccessToken = async (req: Request, res: Response) => {
    try {
        // Validate and decode the refresh-token
        // Note: When the JWT is invalid "verify" throws an error
        const decoded = verify(req.cookies.refreshToken, config.refreshTokenSecret);

        // Validate the refresh JWT structure
        const result = parseSchema(jwtPayloadSchema, decoded);

        if (!result.success) {
            return response.internalError(res, messages.error.invalidTokenStructure);
        }

        // Create a new access-token and send it to the browser
        const { accessToken } = jwtService.createTokens(result.data);

        response.success(res, accessToken);
    } catch (error) {
        response.notAuthorised(res, messages.error.notAuthorised);
    }
};

export { renewAccessToken, register, logout, login };
