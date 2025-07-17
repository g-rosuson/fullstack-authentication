const error = {
    badRequest: 'BAD_REQUEST',
    notAuthorised: 'NOT_AUTHORISED',
    authorisationConflict: 'AUTHORISATION_CONFLICT',
    notFound: 'NOT_FOUND',
    internalServerError: 'INTERNAL_SERVER_ERROR',
} as const;

const status = {
    success: 200,
    badRequest: 400,
    notAuthorised: 401,
    authorisationConflict: 409,
    notFound: 404,
    internalServerError: 500,
} as const;

const codes = {
    error,
    status,
};

export default codes;
