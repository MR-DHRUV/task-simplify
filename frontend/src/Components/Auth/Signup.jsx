import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { url } from '../constants';
import Swal from 'sweetalert2';

export default function ForgotPassword() {

    const navigator = useNavigate();

    // State for the component
    const [data, setData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        otp: "",
        otpSent: false
    });

    const onChange = (e) => {
        setData({ ...data, [e.target.name]: e.target.value });
    }

    // Function to send OTP to the user's email
    const sendOtp = async () => {

        if (data.email === "") {
            Swal.fire({
                title: "Error",
                text: "Please enter your email",
                icon: "error"
            });
            return;
        }

        const response = await fetch(`${url}/auth/signup/email`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*",
            },
            mode: "cors",
            referrerPolicy: "origin-when-cross-origin",
            body: JSON.stringify({ email: data.email })
        });

        const json = await response.json();

        if (json.success === true) {
            setData({ ...data, otpSent: true });
            Swal.fire({
                title: "OTP Sent",
                text: "An OTP has been sent to your email",
                icon: "success"
            });
        } else {
            Swal.fire({
                title: "Error",
                text: json.message,
                icon: "error"
            });
        }
    }

    // Function to sign up the user
    const signUp = async (e) => {
        e.preventDefault();
        const response = await fetch(`${url}/auth/signup/email/verify`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*",
            },
            mode: "cors",
            referrerPolicy: "origin-when-cross-origin",
            body: JSON.stringify({
                name: data.firstName + " " + data.lastName,
                email: data.email,
                password: data.password,
                authcode: parseInt(data.otp),
            })
        });

        const json = await response.json();
        if (json.success === true) {
            localStorage.setItem('auth-token', json.authToken);
            navigator('/');
        } else {
            Swal.fire({
                title: "Error",
                text: json.message,
                icon: "error"
            });
        }
    }

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-lg-5 col-md-7 col-sm-9">
                    <div className="text-center mb-4">
                        <div className="avatar bg-secondary rounded-circle mb-2"></div>
                        <h1 className="h5">Sign up</h1>
                    </div>
                    <form noValidate onSubmit={signUp}>
                        <div className="row">
                            <div className="col-6 mb-3">
                                <label htmlFor="firstName" className="form-label">First Name</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="firstName"
                                    name="firstName"
                                    required
                                    autoFocus
                                    value={data.firstName}
                                    onChange={onChange}
                                />
                            </div>
                            <div className="col-6 mb-3">
                                <label htmlFor="lastName" className="form-label">Last Name</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="lastName"
                                    name="lastName"
                                    required
                                    value={data.lastName}
                                    onChange={onChange}
                                />
                            </div>
                        </div>
                        <div className="mb-3">
                            <label htmlFor="email" className="form-label">Email Address</label>
                            <input
                                type="email"
                                className="form-control"
                                id="email"
                                name="email"
                                required
                                autoFocus
                                value={data.email}
                                onChange={onChange}
                            />
                        </div>
                        <div className="row">
                            <div className="col-8 mb-3">
                                <label htmlFor="otp" className="form-label">Verification Code</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="otp"
                                    name="otp"
                                    required
                                    disabled={!data.otpSent}
                                    onChange={onChange}
                                />
                            </div>
                            <div className="col-4 d-flex align-items-end mb-3">
                                <button
                                    type="button"
                                    className="btn btn-primary w-100"
                                    onClick={sendOtp}
                                >
                                    Send OTP
                                </button>
                            </div>
                        </div>
                        <div className="mb-3">
                            <label htmlFor="password" className="form-label">Password</label>
                            <input
                                type="password"
                                className="form-control"
                                id="password"
                                name="password"
                                required
                                value={data.password}
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
                            onClick={
                                () => {
                                    let REDIRET_URI = window.location.href.split('/').slice(0, 3).join('/') + '/handler';
                                    window.location.href = `${url}/auth/google?url=${REDIRET_URI}`
                                }
                            }
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
                            <Link to="/signin">Already have an account? Sign in</Link>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}