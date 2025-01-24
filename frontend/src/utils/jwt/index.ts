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

const jwt = {
    isValid
};

export default jwt;