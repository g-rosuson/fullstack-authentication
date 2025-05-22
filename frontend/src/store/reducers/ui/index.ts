import { Theme } from '../../types';

const changeTheme = (payload: Theme) => ({
    theme: payload
})

const reducers = {
   changeTheme
}

export default reducers;