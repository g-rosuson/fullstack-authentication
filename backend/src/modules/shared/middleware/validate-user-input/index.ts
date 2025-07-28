import { NextFunction, Request, Response } from 'express';

import { InputValidationException } from 'aop/exceptions';

import { isObject } from 'utils';

/**
 * Recursively checks if the given value (or any of its nested properties) contains HTML tags.
 *
 * This is primarily used to prevent XSS attacks by ensuring that user input does not include
 * HTML content such as <script>, <img>, or other potentially harmful tags.
 */
const _containsHtml = (value: unknown) => {
    if (typeof value === 'string') {
        // Matches basic HTML tags (e.g., <div>, <script>, <img src="...">)
        // Breakdown:
        //   <            — opening angle bracket
        //   \s*          — optional whitespace (e.g., "<   div")
        //   /?           — optional forward slash for closing tags (e.g., "</div>")
        //   \s*          — optional whitespace after slash
        //   [a-z]        — tag name must start with a letter
        //   [a-z0-9]*    — followed by zero or more letters or digits (e.g., "h1", "input")
        //   \b           — word boundary to avoid partial matches (e.g., "<embedstuff" won't match)
        //   [^>]*        — any characters except ">" (to capture tag attributes or spacing)
        //   >            — closing angle bracket (implied by regex engine, not explicitly written)
        // Flags:
        //   i            — case-insensitive (so <DIV> also matches)
        const htmlTagRegex = /<\s*\/?\s*[a-z][a-z0-9]*\b[^>]*>/i;

        return htmlTagRegex.test(value);
    }

    // If the value is a plain object, recursively check all its property values.
    // This ensures HTML tags are detected in deeply nested objects.
    if (isObject(value)) {
        return Object.values(value || {}).some(_containsHtml);
    }

    return false;
};

/**
 * Middleware to validate that the request body is a valid JSON object
 * and does not contain HTML tags.
 */
const validateUserInput = (req: Request, _res: Response, next: NextFunction) => {
    if (!isObject(req.body)) {
        throw new InputValidationException(
            `Invalid request body. Expected a JSON object but got: "${typeof req.body}"`
        );
    }

    if (_containsHtml(req.body)) {
        throw new InputValidationException('Invalid request body. HTML tags detected');
    }

    next();
};

export default validateUserInput;
