import {
    useEffect,
    useState
} from "react";

import {
    useNavigate
} from "react-router-dom";

import {
    useAuth
} from "../context/AuthContext";

import Button
    from "../components/Button";

import Card
    from "../components/Card";

import DashboardLayout
    from "../layouts/DashboardLayout";

import api
    from "../api/axios";

import "./Account.css"

export default function Account() {

    const navigate =
        useNavigate();

const {
    logout
} = useAuth();

    const [
        user,
        setUser
    ] = useState(null);


    const [
        aiCredits,
        setAiCredits
    ] = useState(null);


    const [
        payments,
        setPayments
    ] = useState([]);


    const [
        loading,
        setLoading
    ] = useState(true);


    const [
        error,
        setError
    ] = useState("");


    const [
        paymentCurrentPage,
        setPaymentCurrentPage
    ] = useState(1);


    const [
        paymentLastPage,
        setPaymentLastPage
    ] = useState(1);


    const [
        purchasedCredits,
        setPurchasedCredits
    ] = useState(0);

    const [
    editingProfile,
    setEditingProfile
] = useState(false);

const [
    profileName,
    setProfileName
] = useState("");

const [
    profileEmail,
    setProfileEmail
] = useState("");

const [
    savingProfile,
    setSavingProfile
] = useState(false);


const [
    changingPassword,
    setChangingPassword
] = useState(false);

const [
    currentPassword,
    setCurrentPassword
] = useState("");

const [
    newPassword,
    setNewPassword
] = useState("");

const [
    confirmPassword,
    setConfirmPassword
] = useState("");

const [
    savingPassword,
    setSavingPassword
] = useState(false);






async function handleUpdateProfile() {

    try {

        setSavingProfile(true);

        const response =
            await api.patch(
                "/api/account/profile",
                {
                    name: profileName,
                    email: profileEmail
                }
            );


        const updatedUser =
            response.data.user;


        setUser(
            updatedUser
        );


        setEditingProfile(false);


        /*
        |--------------------------------------------------------------------------
        | If email changed, Laravel requires email verification again.
        |--------------------------------------------------------------------------
        */

        if (
            response.data.email_changed
        ) {

            alert(
                response.data.message
            );

        } else {

            alert(
                "Profile updated successfully."
            );

        }

    } catch (error) {

        console.error(
            "PROFILE UPDATE ERROR:",
            error.response?.data ||
            error.message
        );

    } finally {

        setSavingProfile(false);

    }
}



async function handleChangePassword() {

    try {

        setSavingPassword(true);


        const response =
            await api.patch(
                "/api/account/password",
                {
                    current_password:
                        currentPassword,

                    new_password:
                        newPassword,

                    new_password_confirmation:
                        confirmPassword
                }
            );


        /*
        |--------------------------------------------------------------------------
        | Clear Password Fields
        |--------------------------------------------------------------------------
        */

        setCurrentPassword("");

        setNewPassword("");

        setConfirmPassword("");


        setChangingPassword(false);


        alert(
            response.data.message ||
            "Password changed successfully."
        );

    } catch (error) {

        console.error(
            "PASSWORD CHANGE ERROR:",
            error.response?.data ||
            error.message
        );

    } finally {

        setSavingPassword(false);

    }
}















    async function loadAccount(
        paymentPage = 1
    ) {

        try {

            setLoading(true);

            setError("");


            const [
                userResponse,
                creditsResponse,
                paymentsResponse,
                purchasedCreditsResponse
            ] = await Promise.all([

                api.get(
                    "/api/user"
                ),

                api.get(
                    "/api/ai-credits"
                ),

                api.get(
                    `/api/payments/history?page=${paymentPage}`
                ),

                api.get(
                    "/api/credits/balance"
                )

            ]);


            /*
            |--------------------------------------------------------------------------
            | User
            |--------------------------------------------------------------------------
            */

            setUser(
                userResponse.data.user
            );


            /*
            |--------------------------------------------------------------------------
            | AI Credits
            |--------------------------------------------------------------------------
            */

            const creditData =
                creditsResponse.data;


            /*
            |--------------------------------------------------------------------------
            | Purchased Credits
            |--------------------------------------------------------------------------
            |
            | /api/ai-credits is now the main source of truth.
            |
            | We keep the separate balance request as a fallback so this
            | page remains compatible with the existing credit balance API.
            |
            */

            const purchasedBalance =
                creditData.purchased_credits ??
                purchasedCreditsResponse
                    .data
                    .purchased_credits ??
                0;


            setPurchasedCredits(
                purchasedBalance
            );


            /*
            |--------------------------------------------------------------------------
            | Store AI Credit Information
            |--------------------------------------------------------------------------
            */

            setAiCredits({

                /*
                | Credits used from the monthly allowance this month.
                */

                used:
                    creditData.used ??
                    creditData.ai_credits_used ??
                    creditData.aiCreditsUsed ??
                    creditData.generations ??
                    0,


                /*
                | Monthly included credit limit.
                */

                limit:
                    creditData.limit ??
                    creditData.ai_credit_limit ??
                    creditData.aiCreditsLimit ??
                    0,


                /*
                | Monthly credits that have not yet been used.
                */

                monthlyRemaining:
                    creditData.monthly_remaining ??
                    0,


                /*
                | Purchased credit balance.
                */

                purchased:
                    purchasedBalance,


                /*
                | Total credits actually available to generate AI.
                |
                | This includes:
                |
                | monthly remaining
                | +
                | purchased credits
                */

                remaining:
                    creditData.remaining ??
                    creditData.ai_credits_remaining ??
                    creditData.aiCreditsRemaining ??
                    0,


                /*
                | Monthly reset date.
                */

                resetDate:
                    creditData.resetDate ??
                    null

            });


            /*
            |--------------------------------------------------------------------------
            | Payments
            |--------------------------------------------------------------------------
            */

            const paymentData =
                paymentsResponse
                    .data
                    .payments;


            setPayments(
                paymentData?.data || []
            );


            setPaymentCurrentPage(
                paymentData?.current_page || 1
            );


            setPaymentLastPage(
                paymentData?.last_page || 1
            );


        } catch (error) {

            console.error(
                "ACCOUNT LOAD ERROR:",
                error.response?.data ||
                error.message
            );


            setError(
                error.response?.data?.message ||
                "Unable to load account information."
            );


        } finally {

            setLoading(false);

        }

    }


    useEffect(() => {

        loadAccount();

    }, []);


    function formatCurrency(
        amount,
        currency = "NGN"
    ) {

        return new Intl.NumberFormat(
            "en-NG",
            {
                style: "currency",
                currency
            }
        ).format(
            amount / 100
        );

    }


    function formatDate(
        date
    ) {

        if (!date) {

            return "N/A";

        }


        return new Date(
            date
        ).toLocaleDateString(
            "en-NG",
            {
                year: "numeric",
                month: "short",
                day: "numeric"
            }
        );

    }


    function formatPlan(
        plan
    ) {

        if (!plan) {

            return "Unknown";

        }


        return (
            plan.charAt(0).toUpperCase() +
            plan.slice(1)
        );

    }


    /*
    |--------------------------------------------------------------------------
    | AI Credit Values
    |--------------------------------------------------------------------------
    */

    const usedCredits =
        Number(
            aiCredits?.used || 0
        );


    const creditLimit =
        Number(
            aiCredits?.limit || 0
        );


    const monthlyRemaining =
        Number(
            aiCredits?.monthlyRemaining || 0
        );


    const totalRemaining =
        Number(
            aiCredits?.remaining || 0
        );


    const purchasedCreditBalance =
        Number(
            aiCredits?.purchased ??
            purchasedCredits ??
            0
        );


    /*
    |--------------------------------------------------------------------------
    | Credit Progress
    |--------------------------------------------------------------------------
    |
    | The progress bar represents usage of the monthly included allowance.
    |
    | Purchased credits do not increase the monthly allowance.
    |
    */

    const creditProgress =
        creditLimit > 0
            ? Math.min(
                100,
                (
                    usedCredits /
                    creditLimit
                ) * 100
            )
            : 0;


    /*
    |--------------------------------------------------------------------------
    | Loading State
    |--------------------------------------------------------------------------
    */

    if (loading) {

        return (

            <DashboardLayout>

                <div className="account-page">

                    <div className="account-header">

                        <h1>
                            My Account
                        </h1>

                        <p>
                            Loading account information...
                        </p>

                    </div>

                </div>

            </DashboardLayout>

        );

    }


    /*
    |--------------------------------------------------------------------------
    | Error State
    |--------------------------------------------------------------------------
    */

    if (error) {

        return (

            <DashboardLayout>

                <div className="account-page">

                    <div className="account-header">

                        <h1>
                            My Account
                        </h1>

                    </div>


                    <div className="account-error">

                        {error}

                    </div>


                    <Button
                        text="Try Again"
                        onClick={() =>
                            loadAccount(
                                paymentCurrentPage
                            )
                        }
                    />

                </div>

            </DashboardLayout>

        );

    }


    /*
    |--------------------------------------------------------------------------
    | Account Page
    |--------------------------------------------------------------------------
    */

    return (

        <DashboardLayout>

            <div className="account-page">


                {/* =================================================
                    HEADER
                ================================================= */}

                <div className="account-header">

                    <h1>
                        My Account
                    </h1>

                    <p>
                        Manage your account,
                        subscription, billing
                        and AI usage.
                    </p>

                </div>


                {/* =================================================
                    ROW 1
                    PROFILE / SUBSCRIPTION / AI USAGE
                ================================================= */}

                <div className="account-card-row account-top-row">


                    {/* PROFILE */}

                    <Card
                        title="Profile"
                        className="account-card account-profile-card"
                    >






















<div className="account-profile">

    {!editingProfile ? (

        <>
            <p>
                <strong>
                    Name:
                </strong>{" "}
                {user?.name || "N/A"}
            </p>


            <p>
                <strong>
                    Email:
                </strong>{" "}
                {user?.email || "N/A"}
            </p>


            <p>
                <strong>
                    Member Since:
                </strong>{" "}
                {formatDate(
                    user?.created_at
                )}
            </p>


            <Button
                text="Edit Profile"
                onClick={() => {

                    setProfileName(
                        user?.name || ""
                    );

                    setProfileEmail(
                        user?.email || ""
                    );

                    setEditingProfile(
                        true
                    );

                }}
            />

        </>

    ) : (

        <div className="account-profile-edit">

            <div
                style={{
                    marginBottom: "16px"
                }}
            >

                <label
                    style={{
                        display: "block",
                        marginBottom: "6px",
                        fontWeight: "600"
                    }}
                >
                    Name
                </label>

                <input
                    type="text"
                    value={profileName}
                    onChange={(event) =>
                        setProfileName(
                            event.target.value
                        )
                    }
                    placeholder="Your name"
                    style={{
                        width: "100%",
                        padding: "10px",
                        border: "1px solid #ccc",
                        borderRadius: "6px"
                    }}
                />

            </div>


            <div
                style={{
                    marginBottom: "16px"
                }}
            >

                <label
                    style={{
                        display: "block",
                        marginBottom: "6px",
                        fontWeight: "600"
                    }}
                >
                    Email
                </label>

                <input
                    type="email"
                    value={profileEmail}
                    onChange={(event) =>
                        setProfileEmail(
                            event.target.value
                        )
                    }
                    placeholder="Your email"
                    style={{
                        width: "100%",
                        padding: "10px",
                        border: "1px solid #ccc",
                        borderRadius: "6px"
                    }}
                />

            </div>


            <div
                style={{
                    display: "flex",
                    gap: "10px",
                    flexWrap: "wrap"
                }}
            >

                <Button
                    text={
                        savingProfile
                            ? "Saving..."
                            : "Save Changes"
                    }
                    disabled={
                        savingProfile
                    }
                    onClick={
                        handleUpdateProfile
                    }
                />


                <Button
                    text="Cancel"
                    variant="secondary"
                    disabled={
                        savingProfile
                    }
                    onClick={() =>
                        setEditingProfile(
                            false
                        )
                    }
                />

            </div>

        </div>

    )}

</div>














                    </Card>



                    {/* SUBSCRIPTION */}

                    <Card
                        title="Subscription"
                        className="account-card account-subscription-card"
                    >

                        <div className="account-subscription">


                            <p>

                                <strong>
                                    Current Plan:
                                </strong>{" "}

                                {formatPlan(
                                    user?.plan
                                )}

                            </p>


                            <p>

                                <strong>
                                    Subscription Status:
                                </strong>{" "}

                                {user?.plan === "free"
                                    ? "Free"
                                    : "Active"}

                            </p>


                            <p>

                                <strong>
                                    AI Credits:
                                </strong>{" "}

                                {totalRemaining}

                                {" / "}

                                {creditLimit}

                            </p>


                            <Button
                                text={
                                    user?.plan === "pro"
                                        ? "View Pro Plan"
                                        : "Upgrade to Pro"
                                }
                                onClick={() =>
                                    navigate(
                                        "/pricing"
                                    )
                                }
                            />

                        </div>

                    </Card>



                    {/* AI USAGE */}

                    <Card
                        title="AI Usage"
                        className="account-card account-usage-card"
                    >

                        <div className="account-usage">


                            <p>

                                <strong>
                                    Credits Used This Month:
                                </strong>{" "}

                                {usedCredits}

                            </p>


                            <p>

                                <strong>
                                    Monthly Credits Remaining:
                                </strong>{" "}

                                {monthlyRemaining}

                            </p>


                            <p>

                                <strong>
                                    Purchased Credits:
                                </strong>{" "}

                                {purchasedCreditBalance}

                            </p>


                            <p>

                                <strong>
                                    Total Credits Available:
                                </strong>{" "}

                                {totalRemaining}

                            </p>


                            <p>

                                <strong>
                                    Monthly Credit Limit:
                                </strong>{" "}

                                {creditLimit}

                            </p>


                            <div className="account-credit-bar">

                                <div
                                    className="account-credit-progress"
                                    style={{
                                        width:
                                            `${creditProgress}%`
                                    }}
                                />

                            </div>


                        </div>

                    </Card>


                </div>



                {/* =================================================
                    ROW 2
                    BILLING / UPGRADE / AI CREDITS
                ================================================= */}

                <div className="account-card-row account-bottom-row">


                    {/* BILLING */}

                    <Card
                        title="Billing"
                        className="account-card account-billing-card"
                    >

                        {payments.length === 0 ? (

                            <div className="empty-payments">

                                <p>
                                    No payment history yet.
                                </p>


                                <Button
                                    text="View Pricing"
                                    onClick={() =>
                                        navigate(
                                            "/pricing"
                                        )
                                    }
                                />

                            </div>

                        ) : (

                            <div className="payment-history">

                                {payments.map(
                                    (payment) => (

                                        <div
                                            className="payment-row"
                                            key={payment.id}
                                        >

                                            <div>

                                                <strong>

                                                    {formatPlan(
                                                        payment.plan
                                                    )}{" "}

                                                    Plan

                                                </strong>


                                                <p>

                                                    {
                                                        payment.reference
                                                    }

                                                </p>

                                            </div>



                                            <div>

                                                <strong>

                                                    {formatCurrency(
                                                        payment.amount,
                                                        payment.currency
                                                    )}

                                                </strong>


                                                <p>

                                                    {formatDate(
                                                        payment.paid_at
                                                    )}

                                                </p>

                                            </div>



                                            <div>

                                                <span
                                                    className={
                                                        payment.status ===
                                                        "success"
                                                            ? "payment-status payment-success"
                                                            : "payment-status"
                                                    }
                                                >

                                                    {
                                                        payment.status
                                                    }

                                                </span>

                                            </div>


                                        </div>

                                    )
                                )}

                            </div>

                        )}



                        {/* BILLING PAGINATION */}

                        {payments.length > 0 && (

                            <div className="payment-pagination">

                                <Button
                                    text="Previous"
                                    variant="secondary"
                                    disabled={
                                        paymentCurrentPage === 1
                                    }
                                    onClick={() =>
                                        loadAccount(
                                            paymentCurrentPage - 1
                                        )
                                    }
                                />


                                <span>

                                    Page{" "}

                                    {paymentCurrentPage}{" "}

                                    of{" "}

                                    {paymentLastPage}

                                </span>


                                <Button
                                    text="Next"
                                    variant="secondary"
                                    disabled={
                                        paymentCurrentPage ===
                                        paymentLastPage
                                    }
                                    onClick={() =>
                                        loadAccount(
                                            paymentCurrentPage + 1
                                        )
                                    }
                                />

                            </div>

                        )}

                    </Card>



                    {/* UPGRADE */}

                    <Card
                        title="Upgrade"
                        className="account-card account-upgrade-card"
                    >

                        {user?.plan === "pro" ? (

                            <div>

                                <h3>
                                    You're on Pro
                                </h3>

                                <p>
                                    You already have access
                                    to your Pro features
                                    and AI credits.
                                </p>

                            </div>

                        ) : (

                            <div>

                                <h3>
                                    Unlock Pro
                                </h3>


                                <ul>

                                    <li>
                                        ✓ 100 AI credits
                                    </li>

                                    <li>
                                        ✓ Unlimited funnels
                                    </li>

                                    <li>
                                        ✓ PDF export
                                    </li>

                                    <li>
                                        ✓ DOCX export
                                    </li>

                                    <li>
                                        ✓ Version history
                                    </li>

                                    <li>
                                        ✓ Public funnel sharing
                                    </li>

                                </ul>


                                <Button
                                    text="Upgrade to Pro"
                                    onClick={() =>
                                        navigate(
                                            "/pricing"
                                        )
                                    }
                                />

                            </div>

                        )}

                    </Card>



                    {/* AI CREDITS */}

                    <div className="account-card ai-credits-card">

                        <div className="ai-credits-header">

                            <h2>
                                AI Credits
                            </h2>

                        </div>


                        {/* TOTAL AVAILABLE */}

                        <div className="ai-credit-row">

                            <span>
                                Total Available
                            </span>

                            <strong>
                                {totalRemaining}
                            </strong>

                        </div>


                        {/* MONTHLY */}

                        <div className="ai-credit-row">

                            <span>
                                Monthly
                            </span>

                            <strong>

                                {usedCredits}

                                {" / "}

                                {creditLimit}

                            </strong>

                        </div>


                        {/* MONTHLY REMAINING */}

                        <div className="ai-credit-row">

                            <span>
                                Monthly Remaining
                            </span>

                            <strong>
                                {monthlyRemaining}
                            </strong>

                        </div>


                        {/* PURCHASED */}

                        <div className="ai-credit-row">

                            <span>
                                Purchased
                            </span>

                            <strong>
                                {purchasedCreditBalance}
                            </strong>

                        </div>


                        {/* ACTIONS */}

                        <div className="credit-actions">

                            <button
                                type="button"
                                onClick={() =>
                                    navigate(
                                        "/pricing"
                                    )
                                }
                            >
                                Buy 100
                            </button>


                            <button
                                type="button"
                                onClick={() =>
                                    navigate(
                                        "/pricing"
                                    )
                                }
                            >
                                Buy 500
                            </button>


                            <button
                                type="button"
                                onClick={() =>
                                    navigate(
                                        "/pricing"
                                    )
                                }
                            >
                                Buy 1,000
                            </button>

                        </div>

                    </div>


                </div>



                {/* =================================================
                    ACCOUNT ACTIONS
                ================================================= */}










            <Card
    title="Account Actions"
    className="account-actions-card"
>

    <div className="account-actions">


        {!changingPassword ? (

            <Button
                text="Change Password"
                onClick={() =>
                    setChangingPassword(
                        true
                    )
                }
            />

        ) : (

            <div
                style={{
                    width: "100%",
                    maxWidth: "500px"
                }}
            >

                <h3>
                    Change Password
                </h3>


                <p
                    style={{
                        marginBottom: "20px"
                    }}
                >
                    Enter your current password
                    and choose a new password.
                </p>


                {/* CURRENT PASSWORD */}

                <div
                    style={{
                        marginBottom: "16px"
                    }}
                >

                    <label
                        style={{
                            display: "block",
                            marginBottom: "6px",
                            fontWeight: "600"
                        }}
                    >
                        Current Password
                    </label>

                    <input
                        type="password"
                        value={
                            currentPassword
                        }
                        onChange={(event) =>
                            setCurrentPassword(
                                event.target.value
                            )
                        }
                        placeholder="Enter current password"
                        autoComplete="current-password"
                        style={{
                            width: "100%",
                            padding: "10px",
                            border: "1px solid #ccc",
                            borderRadius: "6px"
                        }}
                    />

                </div>


                {/* NEW PASSWORD */}

                <div
                    style={{
                        marginBottom: "16px"
                    }}
                >

                    <label
                        style={{
                            display: "block",
                            marginBottom: "6px",
                            fontWeight: "600"
                        }}
                    >
                        New Password
                    </label>

                    <input
                        type="password"
                        value={
                            newPassword
                        }
                        onChange={(event) =>
                            setNewPassword(
                                event.target.value
                            )
                        }
                        placeholder="Enter new password"
                        autoComplete="new-password"
                        style={{
                            width: "100%",
                            padding: "10px",
                            border: "1px solid #ccc",
                            borderRadius: "6px"
                        }}
                    />

                </div>


                {/* CONFIRM PASSWORD */}

                <div
                    style={{
                        marginBottom: "20px"
                    }}
                >

                    <label
                        style={{
                            display: "block",
                            marginBottom: "6px",
                            fontWeight: "600"
                        }}
                    >
                        Confirm New Password
                    </label>

                    <input
                        type="password"
                        value={
                            confirmPassword
                        }
                        onChange={(event) =>
                            setConfirmPassword(
                                event.target.value
                            )
                        }
                        placeholder="Confirm new password"
                        autoComplete="new-password"
                        style={{
                            width: "100%",
                            padding: "10px",
                            border: "1px solid #ccc",
                            borderRadius: "6px"
                        }}
                    />

                </div>


                <div
                    style={{
                        display: "flex",
                        gap: "10px",
                        flexWrap: "wrap"
                    }}
                >

                    <Button
                        text={
                            savingPassword
                                ? "Changing..."
                                : "Change Password"
                        }
                        disabled={
                            savingPassword
                        }
                        onClick={
                            handleChangePassword
                        }
                    />


                    <Button
                        text="Cancel"
                        variant="secondary"
                        disabled={
                            savingPassword
                        }
                        onClick={() => {

                            setChangingPassword(
                                false
                            );

                            setCurrentPassword(
                                ""
                            );

                            setNewPassword(
                                ""
                            );

                            setConfirmPassword(
                                ""
                            );

                        }}
                    />

                </div>

            </div>

        )}


        {/* LOGOUT */}

        {!changingPassword && (

      <Button
    text="Logout"
    onClick={async () => {

        try {

            await logout();

        } catch (error) {

            console.error(
                "LOGOUT ERROR:",
                error
            );

        }

    }}
/>

        )}

    </div>

</Card>













            </div>

        </DashboardLayout>

    );

}