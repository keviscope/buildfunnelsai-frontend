import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute() {

    const { user, loading } = useAuth();

    // Don't decide anything until we know
    // whether the user is authenticated.
    if (loading) {
        return <p>Loading...</p>;
    }

    // Not authenticated ? go to login
    if (!user) {
        return <Navigate to="/login" replace />;
    }

    // Authenticated ? render the requested page
    return <Outlet />;
}