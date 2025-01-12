import { ReactNode, useCallback, useEffect, useState } from 'react';

import api from 'api';

const Authenticator = ({ children }: { children: ReactNode}) => {
    const [state, setState] = useState({
        accessToken: null,
        isLoading: true
    });


    const fetchTokens = useCallback(async () => {
        try {
            const response = await api.service.resources.authentication.refreshAccessToken();

            setState(prevState => ({
                ...prevState,
                accessToken: response.accessToken || null
            }));

        } catch (error) {
            console.error(error)

        } finally {
            setState(prevState => ({
                ...prevState,
                isLoading: false
            }));
        }
    }, [state.accessToken]);


    useEffect(() => {
        fetchTokens();
    }, [fetchTokens])


    return children;
};

export default Authenticator;