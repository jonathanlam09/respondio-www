import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuthContext } from '../../hooks/auth';
import React, { useEffect, useRef, useState } from 'react';

const Register = () => {
    const [error, setError] = useState(null);
    const [firstName, setFirstName] = useState();
    const [lastName, setLastName] = useState();
    const [email, setEmail] = useState();
    const [contact, setContact] = useState();
    const [errorFields, setErrorFields] = useState([]);

    const registerUser = async (e) => {
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
            formdata.append('firstName', firstName);
            formdata.append('lastName', lastName);
            formdata.append('email', email);
            formdata.append('contact', contact);

            const response = await axios.post('/users/register', formdata);
            if(!response.data.status){
                throw new Error(response.data.error);
            }
            
            global.config.methods.successResponse(
                `Successfully registered!
                Your credential is username is ${response.data.email} and password is ${response.data.password}
                `
            ).then(() => {
                window.location.href = '/login';
            })
        } catch (err) {
            setError(err.message);
        }
    }

    return (
        <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
            <div className="card row maincard register-card" style={{backgroundColor: 'white', margin:'5px', boxShadow: 'rgba(100, 100, 111, 0.2) 0px 7px 29px 0px'}}>
                <div className="d-flex flex-column justify-content-center align-items-center mb-3">
                </div>
                {
                    error && (
                        <div className="alert alert-danger">{ error }</div>
                    )
                }
                <form onSubmit={registerUser}>
                    <div className={'row'}>
                        <div className="col-md-6 col-12 mb-4 d-flex justify-content-center align-items-center">
                            <input type="text" 
                            className={"form-control required-fields " + (errorFields.includes('firstName') ? 'validation-error' : '')} 
                            id="firstName" 
                            name="firstName" 
                            placeholder="First name" 
                            onChange={(e) => {
                                setFirstName(e.target.value)
                            }}
                            />
                        </div>
                        <div className="col-md-6 col-12 mb-4 d-flex justify-content-center align-items-center">
                            <input type="text" 
                            className={"form-control required-fields " + (errorFields.includes('lastName') ? 'validation-error' : '')} 
                            id="lastName" 
                            name="lastName" 
                            placeholder="Last name" 
                            onChange={(e) => {
                                setLastName(e.target.value)
                            }}
                            />
                        </div>
                        <div className="col-12 mb-4 d-flex justify-content-center align-items-center">
                            <input type="text" 
                            className={"form-control required-fields " + (errorFields.includes('email') ? 'validation-error' : '')}
                            id="email" 
                            name="email" 
                            placeholder="Email" 
                            onChange={(e) => {
                                setEmail(e.target.value)
                            }}
                            />
                        </div>
                        <div className="col-12 mb-4 d-flex justify-content-center align-items-center">
                            <input type="text" 
                            className={"form-control required-fields " + (errorFields.includes('contact') ? 'validation-error' : '') }
                            id="contact" 
                            name="contact" 
                            placeholder="Contact" 
                            onChange={(e) => {
                                setContact(e.target.value)
                            }}
                            />
                        </div>
                    </div>
                    <div className="col-12 d-flex justify-content-center mt-3">
                        <button type="submit" className="register-btn text-white">Submit</button>
                    </div>
                    <div className="col-12 d-flex justify-content-center mt-5">
                        <a className="reset text-dark" href="/login" style={{fontSize: '12px', textDecoration: 'none'}}>Already have an account? Sign in here!</a>
                    </div>
                </form>
            </div>
        </div>
    )
}
export default Register