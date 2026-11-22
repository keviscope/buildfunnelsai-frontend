import { useEffect, useState } from "react";
import {
    useNavigate,
    useSearchParams
} from "react-router-dom";

import Button from "../components/Button";
import DashboardLayout from "../layouts/DashboardLayout";
import api from "../api/axios";
import { analytics } from "../analytics";



export default function CreditPurchaseVerification() {

    const navigate = useNavigate();

    const [searchParams] =
        useSearchParams();

    const reference =
        searchParams.get("reference");


    const [status, setStatus] =
        useState("verifying");


    const [message, setMessage] =
        useState(
            "Verifying your credit purchase..."
        );


    const [creditsAdded, setCreditsAdded] =
        useState(0);


    useEffect(() => {

        async function verifyPurchase() {

            if (!reference) {

                setStatus("error");

                setMessage(
                    "No payment reference was found."
                );

                return;

            }


            try {

                const response =
                    await api.get(
                        `/api/credits/verify/${encodeURIComponent(reference)}`
                    );


                const data =
                    response.data;


                console.log(
                    "CREDIT PURCHASE VERIFICATION:",
                    data
                );


   setCreditsAdded(
    data.credits_added || 0
);


analytics.aiCreditsPurchased({
    credits_added: data.credits_added || 0,
    payment_reference: reference
});


setStatus("success");


setMessage(
    data.message ||
    "Credit purchase successful."
);



            } catch (error) {

                const data =
                    error.response?.data;


                console.error(
                    "CREDIT PURCHASE ERROR:",
                    data ||
                    error.message
                );


                setStatus(
                    data?.payment_status === "abandoned"
                        ? "abandoned"
                        : data?.payment_status === "failed"
                        ? "failed"
                        : "error"
                );


                setMessage(
                    data?.message ||
                    "We could not verify your credit purchase."
                );

            }

        }


        verifyPurchase();

    }, [reference]);


    return (

        <DashboardLayout>

            <div className="payment-verification-page">


                {status === "verifying" && (

                    <>

                        <div className="payment-status-icon">
                            ⏳
                        </div>

                        <h1>
                            Verifying Credit Purchase
                        </h1>

                        <p>
                            {message}
                        </p>

                    </>

                )}


                {status === "success" && (

                    <>

                        <div className="payment-status-icon">
                            ✓
                        </div>

                        <h1>
                            Credits Added Successfully
                        </h1>

                        <p>
                            {message}
                        </p>


                        <h3>
                            +{creditsAdded} AI Credits
                        </h3>


                        <div className="payment-reference">

                            <strong>
                                Payment Reference
                            </strong>

                            <code>
                                {reference}
                            </code>

                        </div>


                        <Button
                            text="Go to Account"
                            onClick={() =>
                                navigate("/account")
                            }
                        />

                    </>

                )}


                {(
                    status === "failed" ||
                    status === "abandoned"
                ) && (

                    <>

                        <div className="payment-status-icon">
                            !
                        </div>


                        <h1>

                            {status === "abandoned"
                                ? "Credit Purchase Abandoned"
                                : "Credit Purchase Failed"}

                        </h1>


                        <p>
                            {message}
                        </p>


                        <div className="payment-verification-actions">

                            <Button
                                text="Try Again"
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

                    </>

                )}


                {status === "error" && (

                    <>

                        <div className="payment-status-icon">
                            !
                        </div>


                        <h1>
                            Credit Purchase Verification Failed
                        </h1>


                        <p>
                            {message}
                        </p>


                        <div className="payment-verification-actions">

                            <Button
                                text="Back to Pricing"
                                onClick={() =>
                                    navigate("/pricing")
                                }
                            />

                        </div>

                    </>

                )}

            </div>

        </DashboardLayout>

    );

}
