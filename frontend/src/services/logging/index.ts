/**
 * Logs an error to the console when developing.
 */
const error = (error: Error) => {
    const isLocal = window.location.hostname === 'localhost';

    if (isLocal) {
        console.error(error);
    }
};

const logging = {
    error
};

export default logging;