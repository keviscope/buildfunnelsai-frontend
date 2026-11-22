import { useState } from "react";
import { Link } from "react-router-dom";
import Input from "../components/Input";
import Button from "../components/Button";
import api from "../api/axios";

export default function ForgotPassword() {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    async function handleForgotPassword(event) {
        event.preventDefault();

        setError("");
        setSuccess("");
        setLoading(true);

        try {
            const response = await api.post(
                "/api/forgot-password",
                {
                    email,
                },
                {
                    /*
                     * Password recovery is a public authentication flow.
                     * It does not require an existing login session.
                     */
                    skipAuthRedirect: true,
                    skipGlobalToast: true,
                }
            );

            setSuccess(
                response.data?.message ||
                    "If an account exists with that email address, a password reset link has been sent."
            );

            setEmail("");
        } catch (error) {
            console.error(
                "FORGOT PASSWORD ERROR:",
                error.response?.data || error.message
            );

            const data = error.response?.data;

            if (data?.errors) {
                const firstError = Object.values(data.errors)[0]?.[0];

                setError(
                    firstError ||
                        "Unable to send the password reset link."
                );
            } else {
                setError(
                    data?.message ||
                        "Unable to send the password reset link. Please try again."
                );
            }
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="auth-page">
            <div className="auth-card">
                <h1>Forgot Password?</h1>

                <p>
                    Enter the email address associated with your
                    Funnel AI Builder account and we'll send you a
                    password reset link.
                </p>

                {error && (
                    <div
                        style={{
                            color: "red",
                            marginBottom: "15px",
                        }}
                    >
                        {error}
                    </div>
                )}

                {success && (
                    <div
                        style={{
                            color: "green",
                            marginBottom: "15px",
                        }}
                    >
                        {success}
                    </div>
                )}

                {!success && (
                    <form onSubmit={handleForgotPassword}>
                        <Input
                            label="Email Address"
                            type="email"
                            value={email}
                            onChange={(event) =>
                                setEmail(event.target.value)
                            }
                            placeholder="Enter your email address"
                            required
                            autoComplete="email"
                        />

                        <Button
                            type="submit"
                            disabled={loading}
                            text={
                                loading
                                    ? "Sending..."
                                    : "Send Reset Link"
                            }
                        />
                    </form>
                )}

                {success && (
                    <p>
                        Check your inbox and spam folder for the
                        password reset email.
                    </p>
                )}

                <p>
                    Remember your password?{" "}
                    <Link to="/login">
                        Back to Login
                    </Link>
                </p>
            </div>
        </div>
    );
}