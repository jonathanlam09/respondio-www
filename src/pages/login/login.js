import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuthContext } from '../../hooks/auth';
import React, { useEffect, useRef, useState } from 'react';

const Login = () => {
    const { dispatch } = useAuthContext();
    const [error, setError] = useState(null);
    const { state, search } = useLocation();
    const navigate = useNavigate();
    const [username, setUsername] = useState();
    const [password, setPassword] = useState();
    const [errorFields, setErrorFields] = useState([]);

    useEffect(() => {
        if(state){
            setError(state.error);
            window.history.replaceState({}, document.title);
        }
        // eslint-disable-next-line
    }, [state]);

    const loginUser = async (e) => {
        e.preventDefault();

        try {
            var errorFields = [];
            const requiredFields = document.querySelectorAll('.required-fields');
            if(requiredFields.length > 0) {
                requiredFields.forEach(el => {
                    if(!el.value) {
                        errorFields.push(el.id);
                    }
                })
            }

            if(errorFields.length > 0) {
                setError('Please complete all required fields');
                setErrorFields(errorFields);
                return false;
            }

            var formdata = new FormData();
            formdata.append('username', username);
            formdata.append('password', password);

            const response = await axios.post('/users/login', formdata);
            if(!response.data.status) {
                throw new Error(response.data.error);
            }
            dispatch({type: 'LOGIN', payload: response.data.user});
            navigate('/dashboard');
        } catch (err) {
            setError(err.message);
        }
    }

    return (
        <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
            <div className="card row maincard login-card" style={{backgroundColor: 'white', margin:'5px', boxShadow: 'rgba(100, 100, 111, 0.2) 0px 7px 29px 0px'}}>
                <div className="d-flex flex-column justify-content-center align-items-center mb-3">
                </div>
                {
                    error && (
                        <div className="alert alert-danger">{ error }</div>
                    )
                }
                <form onSubmit={loginUser}>
                    <div className="col-12 mb-4 d-flex justify-content-center align-items-center">
                        <input type="text" 
                        className={"form-control required-fields " + (errorFields.includes('username') ? 'validation-error' : '')}
                        id="username" 
                        name="username" 
                        placeholder="Username" 
                        autoComplete="off" 
                        onChange={(e) => {
                            setUsername(e.target.value);
                        }}
                        />
                    </div>
                    <div className="col-12 d-flex justify-content-center align-items-center mb-5">
                        <input type="password" 
                        className={"form-control required-fields " + (errorFields.includes('password') ? 'validation-error' : '')} 
                        id="password" 
                        name="password" 
                        placeholder="Password" 
                        autoComplete="new-password"
                        onChange={(e) => {
                            setPassword(e.target.value);
                        }}/>
                    </div>
                    <div className="col-12 d-flex justify-content-center">
                        <button type="submit" className="login-btn text-white">Sign in</button>
                    </div>
                    <div className="col-12 d-flex justify-content-center mt-5">
                        <a className="reset text-dark" href="/register" style={{fontSize: '12px', textDecoration: 'none'}}>Don&#39;t have an account yet? Sign up here!</a>
                    </div>
                </form>
            </div>
        </div>
        
    )
}

export default Login