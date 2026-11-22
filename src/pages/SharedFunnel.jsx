import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function SharedFunnel() {

    const { share_token } = useParams();

    const [funnel, setFunnel] = useState(null);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");



    useEffect(() => {

        async function loadFunnel() {

            try {

                const response = await fetch(
                    `https://api.buildfunnelsai.com/api/share/${share_token}`
                );

                const data = await response.json();

                if (!response.ok) {

                    throw new Error(
                        data.message || "Funnel not found."
                    );

                }

                setFunnel(data.funnel);

            } catch (error) {

                console.error(error);

                setError(
                    error.message || "Failed to load funnel."
                );

            } finally {

                setLoading(false);

            }

        }

        loadFunnel();

    }, [share_token]);



    if (loading) {

        return (
            <div>
                <h2>Loading Funnel...</h2>
            </div>
        );

    }



    if (error || !funnel) {

        return (
            <div>
                <h2>Unable to Load Funnel</h2>

                <p>
                    {error || "Funnel not found."}
                </p>
            </div>
        );

    }



    return (

        <div>

            <h1>
                {funnel.campaign}
            </h1>


            <hr />


            {/* Campaign Details */}

            <h2>
                Campaign Details
            </h2>

            <p>
                <strong>Property Type:</strong>{" "}
                {funnel.propertyType}
            </p>

            <p>
                <strong>Bedrooms:</strong>{" "}
                {funnel.bedrooms}
            </p>

            <p>
                <strong>Location:</strong>{" "}
                {funnel.location}
            </p>

            <p>
                <strong>Offer:</strong>{" "}
                {funnel.offer}
            </p>


            <hr />


            {/* Lead Magnet */}

            <h2>
                Lead Magnet
            </h2>

            <p>
                {funnel.lead_magnet}
            </p>


            <hr />


            {/* Landing Page */}

            <h2>
                Landing Page
            </h2>

            {funnel.landing_page && (

                <LandingPage
                    landingPage={funnel.landing_page}
                />

            )}


            <hr />


            {/* Facebook */}

            <h2>
                Facebook Ad
            </h2>

            <p>
                {funnel.facebook_ad}
            </p>


            <hr />


            {/* Instagram */}

            <h2>
                Instagram Ad
            </h2>

            <p>
                {funnel.instagram_ad}
            </p>


            <hr />


            {/* WhatsApp */}

            <h2>
                WhatsApp
            </h2>

            <p>
                {funnel.whatsapp}
            </p>


            <hr />


            {/* Email */}

            <h2>
                Email
            </h2>

            <p>
                {funnel.email}
            </p>


            <hr />


            {/* Thank You */}

            <h2>
                Thank You Page
            </h2>

            <p>
                {funnel.thank_you}
            </p>

        </div>

    );

}



function LandingPage({ landingPage }) {

    let data = landingPage;

    if (typeof landingPage === "string") {

        try {

            data = JSON.parse(landingPage);

        } catch {

            return (
                <p>
                    {landingPage}
                </p>
            );

        }

    }


    return (

        <>

            <h3>
                {data.headline}
            </h3>

            <p>
                {data.subheadline}
            </p>


            <strong>
                Benefits
            </strong>

            <ul>

                {(data.benefits || []).map(
                    (benefit, index) => (

                        <li key={index}>
                            {benefit}
                        </li>

                    )
                )}

            </ul>


            <strong>
                Call To Action
            </strong>

            <p>
                {data.cta}
            </p>

        </>

    );

}
