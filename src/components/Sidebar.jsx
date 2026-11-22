import {
    useEffect,
    useState
} from "react";

import {
    NavLink,
    useLocation,
    useNavigate
} from "react-router-dom";


import {
    useAuth
} from "../context/AuthContext";


export default function Sidebar() {

    const {
        user
    } = useAuth();


    const navigate =
        useNavigate();


    const location =
        useLocation();
        

    const [
    sidebarOpen,
    setSidebarOpen
] = useState(false);


function closeSidebar() {
    setSidebarOpen(false);
}


useEffect(() => {

    setSidebarOpen(false);

}, [
    location.pathname,
    location.hash
]);


    if (!user) {

        return null;

    }


    /*
     * ---------------------------------------------------------
     * PLAN
     * ---------------------------------------------------------
     */

    const plan =
        (
            user.plan ||
            user.subscription_plan ||
            "free"
        )
            .toString()
            .toUpperCase();


    /*
     * ---------------------------------------------------------
     * AI CREDITS
     *
     * We intentionally support several possible property names
     * so this shell does not require a backend change.
     * ---------------------------------------------------------
     */

    const aiCreditsRemaining =
        user.ai_credits_remaining ??
        user.aiCreditsRemaining ??
        user.remaining_ai_credits ??
        user.remainingAiCredits ??
        null;


    const aiCreditsLimit =
        user.ai_credits_limit ??
        user.aiCreditsLimit ??
        user.ai_credit_limit ??
        user.aiCreditLimit ??
        null;


    /*
     * ---------------------------------------------------------
     * NAVIGATION HELPERS
     * ---------------------------------------------------------
     */

    function isCreateFunnelActive() {

        return (
            location.pathname === "/dashboard" &&
            location.hash === "#create-funnel"
        );

    }


    function dashboardNavClass({
        isActive
    }) {

        if (
            isActive &&
            !isCreateFunnelActive()
        ) {

            return "app-sidebar-link app-sidebar-link-active";

        }


        return "app-sidebar-link";

    }


    function createFunnelClass() {

        return isCreateFunnelActive()
            ? "app-sidebar-link app-sidebar-link-active"
            : "app-sidebar-link";

    }


    function standardNavClass({
        isActive
    }) {

        return isActive
            ? "app-sidebar-link app-sidebar-link-active"
            : "app-sidebar-link";

    }


    function handleCreateFunnel() {
closeSidebar();
        if (
            location.pathname === "/dashboard"
        ) {

            window.dispatchEvent(
                new CustomEvent(
                    "funnel-ai-create-funnel"
                )
            );


            window.setTimeout(() => {

                const section =
                    document.getElementById(
                        "create-funnel"
                    );


                if (section) {

                    section.scrollIntoView({
                        behavior: "smooth",
                        block: "start"
                    });

                }

            }, 50);


            return;

        }


        navigate(
            "/dashboard#create-funnel"
        );

    }


    /*
     * ---------------------------------------------------------
     * ACCOUNT INITIAL
     * ---------------------------------------------------------
     */

    const userInitial =
        user.name
            ?.charAt(0)
            ?.toUpperCase() ||
        "U";


  return (

    <>
        {/* MOBILE SIDEBAR TOGGLE */}

        <button
            type="button"
            className="app-sidebar-toggle"
            onClick={() =>
                setSidebarOpen(
                    previous => !previous
                )
            }
            aria-label={
                sidebarOpen
                    ? "Close navigation menu"
                    : "Open navigation menu"
            }
            aria-expanded={
                sidebarOpen
            }
        >
            <span />
            <span />
            <span />
        </button>


        {/* MOBILE SIDEBAR OVERLAY */}

        {sidebarOpen && (

            <button
                type="button"
                className="app-sidebar-overlay"
                aria-label="Close navigation menu"
                onClick={
                    closeSidebar
                }
            />

        )}


        <aside
            className={
                sidebarOpen
                    ? "app-sidebar app-sidebar-open"
                    : "app-sidebar"
            }
        >


        <button
    type="button"
    className="app-sidebar-close"
    onClick={
        closeSidebar
    }
    aria-label="Close navigation menu"
>
    ×
</button>

            {/* =================================================
                BRAND
            ================================================= */}

            <div className="app-sidebar-header">

                <NavLink
                    to="/dashboard"
                    className="app-sidebar-brand"
                >

                  
<span className="app-sidebar-brand-mark">
    <img
        src="/logo.png"
        alt="BuildFunnelsAI logo"
        className="app-sidebar-logo"
    />
</span>


                    <span>
                        Funnel AI
                    </span>

                </NavLink>

            </div>


            {/* =================================================
                CREATE FUNNEL
            ================================================= */}

            <div className="app-sidebar-create">

                <button
                    type="button"
                    className="app-sidebar-create-button"
                    onClick={
                        handleCreateFunnel
                    }
                >

                    <span className="app-sidebar-create-icon">
                        +
                    </span>

                    <span>
                        Create Funnel
                    </span>

                </button>

            </div>


            {/* =================================================
                MAIN NAVIGATION
            ================================================= */}

            <nav
                className="app-sidebar-navigation"
                aria-label="Application navigation"
            >

                <p className="app-sidebar-section-title">
                    Workspace
                </p>


                {/* DASHBOARD */}

                <NavLink
                    to="/dashboard"
                    end
                    className={
                        dashboardNavClass
                    }
                >

                    <span className="app-sidebar-link-icon">
                        ◼
                    </span>

                    <span>
                        Dashboard
                    </span>

                </NavLink>


                {/* CREATE FUNNEL */}

                <button
                    type="button"
                    className={
                        `${createFunnelClass()} app-sidebar-link-button`
                    }
                    onClick={
                        handleCreateFunnel
                    }
                >

                    <span className="app-sidebar-link-icon">
                        ＋
                    </span>

                    <span>
                        Create Funnel
                    </span>

                </button>


                {/* FUNNEL HISTORY */}

                <NavLink
                    to="/history"
                    className={
                        standardNavClass
                    }
                >

                    <span className="app-sidebar-link-icon">
                        ▣
                    </span>

                    <span>
                        Funnel History
                    </span>

                </NavLink>


                <p className="app-sidebar-section-title app-sidebar-section-spaced">
                    Account
                </p>


                {/* PRICING */}

                <NavLink
                    to="/pricing"
                    className={
                        standardNavClass
                    }
                >

                    <span className="app-sidebar-link-icon">
                        ◆
                    </span>

                    <span>
                        Pricing / Upgrade
                    </span>

                </NavLink>


                {/* ACCOUNT */}

                <NavLink
                    to="/account"
                    className={
                        standardNavClass
                    }
                >

                    <span className="app-sidebar-link-icon">
                        ○
                    </span>

                    <span>
                        Account
                    </span>

                </NavLink>


                {/* =================================================
                    ADMINISTRATION
                    Only visible to admin users
                ================================================= */}

                {user.is_admin && (

                    <>

                        <p className="app-sidebar-section-title app-sidebar-section-spaced">
                            Administration
                        </p>


                        <NavLink
                            to="/admin"
                            className={
                                standardNavClass
                            }
                        >

                            <span className="app-sidebar-link-icon">
                                ⚙
                            </span>

                            <span>
                                Admin Dashboard
                            </span>

                        </NavLink>

                    </>

                )}

            </nav>


            {/* =================================================
                PLAN / CREDIT SUMMARY
            ================================================= */}

            <div className="app-sidebar-summary">


                <div className="app-sidebar-plan-row">

                    <span className="app-sidebar-plan-label">
                        Current plan
                    </span>

                    <span
                        className={
                            `app-sidebar-plan-badge app-sidebar-plan-${plan.toLowerCase()}`
                        }
                    >

                        {plan}

                    </span>

                </div>


                {aiCreditsRemaining !== null && (

                    <div className="app-sidebar-credit-row">

                        <span className="app-sidebar-credit-icon">
                            ⚡
                        </span>


                        <div className="app-sidebar-credit-content">

                            <span className="app-sidebar-credit-label">
                                AI Credits
                            </span>


                            <strong>

                                {aiCreditsRemaining}

                                {aiCreditsLimit !== null && (

                                    <>
                                        {" / "}
                                        {aiCreditsLimit}
                                    </>

                                )}

                            </strong>

                        </div>

                    </div>

                )}

            </div>


            {/* =================================================
                SIDEBAR FOOTER
            ================================================= */}

            <div className="app-sidebar-footer">

                <NavLink
                    to="/account"
                    className="app-sidebar-account-link"
                >

                    <span className="app-sidebar-account-avatar">
                        {userInitial}
                    </span>


                    <span className="app-sidebar-account-info">

                        <strong>

                            {
                                user.name ||
                                "Account"
                            }

                        </strong>


                        <small>
                            Manage account
                        </small>

                    </span>

                </NavLink>

            </div>


          </aside>

    </>
);

}
