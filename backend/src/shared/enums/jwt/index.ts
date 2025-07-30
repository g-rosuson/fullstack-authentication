/* eslint-disable no-unused-vars */
/**
 * Token expiration times in seconds.
 */
export enum TokenExpiration {
    Access = 7 * 60 * 60, // 7 hrs in seconds
    Refresh = 14 * 24 * 60 * 60, // 14 days in seconds
}
