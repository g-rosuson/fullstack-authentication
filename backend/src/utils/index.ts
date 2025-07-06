/**
 * Determines if the given value is an object.
 */
const isObject = (value: unknown): value is Record<string, unknown> => {
    return Object.prototype.toString.call(value) === '[object Object]';
};

export { isObject };
