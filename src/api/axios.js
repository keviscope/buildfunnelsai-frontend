
import axios from "axios";

const api = axios.create({
    baseURL: "https://api.buildfunnelsai.com",

    /*
     * Laravel Sanctum / session authentication.
     */
    withCredentials: true,

    /*
     * Automatically read the XSRF-TOKEN cookie and
     * send it as the X-XSRF-TOKEN header.
     */
    withXSRFToken: true,

    /*
     * Prevent requests from hanging forever.
     *
     * Individual requests can override this with their
     * own timeout when necessary.
     */
    timeout: 15000,

    headers: {
        Accept: "application/json"
    }
});


/* =========================================================
 * ERROR MESSAGE DEFINITIONS
 * ========================================================= */

const ERROR_MESSAGES = {
    401: "Your session has expired. Please log in again.",

    403: "You don't have permission to perform this action.",

    404: "The requested resource could not be found.",

    419: "Your session security token has expired. Please refresh and try again.",

    422: "Please check the information you entered and try again.",

    429: "Too many requests. Please wait a moment and try again.",

    500: "Something went wrong on the server. Please try again.",

    502: "An upstream service is temporarily unavailable. Please try again shortly.",

    503: "The service is temporarily unavailable. Please try again shortly.",

    504: "The server took too long to respond. Please try again.",

    NETWORK:
        "Unable to connect to Funnel AI. Please check your connection and try again.",

    TIMEOUT:
        "The request took too long to complete. Please try again."
};


/* =========================================================
 * ERROR TYPE
 * ========================================================= */

function getErrorType(error) {

    if (!error) {
        return "UNKNOWN";
    }


    /*
     * Axios timeout.
     *
     * ECONNABORTED is Axios' common timeout code.
     * ETIMEDOUT is also handled for compatibility.
     */
    if (
        error.code === "ECONNABORTED" ||
        error.code === "ETIMEDOUT"
    ) {
        return "TIMEOUT";
    }


    /*
     * No response means the browser could not receive
     * a response from Laravel.
     *
     * This covers:
     * - Laravel offline
     * - internet disconnected
     * - DNS failure
     * - connection refused
     * - browser/network interruption
     */
    if (!error.response) {
        return "NETWORK";
    }


    return String(error.response.status);
}


/* =========================================================
 * EXTRACT BACKEND MESSAGE
 * ========================================================= */

function getBackendMessage(error) {

    const data = error?.response?.data;


    /*
     * Normal Laravel JSON response:
     *
     * {
     *     "message": "..."
     * }
     */
    if (
        data &&
        typeof data === "object" &&
        typeof data.message === "string" &&
        data.message.trim()
    ) {
        return data.message.trim();
    }


    /*
     * Some Laravel validation responses can contain
     * an error string.
     */
    if (
        data &&
        typeof data === "object" &&
        typeof data.error === "string" &&
        data.error.trim()
    ) {
        return data.error.trim();
    }


    return null;
}


/* =========================================================
 * USER-FACING ERROR MESSAGE
 * ========================================================= */

export function getApiErrorMessage(
    error,
    fallback = "Something went wrong. Please try again."
) {

    if (!error) {
        return fallback;
    }


    /*
     * If another layer has already assigned a user-friendly
     * message, preserve it.
     */
    if (
        typeof error.userMessage === "string" &&
        error.userMessage.trim()
    ) {
        return error.userMessage.trim();
    }


    const errorType = getErrorType(error);


    /*
     * Network error.
     */
    if (errorType === "NETWORK") {
        return ERROR_MESSAGES.NETWORK;
    }


    /*
     * Timeout.
     */
    if (errorType === "TIMEOUT") {
        return ERROR_MESSAGES.TIMEOUT;
    }


    /*
     * HTTP status.
     */
    const status = Number(errorType);


    /*
     * Prefer an intentional backend message when one exists.
     *
     * This is important for things such as:
     *
     * 429:
     * "You have used all your AI credits for this month."
     *
     * 403:
     * "You don't have permission to access this funnel."
     *
     * 404:
     * "This funnel could not be found."
     *
     * etc.
     */
    const backendMessage = getBackendMessage(error);

    if (backendMessage) {
        return backendMessage;
    }


    if (ERROR_MESSAGES[status]) {
        return ERROR_MESSAGES[status];
    }


    return fallback;
}


/* =========================================================
 * TOAST TYPE
 * ========================================================= */

export function getApiErrorToastType(error) {

    if (!error) {
        return "error";
    }


    const errorType = getErrorType(error);


    /*
     * Network and server/provider failures are errors.
     */
    if (
        errorType === "NETWORK" ||
        errorType === "TIMEOUT"
    ) {
        return "error";
    }


    const status = Number(errorType);


    /*
     * Authentication/session problems.
     */
    if (
        status === 401 ||
        status === 419
    ) {
        return "warning";
    }


    /*
     * Validation problems.
     */
    if (status === 422) {
        return "warning";
    }


    /*
     * Credit/rate-limit problems.
     */
    if (status === 429) {
        return "warning";
    }


    return "error";
}


/* =========================================================
 * GLOBAL TOAST EVENT
 * ========================================================= */

function emitApiErrorToast(error) {

    /*
     * Axios is outside React, so it cannot directly call
     * useToast().
     *
     * Instead we emit a browser event.
     *
     * ToastProvider listens for this event and displays
     * the notification through the existing Toast system.
     */
    if (typeof window === "undefined") {
        return;
    }


    const message = getApiErrorMessage(error);

    const type = getApiErrorToastType(error);


    window.dispatchEvent(
        new CustomEvent("app:api-error", {
            detail: {
                message,
                type,
                status: error?.response?.status ?? null,
                code: error?.code ?? null,
                errorCode:
                    error?.response?.data?.error_code ?? null
            }
        })
    );
}


/* =========================================================
 * SESSION REDIRECTION
 * ========================================================= */

function handleAuthenticationFailure(error) {

    if (typeof window === "undefined") {
        return;
    }


    const status = error?.response?.status;


    /*
     * Do not automatically redirect on 419.
     *
     * A CSRF failure can often be fixed by refreshing the
     * current page and obtaining a fresh token.
     */
    if (status === 419) {
        return;
    }


    /*
     * 401 means the authenticated session is no longer valid.
     *
     * Avoid redirect loops when already on login/register.
     */
    if (status === 401) {

        const currentPath = window.location.pathname;


      const publicPaths = [
    "/",
    "/login",
    "/register",
    "/forgot-password",
    "/reset-password",
    "/email-verified"
];


        const isPublicPath =
            publicPaths.includes(currentPath);


        if (!isPublicPath) {

            window.setTimeout(() => {

                /*
                 * Preserve the page the user was attempting
                 * to access.
                 */
                const currentUrl =
                    window.location.pathname +
                    window.location.search;


                const loginUrl =
                    `/login?redirect=${encodeURIComponent(
                        currentUrl
                    )}`;


                window.location.assign(loginUrl);

            }, 400);
        }
    }
}


/* =========================================================
 * RESPONSE INTERCEPTOR
 * ========================================================= */

api.interceptors.response.use(

    /*
     * Successful response.
     */
    response => response,


    /*
     * Failed response.
     */
    error => {

        /*
         * Attach a consistent error classification to
         * the original Axios error.
         *
         * Existing components can therefore do:
         *
         * catch (error) {
         *     showToast(error.userMessage, "error");
         * }
         */
        error.userMessage =
            getApiErrorMessage(error);


        error.userErrorType =
            getErrorType(error);


        error.userToastType =
            getApiErrorToastType(error);


        error.userStatus =
            error?.response?.status ?? null;


        error.userErrorCode =
            error?.response?.data?.error_code ?? null;


    /*
 * Session/authentication handling.
 */
if (!error.config?.skipAuthRedirect) {
    handleAuthenticationFailure(error);
}

/*
 * Tell the existing Toast system about the error.
 */
if (!error.config?.skipGlobalToast) {
    emitApiErrorToast(error);
}


        /*
         * IMPORTANT:
         *
         * Always reject the original Axios error.
         *
         * This means existing component-level catch()
         * blocks continue to work normally.
         */
        return Promise.reject(error);
    }
);


export default api;

