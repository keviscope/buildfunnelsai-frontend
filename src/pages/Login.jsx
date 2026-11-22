import { useState } from "react";

import Button
    from "../components/Button";

import Input
    from "../components/Input";

import {
    Link,
    useNavigate
} from "react-router-dom";

import {
    useAuth
} from "../context/AuthContext";

import {
    useToast
} from "../context/ToastContext";


export default function Login() {

    const [email, setEmail] =
        useState("");

    const [password, setPassword] =
        useState("");

    const [loading, setLoading] =
        useState(false);

    const {
        login
    } = useAuth();

    const navigate =
        useNavigate();

    const {
        showToast
    } = useToast();


    async function handleLogin(event) {

        event.preventDefault();

        setLoading(true);

        try {

            const data =
                await login(
                    email,
                    password
                );

            console.log(
                "LOGIN SUCCESS:",
                data
            );

            showToast(
                "Welcome back!",
                "success"
            );

            navigate(
                "/dashboard"
            );

        } catch (error) {

            console.error(
                "LOGIN ERROR:",
                error.response?.data ||
                error.message
            );

            showToast(
                error.response?.data?.message ||
                "Login failed. Please check your email and password.",
                "error"
            );

        } finally {

            setLoading(false);

        }

    }







    
    return (

        <div className="auth-page">

            <div className="auth-card">

                <h1>
                    Welcome Back
                </h1>

                <p>
                    Log in to continue building
                    your real estate funnels.
                </p>


                <form
                    className="auth-form"
                    onSubmit={handleLogin}
                >

                    <div className="auth-form-group">

                        <Input
                            label="Email"
                            type="email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(event) =>
                                setEmail(
                                    event.target.value
                                )
                            }
                            required
                            disabled={loading}
                        />

                    </div>


                    <div className="auth-form-group">

                        <Input
                            label="Password"
                            type="password"
                            placeholder="Enter your password"
                            value={password}
                            onChange={(event) =>
                                setPassword(
                                    event.target.value
                                )
                            }
                            required
                            disabled={loading}
                        />

                    </div>


                    {/* Forgot Password */}

                    <div
                        style={{
                            textAlign: "right",
                            marginTop: "-8px",
                            marginBottom: "18px"
                        }}
                    >

                        <Link to="/forgot-password">
                            Forgot Password?
                        </Link>

                    </div>


                    <Button
                        text={
                            loading
                                ? "Logging In..."
                                : "Login"
                        }
                        type="submit"
                        loading={loading}
                        fullWidth
                    />

                </form>


                <div className="auth-footer">

                    Don't have an account?{" "}

                    <Link to="/register">
                        Create one
                    </Link>

                </div>

            </div>

        </div>

    );

}