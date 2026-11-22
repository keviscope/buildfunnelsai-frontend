import "./PrintableFunnel.css";

export default function PrintableFunnel({ funnel }) {

    if (!funnel) {
        return null;
    }

    return (
        <div className="printable-funnel">

            {/* Header */}

            <header className="print-header">

                <h1>FUNNEL AI BUILDER</h1>

                <p>Marketing Funnel Report</p>

                <h2>{funnel.campaign}</h2>

            </header>


            {/* Campaign Details */}

            <section className="print-section">

                <h2>Campaign Details</h2>

                <div className="campaign-details">

                    <p>
                        <strong>Property Type:</strong>{" "}
                        {funnel.propertyType}
                    </p>

                    <p>
                        <strong>Bedrooms:</strong>{" "}
                        {funnel.bedrooms}
                    </p>

                    <p>
                        <strong>Budget:</strong>{" "}
                        {funnel.budgetLevel}
                    </p>

                    <p>
                        <strong>Audience:</strong>{" "}
                        {funnel.audience}
                    </p>

                    <p>
                        <strong>Location:</strong>{" "}
                        {funnel.location}
                    </p>

                    <p>
                        <strong>Offer:</strong>{" "}
                        {funnel.offer}
                    </p>

                </div>

            </section>


            {/* Lead Magnet */}

            <section className="print-section">

                <h2>Lead Magnet</h2>

                <p>
                    {funnel.lead_magnet}
                </p>

            </section>


            {/* Landing Page */}

            <section className="print-section">

                <h2>Landing Page</h2>

                <h3>
                    {funnel.landing_page?.headline}
                </h3>

                <p>
                    {funnel.landing_page?.subheadline}
                </p>


                <h4>Benefits</h4>

                <ul>

                    {funnel.landing_page?.benefits?.map(
                        (benefit, index) => (

                            <li key={index}>
                                {benefit}
                            </li>

                        )
                    )}

                </ul>


                <h4>Call To Action</h4>

                <p>
                    {funnel.landing_page?.cta}
                </p>

            </section>


            {/* Facebook Ad */}

            <section className="print-section">

                <h2>Facebook Ad</h2>

                <p>
                    {funnel.facebook_ad}
                </p>

            </section>


            {/* Instagram Ad */}

            <section className="print-section">

                <h2>Instagram Ad</h2>

                <p>
                    {funnel.instagram_ad}
                </p>

            </section>


            {/* Email */}

            <section className="print-section">

                <h2>Email</h2>

                <p>
                    {funnel.email}
                </p>

            </section>


            {/* WhatsApp */}

            <section className="print-section">

                <h2>WhatsApp</h2>

                <p>
                    {funnel.whatsapp}
                </p>

            </section>


            {/* Thank You */}

            <section className="print-section">

                <h2>Thank You Page</h2>

                <p>
                    {funnel.thank_you}
                </p>

            </section>


            {/* Footer */}

            <footer className="print-footer">

                Funnel AI Builder • Marketing Funnel Report

            </footer>

        </div>
    );
}