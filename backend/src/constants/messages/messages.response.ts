// TODO: We are only using dev messages, should this be moved
// TODO: to exceptions?
const errorMessages = {
    invalidRequestBody: 'Invalid request body. Expected a JSON object but got: "{type}"',
    htmlTagsNotAllowed: 'HTML tags are not allowed in request body',
    internalServerError: 'Internal server error',
    notAuthorised: 'Not authorised',
    authorisationConflict: 'Authorisation conflict',
    invalidCredentials: 'Email or password are invalid',
    refreshTokenCookieNotFound: 'Refresh token cookie not found',
    invalidTokenStructure: 'Invalid token structure',
    malformedAuthorizationHeader: 'Authorization header malformed',
} as const;

export default errorMessages;
