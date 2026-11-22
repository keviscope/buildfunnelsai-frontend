import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../components/Button";
import Card from "../components/Card";
import DashboardLayout from "../layouts/DashboardLayout";
import api from "../api/axios";
import { analytics } from "../analytics";



export default function Pricing() {
const navigate = useNavigate();


const [loading, setLoading] = useState(false);
const [error, setError] = useState("");

const [creditPackages, setCreditPackages] = useState([]);
const [creditLoading, setCreditLoading] = useState(null);




async function loadCreditPackages() {
    try {
        const response = await api.get("/api/credit-packages");

        console.log("CREDIT PACKAGES:", response.data);

        const packages = response.data.packages || {};

        setCreditPackages(
            Object.values(packages)
        );
    } catch (error) {
        console.error(
            "CREDIT PACKAGE ERROR:",
            error.response?.data || error.message
        );
    }
}

useEffect(() => {
    loadCreditPackages();
}, []);








async function buyCredits(packageKey) {

    setCreditLoading(packageKey);

    try {

        const response = await api.post(
            `/api/credits/purchase/${packageKey}`
        );

        console.log(
            "CREDIT PURCHASE INITIALIZED:",
            response.data
        );

        if (response.data.authorization_url) {

            window.location.href =
                response.data.authorization_url;

        }

    } catch (error) {

        console.error(
            "CREDIT PURCHASE ERROR:",
            error.response?.data || error.message
        );

        alert(
            error.response?.data?.message ||
            "Unable to initialize credit purchase."
        );

    } finally {

        setCreditLoading(null);

    }
}




















async function upgradeToPro() {
    try {
        setLoading(true);
        setError("");

        analytics.planUpgradeStarted({
            plan: "pro"
        });

        const response = await api.post(
            "/api/payments/pro/initialize"
        );

        console.log(
            "PAYMENT INITIALIZED:",
            response.data
        );

        const authorizationUrl =
            response.data.authorization_url;

        if (!authorizationUrl) {
            setError(
                "Unable to start payment."
            );

            return;
        }

        window.location.href =
            authorizationUrl;

    } catch (error) {
        console.error(
            "PAYMENT INITIALIZATION ERROR:",
            error.response?.data ||
            error.message
        );

        setError(
            error.response?.data?.message ||
            "Unable to start payment. Please try again."
        );

    } finally {
        setLoading(false);
    }
}













return (
    <DashboardLayout>

        <div className="pricing-page">

            {/* TEMPORARY DEBUG
            <pre>
                {JSON.stringify(
                    creditPackages,
                    null,
                    2
                )}
            </pre> */}

            {/* HEADER */}

            <div className="pricing-header">

                <h1>
                    Choose Your Plan
                </h1>

                <p>
                    Get the AI credits and funnel features you need to grow.
                </p>

            </div>

            {/* ERROR */}

            {error && (
                <div className="pricing-error">
                    {error}
                </div>
            )}

            {/* PLANS */}

            <div className="pricing-grid">

                {/* FREE */}

                <Card title="Free">

                    <div className="pricing-price">

                        <span>
                            ₦0
                        </span>

                        <small>
                            / month
                        </small>

                    </div>

                    <p className="pricing-description">
                        Get started with the basics.
                    </p>

                    <ul className="pricing-features">

                        <li>
                            ✓ 10 AI credits
                        </li>

                        <li>
                            ✓ Up to 5 funnels
                        </li>

                        <li>
                            ✓ Funnel generation
                        </li>

                        <li>
                            ✓ Basic support
                        </li>

                    </ul>

                    <Button
                        text="Current Plan"
                        disabled
                    />

                </Card>

                {/* PRO */}

                <Card title="Pro">

                    <div className="pricing-price">

                        <span>
                            ₦10,000
                        </span>

                        <small>
                            / month
                        </small>

                    </div>

                    <p className="pricing-description">
                        For growing businesses that need more power.
                    </p>

                    <ul className="pricing-features">

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
                        text={
                            loading
                                ? "Starting Payment..."
                                : "Upgrade to Pro"
                        }
                        disabled={loading}
                        onClick={upgradeToPro}
                    />

                </Card>

                {/* AGENCY */}

                <Card title="Agency">

                    <div className="pricing-price">

                        <span>
                            Custom
                        </span>

                    </div>

                    <p className="pricing-description">
                        Built for teams and higher-volume funnel production.
                    </p>

                    <ul className="pricing-features">

                        <li>
                            ✓ 500 AI credits
                        </li>

                        <li>
                            ✓ Unlimited funnels
                        </li>

                        <li>
                            ✓ Advanced features
                        </li>

                        <li>
                            ✓ Team features
                        </li>

                        <li>
                            ✓ Priority support
                        </li>

                    </ul>

                    <Button
                        text="Contact Us"
                        onClick={() =>
                            alert(
                                "Agency plan coming soon."
                            )
                        }
                    />

                </Card>

            </div>

            {/* CREDIT PURCHASE */}

            <section className="credit-purchase-section">

                <div className="credit-purchase-header">

                    <h2>
                        Need more AI credits?
                    </h2>

                    <p>
                        Purchase additional AI credits whenever you need them.
                    </p>

                </div>

                <div className="credit-package-grid">

                    {creditPackages.map((pkg) => (

                        <div
                            key={pkg.credits}
                            className="credit-package-card"
                        >

                            <h3>
                                {pkg.name}
                            </h3>

                            <p className="credit-package-price">

                                ₦
                                {Number(
                                    pkg.price
                                ).toLocaleString()}

                            </p>

                            <button
                                onClick={() =>
                                    buyCredits(
                                        String(pkg.credits)
                                    )
                                }
                                disabled={creditLoading !== null}
                                className="credit-buy-button"
                            >

                                {creditLoading === String(pkg.credits)
    ? "Processing..."
    : `Buy ${pkg.credits.toLocaleString()}`}

                            </button>

                        </div>

                    ))}

                </div>

            </section>

            {/* BACK */}

            <div className="pricing-back">

                <Button
                    text="Back to Account"
                    onClick={() =>
                        navigate("/account")
                    }
                />

            </div>

        </div>

    </DashboardLayout>
);


}
