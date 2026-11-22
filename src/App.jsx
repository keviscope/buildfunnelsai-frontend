import { Routes, Route } from "react-router-dom";

import Landing from "./pages/Landing";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Loading from "./pages/Loading";
import FunnelResult from "./pages/FunnelResult";
import FunnelHistory from "./pages/FunnelHistory";
import Account from "./pages/Account";
import SharedFunnel from "./pages/SharedFunnel";
import EmailVerified from "./pages/EmailVerified";
import ProtectedRoute from "./components/ProtectedRoute";
import Pricing from "./pages/Pricing";
import PaymentVerification from "./pages/PaymentVerification";
import CreditPurchaseVerification from "./pages/CreditPurchaseVerification";
import ResetPassword from "./pages/ResetPassword";
import ForgotPassword from "./pages/ForgotPassword";
import AdminDashboard from "./pages/AdminDashboard";


function App() {

    return (
        <Routes>

            {/* =====================================================
                PUBLIC ROUTES
            ===================================================== */}

            <Route
                path="/"
                element={<Landing />}
            />

            <Route
                path="/register"
                element={<Register />}
            />

            <Route
                path="/login"
                element={<Login />}
            />

            <Route
                path="/share/:share_token"
                element={<SharedFunnel />}
            />

            <Route
                path="/email-verified"
                element={<EmailVerified />}
            />

            <Route
                path="/reset-password"
                element={<ResetPassword />}
            />

                       <Route
    path="/forgot-password"
    element={<ForgotPassword />}
/>


            {/* =====================================================
                PROTECTED ROUTES
            ===================================================== */}

            <Route element={<ProtectedRoute />}>

                <Route
                    path="/dashboard"
                    element={<Dashboard />}
                />


                <Route
    path="/admin"
    element={<AdminDashboard />}
/>



                <Route
                    path="/loading"
                    element={<Loading />}
                />

                <Route
                    path="/result/:id"
                    element={<FunnelResult />}
                />

                <Route
                    path="/history"
                    element={<FunnelHistory />}
                />

                <Route
                    path="/account"
                    element={<Account />}
                />

                <Route
                    path="/pricing"
                    element={<Pricing />}
                />

                <Route
                    path="/payment/verify"
                    element={<PaymentVerification />}
                />

                <Route
                    path="/credit-purchase/verify"
                    element={<CreditPurchaseVerification />}
                />

     

            </Route>

        </Routes>
    );
}

export default App;