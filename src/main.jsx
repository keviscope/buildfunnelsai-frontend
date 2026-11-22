import {
    StrictMode
} from "react";

import {
    createRoot
} from "react-dom/client";

import {
    BrowserRouter
} from "react-router-dom";

import posthog from "posthog-js";

import FunnelProvider
    from "./context/FunnelProvider";

import {
    AuthProvider
} from "./context/AuthContext";

import {
    ToastProvider
} from "./context/ToastContext";

import ErrorBoundary
    from "./components/ErrorBoundary";

import PageViewTracker
    from "./components/PageViewTracker";

import "./index.css";

import App from "./App.jsx";


// =====================================================
// POSTHOG INITIALIZATION
// =====================================================

posthog.init(
    import.meta.env.VITE_POSTHOG_KEY,
    {
        api_host: import.meta.env.VITE_POSTHOG_HOST,
        capture_pageview: false,
    }
);


// =====================================================
// REACT APPLICATION
// =====================================================

createRoot(
    document.getElementById("root")
).render(

    <StrictMode>

        <BrowserRouter>

            <PageViewTracker />

            <ErrorBoundary>

                <AuthProvider>

                    <ToastProvider>

                        <FunnelProvider>

                            <App />

                        </FunnelProvider>

                    </ToastProvider>

                </AuthProvider>

            </ErrorBoundary>

        </BrowserRouter>

    </StrictMode>

);