import bcrypt from 'bcrypt';
import { Request, Response } from 'express';
import { verify } from 'jsonwebtoken';
import { MongoServerError } from 'mongodb';
import { v4 as generateId } from 'uuid';

import config from 'aop/config';
import db from 'aop/db';
import response from 'api/response';
import { parseSchema } from 'lib/validation';

import constants from './auth.constant';
import inputSchema, { type JWTInputDto, type LoginInputDto, type RegisterInputDto } from './dto/auth.input-dto';
import outputSchema, { type AuthenticationOutputDto } from './dto/auth.output-dto';

import jwtService from 'services/jwt';

/**
 * Attempts to create a new user document using atomic insertion.
 * If the email is already registered, responds with a 409 Conflict.
 * On success, returns user payload and sets an httpOnly refresh-token cookie.
 */
const register = async (req: Request<unknown, unknown, RegisterInputDto>, res: Response) => {
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

        // Note: Because the email field has a unique index (see db/setup/index),
        // attempting to insert a user with an existing email will throw a
        // duplicate key error.
        await db.service.mutations.users.create(newUser);

        // Validate payload sent to the client
        const payload = {
            ...tokenPayload,
            accessToken,
        };

        const result = parseSchema<AuthenticationOutputDto>(outputSchema.authenticationOutputDto, payload);

        if (!result.success) {
            return response.internalError(res, constants.INVALID_PAYLOAD_STRUCTURE_MSG);
        }

        // Set refresh token as a cookie and send user data to front-end
        res.cookie(constants.REFRESH_COOKIE_NAME, refreshToken, constants.REFRESH_COOKIE_OPTIONS());

        response.success<AuthenticationOutputDto>(res, payload);
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
const login = async (req: Request<unknown, unknown, LoginInputDto>, res: Response) => {
    try {
        const { email, password } = req.body;

        // Get user by email
        const userDocument = await db.service.queries.users.getByEmail(email);

        // Validate if user exists
        if (!userDocument) {
            return response.notFound(res, constants.INVALID_AUTH_MSG);
        }

        // Validate if password is correct
        const isPasswordValid = await bcrypt.compare(password, userDocument.password);

        if (!isPasswordValid) {
            return response.notFound(res, constants.INVALID_AUTH_MSG);
        }

        // Create JWT tokens
        const tokenPayload = {
            id: userDocument.id,
            email: userDocument.email,
        };

        const { accessToken, refreshToken } = jwtService.createTokens(tokenPayload);

        // Validate payload sent to the client
        const payload = {
            ...tokenPayload,
            accessToken,
        };

        const result = parseSchema<AuthenticationOutputDto>(outputSchema.authenticationOutputDto, payload);

        if (!result.success) {
            return response.internalError(res, constants.INVALID_PAYLOAD_STRUCTURE_MSG);
        }

        // Set refresh token as a httpOnly cookie and send user data to front-end
        res.cookie(constants.REFRESH_COOKIE_NAME, refreshToken, constants.REFRESH_COOKIE_OPTIONS());

        response.success(res, payload);
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
        return response.badRequest(res, { message: constants.NO_TOKEN_MSG });
    }

    res.clearCookie(constants.REFRESH_COOKIE_NAME, constants.REFRESH_COOKIE_OPTIONS(false));

    response.success(res, undefined);
};

/**
 * Sends a new access-token to the browser when the refresh-token
 * contained in a httpOnly cookie is valid.
 */
const renewAccessToken = async (req: Request, res: Response) => {
    try {
        // Validate that refresh-token cookie is set
        if (!req.cookies?.refreshToken) {
            return response.badRequest(res, { message: constants.NO_TOKEN_MSG });
        }

        // Validate and decode the refresh-token
        // Note: When the JWT is invalid "verify" throws an error
        const decoded = verify(req.cookies.refreshToken, config.refreshTokenSecret);

        // Validate the refresh JWT structure
        const result = parseSchema<JWTInputDto>(inputSchema.jwtInputDto, decoded);

        if (!result.success) {
            return response.internalError(res, constants.INVALID_TOKEN_STRUCTURE_MSG);
        }

        // Create a new access-token and send it to the browser
        const { accessToken } = jwtService.createTokens(result.data);

        // Validate payload sent to the client
        const payload = {
            ...result.data,
            accessToken,
        };

        const payloadResult = parseSchema<AuthenticationOutputDto>(outputSchema.authenticationOutputDto, payload);

        if (!payloadResult.success) {
            return response.internalError(res, constants.INVALID_PAYLOAD_STRUCTURE_MSG);
        }

        response.success<AuthenticationOutputDto>(res, payload);
    } catch (error) {
        response.notAuthorised(res);
    }
};

export { renewAccessToken, register, logout, login };
