import { Request, Response } from 'express';
import { JsonWebTokenError } from 'jsonwebtoken';
import { MongoError } from 'mongodb';

import config from 'aop/config';
import { logger } from 'aop/logging';

import { ErrorLogger } from './utils/logger';

import { ErrorHandlerConfig, ErrorLogContext, ErrorResponse } from './types';

import { BaseException, ConflictException, DatabaseException, InternalException, TokenException } from '../';

/**
 * Centralized error handling middleware for Express applications.
 * Handles all application exceptions and provides consistent error responses.
 */
class ErrorHandlerMiddleware {
    private config: ErrorHandlerConfig;

    constructor() {
        this.config = {
            includeStackTrace: config.isDeveloping,
            sanitizeErrors: !config.isDeveloping,
            logErrors: true,
        };
    }

    /**
     * Express error handling middleware function.
     *
     * @param error The error that occurred
     * @param req Express request object
     * @param res Express response object
     */
    public handle = (error: Error, req: Request, res: Response) => {
        // Skip if a response has already been sent
        if (res.headersSent) {
            logger.warn('Already sent response and could not handle error', { error });
            return;
        }

        const userId = req.context.user.id;

        // Handle application exceptions
        if (error instanceof BaseException) {
            this.handleApplicationException(error, req, res, userId);
            return;
        }

        // Handle MongoDB errors
        if (error instanceof MongoError) {
            this.handleMongoError(error, req, res, userId);
            return;
        }

        // Handle JWT errors
        if (error instanceof JsonWebTokenError) {
            this.handleJsonWebTokenError(error, req, res, userId);
            return;
        }

        // Handle unexpected errors
        this.handleUnexpectedError(error, req, res, userId);
    };

    /**
     * Handles application exceptions that extend BaseException.
     *
     * @param error The application exception
     * @param req Express request object
     * @param res Express response object
     * @param userId User ID if available
     */
    private handleApplicationException(error: BaseException, req: Request, res: Response, userId: string) {
        const logContext: ErrorLogContext = {
            userId,
            method: req.method,
            url: req.url,
            userAgent: req.get('User-Agent'),
            ip: req.ip,
            message: error.message,
            statusCode: error.statusCode,
            errorType: error.errorType,
            stack: this.config.includeStackTrace ? error.context.error?.stack : undefined,
            context: error.context,
        };

        if (this.config.logErrors) {
            ErrorLogger.logError(error, logContext);
        }

        const errorResponse: ErrorResponse = {
            success: false,
            issues: error.context.issues,
            type: error.errorType,
            timestamp: error.timestamp.toISOString(),
        };

        res.status(error.statusCode).json(errorResponse);
    }

    /**
     * Handles MongoDB-specific errors.
     *
     * @param error The MongoDB error
     * @param req Express request object
     * @param res Express response object
     * @param userId User ID if available
     */
    private handleMongoError(error: MongoError, req: Request, res: Response, userId: string) {
        let appException: BaseException;

        if (error.code === 11000) {
            appException = new ConflictException('MongoDB conflict error', { error, userId });
        } else {
            appException = new DatabaseException(`MongoDB error, code: ${error.code}`, { error, userId });
        }

        this.handleApplicationException(appException, req, res, userId);
    }

    private handleJsonWebTokenError(error: JsonWebTokenError, req: Request, res: Response, userId: string) {
        const appException = new TokenException('JSON Web Token error', { error, userId });
        this.handleApplicationException(appException, req, res, userId);
    }

    /**
     * Handles unexpected errors that don't extend BaseException.
     *
     * @param error The unexpected error
     * @param req Express request object
     * @param res Express response object
     * @param userId User ID if available
     */
    private handleUnexpectedError(error: Error, req: Request, res: Response, userId: string) {
        const internalException = new InternalException('Unexpected error', { error, userId });

        this.handleApplicationException(internalException, req, res, userId);
    }
}

/**
 * Factory function to create error handler middleware with default configuration.
 *
 * @returns Express error handling middleware function
 */
export function exceptionsMiddleware() {
    const errorHandler = new ErrorHandlerMiddleware();
    return errorHandler.handle;
}
