import { ChangeThemeReducer } from './ui.types';

const changeTheme: ChangeThemeReducer = {
    type: 'change_theme',
    action: (payload, state) => ({
        ...state,
        theme: payload
    })
};

const reducers = [
    changeTheme
];

export default reducers;