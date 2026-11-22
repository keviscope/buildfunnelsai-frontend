import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

import Button from "../components/Button";
import DashboardLayout from "../layouts/DashboardLayout";
import api from "../api/axios";
import { analytics } from "../analytics";



export default function PaymentVerification() {
console.log("PAYMENT VERIFICATION PAGE MOUNTED");
    const navigate = useNavigate();

    const [searchParams] =
        useSearchParams();

    const reference =
        searchParams.get("reference");
    console.log("PAYMENT REFERENCE:", reference);


    const [status, setStatus] =
        useState("verifying");


    const [paymentStatus, setPaymentStatus] =
        useState("");


    const [message, setMessage] =
        useState(
            "Verifying your payment..."
        );



























   








useEffect(() => {
    let cancelled = false;

    async function verifyPayment() {
        if (!reference) {
            setStatus("error");
            setMessage("No payment reference was found.");
            return;
        }

        setStatus("verifying");
        setMessage("Verifying your payment...");

        for (let attempt = 1; attempt <= 3; attempt++) {
            try {
                const response = await api.get(
                    `/api/payments/verify/${encodeURIComponent(reference)}`
                );

                if (cancelled) return;

                const data = response.data;
                const returnedStatus = data.payment_status;

                // Only report a failure when the API explicitly confirms it.
                if (
                    returnedStatus === "failed" ||
                    returnedStatus === "abandoned"
                ) {
                    setPaymentStatus(returnedStatus);
                    setStatus(returnedStatus);
                    setMessage(
                        data.message ||
                        (returnedStatus === "abandoned"
                            ? "The payment was abandoned."
                            : "The payment failed.")
                    );

                    analytics.paymentFailed({
                        plan: data.plan || "pro",
                        payment_status: returnedStatus,
                        status_code: response.status
                    });

                    return;
                }

                // Do not treat an inconclusive API response as success.
                if (
                    data.verified !== true &&
                    returnedStatus !== "success"
                ) {
                    throw new Error(
                        data.message ||
                        "The payment status could not be confirmed."
                    );
                }

                setPaymentStatus("success");

                analytics.paymentCompleted({
                    plan: data.plan || "pro",
                    amount: data.amount || null,
                    currency: data.currency || "NGN",
                    payment_status: "success"
                });

                setStatus("success");
                setMessage(
                    data.message ||
                    "Payment verified successfully."
                );

                return;
            } catch (error) {
                if (cancelled) return;

                const data = error.response?.data;
                const returnedStatus = data?.payment_status;

                console.error(
                    "PAYMENT VERIFICATION ERROR:",
                    data || error.message
                );

                // Handle explicitly confirmed failures separately.
                if (
                    returnedStatus === "failed" ||
                    returnedStatus === "abandoned"
                ) {
                    setPaymentStatus(returnedStatus);
                    setStatus(returnedStatus);
                    setMessage(
                        data?.message ||
                        "The payment was not successful."
                    );

                    analytics.paymentFailed({
                        plan: "pro",
                        payment_status: returnedStatus,
                        status_code: error.response?.status || null
                    });

                    return;
                }

                // Retry verification, never the payment itself.
                if (attempt < 3) {
                    await new Promise(resolve =>
                        setTimeout(resolve, attempt * 1000)
                    );

                    if (cancelled) return;
                } else {
                    setStatus("error");
                    setMessage(
                        "We couldn't confirm your payment status. " +
                        "If you were charged, please do not pay again. " +
                        "Keep your payment reference and check your account."
                    );
                }
            }
        }
    }

    verifyPayment();

    return () => {
        cancelled = true;
    };
}, [reference]);











    if (status === "verifying") {

        return (

            <DashboardLayout>

                <div className="payment-verification-page">

                    <div className="payment-status-icon">
                        ⏳
                    </div>

                    <h1>
                        Verifying Payment
                    </h1>

                    <p>
                        {message}
                    </p>

                </div>

            </DashboardLayout>

        );

    }


    if (status === "success") {

        return (

            <DashboardLayout>

                <div className="payment-verification-page">

                    <div className="payment-status-icon">
                        ✓
                    </div>

                    <h1>
                        Payment Successful
                    </h1>

                    <p>
                        {message}
                    </p>


                    <div className="payment-reference">

                        <strong>
                            Payment Reference
                        </strong>

                        <code>
                            {reference}
                        </code>

                    </div>


                    <p>
                        Your account has been updated.
                    </p>


                    <Button
                        text="Go to Account"
                        onClick={() =>
                            navigate("/account")
                        }
                    />

                </div>

            </DashboardLayout>

        );

    }


    if (
        status === "failed" ||
        status === "abandoned"
    ) {

        return (

            <DashboardLayout>

                <div className="payment-verification-page">

                    <div className="payment-status-icon">
                        !
                    </div>


                    <h1>

                        {status === "abandoned"
                            ? "Payment Abandoned"
                            : "Payment Failed"}

                    </h1>


                    <p>
                        {message}
                    </p>


                    {reference && (

                        <div className="payment-reference">

                            <strong>
                                Payment Reference
                            </strong>

                            <code>
                                {reference}
                            </code>

                        </div>

                    )}


                    <div className="payment-verification-actions">

                        <Button
                            text="Retry Payment"
                            onClick={() =>
                                navigate("/pricing")
                            }
                        />

                        <Button
                            text="Go to Account"
                            onClick={() =>
                                navigate("/account")
                            }
                        />

                    </div>

                </div>

            </DashboardLayout>

        );

    }


    return (

        <DashboardLayout>

            <div className="payment-verification-page">

                <div className="payment-status-icon">
                    !
                </div>


                <h1>
                    Payment Verification Failed
                </h1>


                <p>
                    {message}
                </p>


                {reference && (

                    <div className="payment-reference">

                        <strong>
                            Payment Reference
                        </strong>

                        <code>
                            {reference}
                        </code>

                    </div>

                )}


          <div className="payment-verification-actions">
    <Button
        text="Check Again"
        onClick={() => window.location.reload()}
    />

    <Button
        text="Go to Account"
        onClick={() => navigate("/account")}
    />
</div>

            </div>

        </DashboardLayout>

    );

}

