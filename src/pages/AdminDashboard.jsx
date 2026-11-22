import {
    useEffect,
    useMemo,
    useState
} from "react";

import {
    useNavigate
} from "react-router-dom";

import {
    ResponsiveContainer,
    LineChart,
    Line,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend
} from "recharts";

import DashboardLayout
    from "../layouts/DashboardLayout";

import StatCard
    from "../components/StatCard";

import LoadingSpinner
    from "../components/LoadingSpinner";

import api
    from "../api/axios";

import {
    useAuth
} from "../context/AuthContext";


export default function AdminDashboard() {

    const {
        user,
        loading: authLoading
    } = useAuth();

    const navigate =
        useNavigate();


    const [
        overview,
        setOverview
    ] = useState(null);


    const [
        growth,
        setGrowth
    ] = useState(null);


    const [
        users,
        setUsers
    ] = useState([]);


    const [
        payments,
        setPayments
    ] = useState([]);


    const [
        funnels,
        setFunnels
    ] = useState([]);


    const [
        aiUsage,
        setAiUsage
    ] = useState([]);


    const [
        system,
        setSystem
    ] = useState(null);


    const [
        loading,
        setLoading
    ] = useState(true);


    const [
        error,
        setError
    ] = useState(null);


    useEffect(() => {

        if (
            authLoading
        ) {
            return;
        }


        if (
            !user?.is_admin
        ) {

            navigate(
                "/dashboard",
                {
                    replace: true
                }
            );

            return;

        }


        loadAdminData();

    }, [
        authLoading,
        user,
        navigate
    ]);


    async function loadAdminData() {

        setLoading(true);
        setError(null);

        try {

            const [
                overviewResponse,
                growthResponse,
                usersResponse,
                funnelsResponse,
                paymentsResponse,
                aiUsageResponse,
                systemResponse
            ] = await Promise.all([

                api.get(
                    "/api/admin/overview"
                ),

                api.get(
                    "/api/admin/growth"
                ),

                api.get(
                    "/api/admin/users",
                    {
                        params: {
                            per_page: 10
                        }
                    }
                ),

                api.get(
                    "/api/admin/funnels",
                    {
                        params: {
                            per_page: 10
                        }
                    }
                ),

                api.get(
                    "/api/admin/payments",
                    {
                        params: {
                            per_page: 10
                        }
                    }
                ),

                api.get(
                    "/api/admin/ai-usage",
                    {
                        params: {
                            per_page: 10
                        }
                    }
                ),

                api.get(
                    "/api/admin/system"
                )

            ]);


            setOverview(
                overviewResponse.data
            );


            setGrowth(
                growthResponse.data
            );


            setUsers(
                usersResponse.data?.data || []
            );


            setFunnels(
                funnelsResponse.data?.data || []
            );


            setPayments(
                paymentsResponse.data?.data || []
            );


            setAiUsage(
                aiUsageResponse.data?.data || []
            );


            setSystem(
                systemResponse.data
            );


        } catch (err) {

            console.error(
                "ADMIN DASHBOARD ERROR:",
                err.response?.data ||
                err.message
            );


            setError(
                err.response?.data?.message ||
                "Unable to load the admin dashboard."
            );

        } finally {

            setLoading(false);

        }

    }


    const planData =
        useMemo(() => {

            if (
                !growth?.plans
            ) {
                return [];
            }

            return [
                {
                    name: "Free",
                    users: Number(
                        growth.plans.free || 0
                    )
                },
                {
                    name: "Pro",
                    users: Number(
                        growth.plans.pro || 0
                    )
                }
            ];

        }, [growth]);


    function formatCurrency(
        amount
    ) {

        return new Intl.NumberFormat(
            "en-NG",
            {
                style: "currency",
                currency: "NGN",
                maximumFractionDigits: 0
            }
        ).format(
            Number(amount || 0)
        );

    }


    function formatDate(
        value
    ) {

        if (!value) {
            return "—";
        }

        return new Date(
            value
        ).toLocaleDateString(
            "en-NG",
            {
                day: "numeric",
                month: "short",
                year: "numeric"
            }
        );

    }


    function formatMonth(
        value
    ) {

        if (!value) {
            return "—";
        }

        const [
            year,
            month
        ] = value.split("-");

        return new Date(
            Number(year),
            Number(month) - 1
        ).toLocaleDateString(
            "en-US",
            {
                month: "short"
            }
        );

    }


    if (
        authLoading ||
        loading
    ) {

        return (

            <DashboardLayout>

                <div className="admin-loading">

                    <LoadingSpinner />

                    <h2>
                        Loading admin dashboard...
                    </h2>

                    <p>
                        Getting your platform
                        analytics ready.
                    </p>

                </div>

            </DashboardLayout>

        );

    }


    if (
        !user?.is_admin
    ) {
        return null;
    }


    if (
        error
    ) {

        return (

            <DashboardLayout>

                <div className="admin-page">

                    <section className="admin-error-card">

                        <div className="admin-error-icon">
                            !
                        </div>

                        <h1>
                            Unable to load dashboard
                        </h1>

                        <p>
                            {error}
                        </p>

                        <button
                            type="button"
                            className="admin-retry-button"
                            onClick={
                                loadAdminData
                            }
                        >
                            Try Again
                        </button>

                    </section>

                </div>

            </DashboardLayout>

        );

    }


    return (

        <DashboardLayout>

            <div className="admin-page">

                {/* =====================================================
                    HEADER
                ===================================================== */}

                <section className="admin-header">

                    <div>

                        <span className="admin-eyebrow">
                            Administration
                        </span>

                        <h1>
                            Admin Dashboard
                        </h1>

                        <p>
                            Monitor Funnel AI Builder
                            users, funnels, revenue,
                            AI usage, and platform health.
                        </p>

                    </div>


                    <button
                        type="button"
                        className="admin-refresh-button"
                        onClick={
                            loadAdminData
                        }
                    >
                        ↻ Refresh
                    </button>

                </section>


                {/* =====================================================
                    PLATFORM OVERVIEW
                ===================================================== */}

                <section className="admin-section">

                    <div className="admin-section-heading">

                        <div>

                            <h2>
                                Platform Overview
                            </h2>

                            <p>
                                Current platform totals
                                and activity.
                            </p>

                        </div>

                    </div>


                    <div className="stats-grid">

                        <StatCard
                            title="Total Users"
                            value={
                                overview?.users?.total ?? 0
                            }
                            icon="👥"
                        />


                        <StatCard
                            title="Free Users"
                            value={
                                overview?.users?.free ?? 0
                            }
                            icon="🆓"
                        />


                        <StatCard
                            title="Pro Users"
                            value={
                                overview?.users?.pro ?? 0
                            }
                            icon="💎"
                        />


                        <StatCard
                            title="Total Funnels"
                            value={
                                overview?.funnels?.total ?? 0
                            }
                            icon="📁"
                        />


                        <StatCard
                            title="Funnels This Month"
                            value={
                                overview?.funnels?.created_this_month ?? 0
                            }
                            icon="📈"
                        />


                        <StatCard
                            title="AI Credits Used"
                            value={
                                overview?.ai?.credits_used ?? 0
                            }
                            icon="🤖"
                        />


                        <StatCard
                            title="Purchased Credits"
                            value={
                                overview?.ai?.purchased_credits ?? 0
                            }
                            icon="⚡"
                        />


                        <StatCard
                            title="Total Revenue"
                            value={
                                formatCurrency(
                                    overview?.revenue?.total
                                )
                            }
                            icon="₦"
                        />

                    </div>

                </section>


                {/* =====================================================
                    REVENUE / USER / FUNNEL GROWTH
                ===================================================== */}

                <section className="admin-section">

                    <div className="admin-section-heading">

                        <div>

                            <h2>
                                Growth
                            </h2>

                            <p>
                                Six-month platform activity.
                            </p>

                        </div>

                    </div>


                    <div className="admin-chart-grid">

                        <div className="admin-chart-card">

                            <div className="admin-card-heading">

                                <div>

                                    <h3>
                                        Users & Funnels
                                    </h3>

                                    <p>
                                        Monthly registrations
                                        and funnel creation.
                                    </p>

                                </div>

                            </div>


                            <div className="admin-chart">

                                <ResponsiveContainer
                                    width="100%"
                                    height={300}
                                >

                                    <LineChart
                                        data={
                                            growth?.monthly || []
                                        }
                                    >

                                        <CartesianGrid
                                            strokeDasharray="3 3"
                                        />

                                        <XAxis
                                            dataKey="label"
                                        />

                                        <YAxis />

                                        <Tooltip />

                                        <Legend />

                                        <Line
                                            type="monotone"
                                            dataKey="users"
                                            name="Users"
                                            stroke="#4f46e5"
                                            strokeWidth={2}
                                            dot={false}
                                        />

                                        <Line
                                            type="monotone"
                                            dataKey="funnels"
                                            name="Funnels"
                                            stroke="#111827"
                                            strokeWidth={2}
                                            dot={false}
                                        />

                                    </LineChart>

                                </ResponsiveContainer>

                            </div>

                        </div>


                        <div className="admin-chart-card">

                            <div className="admin-card-heading">

                                <div>

                                    <h3>
                                        Revenue
                                    </h3>

                                    <p>
                                        Monthly successful
                                        payment revenue.
                                    </p>

                                </div>

                            </div>


                            <div className="admin-chart">

                                <ResponsiveContainer
                                    width="100%"
                                    height={300}
                                >

                                    <BarChart
                                        data={
                                            growth?.monthly || []
                                        }
                                    >

                                        <CartesianGrid
                                            strokeDasharray="3 3"
                                        />

                                        <XAxis
                                            dataKey="label"
                                        />

                                        <YAxis />

                                        <Tooltip
                                            formatter={
                                                (value) =>
                                                    formatCurrency(
                                                        value
                                                    )
                                            }
                                        />

                                        <Bar
                                            dataKey="revenue"
                                            name="Revenue"
                                            fill="#4f46e5"
                                            radius={[
                                                5,
                                                5,
                                                0,
                                                0
                                            ]}
                                        />

                                    </BarChart>

                                </ResponsiveContainer>

                            </div>

                        </div>

                    </div>

                </section>


                {/* =====================================================
                    AI USAGE + PLAN DISTRIBUTION
                ===================================================== */}

                <section className="admin-section">

                    <div className="admin-chart-grid">

                        <div className="admin-chart-card">

                            <div className="admin-card-heading">

                                <div>

                                    <h3>
                                        AI Credit Activity
                                    </h3>

                                    <p>
                                        Included-credit usage
                                        and purchased credits.
                                    </p>

                                </div>

                            </div>


                            <div className="admin-chart">

                                <ResponsiveContainer
                                    width="100%"
                                    height={300}
                                >

                                    <BarChart
                                        data={
                                            growth?.monthly || []
                                        }
                                    >

                                        <CartesianGrid
                                            strokeDasharray="3 3"
                                        />

                                        <XAxis
                                            dataKey="label"
                                        />

                                        <YAxis />

                                        <Tooltip />

                                        <Legend />

                                        <Bar
                                            dataKey="ai_credits_used"
                                            name="AI Credits Used"
                                            fill="#111827"
                                        />

                                        <Bar
                                            dataKey="purchased_credits"
                                            name="Purchased Credits"
                                            fill="#4f46e5"
                                        />

                                    </BarChart>

                                </ResponsiveContainer>

                            </div>

                        </div>


                        <div className="admin-chart-card">

                            <div className="admin-card-heading">

                                <div>

                                    <h3>
                                        Plan Distribution
                                    </h3>

                                    <p>
                                        Current users by plan.
                                    </p>

                                </div>

                            </div>


                            <div className="admin-plan-list">

                                {planData.map(
                                    (plan) => {

                                        const total =
                                            Number(
                                                growth?.conversion?.total_users || 0
                                            );

                                        const percentage =
                                            total > 0
                                                ? (
                                                    plan.users /
                                                    total
                                                ) * 100
                                                : 0;

                                        return (

                                            <div
                                                className="admin-plan-row"
                                                key={
                                                    plan.name
                                                }
                                            >

                                                <div className="admin-plan-row-top">

                                                    <strong>
                                                        {plan.name}
                                                    </strong>

                                                    <span>
                                                        {
                                                            plan.users
                                                        }
                                                    </span>

                                                </div>


                                                <div className="admin-plan-bar">

                                                    <div
                                                        className="admin-plan-bar-fill"
                                                        style={{
                                                            width:
                                                                `${percentage}%`
                                                        }}
                                                    />

                                                </div>


                                                <small>
                                                    {
                                                        percentage.toFixed(
                                                            1
                                                        )
                                                    }%
                                                </small>

                                            </div>

                                        );

                                    }
                                )}

                            </div>


                            <div className="admin-conversion-box">

                                <span>
                                    Paid-user rate
                                </span>

                                <strong>
                                    {
                                        growth?.conversion?.paid_user_rate ?? 0
                                    }%
                                </strong>

                            </div>

                        </div>

                    </div>

                </section>


                {/* =====================================================
                    REVENUE SUMMARY
                ===================================================== */}

                <section className="admin-section">

                    <div className="admin-summary-card">

                        <div>

                            <span>
                                Revenue This Month
                            </span>

                            <strong>
                                {
                                    formatCurrency(
                                        overview?.revenue?.this_month
                                    )
                                }
                            </strong>

                        </div>


                        <div>

                            <span>
                                New Users This Month
                            </span>

                            <strong>
                                {
                                    overview?.users?.new_this_month ?? 0
                                }
                            </strong>

                        </div>


                        <div>

                            <span>
                                Paid Users
                            </span>

                            <strong>
                                {
                                    growth?.conversion?.paid_users ?? 0
                                }
                            </strong>

                        </div>


                        <div>

                            <span>
                                Platform Status
                            </span>

                            <strong className="admin-status-good">
                                {system?.application?.status || "—"}
                            </strong>

                        </div>

                    </div>

                </section>


                {/* =====================================================
                    RECENT USERS
                ===================================================== */}

                <section className="admin-section">

                    <div className="admin-section-heading">

                        <div>

                            <h2>
                                Recent Users
                            </h2>

                            <p>
                                Latest registered accounts.
                            </p>

                        </div>

                    </div>


                    <div className="admin-table-card">

                        <div className="admin-table-wrapper">

                            <table className="admin-table">

                                <thead>

                                    <tr>

                                        <th>
                                            User
                                        </th>

                                        <th>
                                            Plan
                                        </th>

                                        <th>
                                            Funnels
                                        </th>

                                        <th>
                                            Verified
                                        </th>

                                        <th>
                                            Joined
                                        </th>

                                    </tr>

                                </thead>

                                <tbody>

                                    {users.length > 0 ? (

                                        users.map(
                                            (item) => (

                                                <tr
                                                    key={
                                                        item.id
                                                    }
                                                >

                                                    <td>

                                                        <strong>
                                                            {
                                                                item.name ||
                                                                "Unnamed"
                                                            }
                                                        </strong>

                                                        <span className="admin-table-secondary">
                                                            {
                                                                item.email
                                                            }
                                                        </span>

                                                    </td>

                                                    <td>

                                                        <span
                                                            className={
                                                                `admin-plan-badge ${
                                                                    item.plan === "pro"
                                                                        ? "admin-plan-pro"
                                                                        : "admin-plan-free"
                                                                }`
                                                            }
                                                        >
                                                            {
                                                                (
                                                                    item.plan ||
                                                                    "free"
                                                                ).toUpperCase()
                                                            }
                                                        </span>

                                                    </td>

                                                    <td>
                                                        {
                                                            item.funnels_count ??
                                                            0
                                                        }
                                                    </td>

                                                    <td>
                                                        {
                                                            item.email_verified_at
                                                                ? "Yes"
                                                                : "No"
                                                        }
                                                    </td>

                                                    <td>
                                                        {
                                                            formatDate(
                                                                item.created_at
                                                            )
                                                        }
                                                    </td>

                                                </tr>

                                            )
                                        )

                                    ) : (

                                        <tr>

                                            <td
                                                colSpan="5"
                                            >
                                                No users found.
                                            </td>

                                        </tr>

                                    )}

                                </tbody>

                            </table>

                        </div>

                    </div>

                </section>


                {/* =====================================================
                    RECENT PAYMENTS
                ===================================================== */}

                <section className="admin-section">

                    <div className="admin-section-heading">

                        <div>

                            <h2>
                                Recent Payments
                            </h2>

                            <p>
                                Latest payment records.
                            </p>

                        </div>

                    </div>


                    <div className="admin-table-card">

                        <div className="admin-table-wrapper">

                            <table className="admin-table">

                                <thead>

                                    <tr>

                                        <th>
                                            User
                                        </th>

                                        <th>
                                            Plan
                                        </th>

                                        <th>
                                            Amount
                                        </th>

                                        <th>
                                            Status
                                        </th>

                                        <th>
                                            Date
                                        </th>

                                    </tr>

                                </thead>

                                <tbody>

                                    {payments.length > 0 ? (

                                        payments.map(
                                            (payment) => (

                                                <tr
                                                    key={
                                                        payment.id
                                                    }
                                                >

                                                    <td>

                                                        <strong>
                                                            {
                                                                payment.user?.name ||
                                                                "Unknown"
                                                            }
                                                        </strong>

                                                        <span className="admin-table-secondary">
                                                            {
                                                                payment.user?.email ||
                                                                "—"
                                                            }
                                                        </span>

                                                    </td>

                                                    <td>
                                                        {
                                                            (
                                                                payment.plan ||
                                                                "—"
                                                            ).toUpperCase()
                                                        }
                                                    </td>

                                                    <td>
                                                        {
                                                            formatCurrency(
                                                                Number(
                                                                    payment.amount ||
                                                                    0
                                                                ) / 100
                                                            )
                                                        }
                                                    </td>

                                                    <td>

                                                        <span
                                                            className={
                                                                payment.status === "success"
                                                                    ? "admin-payment-success"
                                                                    : "admin-payment-other"
                                                            }
                                                        >
                                                            {
                                                                payment.status
                                                            }
                                                        </span>

                                                    </td>

                                                    <td>
                                                        {
                                                            formatDate(
                                                                payment.paid_at ||
                                                                payment.created_at
                                                            )
                                                        }
                                                    </td>

                                                </tr>

                                            )
                                        )

                                    ) : (

                                        <tr>

                                            <td
                                                colSpan="5"
                                            >
                                                No payments found.
                                            </td>

                                        </tr>

                                    )}

                                </tbody>

                            </table>

                        </div>

                    </div>

                </section>


                {/* =====================================================
                    RECENT FUNNELS
                ===================================================== */}

                <section className="admin-section">

                    <div className="admin-section-heading">

                        <div>

                            <h2>
                                Recent Funnels
                            </h2>

                            <p>
                                Latest funnels created
                                across the platform.
                            </p>

                        </div>

                    </div>


                    <div className="admin-table-card">

                        <div className="admin-table-wrapper">

                            <table className="admin-table">

                                <thead>

                                    <tr>

                                        <th>
                                            Campaign
                                        </th>

                                        <th>
                                            Owner
                                        </th>

                                        <th>
                                            Property
                                        </th>

                                        <th>
                                            Location
                                        </th>

                                        <th>
                                            Created
                                        </th>

                                    </tr>

                                </thead>

                                <tbody>

                                    {funnels.length > 0 ? (

                                        funnels.map(
                                            (funnel) => (

                                                <tr
                                                    key={
                                                        funnel.id
                                                    }
                                                >

                                                    <td>
                                                        <strong>
                                                            {
                                                                funnel.campaign ||
                                                                "Untitled Funnel"
                                                            }
                                                        </strong>
                                                    </td>

                                                    <td>

                                                        <strong>
                                                            {
                                                                funnel.user?.name ||
                                                                "Unknown"
                                                            }
                                                        </strong>

                                                        <span className="admin-table-secondary">
                                                            {
                                                                funnel.user?.email ||
                                                                "—"
                                                            }
                                                        </span>

                                                    </td>

                                                    <td>
                                                        {
                                                            funnel.propertyType ||
                                                            "—"
                                                        }
                                                    </td>

                                                    <td>
                                                        {
                                                            funnel.location ||
                                                            "—"
                                                        }
                                                    </td>

                                                    <td>
                                                        {
                                                            formatDate(
                                                                funnel.created_at
                                                            )
                                                        }
                                                    </td>

                                                </tr>

                                            )
                                        )

                                    ) : (

                                        <tr>

                                            <td
                                                colSpan="5"
                                            >
                                                No funnels found.
                                            </td>

                                        </tr>

                                    )}

                                </tbody>

                            </table>

                        </div>

                    </div>

                </section>


                {/* =====================================================
                    SYSTEM STATUS
                ===================================================== */}

                <section className="admin-section">

                    <div className="admin-section-heading">

                        <div>

                            <h2>
                                System Status
                            </h2>

                            <p>
                                Basic application health.
                            </p>

                        </div>

                    </div>


                    <div className="admin-system-grid">

                        <div className="admin-system-card">

                            <span>
                                Application
                            </span>

                            <strong>
                                {
                                    system?.application?.status ||
                                    "—"
                                }
                            </strong>

                        </div>


                        <div className="admin-system-card">

                            <span>
                                Environment
                            </span>

                            <strong>
                                {
                                    system?.application?.environment ||
                                    "—"
                                }
                            </strong>

                        </div>


                        <div className="admin-system-card">

                            <span>
                                Database
                            </span>

                            <strong>
                                {
                                    system?.database?.status ||
                                    "—"
                                }
                            </strong>

                        </div>


                        <div className="admin-system-card">

                            <span>
                                Monitoring
                            </span>

                            <strong>
                                {
                                    system?.monitoring?.posthog ||
                                    "—"
                                }
                            </strong>

                        </div>

                    </div>

                </section>


                {/* =====================================================
                    ADMIN DATA NOTE
                ===================================================== */}

                <section className="admin-data-note">

                    <strong>
                        Admin data source
                    </strong>

                    <p>
                        Business and accounting metrics
                        shown here come from the application
                        database. PostHog remains focused on
                        product behavior and monitoring.
                    </p>

                </section>

            </div>

        </DashboardLayout>

    );

}