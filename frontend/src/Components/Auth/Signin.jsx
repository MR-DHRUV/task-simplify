import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import { url } from '../constants';

export default function SignIn() {

    const navigator = useNavigate();

    const [signInData, setSignInData] = useState({
        email: '',
        password: ''
    });

    const onChange = (e) => {
        setSignInData({
            ...signInData,
            [e.target.name]: e.target.value
        });
    }

    const signIn = async (e) => {
        e.preventDefault();
        const response = await fetch(`${url}/auth/signin/`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*",
            },
            mode: "cors",
            referrerPolicy: "origin-when-cross-origin",
            body: JSON.stringify({
                email: signInData.email,
                password: signInData.password
            })
        });

        const json = await response.json();
        if (json.success === true) {
            localStorage.setItem('auth-token', json.authToken);
            navigator('/');
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: json.message
            });
        }
    }

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-lg-5 col-md-7 col-sm-9">
                    <div className="text-center mb-4">
                        <div className="avatar bg-secondary rounded-circle mb-2"></div>
                        <h1 className="h5">Sign in</h1>
                    </div>
                    <form noValidate onSubmit={signIn}>
                        <div className="mb-3">
                            <label htmlFor="email" className="form-label">Email Address</label>
                            <input
                                type="email"
                                className="form-control"
                                id="email"
                                name="email"
                                required
                                autoFocus
                                value={signInData.email}
                                onChange={onChange}
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="password" className="form-label">Password</label>
                            <input
                                type="password"
                                className="form-control"
                                id="password"
                                name="password"
                                required
                                value={signInData.password}
                                onChange={onChange}
                            />
                        </div>
                        <button
                            type="submit"
                            className="btn btn-primary w-100 mb-3"
                        >
                            Sign In
                        </button>
                        <button
                            type="button"
                            className="btn btn-danger w-100 mb-3 d-flex align-items-center justify-content-center"
                            onClick={() => {
                                let REDIRET_URI = window.location.href.split('/').slice(0, 3).join('/') + '/handler';
                                window.location.href = `${url}/auth/google?url=${REDIRET_URI}`
                            }}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-google" viewBox="0 0 16 16" className='mb-0 me-2 mt-1'>
                                <path d="M15.545 6.558a9.4 9.4 0 0 1 .139 1.626c0 2.434-.87 4.492-2.384 5.885h.002C11.978 15.292 10.158 16 8 16A8 8 0 1 1 8 0a7.7 7.7 0 0 1 5.352 2.082l-2.284 2.284A4.35 4.35 0 0 0 8 3.166c-2.087 0-3.86 1.408-4.492 3.304a4.8 4.8 0 0 0 0 3.063h.003c.635 1.893 2.405 3.301 4.492 3.301 1.078 0 2.004-.276 2.722-.764h-.003a3.7 3.7 0 0 0 1.599-2.431H8v-3.08z" />
                            </svg>
                            Continue with Google
                        </button>
                        <div className="text-center">
                            <Link to="/forgotpassword">Forgot password?</Link>
                        </div>
                        <div className="text-center">
                            <Link to="/signup">Don't have an account? Sign up</Link>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
