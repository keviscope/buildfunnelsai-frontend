import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useRef,
    useState
} from "react";

import Toast from "../components/Toast";


const ToastContext = createContext(null);


export function ToastProvider({ children }) {

    const [toasts, setToasts] = useState([]);

    const timersRef = useRef(new Map());


    /* =====================================================
     * HIDE TOAST
     * ===================================================== */

    const hideToast = useCallback((id) => {

        setToasts(previous =>
            previous.filter(
                toast => toast.id !== id
            )
        );


        const timer =
            timersRef.current.get(id);


        if (timer) {

            window.clearTimeout(timer);

            timersRef.current.delete(id);
        }

    }, []);


    /* =====================================================
     * SHOW TOAST
     * ===================================================== */

    const showToast = useCallback(
        (
            message,
            type = "info",
            duration = 4000
        ) => {

            if (!message) {
                return null;
            }


            const id =
                Date.now() +
                Math.random();


            setToasts(previous => [
                ...previous,
                {
                    id,
                    message,
                    type
                }
            ]);


            if (
                duration !== null &&
                duration > 0
            ) {

                const timer =
                    window.setTimeout(() => {

                        hideToast(id);

                    }, duration);


                timersRef.current.set(
                    id,
                    timer
                );
            }


            return id;
        },
        [hideToast]
    );


    /* =====================================================
     * CENTRAL AXIOS ERROR LISTENER
     * ===================================================== */

    useEffect(() => {

        /*
         * Prevent the same API error from creating multiple
         * visually identical Toasts when both Axios and a
         * component-level catch handler report it.
         */
        let lastMessage = "";
        let lastTimestamp = 0;


        function handleApiError(event) {

            const detail =
                event?.detail;


            if (!detail?.message) {
                return;
            }


            const now =
                Date.now();


            /*
             * Deduplicate identical errors that arrive
             * within one second.
             */
            if (
                detail.message === lastMessage &&
                now - lastTimestamp < 1000
            ) {
                return;
            }


            lastMessage =
                detail.message;


            lastTimestamp =
                now;


            showToast(
                detail.message,
                detail.type || "error"
            );
        }


        window.addEventListener(
            "app:api-error",
            handleApiError
        );


        return () => {

            window.removeEventListener(
                "app:api-error",
                handleApiError
            );

        };

    }, [showToast]);


    /* =====================================================
     * CLEAN UP TIMERS
     * ===================================================== */

    useEffect(() => {

        return () => {

            timersRef.current.forEach(
                timer => {
                    window.clearTimeout(timer);
                }
            );


            timersRef.current.clear();

        };

    }, []);


    /* =====================================================
     * PROVIDER
     * ===================================================== */

    return (
        <ToastContext.Provider
            value={{
                showToast,
                hideToast
            }}
        >

            {children}


            <div
                className="toast-container"
                aria-label="Notifications"
            >

                {toasts.map(toast => (

                    <Toast
                        key={toast.id}
                        message={toast.message}
                        type={toast.type}
                        onClose={() =>
                            hideToast(toast.id)
                        }
                    />

                ))}

            </div>

        </ToastContext.Provider>
    );
}


/* =========================================================
 * USE TOAST
 * ========================================================= */

export function useToast() {

    const context =
        useContext(ToastContext);


    if (!context) {

        throw new Error(
            "useToast must be used inside ToastProvider."
        );

    }


    return context;
}
