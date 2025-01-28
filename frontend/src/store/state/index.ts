const initialState = {
    ui: {
        theme: 'dark' as const,
    },
    user: {
        accessToken: null,
        email: '',
        id: '',
    },
    authentication: {
        accessToken: null
    }
};

export default initialState;