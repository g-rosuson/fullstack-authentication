import client from '../../client';

// Domain name
const DOMAIN = '/auth';

// Domain paths
const REFRESH_ACCESS_TOKEN_PATH = '/refresh'


/**
 * Retrieves a new access-token when a valid http only
 * refresh token cookie is sent to the backend end-point.
 */
const refreshAccessToken = async () => {
    return await client.GET(DOMAIN + REFRESH_ACCESS_TOKEN_PATH);
}

const resources = {
    refreshAccessToken
}

export default resources;