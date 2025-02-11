import { type TokenPayload } from '../types';
import { type JwtPayload } from 'jsonwebtoken';

const isJwtPayloadValid = (tokenPayload: JwtPayload | string | undefined): tokenPayload is TokenPayload => {
    if (!tokenPayload || typeof tokenPayload !== 'object') {
        return false;
    }

    return typeof tokenPayload.email === 'string' && typeof tokenPayload.id === 'string';
};

export { isJwtPayloadValid };
