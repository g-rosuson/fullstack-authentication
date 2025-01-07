import { ReactNode, useCallback, useEffect, useState } from 'react';

const Authenticator = ({ children }: { children: ReactNode}) => {
    const [state, setState] = useState({
        accessToken: null,
        isLoading: true
    });


    const fetchTokens = useCallback(async () => {
        try {
            const response = await fetch('http://localhost:1000/api/refresh', {
                method: 'GET',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                }
            });

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