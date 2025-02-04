import { jwtDecode } from 'jwt-decode';

/**
 * Determines whether the given JWT is valid.
 */
const isValid = (token: string) => {
    try {
        const decoded = jwtDecode(token);

        // Current time in seconds
        const currentTime = Math.floor(Date.now() / 1000);

        // When the timestamp exists, compare it to the current time
        return decoded.exp ? decoded.exp > currentTime : false;

    } catch (error) {
        console.error('JWT invalid', error);
        return false;
    }
};

/**
 * Decodes the given JWT.
 */
const decode = (token: string) => {
    return jwtDecode(token);
}


const jwt = {
    isValid,
    decode
};

export default jwt;