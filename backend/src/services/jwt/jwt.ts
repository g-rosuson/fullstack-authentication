import { sign } from 'jsonwebtoken';

import config from 'config';

import { TokenExpiration } from 'schemas/enums/tokens'

interface AccessTokenPayload {
    userId: string
}

const _signAccessToken = (payload: AccessTokenPayload) => {
    return sign(payload, config.accessTokenSecret, { expiresIn: '30s' });
    // return sign(payload, config.accessTokenSecret, { expiresIn: TokenExpiration.Access });
}


//
interface RefreshTokenPayload {
    userId: string
    version: number
}

const _signRefreshToken = (payload: RefreshTokenPayload) => {
    return sign(payload, config.refreshTokenSecret, { expiresIn: TokenExpiration.Refresh });
}


//
// Todo: If I don't use a type the index.ts parent file
// todo: complains about the UserDocument interface
type UserPayloadData = {
    id: string
    email: string
    tokenVersion: number
}

const createTokens = (userData: UserPayloadData) => {
    const accessTokenPayload: AccessTokenPayload = {
        userId: userData.id
    }

    const refreshTokenPayload: RefreshTokenPayload = {
        userId: userData.id,
        version: userData.tokenVersion
    }

    const accessToken = _signAccessToken(accessTokenPayload)
    const refreshToken = _signRefreshToken(refreshTokenPayload)

    return { accessToken, refreshToken }
}


const jwt = {
    createTokens
}

export default jwt;