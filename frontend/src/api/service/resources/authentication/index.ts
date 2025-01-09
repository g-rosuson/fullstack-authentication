import client from '../../client';
import config from './config';

/**
 * Retrieves a new access-token when a valid http only
 * refresh token cookie is sent to the backend end-point.
 */
const refreshAccessToken = async () => {
    return await client.get(config.paths.refresh);
}

/**
 * Creates a new user and retrieves an access-token when valid credentials
 * are sent to the register backend endpoint.
 */
const register = async (credentials: { email: string, password: string}) => {
    return await client.post(config.paths.register, credentials);
}

/**
 * Retrieves a new access-token when valid credentials are sent
 * to the login backend endpoint.
 */
const login = async (credentials: { email: string, password: string }) => {
    return await client.post(config.paths.login, credentials);
}

/**
 * Logs out the current user by sending the http only refresh token cookie
 * to the logout backend endpoint.
 */
const logout = async () => {
    return await client.post(config.paths.logout);
}

const resources = {
    refreshAccessToken,
    register,
    logout,
    login
}

export default resources;