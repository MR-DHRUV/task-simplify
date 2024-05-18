import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import { url } from '../constants';

export default function SignUp() {

    const navigator = useNavigate();

    // State for the component
    const [data, setData] = useState({
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

        const response = await fetch(`${url}/auth/forgot`, {
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
    const resetPassword = async (e) => {
        e.preventDefault();
        const response = await fetch(`${url}/auth/forgot/verify`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*",
            },
            mode: "cors",
            referrerPolicy: "origin-when-cross-origin",
            body: JSON.stringify({
                email: data.email,
                password: data.password,
                authcode: parseInt(data.otp),
            })
        });

        const json = await response.json();
        if (json.success === true) {
            navigator('/signin');
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
                        <h1 className="h5">Reset Password</h1>
                    </div>
                    <form noValidate onSubmit={resetPassword}>
                        <div className="mb-3">
                            <label htmlFor="email" className="form-label">Email Address</label>
                            <input
                                type="email"
                                className="form-control"
                                id="email"
                                name="email"
                                required
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
                            <label htmlFor="password" className="form-label">New Password</label>
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
                            Reset Password
                        </button>
                        <div className="d-flex justify-content-end">
                            <Link to='/signin' className="text-decoration-none">
                                back
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
