/**
 * Logs an error to the console when developing.
 */
const error = (error: Error) => {
    const isDeveloping = window.location.hostname === 'localhost';

    if (isDeveloping) {
        console.error(error);
    }
};

const logging = {
    error
};

export default logging;