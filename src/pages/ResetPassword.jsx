import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import Input from "../components/Input";
import Button from "../components/Button";
import api from "../api/axios";

export default function ResetPassword() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    const token = searchParams.get("token");
    const email = searchParams.get("email");

    const [password, setPassword] = useState("");
    const [passwordConfirmation, setPasswordConfirmation] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    async function handleResetPassword(event) {
        event.preventDefault();

        setError("");
        setSuccess("");

        if (!token || !email) {
            setError(
                "This password reset link is invalid or incomplete. Please request a new one."
            );
            return;
        }

        if (password.length < 8) {
            setError("Password must be at least 8 characters.");
            return;
        }

        if (password !== passwordConfirmation) {
            setError("Passwords do not match.");
            return;
        }

        setLoading(true);

        try {
            const response = await api.post(
                "/api/reset-password",
                {
                    token,
                    email,
                    password,
                    password_confirmation: passwordConfirmation,
                },
                {
                    /*
                     * Password reset is a public authentication flow.
                     * It must not depend on an existing login session.
                     */
                    skipAuthRedirect: true,
                    skipGlobalToast: true,
                }
            );

            setSuccess(
                response.data?.message ||
                    "Your password has been reset successfully."
            );

            setPassword("");
            setPasswordConfirmation("");

            setTimeout(() => {
                navigate("/login");
            }, 2000);
        } catch (error) {
            console.error(
                "RESET PASSWORD ERROR:",
                error.response?.data || error.message
            );

            const data = error.response?.data;

            if (data?.errors) {
                const firstError = Object.values(data.errors)[0]?.[0];

                setError(
                    firstError ||
                        "Unable to reset your password. Please try again."
                );
            } else {
                setError(
                    data?.message ||
                        "Unable to reset your password. The reset link may be invalid or expired."
                );
            }
        } finally {
            setLoading(false);
        }
    }

    if (!token || !email) {
        return (
            <div className="auth-page">
                <div className="auth-card">
                    <h1>Invalid Reset Link</h1>

                    <p>
                        This password reset link is invalid or incomplete.
                        Please request a new password reset link.
                    </p>

                    <Link to="/forgot-password">
                        Request a new reset link
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="auth-page">
            <div className="auth-card">
                <h1>Reset Password</h1>

                <p>
                    Create a new password for your Funnel AI Builder account.
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
                    <form onSubmit={handleResetPassword}>
                        <Input
                            label="New Password"
                            type="password"
                            value={password}
                            onChange={(event) =>
                                setPassword(event.target.value)
                            }
                            placeholder="Enter your new password"
                            required
                            autoComplete="new-password"
                        />

                        <Input
                            label="Confirm New Password"
                            type="password"
                            value={passwordConfirmation}
                            onChange={(event) =>
                                setPasswordConfirmation(
                                    event.target.value
                                )
                            }
                            placeholder="Confirm your new password"
                            required
                            autoComplete="new-password"
                        />

                     <Button
    type="submit"
    disabled={loading}
    text={loading ? "Resetting..." : "Reset Password"}
/>
                    </form>
                )}

                {success && (
                    <p>
                        Redirecting you to the{" "}
                        <Link to="/login">login page</Link>...
                    </p>
                )}
            </div>
        </div>
    );
}