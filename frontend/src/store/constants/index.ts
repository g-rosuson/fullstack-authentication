const constants = {
    state: {
        ui: {
            theme: 'dark' as const,
        },
        user: {
            accessToken: null,
            email: '',
            id: '',
        }
    },
    user: {
        domain: 'user' as const,
        reducer: {
            clearUser: 'clear_user' as const,
            changeUser: 'change_user' as const,
        }
    },
    ui: {
        domain: 'ui' as const,
        reducer: {
            changeTheme: 'change_theme' as const,
        }
    }
};

export default constants;