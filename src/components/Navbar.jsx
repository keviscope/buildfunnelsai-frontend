import {
    useEffect,
    useRef,
    useState
} from "react";

import {
    NavLink,
    useNavigate
} from "react-router-dom";

import {
    useAuth
} from "../context/AuthContext";


export default function Navbar() {

    const {
        user,
        logout
    } = useAuth();

    const navigate =
        useNavigate();


    const [
        mobileMenuOpen,
        setMobileMenuOpen
    ] = useState(false);


    const [
        userMenuOpen,
        setUserMenuOpen
    ] = useState(false);


    const userMenuRef =
        useRef(null);


    /*
     * ---------------------------------------------------------
     * PLAN
     * ---------------------------------------------------------
     */

    const plan =
        (
            user?.plan ||
            user?.subscription_plan ||
            "free"
        )
            .toString()
            .toUpperCase();


    /*
     * ---------------------------------------------------------
     * AI CREDITS
     * ---------------------------------------------------------
     */

    const aiCreditsRemaining =
        user?.ai_credits_remaining ??
        user?.aiCreditsRemaining ??
        user?.remaining_ai_credits ??
        user?.remainingAiCredits ??
        null;


    const aiCreditsLimit =
        user?.ai_credits_limit ??
        user?.aiCreditsLimit ??
        user?.ai_credit_limit ??
        user?.aiCreditLimit ??
        null;


    /*
     * ---------------------------------------------------------
     * CLOSE USER MENU WHEN CLICKING OUTSIDE
     * ---------------------------------------------------------
     */

    useEffect(() => {

        function handleOutsideClick(
            event
        ) {

            if (
                userMenuRef.current &&
                !userMenuRef.current.contains(
                    event.target
                )
            ) {

                setUserMenuOpen(
                    false
                );

            }

        }


        if (userMenuOpen) {

            document.addEventListener(
                "mousedown",
                handleOutsideClick
            );

        }


        return () => {

            document.removeEventListener(
                "mousedown",
                handleOutsideClick
            );

        };

    }, [
        userMenuOpen
    ]);


    /*
     * ---------------------------------------------------------
     * HELPERS
     * ---------------------------------------------------------
     */

    function closeMobileMenu() {

        setMobileMenuOpen(
            false
        );

    }


    function closeUserMenu() {

        setUserMenuOpen(
            false
        );

    }


    async function handleLogout() {

        closeMobileMenu();

        closeUserMenu();

        await logout();

        navigate(
            "/login"
        );

    }


    function goToDashboard() {

        closeMobileMenu();

        closeUserMenu();

        navigate(
            "/dashboard"
        );

    }


    function goToAccount() {

        closeUserMenu();

        navigate(
            "/account"
        );

    }


    function goToPricing() {

        closeUserMenu();

        navigate(
            "/pricing"
        );

    }


    const userInitial =
        user?.name
            ?.charAt(0)
            ?.toUpperCase() ||
        "U";


    return (

        <>

            {/* =================================================
                DESKTOP / MAIN NAVBAR
            ================================================= */}

            <nav className="app-navbar">

                <div className="app-navbar-inner">


                    {/* =================================================
                        BRAND
                    ================================================= */}

                    <NavLink
                        to={
                            user
                                ? "/dashboard"
                                : "/"
                        }
                        className="app-navbar-brand"
                        onClick={
                            closeMobileMenu
                        }
                    >

                      <span className="app-navbar-brand-mark">
    <img
        src="/logo.png"
        alt="BuildFunnelsAI logo"
        className="app-navbar-logo"
    />
</span>

                        <span>
                            Funnel AI Builder
                        </span>

                    </NavLink>


                    {/* =================================================
                        DESKTOP ACCOUNT ACTIONS
                    ================================================= */}

                    <div className="app-navbar-actions">

                        {user ? (

                            <>

                                {/* AI CREDITS */}

                                {aiCreditsRemaining !== null && (

                                    <div className="app-navbar-credit">

                                        <span>
                                            ⚡
                                        </span>

                                        <strong>
                                            {aiCreditsRemaining}
                                        </strong>

                                        {aiCreditsLimit !== null && (
                                            <small>
                                                / {aiCreditsLimit}
                                            </small>
                                        )}

                                        <span>
                                            credits
                                        </span>

                                    </div>

                                )}


                                {/* PLAN */}

                                <button
                                    type="button"
                                    className="app-navbar-plan-badge"
                                    onClick={
                                        goToPricing
                                    }
                                >

                                    {plan}

                                </button>


                                {/* USER MENU */}

                                <div
                                    className="app-navbar-user-menu"
                                    ref={
                                        userMenuRef
                                    }
                                >

                                    <button
                                        type="button"
                                        className="app-navbar-user"
                                        onClick={() =>
                                            setUserMenuOpen(
                                                previous =>
                                                    !previous
                                            )
                                        }
                                        aria-expanded={
                                            userMenuOpen
                                        }
                                        aria-haspopup="menu"
                                    >

                                        <span className="app-navbar-avatar">

                                            {userInitial}

                                        </span>

                                        <span className="app-navbar-user-name">

                                            {
                                                user.name ||
                                                "Account"
                                            }

                                        </span>

                                        <span
                                            className={
                                                `app-navbar-user-chevron${
                                                    userMenuOpen
                                                        ? " app-navbar-user-chevron-open"
                                                        : ""
                                                }`
                                            }
                                        >
                                            ▾
                                        </span>

                                    </button>


                                    {userMenuOpen && (

                                        <div
                                            className="app-navbar-user-dropdown"
                                            role="menu"
                                        >

                                            <div className="app-navbar-user-dropdown-header">

                                                <span className="app-navbar-dropdown-avatar">
                                                    {userInitial}
                                                </span>

                                                <div>

                                                    <strong>
                                                        {
                                                            user.name ||
                                                            "Account"
                                                        }
                                                    </strong>

                                                    <small>
                                                        {
                                                            user.email ||
                                                            ""
                                                        }
                                                    </small>

                                                </div>

                                            </div>


                                            <div className="app-navbar-user-dropdown-plan">

                                                <span>
                                                    Current plan
                                                </span>

                                                <strong>
                                                    {plan}
                                                </strong>

                                            </div>


                                            <div className="app-navbar-user-dropdown-divider" />


                                            <button
                                                type="button"
                                                className="app-navbar-dropdown-item"
                                                onClick={
                                                    goToAccount
                                                }
                                                role="menuitem"
                                            >
                                                Account
                                            </button>


                                            <button
                                                type="button"
                                                className="app-navbar-dropdown-item"
                                                onClick={
                                                    goToPricing
                                                }
                                                role="menuitem"
                                            >
                                                Pricing / Upgrade
                                            </button>


                                            <div className="app-navbar-user-dropdown-divider" />


                                            <button
                                                type="button"
                                                className="app-navbar-dropdown-logout"
                                                onClick={
                                                    handleLogout
                                                }
                                                role="menuitem"
                                            >
                                                Logout
                                            </button>

                                        </div>

                                    )}

                                </div>

                            </>

                        ) : (

                            <>

                                <NavLink
                                    to="/login"
                                    className="app-navbar-link"
                                >
                                    Login
                                </NavLink>


                                <NavLink
                                    to="/register"
                                    className="app-navbar-register"
                                >
                                    Register
                                </NavLink>

                            </>

                        )}

                    </div>


                    {/* =================================================
                        MOBILE MENU BUTTON
                    ================================================= */}

                    {user && (

                        <button
                            type="button"
                            className="app-navbar-mobile-button"
                            onClick={() =>
                                setMobileMenuOpen(
                                    previous =>
                                        !previous
                                )
                            }
                            aria-label={
                                mobileMenuOpen
                                    ? "Close navigation menu"
                                    : "Open navigation menu"
                            }
                            aria-expanded={
                                mobileMenuOpen
                            }
                        >

                            <span />
                            <span />
                            <span />

                        </button>

                    )}

                </div>

            </nav>


            {/* =================================================
                MOBILE NAVIGATION
            ================================================= */}

            {user && mobileMenuOpen && (

                <>

                    <button
                        type="button"
                        className="app-mobile-nav-overlay"
                        aria-label="Close navigation menu"
                        onClick={
                            closeMobileMenu
                        }
                    />


                    <div className="app-mobile-nav">

                        <div className="app-mobile-nav-header">

                            <div>

                                <strong>
                                    Navigation
                                </strong>

                                <span>
                                    Funnel AI Builder
                                </span>

                            </div>


                            <button
                                type="button"
                                className="app-mobile-nav-close"
                                onClick={
                                    closeMobileMenu
                                }
                                aria-label="Close navigation menu"
                            >
                                ×
                            </button>

                        </div>


                        {/* MOBILE USER SUMMARY */}

                        <div className="app-mobile-user-summary">

                            <span className="app-mobile-user-avatar">
                                {userInitial}
                            </span>

                            <div>

                                <strong>
                                    {
                                        user.name ||
                                        "Account"
                                    }
                                </strong>

                                <span>
                                    {plan} plan
                                </span>

                            </div>

                        </div>


                        {aiCreditsRemaining !== null && (

                            <div className="app-mobile-credit-summary">

                                <span>
                                    ⚡
                                </span>

                                <strong>
                                    {aiCreditsRemaining}
                                </strong>

                                {aiCreditsLimit !== null && (
                                    <small>
                                        / {aiCreditsLimit}
                                    </small>
                                )}

                                <span>
                                    AI credits
                                </span>

                            </div>

                        )}


                        <nav
                            className="app-mobile-nav-links"
                            aria-label="Mobile navigation"
                        >

                            <NavLink
                                to="/dashboard"
                                end
                                className={({ isActive }) =>
                                    isActive
                                        ? "app-mobile-nav-link app-mobile-nav-link-active"
                                        : "app-mobile-nav-link"
                                }
                                onClick={
                                    closeMobileMenu
                                }
                            >
                                Dashboard
                            </NavLink>


                            <button
                                type="button"
                                className="app-mobile-nav-link app-mobile-nav-link-button"
                                onClick={() => {

                                    closeMobileMenu();

                                    navigate(
                                        "/dashboard#create-funnel"
                                    );

                                    window.setTimeout(() => {

                                        window.dispatchEvent(
                                            new CustomEvent(
                                                "funnel-ai-create-funnel"
                                            )
                                        );

                                    }, 100);

                                }}
                            >
                                Create Funnel
                            </button>


                            <NavLink
                                to="/history"
                                className={({ isActive }) =>
                                    isActive
                                        ? "app-mobile-nav-link app-mobile-nav-link-active"
                                        : "app-mobile-nav-link"
                                }
                                onClick={
                                    closeMobileMenu
                                }
                            >
                                Funnel History
                            </NavLink>


                            <NavLink
                                to="/pricing"
                                className={({ isActive }) =>
                                    isActive
                                        ? "app-mobile-nav-link app-mobile-nav-link-active"
                                        : "app-mobile-nav-link"
                                }
                                onClick={
                                    closeMobileMenu
                                }
                            >
                                Pricing / Upgrade
                            </NavLink>


                            <NavLink
                                to="/account"
                                className={({ isActive }) =>
                                    isActive
                                        ? "app-mobile-nav-link app-mobile-nav-link-active"
                                        : "app-mobile-nav-link"
                                }
                                onClick={
                                    closeMobileMenu
                                }
                            >
                                Account
                            </NavLink>

                        </nav>


                        <div className="app-mobile-nav-divider" />


                        <button
                            type="button"
                            className="app-mobile-generate-button"
                            onClick={
                                goToDashboard
                            }
                        >

                            <span className="app-mobile-generate-icon">
                                +
                            </span>

                            <span>
                                Create Funnel
                            </span>

                        </button>


                        <button
                            type="button"
                            className="app-mobile-logout-button"
                            onClick={
                                handleLogout
                            }
                        >
                            Logout
                        </button>

                    </div>

                </>

            )}

        </>

    );

}