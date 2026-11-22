
import { useState } from "react";

import {
    Link,
    useNavigate
} from "react-router-dom";

import Input
    from "../components/Input";

import Button
    from "../components/Button";

import api
    from "../api/axios";

import {
    analytics
} from "../analytics";


export default function Register() {

    const navigate =
        useNavigate();


    const [name, setName] =
        useState("");

    const [email, setEmail] =
        useState("");

    const [marketingConsent, setMarketingConsent] =
    useState(false);

    const [password, setPassword] =
        useState("");

    const [
        passwordConfirmation,
        setPasswordConfirmation
    ] = useState("");


    const [loading, setLoading] =
        useState(false);

    const [error, setError] =
        useState("");


    async function handleRegister(event) {

        event.preventDefault();

        setError("");

        setLoading(true);

        try {

            await api.get(
                "/sanctum/csrf-cookie"
            );


          const response =
    await api.post(
        "/api/register",
        {
            name,
            email,
            password,
            password_confirmation:
                passwordConfirmation,
            marketing_emails_consent:
                marketingConsent
        }
    );


            console.log(
                "REGISTER SUCCESS:",
                response.data
            );

            analytics.userRegistered();


            navigate(
                "/login"
            );

        } catch (error) {

            console.error(
                "REGISTER ERROR:",
                error.response?.data ||
                error.message
            );


        const data =
    error.response?.data;

console.log("REGISTER STATUS:", error.response?.status);
console.log("REGISTER RESPONSE:", data);
console.log("REGISTER FULL ERROR:", error);


            if (data?.errors) {

                const firstError =
                    Object.values(
                        data.errors
                    )[0]?.[0];


                setError(
                    firstError ||
                    "Registration failed."
                );

            } else {

                setError(
                    data?.message ||
                    "Registration failed."
                );

            }

        } finally {

            setLoading(false);

        }

    }


    return (

        <div className="auth-page">

            <div className="auth-card">

                <h1>
                    Create Account
                </h1>

                <p>
                    Create your account and start
                    building AI-powered real estate funnels.
                </p>


                {error && (

                    <div
                        className="auth-error"
                        role="alert"
                    >
                        {error}
                    </div>

                )}


                <form
                    className="auth-form"
                    onSubmit={handleRegister}
                >

                    <div className="auth-form-group">

                        <Input
                            label="Name"
                            type="text"
                            placeholder="Enter your name"
                            value={name}
                            onChange={(event) =>
                                setName(
                                    event.target.value
                                )
                            }
                            required
                            disabled={loading}
                        />

                    </div>


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
                            placeholder="Create a password"
                            value={password}
                            onChange={(event) =>
                                setPassword(
                                    event.target.value
                                )
                            }
                            minLength={8}
                            required
                            disabled={loading}
                        />

                    </div>


                    <div className="auth-form-group">

                        <Input
                            label="Confirm Password"
                            type="password"
                            placeholder="Confirm your password"
                            value={passwordConfirmation}
                            onChange={(event) =>
                                setPasswordConfirmation(
                                    event.target.value
                                )
                            }
                            minLength={8}
                            required
                            disabled={loading}
                        />

                    </div>


                    <div className="marketing-consent">
    <label>
        <input
            type="checkbox"
            checked={marketingConsent}
            onChange={(event) =>
                setMarketingConsent(event.target.checked)
            }
            disabled={loading}
        />

        <span>
            I agree to receive promotional emails from
            BuildFunnelsAI about product features, tips,
            and offers. I understand that I can unsubscribe
            at any time.
        </span>
    </label>
</div>


                    <Button
                        text={
                            loading
                                ? "Creating Account..."
                                : "Create Account"
                        }
                        type="submit"
                        loading={loading}
                        fullWidth
                    />

                </form>


                <div className="auth-footer">

                    Already have an account?{" "}

                    <Link to="/login">
                        Log in
                    </Link>

                </div>

            </div>

        </div>

    );

}

