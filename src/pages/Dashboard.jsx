import {
    useEffect,
    useState
} from "react";

import {
    useNavigate
} from "react-router-dom";

import Button
    from "../components/Button";

import Input
    from "../components/Input";

import Select
    from "../components/Select";

import DashboardLayout
    from "../layouts/DashboardLayout";

import OnboardingCard
    from "../components/OnboardingCard";

import ProgressBar
    from "../components/ProgressBar";

import {
    useAuth
} from "../context/AuthContext";

import api
    from "../api/axios";

import StatCard
    from "../components/StatCard";

import {
    useToast
} from "../context/ToastContext";

import LoadingSpinner
    from "../components/LoadingSpinner";

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
} from "recharts";













export default function Dashboard() {

    const {
        user,
        loading
    } = useAuth();


    const navigate =
        useNavigate();


    const {
        showToast
    } = useToast();


    const [
        location,
        setLocation
    ] = useState("");


    const [
        propertyType,
        setPropertyType
    ] = useState("");


    const [
        audience,
        setAudience
    ] = useState("");


    const [
        offer,
        setOffer
    ] = useState("");


    const [
        bedrooms,
        setBedrooms
    ] = useState("");


    const [
        budgetLevel,
        setBudgetLevel
    ] = useState("");


    const [
        currentStep,
        setCurrentStep
    ] = useState(1);


    const [
        aiCredits,
        setAiCredits
    ] = useState(null);


    const [
        dashboardUsage,
        setDashboardUsage
    ] = useState(null);


    const [
        funnelAnalytics,
        setFunnelAnalytics
    ] = useState(null);


    const [
        recentFunnels,
        setRecentFunnels
    ] = useState([]);


    const [
        startingGeneration,
        setStartingGeneration
    ] = useState(false);


    const totalSteps = 4;


    async function loadDashboardUsage() {

        try {

            const response =
                await api.get(
                    "/api/dashboard/usage"
                );


            setDashboardUsage(
                response.data
            );

        } catch (error) {

            console.error(
                "DASHBOARD USAGE ERROR:",
                error.response?.data ||
                error.message
            );

        }

    }


    async function loadAICredits() {

        try {

            const response =
                await api.get(
                    "/api/ai-credits"
                );


            setAiCredits(
                response.data
            );

        } catch (error) {

            console.error(
                "AI CREDIT ERROR:",
                error.response?.data ||
                error.message
            );

        }

    }


    async function loadFunnelAnalytics() {

        const currentPlan =
            dashboardUsage?.plan ||
            user?.plan;


        if (
            currentPlan !== "agency"
        ) {

            setFunnelAnalytics(
                null
            );

            return;

        }


        try {

            const response =
                await api.get(
                    "/api/analytics/funnels"
                );


            setFunnelAnalytics(
                response.data
            );

        } catch (error) {

            console.error(
                "FUNNEL ANALYTICS ERROR:",
                error.response?.data ||
                error.message
            );

        }

    }


    async function fetchRecentFunnels() {

        try {

            const response =
                await api.get(
                    "/api/funnels"
                );


            setRecentFunnels(
                response.data.data || []
            );

        } catch (error) {

            console.error(
                "RECENT FUNNELS ERROR:",
                error.response?.data ||
                error.message
            );

        }

    }


    useEffect(() => {

        loadDashboardUsage();

        loadAICredits();

        fetchRecentFunnels();

    }, []);


    useEffect(() => {

        if (
            !dashboardUsage &&
            !user
        ) {

            return;

        }


        loadFunnelAnalytics();

    }, [
        dashboardUsage,
        user
    ]);


    function validateCurrentStep() {

        if (
            currentStep === 1
        ) {

            if (!propertyType) {

                showToast(
                    "Please select a property type.",
                    "error"
                );

                return false;

            }


            if (!bedrooms) {

                showToast(
                    "Please select the number of bedrooms.",
                    "error"
                );

                return false;

            }


            if (!budgetLevel) {

                showToast(
                    "Please select a budget level.",
                    "error"
                );

                return false;

            }

        }


        if (
            currentStep === 2
        ) {

            if (!audience) {

                showToast(
                    "Please select a target audience.",
                    "error"
                );

                return false;

            }


            if (
                !location.trim()
            ) {

                showToast(
                    "Please enter a location.",
                    "error"
                );

                return false;

            }

        }


        if (
            currentStep === 3
        ) {

            if (
                !offer.trim()
            ) {

                showToast(
                    "Please enter an offer.",
                    "error"
                );

                return false;

            }

        }


        return true;

    }


    function nextStep() {

        if (
            !validateCurrentStep()
        ) {

            return;

        }


        if (
            currentStep <
            totalSteps
        ) {

            setCurrentStep(
                currentStep + 1
            );

        }

    }


    function previousStep() {

        if (
            currentStep >
            1
        ) {

            setCurrentStep(
                currentStep - 1
            );

        }

    }











    function handleGenerateFunnel(event) {
    event.preventDefault();

    if (!validateCurrentStep()) {
        return;
    }

    const PROPERTY_TYPES = [
        "Apartment",
        "Duplex",
        "Detached House",
        "Terraced House",
        "Land",
        "Commercial Property",
        "Office Space",
        "Warehouse",
        "Short-let Apartment",
    ];

    const BEDROOM_OPTIONS = [
        "1",
        "2",
        "3",
        "4",
        "5+",
        "Studio",
    ];

    const BUDGET_LEVELS = [
        "Affordable",
        "Mid-range",
        "Luxury",
    ];

    const AUDIENCES = [
        "First-Time Buyers",
        "Families",
        "Property Investors",
        "Diaspora Buyers",
        "Businesses",
        "Developers",
    ];

    const cleanLocation = location?.trim() || "";
    const cleanOffer = offer?.trim() || "";

    // Required fields
    if (!propertyType) {
        showToast("Please select a property type.", "error");
        return;
    }

    if (!bedrooms) {
        showToast("Please select the number of bedrooms.", "error");
        return;
    }

    if (!budgetLevel) {
        showToast("Please select a budget level.", "error");
        return;
    }

    if (!audience) {
        showToast("Please select your target audience.", "error");
        return;
    }

    if (!cleanLocation) {
        showToast("Please enter a property location.", "error");
        return;
    }

    if (!cleanOffer) {
        showToast("Please enter your offer.", "error");
        return;
    }

    // Allowed values
    if (!PROPERTY_TYPES.includes(propertyType)) {
        showToast("Please select a valid property type.", "error");
        return;
    }

    if (!BEDROOM_OPTIONS.includes(bedrooms)) {
        showToast("Please select a valid bedroom option.", "error");
        return;
    }

    if (!BUDGET_LEVELS.includes(budgetLevel)) {
        showToast("Please select a valid budget level.", "error");
        return;
    }

    if (!AUDIENCES.includes(audience)) {
        showToast("Please select a valid target audience.", "error");
        return;
    }

    // Maximum lengths
    if (cleanLocation.length > 200) {
        showToast("Location must be 200 characters or less.", "error");
        return;
    }

    if (cleanOffer.length > 1000) {
        showToast("Offer must be 1000 characters or less.", "error");
        return;
    }

    const funnelData = {
        propertyType,
        bedrooms,
        budgetLevel,
        audience,
        location: cleanLocation,
        offer: cleanOffer,
    };

    setStartingGeneration(true);

    navigate("/loading", {
        state: funnelData,
    });
}
















    if (loading) {

        return (

            <DashboardLayout>

                <div className="screen-content dashboard-loading">

                    <LoadingSpinner />

                    <h2>
                        Loading your dashboard...
                    </h2>

                    <p>
                        Getting your funnels and account
                        information ready.
                    </p>

                </div>

            </DashboardLayout>

        );

    }


    const formattedFunnelTrends =
        funnelAnalytics
            ?.funnel_trends
            ?.map(
                (trend) => {

                    const [
                        year,
                        month
                    ] =
                        trend.month.split("-");


                    const date =
                        new Date(
                            Number(year),
                            Number(month) - 1
                        );


                    return {

                        ...trend,

                        label:
                            date.toLocaleString(
                                "en-US",
                                {
                                    month:
                                        "short",
                                    year:
                                        "numeric"
                                }
                            ),

                        total:
                            Number(
                                trend.total
                            )

                    };

                }
            )
            || [];


    const propertyTypeData =
        funnelAnalytics
            ?.property_type_breakdown
            ?.map(
                (item) => ({
                    name:
                        item.propertyType,
                    total:
                        Number(
                            item.total
                        )
                })
            )
            || [];


    const audienceData =
        funnelAnalytics
            ?.audience_breakdown
            ?.map(
                (item) => ({
                    name:
                        item.audience,
                    total:
                        Number(
                            item.total
                        )
                })
            )
            || [];



















    return (

        <DashboardLayout>

            <div className="dashboard-page">


                {/* =================================================
                    WELCOME HEADER
                ================================================= */}

                <section className="dashboard-welcome">

                    <div>

                        <span className="dashboard-eyebrow">
                            Dashboard
                        </span>

                        <h1>
                            Welcome,{" "}
                            {user?.name || "User"}
                        </h1>

                        <p>
                            Build AI-powered marketing
                            funnels for your real estate
                            business.
                        </p>

                    </div>

                </section>


                <OnboardingCard />





















                {/* =================================================
                    OVERVIEW STATS
                ================================================= */}

                <section className="dashboard-section">

                    <div className="dashboard-section-heading">

                        <div>

                            <h2>
                                Dashboard Overview
                            </h2>

                            <p>
                                A quick view of your
                                account and funnel activity.
                            </p>

                        </div>

                    </div>


                    {dashboardUsage ? (

                        <div className="stats-grid">

                            <StatCard
                                title="Current Plan"
                                value={
                                    dashboardUsage
                                        .plan
                                        .toUpperCase()
                                }
                                icon="💎"
                            />


                            <StatCard
                                title="AI Generations"
                                value={
                                    dashboardUsage
                                        .ai_generations
                                }
                                icon="🤖"
                            />


                            {aiCredits && (

                                <StatCard
                                    title="AI Credits"
                                    icon="⚡"
                                >

                                    <h2 className="stat-card-value">

                                        {
                                            aiCredits.remaining
                                        }{" "}
                                        remaining

                                    </h2>


                                    <div className="credit-progress">

                                        <div
                                            className="credit-progress-fill"
                                            style={{
                                                width:
                                                    `${
                                                        aiCredits.limit > 0
                                                            ? (
                                                                aiCredits.remaining /
                                                                aiCredits.limit
                                                            ) *
                                                            100
                                                            : 0
                                                    }%`
                                            }}
                                        />

                                    </div>


                                    <p className="credit-total">

                                        {aiCredits.remaining}

                                        {" / "}

                                        {aiCredits.limit}

                                    </p>


                                    <p className="credit-reset">

                                        Reset:{" "}
                                        {
                                            aiCredits.resetDate
                                        }

                                    </p>

                                </StatCard>

                            )}


                            <StatCard
                                title="Funnels Created"
                                value={
                                    dashboardUsage
                                        .funnels_created
                                }
                                icon="📁"
                            />

                        </div>

                    ) : (

                        <div className="dashboard-inline-loading">
                            Loading dashboard usage...
                        </div>

                    )}

                </section>


                {/* =================================================
                    ANALYTICS
                ================================================= */}

                <section className="dashboard-section dashboard-analytics-section">

                    {(
                        dashboardUsage?.plan === "agency" ||
                        user?.plan === "agency"
                    ) ? (

                        funnelAnalytics ? (

                            Number(
                                funnelAnalytics.total_funnels
                            ) === 0 ? (

                                <div className="empty-state">

                                    <div className="empty-state-content">

                                        <h3>
                                            Your analytics will appear here
                                        </h3>

                                        <p>
                                            Generate your first funnel
                                            to start seeing trends,
                                            audience insights, and
                                            property breakdowns.
                                        </p>

                                        <Button
                                            text="Create Your First Funnel"
                                            onClick={() =>
                                                document
                                                    .querySelector(
                                                        ".create-funnel-section"
                                                    )
                                                    ?.scrollIntoView({
                                                        behavior:
                                                            "smooth"
                                                    })
                                            }
                                        />

                                    </div>

                                </div>

                            ) : (

                                <>

                                    <div className="dashboard-section-heading">

                                        <div>

                                            <h2>
                                                Funnel Analytics
                                            </h2>

                                            <p>
                                                Track your funnel
                                                creation activity
                                                and patterns.
                                            </p>

                                        </div>

                                    </div>


                                    <div className="stats-grid">

                                        <StatCard
                                            title="Total Funnels"
                                            value={
                                                funnelAnalytics
                                                    .total_funnels
                                            }
                                            icon="📊"
                                        />


                                        <StatCard
                                            title="Funnels This Month"
                                            value={
                                                funnelAnalytics
                                                    .funnels_this_month
                                            }
                                            icon="📅"
                                        />


                                        <StatCard
                                            title="Most Used Property"
                                            value={
                                                funnelAnalytics
                                                    .most_used_property_type ||
                                                "None"
                                            }
                                            icon="🏠"
                                        >

                                            {funnelAnalytics
                                                .most_used_property_type && (

                                                <p className="analytics-detail">

                                                    Used{" "}
                                                    {
                                                        funnelAnalytics
                                                            .most_used_property_type_count
                                                    }{" "}
                                                    times

                                                </p>

                                            )}

                                        </StatCard>


                                        <StatCard
                                            title="Most Used Audience"
                                            value={
                                                funnelAnalytics
                                                    .most_used_audience ||
                                                "None"
                                            }
                                            icon="👥"
                                        >

                                            {funnelAnalytics
                                                .most_used_audience && (

                                                <p className="analytics-detail">

                                                    Used{" "}
                                                    {
                                                        funnelAnalytics
                                                            .most_used_audience_count
                                                    }{" "}
                                                    times

                                                </p>

                                            )}

                                        </StatCard>

                                    </div>


                                    {funnelAnalytics.section_counts && (

                                        <div className="section-analytics">

                                            <h3>
                                                Generated Sections
                                            </h3>


                                            <div className="section-list">

                                                <div>
                                                    <span>
                                                        Lead Magnet
                                                    </span>

                                                    <strong>
                                                        {
                                                            funnelAnalytics
                                                                .section_counts
                                                                .lead_magnet
                                                        }
                                                    </strong>
                                                </div>


                                                <div>
                                                    <span>
                                                        Landing Page
                                                    </span>

                                                    <strong>
                                                        {
                                                            funnelAnalytics
                                                                .section_counts
                                                                .landing_page
                                                        }
                                                    </strong>
                                                </div>


                                                <div>
                                                    <span>
                                                        Facebook Ad
                                                    </span>

                                                    <strong>
                                                        {
                                                            funnelAnalytics
                                                                .section_counts
                                                                .facebook_ad
                                                        }
                                                    </strong>
                                                </div>


                                                <div>
                                                    <span>
                                                        Instagram Ad
                                                    </span>

                                                    <strong>
                                                        {
                                                            funnelAnalytics
                                                                .section_counts
                                                                .instagram_ad
                                                        }
                                                    </strong>
                                                </div>


                                                <div>
                                                    <span>
                                                        WhatsApp
                                                    </span>

                                                    <strong>
                                                        {
                                                            funnelAnalytics
                                                                .section_counts
                                                                .whatsapp
                                                        }
                                                    </strong>
                                                </div>


                                                <div>
                                                    <span>
                                                        Email
                                                    </span>

                                                    <strong>
                                                        {
                                                            funnelAnalytics
                                                                .section_counts
                                                                .email
                                                        }
                                                    </strong>
                                                </div>


                                                <div>
                                                    <span>
                                                        Thank You Page
                                                    </span>

                                                    <strong>
                                                        {
                                                            funnelAnalytics
                                                                .section_counts
                                                                .thank_you
                                                        }
                                                    </strong>
                                                </div>

                                            </div>

                                        </div>

                                    )}


                                    {formattedFunnelTrends.length > 0 && (

                                        <div className="funnel-chart-card">

                                            <div className="chart-header">

                                                <h3>
                                                    Funnel Creation Trends
                                                </h3>

                                                <p>
                                                    Your funnel creation activity
                                                    over time.
                                                </p>

                                            </div>


                                            <div className="chart-container">

                                                <ResponsiveContainer
                                                    width="100%"
                                                    height={300}
                                                >

                                                    <LineChart
                                                        data={
                                                            formattedFunnelTrends
                                                        }
                                                    >

                                                        <CartesianGrid
                                                            strokeDasharray="3 3"
                                                        />

                                                        <XAxis
                                                            dataKey="label"
                                                        />

                                                        <YAxis
                                                            allowDecimals={false}
                                                        />

                                                        <Tooltip />


                                                        <Line
                                                            type="monotone"
                                                            dataKey="total"
                                                            stroke="#4f46e5"
                                                            strokeWidth={3}
                                                        />

                                                    </LineChart>

                                                </ResponsiveContainer>

                                            </div>

                                        </div>

                                    )}


                                    {propertyTypeData.length > 0 && (

                                        <div className="funnel-breakdown-card">

                                            <h3>
                                                Funnels by Property Type
                                            </h3>

                                            <p>
                                                See which property types
                                                you create funnels for
                                                most often.
                                            </p>


                                            <div className="breakdown-chart">

                                                <ResponsiveContainer
                                                    width="100%"
                                                    height={300}
                                                >

                                                    <BarChart
                                                        data={
                                                            propertyTypeData
                                                        }
                                                        layout="vertical"
                                                        margin={{
                                                            top:
                                                                10,
                                                            right:
                                                                20,
                                                            left:
                                                                20,
                                                            bottom:
                                                                10
                                                        }}
                                                    >

                                                        <CartesianGrid
                                                            strokeDasharray="3 3"
                                                        />

                                                        <XAxis
                                                            type="number"
                                                            allowDecimals={
                                                                false
                                                            }
                                                        />

                                                        <YAxis
                                                            type="category"
                                                            dataKey="name"
                                                            width={120}
                                                        />

                                                        <Tooltip />

                                                        <Bar
                                                            dataKey="total"
                                                            name="Funnels"
                                                            fill="#4f46e5"
                                                        />

                                                    </BarChart>

                                                </ResponsiveContainer>

                                            </div>

                                        </div>

                                    )}


                                    {audienceData.length > 0 && (

                                        <div className="funnel-breakdown-card">

                                            <h3>
                                                Funnels by Audience
                                            </h3>

                                            <p>
                                                See which audiences
                                                you target most often.
                                            </p>


                                            <div className="breakdown-chart">

                                                <ResponsiveContainer
                                                    width="100%"
                                                    height={300}
                                                >

                                                    <BarChart
                                                        data={
                                                            audienceData
                                                        }
                                                        layout="vertical"
                                                        margin={{
                                                            top:
                                                                10,
                                                            right:
                                                                20,
                                                            left:
                                                                20,
                                                            bottom:
                                                                10
                                                        }}
                                                    >

                                                        <CartesianGrid
                                                            strokeDasharray="3 3"
                                                        />

                                                        <XAxis
                                                            type="number"
                                                            allowDecimals={
                                                                false
                                                            }
                                                        />

                                                        <YAxis
                                                            type="category"
                                                            dataKey="name"
                                                            width={140}
                                                        />

                                                        <Tooltip />

                                                        <Bar
                                                            dataKey="total"
                                                            name="Funnels"
                                                            fill="#4f46e5"
                                                        />

                                                    </BarChart>

                                                </ResponsiveContainer>

                                            </div>

                                        </div>

                                    )}

                                </>

                            )

                        ) : (

                            <div className="dashboard-inline-loading">
                                Loading funnel analytics...
                            </div>

                        )

                    ) : (

                        <div className="feature-upgrade-card">

                            <h2>
                                Advanced Analytics
                            </h2>

                            <p>
                                See funnel trends, audience insights,
                                property breakdowns, and detailed
                                funnel activity.
                            </p>

                            <p>
                                Advanced Analytics is available
                                on the Agency plan.
                            </p>

                            <Button
                                text="Upgrade to Agency"
                                onClick={() =>
                                    navigate(
                                        "/pricing"
                                    )
                                }
                            />

                        </div>

                    )}

                </section>


                {/* =================================================
                    CREATE FUNNEL
                ================================================= */}

                <section
                    className="create-funnel-section dashboard-section"
                    id="create-funnel"
                >

                    <div className="create-funnel-header">

                        <div>

                            <span className="dashboard-eyebrow">
                                Funnel Builder
                            </span>

                            <h2>
                                Create a New Funnel
                            </h2>

                            <p>
                                Tell us about the property,
                                audience, and offer. AI will
                                turn it into a complete
                                marketing funnel.
                            </p>

                        </div>

                    </div>


                    <div className="create-funnel-card">

                        <div className="create-funnel-progress">

                            <ProgressBar
                                currentStep={currentStep}
                                totalSteps={totalSteps}
                                stepTitles={[
                                    "Property Information",
                                    "Target Audience",
                                    "Offer",
                                    "Review"
                                ]}
                            />

                        </div>


                        <form
                            className="funnel-builder-form"
                            onSubmit={
                                handleGenerateFunnel
                            }
                        >

                            {currentStep === 1 && (

                                <div className="funnel-step">

                                    <div className="funnel-step-header">

<br/>
                                        <span>
                                            Step 1
                                        </span>
                                        <br/><br/>

                                        <div>

                                            <h3>
                                                Tell us about the property.
                                            </h3>

                                            <p>
                                                Start with the basic
                                                property details.
                                            </p>

                                        </div>

                                    </div>


                                    <div className="funnel-form-grid">

                                        <Select
                                            label="Property Type"
                                            placeholder="Select Property Type"
                                            value={
                                                propertyType
                                            }
                                            onChange={(event) =>
                                                setPropertyType(
                                                    event.target.value
                                                )
                                            }
                                            options={[
                                                "Apartment",
                                                "Duplex",
                                                "Detached House",
                                                "Terraced House",
                                                "Land",
                                                "Commercial Property",
                                                "Office Space",
                                                "Warehouse",
                                                "Short-let Apartment"
                                            ]}
                                        />
<br/>

                                        <Select
                                            label="Bedrooms"
                                            placeholder="Select Bedrooms"
                                            value={
                                                bedrooms
                                            }
                                            onChange={(event) =>
                                                setBedrooms(
                                                    event.target.value
                                                )
                                            }
                                            options={[
                                                "1",
                                                "2",
                                                "3",
                                                "4",
                                                "5+",
                                                "Studio"
                                            ]}
                                        />
                                        <br/>

                                        <Select
                                            label="Budget Level"
                                            placeholder="Select Budget"
                                            value={
                                                budgetLevel
                                            }
                                            onChange={(event) =>
                                                setBudgetLevel(
                                                    event.target.value
                                                )
                                            }
                                            options={[
                                                "Affordable",
                                                "Mid-range",
                                                "Luxury"
                                            ]}
                                        />

                                    </div>

                                </div>

                            )}


                            {currentStep === 2 && (

                                <div className="funnel-step">

                                    <div className="funnel-step-header">

                                        <span>
                                            Step 2
                                        </span>

                                        <div>

                                            <h3>
                                                Who do you want to attract?
                                            </h3>

                                            <p>
                                                Identify the people
                                                most likely to take action.
                                            </p>

                                        </div>

                                    </div>


                                    <div className="funnel-form-grid">

                                        <Select
                                            label="Target Audience"
                                            placeholder="Select Target Audience"
                                            value={
                                                audience
                                            }
                                            onChange={(event) =>
                                                setAudience(
                                                    event.target.value
                                                )
                                            }
                                            options={[
                                                "First-Time Buyers",
                                                "Families",
                                                "Property Investors",
                                                "Diaspora Buyers",
                                                "Businesses",
                                                "Developers"
                                            ]}
                                        />

                                            <br/>

                                        <Input
                                            label="Location"
                                            type="text"
                                            placeholder="e.g. Lekki"
                                            value={
                                                location
                                            }
                                            onChange={(event) =>
                                                setLocation(
                                                    event.target.value
                                                )
                                            }
                                        />

                                    </div>

                                </div>

                            )}


                            {currentStep === 3 && (

                                <div className="funnel-step">

                                    <div className="funnel-step-header">

                                        <span>
                                            Step 3
                                        </span>

                                        <div>

                                            <h3>
                                                What special offer are you promoting?
                                            </h3>

                                            <p>
                                                Tell us what makes
                                                this opportunity attractive.
                                            </p>

                                        </div>

                                    </div>


                                    <div className="funnel-form-single">

                                        <Input
                                            label="Offer / Promotion"
                                            type="text"
                                            placeholder="e.g. Free Inspection"
                                            value={
                                                offer
                                            }
                                            onChange={(event) =>
                                                setOffer(
                                                    event.target.value
                                                )
                                            }
                                        />

                                    </div>

                                </div>

                            )}


                            {currentStep === 4 && (

                                <div className="funnel-step">

                                    <div className="funnel-step-header">

                                        <span>
                                            Step 4
                                        </span>

                                        <div>

                                            <h3>
                                                Review your funnel
                                            </h3>

                                            <p>
                                                Make sure everything
                                                looks right before AI
                                                starts generating.
                                            </p>

                                        </div>

                                    </div>


                                    <div className="funnel-review-grid">

                                        <div className="funnel-review-card">

                                            <h4>
                                                Property Information
                                            </h4>

                                            <p>
                                                <strong>
                                                    Property Type:
                                                </strong>{" "}
                                                {propertyType}
                                            </p>

                                            <p>
                                                <strong>
                                                    Bedrooms:
                                                </strong>{" "}
                                                {bedrooms}
                                            </p>

                                            <p>
                                                <strong>
                                                    Budget Level:
                                                </strong>{" "}
                                                {budgetLevel}
                                            </p>

                                        </div>


                                        <div className="funnel-review-card">

                                            <h4>
                                                Target Audience
                                            </h4>

                                            <p>
                                                <strong>
                                                    Audience:
                                                </strong>{" "}
                                                {audience}
                                            </p>

                                            <p>
                                                <strong>
                                                    Location:
                                                </strong>{" "}
                                                {location}
                                            </p>

                                        </div>


                                        <div className="funnel-review-card">

                                            <h4>
                                                Offer
                                            </h4>

                                            <p>
                                                <strong>
                                                    Promotion:
                                                </strong>{" "}
                                                {offer}
                                            </p>

                                        </div>


                                        <div className="funnel-review-card">

                                            <h4>
                                                AI Will Generate
                                            </h4>

                                            <ul>

                                                <li>
                                                    Lead Magnet
                                                </li>

                                                <li>
                                                    Landing Page
                                                </li>

                                                <li>
                                                    Facebook Ad
                                                </li>

                                                <li>
                                                    Instagram Ad
                                                </li>

                                                <li>
                                                    WhatsApp Follow-up
                                                </li>

                                                <li>
                                                    Email Sequence
                                                </li>

                                                <li>
                                                    Thank You Page
                                                </li>

                                            </ul>

                                            <p>
                                                <strong>
                                                    Estimated AI Credits:
                                                </strong>{" "}
                                                15 Credits
                                            </p>

                                            <p>
                                                <strong>
                                                    Estimated Time:
                                                </strong>{" "}
                                                20 Seconds
                                            </p>

                                        </div>

                                    </div>

                                </div>

                            )}


                            <div className="funnel-step-footer">

                                <div className="funnel-step-indicator">

                                    Step {currentStep} of {totalSteps}

                                </div>


                                <div className="funnel-step-actions">

                                    {currentStep > 1 && (

                                        <Button
                                            text="Previous"
                                            variant="secondary"
                                            onClick={
                                                previousStep
                                            }
                                        />

                                    )}


                                    {currentStep <
                                        totalSteps && (

                                        <Button
                                            text="Next"
                                            onClick={
                                                nextStep
                                            }
                                        />

                                    )}


                                    {currentStep ===
                                        totalSteps && (

                                        <Button
                                            text={
                                                startingGeneration
                                                    ? "Starting AI Generation..."
                                                    : "Generate Funnel"
                                            }
                                            disabled={
                                                startingGeneration
                                            }
                                            onClick={
                                                handleGenerateFunnel
                                            }
                                        />

                                    )}

                                </div>





                            </div>

                        </form>

                    </div>

                </section>


                {/* =================================================
                    RECENT FUNNELS
                ================================================= */}

                <section className="recent-funnels dashboard-section">

                    <div className="recent-funnels-header">

                        <div>

                            <span className="dashboard-eyebrow">
                                Your Work
                            </span>

                            <h2>
                                Recent Funnels
                            </h2>

                            <p>
                                Quickly revisit your latest
                                generated marketing funnels.
                            </p>

                        </div>


                        {recentFunnels.length > 0 && (

                            <Button
                                text="View All Funnels"
                                variant="secondary"
                                onClick={() =>
                                    navigate(
                                        "/history"
                                    )
                                }
                            />

                        )}

                    </div>


                    {recentFunnels.length === 0 ? (

                        <div className="empty-state">

                            <div className="empty-state-content">

                                <h3>
                                    No funnels yet
                                </h3>

                                <p>
                                    Create your first AI-powered
                                    marketing funnel to see it
                                    appear here.
                                </p>

                                <Button
                                    text="Create Your First Funnel"
                                    onClick={() =>
                                        document
                                            .querySelector(
                                                "#create-funnel"
                                            )
                                            ?.scrollIntoView({
                                                behavior:
                                                    "smooth"
                                            })
                                    }
                                />

                            </div>

                        </div>

                    ) : (

                        <div className="recent-funnels-list">

                            {recentFunnels
                                .slice(0, 5)
                                .map(
                                    (funnel) => (

                                        <div
                                            className="recent-funnel-item"
                                            key={
                                                funnel.id
                                            }
                                        >

                                            <div className="recent-funnel-info">

                                                <h3>
                                                    {
                                                        funnel.campaign ||
                                                        `${funnel.propertyType} Campaign`
                                                    }
                                                </h3>

                                                <p>

                                                    {
                                                        funnel.propertyType
                                                    }

                                                    {" • "}

                                                    {
                                                        funnel.audience
                                                    }

                                                    {" • "}

                                                    {
                                                        funnel.location
                                                    }

                                                </p>

                                            </div>


                                            <div className="recent-funnel-meta">

                                                <span className="funnel-status">

                                                    {
                                                        funnel.status
                                                    }

                                                </span>


                                                <small>

                                                    {
                                                        new Date(
                                                            funnel.created_at
                                                        ).toLocaleDateString()
                                                    }

                                                </small>

                                            </div>

                                        </div>

                                    )
                                )}

                        </div>

                    )}

                </section>


            </div>

        </DashboardLayout>

    );

}

