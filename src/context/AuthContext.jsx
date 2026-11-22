import {
    createContext,
    useContext,
    useEffect,
    useState
} from "react";

import api from "../api/axios";

import {
    analytics
} from "../analytics";


const AuthContext = createContext();


export function AuthProvider({ children }) {

    const [user, setUser] =
        useState(null);

    const [loading, setLoading] =
        useState(true);


    async function fetchUser() {

        try {

            const response =
                await api.get(
                    "/api/user",
                    {
                        /*
                         * Checking whether a user is already
                         * logged in is allowed to fail silently.
                         *
                         * A 401 here simply means:
                         * "There is currently no logged-in user."
                         *
                         * It should NOT trigger the global
                         * "session expired" notification.
                         */
                        skipAuthRedirect: true,
                        skipGlobalToast: true,
                    }
                );

            const authenticatedUser =
                response.data.user;


            setUser(
                authenticatedUser
            );


            /*
             * Identify the user in PostHog.
             *
             * This is important when the application
             * is reopened and the user is already logged in.
             */
            if (
                authenticatedUser?.id
            ) {

                analytics.identify(
                    authenticatedUser.id,
                    {
                        plan:
                            authenticatedUser.plan
                    }
                );

            }


            return authenticatedUser;

        } catch (error) {

            /*
             * Not being authenticated is normal when the
             * application is first opened on public pages.
             */
            setUser(null);

            return null;

        } finally {

            setLoading(false);

        }

    }





    

    async function login(
        email,
        password
    ) {

        /*
         * Get CSRF cookie first.
         */
        await api.get(
            "/sanctum/csrf-cookie"
        );


        /*
         * Login to Laravel.
         */
        const response =
            await api.post(
                "/api/login",
                {
                    email,
                    password,
                }
            );


        /*
         * Get the authenticated user.
         */
        const userResponse =
            await api.get(
                "/api/user"
            );


        const authenticatedUser =
            userResponse.data.user;


        /*
         * Update React authentication state.
         */
        setUser(
            authenticatedUser
        );


        /*
         * Identify the authenticated user
         * in PostHog.
         */
        if (
            authenticatedUser?.id
        ) {

            analytics.identify(
                authenticatedUser.id,
                {
                    plan:
                        authenticatedUser.plan
                }
            );

        }


        /*
         * Record successful login.
         */
        analytics.loginCompleted({
            plan:
                authenticatedUser?.plan
        });


        return response.data;

    }












    async function logout() {

        try {

            await api.post(
                "/api/logout"
            );


            /*
             * Record successful logout.
             */
            analytics.logoutCompleted();

        } catch (error) {

            console.error(
                "LOGOUT ERROR:",
                error.response?.data ||
                error.message
            );

        } finally {

            /*
             * Clear React authentication state.
             */
            setUser(null);


            /*
             * Reset PostHog identity.
             *
             * The next visitor using this browser
             * should not be associated with this user.
             */
            analytics.reset();

        }

    }












    

    useEffect(() => {

        fetchUser();

    }, []);


    return (

        <AuthContext.Provider
            value={{
                user,
                setUser,
                loading,
                login,
                logout,
                fetchUser
            }}
        >

            {children}

        </AuthContext.Provider>

    );

}


export function useAuth() {

    return useContext(
        AuthContext
    );

}