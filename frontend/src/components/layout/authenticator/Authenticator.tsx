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

            const data = await response.json();

            setState(prevState => ({
                ...prevState,
                accessToken: data.accessToken || null
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


    return (
        <div>
            {children}
        </div>
    );
};

export default Authenticator;