import axios from 'axios';
import { createContext, useEffect, useReducer, useState } from 'react';

export const AuthContext = createContext({});

export const authReducer = (state, action) => {
    switch (action.type){
        case 'LOGIN': 
            return { user: action.payload };
        case 'LOGOUT':
            return { user: null }
        default: 
            return state;
    }
}

export const AuthContextProvider = ({children}) => {
    const [state, dispatch] = useReducer(authReducer, {
        user: null
    })
    const [ready, setReady] = useState(false);

    const configureAxios = (token) => {
        axios.interceptors.request.use(
            (config) => {
                if (token) {
                    config.headers.Authorization = `Bearer ${token}`;
                }
                return config;
            },
            (error) => Promise.reject(error)
        );

        axios.interceptors.response.use(
            (response) => response,
            async (error) => {
                const originalRequest = error.config;

                if (
                    error.response?.status === 401 &&
                    !originalRequest._retry
                ) {
                    originalRequest._retry = true;
                    try {
                        console.debug('Refreshing...')
                        const refreshResponse = await axios.get('/me');
                        if(refreshResponse.status !== 200) {
                            throw new Error(refreshResponse.data.error);
                        }
                        const updatedUser = refreshResponse.data.user;
                        dispatch({ type: 'LOGIN', payload: updatedUser });
                        originalRequest.headers.Authorization = `Bearer ${updatedUser.accessToken}`;
                        return axios(originalRequest);
                    } catch (refreshError) {
                        originalRequest._retry = false;
                        console.error('Failed to refresh token:', refreshError);
                        dispatch({ type: 'LOGOUT' });
                        return Promise.reject(refreshError);
                    }
                }
                return Promise.reject(error);
            }
        );
    };

    useEffect(() => {
        const checkRefreshToken = async () => {
            try {
                const response = await axios.get('/me');
                const user = response.data.user;
                dispatch({ type: 'LOGIN', payload: user });
                configureAxios(user.accessToken);
            } catch (error) {
                console.error('Refresh token is invalid or expired.', error);
                dispatch({ type: 'LOGOUT' });
            } finally {
                setReady(true);
            }
        };
        checkRefreshToken();
    }, []);

    useEffect(() => {
        if(state.user) {
            configureAxios(state.user.accessToken);
        }
    }, [state.user]);
    
    return (
        <AuthContext.Provider value={{ ...state, dispatch, ready }}>
            {children}
        </AuthContext.Provider>
    )
}