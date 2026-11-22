import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Landing() {

    const navigate = useNavigate();

    const { user } = useAuth();

    const [openFaq, setOpenFaq] = useState(null);


    function goToRegister() {

        navigate("/register");

    }


    function goToLogin() {

        navigate("/login");

    }


    function goToDashboard() {

        navigate("/dashboard");

    }


    function goToPricing() {

        navigate("/pricing");

    }


    function toggleFaq(index) {

        setOpenFaq(
            openFaq === index
                ? null
                : index
        );

    }


    const faqItems = [

        {
            question:
                "What exactly does Funnel AI Builder create?",

            answer:
                "Funnel AI Builder turns your property and campaign information into a complete marketing funnel. Depending on the information you provide, this can include a lead magnet, landing page copy, Facebook ad, Instagram ad, WhatsApp follow-up, email content and thank-you page."
        },

        {
            question:
                "Who is Funnel AI Builder for?",

            answer:
                "It is built primarily for real estate agents, brokers, property marketers and agencies that need to market properties consistently without having to build every campaign from scratch."
        },

        {
            question:
                "Do I need to be a copywriter or marketing expert?",

            answer:
                "No. You provide the important information about the property, audience, location and offer. Funnel AI Builder uses that information to generate the marketing assets for the campaign."
        },

        {
            question:
                "Can I edit the generated funnel?",

            answer:
                "Yes. Your generated funnel is not locked. You can edit sections, regenerate sections, create variations and work with different versions of your marketing content."
        },

        {
            question:
                "Can I export my funnel?",

            answer:
                "Yes. The application supports exporting your funnel content, including PDF and Word documents, as well as the complete funnel package."
        },

        {
            question:
                "Can I share a funnel with someone else?",

            answer:
                "Yes. Public funnel sharing is available on plans that include the public sharing feature. You can generate a public link, copy it, disable sharing or regenerate the link."
        },

        {
            question:
                "Do I have to create an account before generating a funnel?",

            answer:
                "Yes. Your account gives you a place to store your funnels, track your AI usage and return to campaigns you've already created."
        }

    ];


    return (

        <div className="marketing-site">


            {/* =====================================================
                NAVIGATION
            ===================================================== */}

            <header className="marketing-nav">

                <div className="marketing-container marketing-nav-inner">


                    <button
                        type="button"
                        className="marketing-brand"
                        onClick={() =>
                            window.scrollTo({
                                top: 0,
                                behavior: "smooth"
                            })
                        }
                    >



                      
<span className="marketing-brand-mark">
    <img
        src="/logo.png"
        alt="BuildFunnelsAI logo"
        className="marketing-logo"
    />
</span>




                        <span>
                            Funnel AI Builder
                        </span>

                    </button>


                    <nav
                        className="marketing-nav-links"
                        aria-label="Main navigation"
                    >

                        <a href="#how-it-works">
                            How It Works
                        </a>

                        <a href="#benefits">
                            Benefits
                        </a>

                        <a href="#examples">
                            Examples
                        </a>

                        <a href="#pricing">
                            Pricing
                        </a>

                        <a href="#faq">
                            FAQ
                        </a>

                    </nav>


                    <div className="marketing-nav-actions">

                        {user ? (

                            <button
                                type="button"
                                className="marketing-nav-login"
                                onClick={goToDashboard}
                            >
                                Dashboard
                            </button>

                        ) : (

                            <>

                                <button
                                    type="button"
                                    className="marketing-nav-login"
                                    onClick={goToLogin}
                                >
                                    Log in
                                </button>

                                <button
                                    type="button"
                                    className="marketing-nav-register"
                                    onClick={goToRegister}
                                >
                                    Get Started
                                </button>

                            </>

                        )}

                    </div>

                </div>

            </header>


            {/* =====================================================
                HERO
            ===================================================== */}

            <main>


                <section className="marketing-hero">

                    <div className="marketing-container marketing-hero-grid">


                        <div className="marketing-hero-copy">


                            <div className="marketing-eyebrow">

                                <span>
                                    AI-powered real estate marketing
                                </span>

                            </div>


                            <h1>

                                Stop starting your property marketing
                                <span>
                                    from scratch.
                                </span>

                            </h1>


                            <p className="marketing-hero-lead">

                                Turn a property, an audience and an offer
                                into a complete marketing funnel —
                                without spending hours figuring out
                                what to write, what to offer or what
                                to send next.

                            </p>


                            <div className="marketing-hero-actions">

                                <button
                                    type="button"
                                    className="marketing-primary-button"
                                    onClick={
                                        user
                                            ? goToDashboard
                                            : goToRegister
                                    }
                                >

                                    {user
                                        ? "Go to Dashboard"
                                        : "Create Your First Funnel"
                                    }

                                    <span>
                                        →
                                    </span>

                                </button>


                                <a
                                    href="#how-it-works"
                                    className="marketing-secondary-button"
                                >
                                    See How It Works
                                </a>

                            </div>


                            <p className="marketing-hero-note">

                                No marketing team required.
                                No blank page staring contest.

                            </p>


                        </div>


                        {/* HERO PRODUCT VISUAL */}

                        <div className="marketing-hero-visual">


                            <div className="marketing-hero-glow" />


                            <div className="marketing-product-window">


                                <div className="marketing-window-top">

                                    <div className="marketing-window-dots">

                                        <span />
                                        <span />
                                        <span />

                                    </div>

                                    <span>
                                        Funnel AI Builder
                                    </span>

                                </div>


                                <div className="marketing-window-content">


                                    <div className="marketing-window-label">
                                        NEW CAMPAIGN
                                    </div>


                                    <h3>
                                        3-Bedroom Luxury Apartment
                                    </h3>


                                    <p>
                                        Lagos • Luxury Buyers •
                                        Property Viewing
                                    </p>


                                    <div className="marketing-generation-line">

                                        <span className="marketing-generation-icon">
                                            ✦
                                        </span>

                                        <div>

                                            <strong>
                                                AI Funnel Generated
                                            </strong>

                                            <small>
                                                Your campaign is ready to edit.
                                            </small>

                                        </div>

                                    </div>


                                    <div className="marketing-output-grid">

                                        <div>
                                            <span>01</span>
                                            <strong>Lead Magnet</strong>
                                        </div>

                                        <div>
                                            <span>02</span>
                                            <strong>Landing Page</strong>
                                        </div>

                                        <div>
                                            <span>03</span>
                                            <strong>Facebook Ad</strong>
                                        </div>

                                        <div>
                                            <span>04</span>
                                            <strong>WhatsApp</strong>
                                        </div>

                                        <div>
                                            <span>05</span>
                                            <strong>Email</strong>
                                        </div>

                                        <div>
                                            <span>06</span>
                                            <strong>Thank You Page</strong>
                                        </div>

                                    </div>


                                    <div className="marketing-window-footer">

                                        <span>
                                            Generated with Funnel AI Builder
                                        </span>

                                        <span>
                                            Ready to edit
                                        </span>

                                    </div>


                                </div>

                            </div>


                        </div>

                    </div>

                </section>


                {/* =====================================================
                    PROBLEM
                ===================================================== */}

                <section className="marketing-problem">

                    <div className="marketing-container marketing-narrow">


                        <span className="marketing-section-label">
                            THE REAL PROBLEM
                        </span>


                        <h2>

                            Selling property is already hard.

                            <span>
                                Marketing shouldn't make it harder.
                            </span>

                        </h2>


                        <p>

                            Every new property can create the same
                            exhausting cycle.

                        </p>


                        <div className="marketing-problem-list">


                            <div className="marketing-problem-item">

                                <span>01</span>

                                <div>

                                    <strong>
                                        “What should I say?”
                                    </strong>

                                    <p>
                                        You have the property.
                                        You know it is valuable.
                                        But turning that value into
                                        persuasive copy takes work.
                                    </p>

                                </div>

                            </div>


                            <div className="marketing-problem-item">

                                <span>02</span>

                                <div>

                                    <strong>
                                        “What should I offer?”
                                    </strong>

                                    <p>
                                        You need something that gives
                                        prospects a reason to raise their
                                        hand instead of simply scrolling past.
                                    </p>

                                </div>

                            </div>


                            <div className="marketing-problem-item">

                                <span>03</span>

                                <div>

                                    <strong>
                                        “What do I send them next?”
                                    </strong>

                                    <p>
                                        The ad is only the beginning.
                                        Leads still need landing pages,
                                        follow-up messages, emails and
                                        a clear next step.
                                    </p>

                                </div>

                            </div>


                        </div>


                        <div className="marketing-problem-transition">

                            <span>
                                That is exactly where Funnel AI Builder comes in.
                            </span>

                        </div>


                    </div>

                </section>


                {/* =====================================================
                    WHAT IT DOES
                ===================================================== */}

                <section className="marketing-feature-section">

                    <div className="marketing-container">


                        <div className="marketing-section-heading">

                            <span className="marketing-section-label">
                                ONE CAMPAIGN. COMPLETE SYSTEM.
                            </span>

                            <h2>
                                Give AI the property.
                                Get the marketing system.
                            </h2>

                            <p>
                                Funnel AI Builder takes the information
                                you already know about the property and
                                turns it into the pieces you need to
                                attract, capture and follow up with prospects.
                            </p>

                        </div>


                        <div className="marketing-assets-grid">


                            <div className="marketing-asset-card marketing-asset-large">

                                <span className="marketing-asset-number">
                                    01
                                </span>

                                <div className="marketing-asset-icon">
                                    ↓
                                </div>

                                <h3>
                                    Lead Magnet
                                </h3>

                                <p>
                                    Give potential buyers a reason to
                                    exchange attention for value.
                                </p>

                            </div>


                            <div className="marketing-asset-card">

                                <span className="marketing-asset-number">
                                    02
                                </span>

                                <div className="marketing-asset-icon">
                                    ◇
                                </div>

                                <h3>
                                    Landing Page
                                </h3>

                                <p>
                                    Turn interest into a clear next step.
                                </p>

                            </div>


                            <div className="marketing-asset-card">

                                <span className="marketing-asset-number">
                                    03
                                </span>

                                <div className="marketing-asset-icon">
                                    ↗
                                </div>

                                <h3>
                                    Facebook Ad
                                </h3>

                                <p>
                                    Create campaign messaging designed
                                    to attract the right audience.
                                </p>

                            </div>


                            <div className="marketing-asset-card">

                                <span className="marketing-asset-number">
                                    04
                                </span>

                                <div className="marketing-asset-icon">
                                    ◌
                                </div>

                                <h3>
                                    Instagram Ad
                                </h3>

                                <p>
                                    Adapt your campaign for another
                                    social channel.
                                </p>

                            </div>


                            <div className="marketing-asset-card">

                                <span className="marketing-asset-number">
                                    05
                                </span>

                                <div className="marketing-asset-icon">
                                    ◐
                                </div>

                                <h3>
                                    WhatsApp Follow-up
                                </h3>

                                <p>
                                    Continue the conversation after
                                    someone raises their hand.
                                </p>

                            </div>


                            <div className="marketing-asset-card">

                                <span className="marketing-asset-number">
                                    06
                                </span>

                                <div className="marketing-asset-icon">
                                    @
                                </div>

                                <h3>
                                    Email
                                </h3>

                                <p>
                                    Keep the conversation moving beyond
                                    the first interaction.
                                </p>

                            </div>


                            <div className="marketing-asset-card">

                                <span className="marketing-asset-number">
                                    07
                                </span>

                                <div className="marketing-asset-icon">
                                    ✓
                                </div>

                                <h3>
                                    Thank You Page
                                </h3>

                                <p>
                                    Give every campaign a deliberate
                                    destination after conversion.
                                </p>

                            </div>


                        </div>

                    </div>

                </section>


                {/* =====================================================
                    HOW IT WORKS
                ===================================================== */}

                <section
                    id="how-it-works"
                    className="marketing-how-section"
                >

                    <div className="marketing-container">


                        <div className="marketing-section-heading marketing-center">

                            <span className="marketing-section-label">
                                HOW IT WORKS
                            </span>

                            <h2>
                                From property details
                                to campaign-ready.
                            </h2>

                            <p>
                                You don't need to know how to build a funnel.
                                You just need to know what you're selling.
                            </p>

                        </div>


                        <div className="marketing-steps">


                            <div className="marketing-step">

                                <div className="marketing-step-number">
                                    1
                                </div>

                                <div>

                                    <h3>
                                        Tell us about your property
                                    </h3>

                                    <p>
                                        Choose the property type,
                                        bedrooms and budget level.
                                    </p>

                                </div>

                            </div>


                            <div className="marketing-step">

                                <div className="marketing-step-number">
                                    2
                                </div>

                                <div>

                                    <h3>
                                        Tell us about your audience
                                    </h3>

                                    <p>
                                        Define who you're trying to
                                        attract, where they are and
                                        what you're offering.
                                    </p>

                                </div>

                            </div>


                            <div className="marketing-step">

                                <div className="marketing-step-number">
                                    3
                                </div>

                                <div>

                                    <h3>
                                        Generate your funnel
                                    </h3>

                                    <p>
                                        AI turns those inputs into a
                                        complete marketing campaign.
                                    </p>

                                </div>

                            </div>


                            <div className="marketing-step">

                                <div className="marketing-step-number">
                                    4
                                </div>

                                <div>

                                    <h3>
                                        Edit and launch
                                    </h3>

                                    <p>
                                        Refine the sections, export your
                                        assets and put the campaign to work.
                                    </p>

                                </div>

                            </div>


                        </div>


                    </div>

                </section>


                {/* =====================================================
                    BENEFITS
                ===================================================== */}

                <section
                    id="benefits"
                    className="marketing-benefits-section"
                >

                    <div className="marketing-container">


                        <div className="marketing-benefits-grid">


                            <div className="marketing-benefits-copy">

                                <span className="marketing-section-label">
                                    WHY IT MATTERS
                                </span>

                                <h2>
                                    Your advantage isn't
                                    “using AI.”
                                    <span>
                                        It's moving faster with a system.
                                    </span>
                                </h2>

                                <p>
                                    AI is only useful when it helps you
                                    get something important done.
                                    Funnel AI Builder is designed around
                                    the work real estate marketers actually
                                    need to complete.
                                </p>


                                <button
                                    type="button"
                                    className="marketing-primary-button"
                                    onClick={
                                        user
                                            ? goToDashboard
                                            : goToRegister
                                    }
                                >
                                    {user
                                        ? "Create a Funnel"
                                        : "Start Building"}
                                    <span>→</span>
                                </button>

                            </div>


                            <div className="marketing-benefits-list">


                                <div className="marketing-benefit">

                                    <span>
                                        01
                                    </span>

                                    <div>

                                        <h3>
                                            Stop staring at blank pages
                                        </h3>

                                        <p>
                                            Start with your property
                                            information instead of a
                                            blank document.
                                        </p>

                                    </div>

                                </div>


                                <div className="marketing-benefit">

                                    <span>
                                        02
                                    </span>

                                    <div>

                                        <h3>
                                            Build complete campaigns
                                        </h3>

                                        <p>
                                            Think beyond one ad.
                                            Build the pieces around
                                            the entire customer journey.
                                        </p>

                                    </div>

                                </div>


                                <div className="marketing-benefit">

                                    <span>
                                        03
                                    </span>

                                    <div>

                                        <h3>
                                            Launch without waiting for a team
                                        </h3>

                                        <p>
                                            Create your first campaign
                                            yourself instead of waiting
                                            for a copywriter or agency.
                                        </p>

                                    </div>

                                </div>


                                <div className="marketing-benefit">

                                    <span>
                                        04
                                    </span>

                                    <div>

                                        <h3>
                                            Keep improving the work
                                        </h3>

                                        <p>
                                            Edit sections, regenerate
                                            content and work with
                                            different versions.
                                        </p>

                                    </div>

                                </div>


                            </div>


                        </div>

                    </div>

                </section>


                {/* =====================================================
                    WHO IT IS FOR
                ===================================================== */}

                <section className="marketing-audience-section">

                    <div className="marketing-container">


                        <div className="marketing-section-heading marketing-center">

                            <span className="marketing-section-label">
                                BUILT FOR PROPERTY MARKETERS
                            </span>

                            <h2>
                                If you sell property,
                                this was built with your workflow in mind.
                            </h2>

                        </div>


                        <div className="marketing-audience-grid">


                            <div className="marketing-audience-card">

                                <span>01</span>

                                <h3>
                                    Real Estate Agents
                                </h3>

                                <p>
                                    Create campaigns for individual
                                    properties without rebuilding your
                                    marketing process every time.
                                </p>

                            </div>


                            <div className="marketing-audience-card">

                                <span>02</span>

                                <h3>
                                    Brokers
                                </h3>

                                <p>
                                    Build repeatable campaigns across
                                    the properties and audiences you serve.
                                </p>

                            </div>


                            <div className="marketing-audience-card">

                                <span>03</span>

                                <h3>
                                    Property Marketers
                                </h3>

                                <p>
                                    Move from property information to
                                    campaign assets faster.
                                </p>

                            </div>


                            <div className="marketing-audience-card">

                                <span>04</span>

                                <h3>
                                    Real Estate Agencies
                                </h3>

                                <p>
                                    Create a structured marketing workflow
                                    instead of relying on scattered tools.
                                </p>

                            </div>


                        </div>

                    </div>

                </section>


                {/* =====================================================
                    EXAMPLE
                ===================================================== */}

                <section
                    id="examples"
                    className="marketing-example-section"
                >

                    <div className="marketing-container">


                        <div className="marketing-section-heading marketing-center">

                            <span className="marketing-section-label">
                                SEE THE TRANSFORMATION
                            </span>

                            <h2>
                                One property.
                                An entire campaign.
                            </h2>

                            <p>
                                Here's what the workflow can look like.
                            </p>

                        </div>


                        <div className="marketing-example-flow">


                            <div className="marketing-example-input">

                                <span>
                                    YOUR INPUT
                                </span>

                                <h3>
                                    3-Bedroom Apartment
                                </h3>

                                <ul>

                                    <li>
                                        Luxury property
                                    </li>

                                    <li>
                                        Lagos location
                                    </li>

                                    <li>
                                        Buyers as target audience
                                    </li>

                                    <li>
                                        Property viewing offer
                                    </li>

                                </ul>

                            </div>


                            <div className="marketing-example-arrow">
                                →
                            </div>


                            <div className="marketing-example-output">

                                <span>
                                    FUNNEL AI BUILDER
                                </span>

                                <div className="marketing-output-stack">

                                    <div>
                                        Lead Magnet
                                    </div>

                                    <div>
                                        Landing Page
                                    </div>

                                    <div>
                                        Facebook Ad
                                    </div>

                                    <div>
                                        Instagram Ad
                                    </div>

                                    <div>
                                        WhatsApp
                                    </div>

                                    <div>
                                        Email
                                    </div>

                                    <div>
                                        Thank You Page
                                    </div>

                                </div>

                            </div>

                        </div>


                    </div>

                </section>


                {/* =====================================================
                    PRICING
                ===================================================== */}

                <section
                    id="pricing"
                    className="marketing-pricing-section"
                >

                    <div className="marketing-container">


                        <div className="marketing-section-heading marketing-center">

                            <span className="marketing-section-label">
                                PRICING
                            </span>

                            <h2>
                                Start where you are.
                                Scale when you need to.
                            </h2>

                            <p>
                                Choose the plan that matches how much
                                marketing work you need Funnel AI Builder
                                to handle.
                            </p>

                        </div>


                        <div className="marketing-pricing-grid">


                            <div className="marketing-price-card">

                                <span className="marketing-price-plan">
                                    FREE
                                </span>

                                <h3>
                                    Start Building
                                </h3>

                                <p className="marketing-price-description">
                                    Get familiar with the workflow and
                                    create your first campaigns.
                                </p>

                                <div className="marketing-price-value">
                                    $0
                                </div>

                                <ul>

                                    <li>
                                        ✓ 5 funnels
                                    </li>

                                    <li>
                                        ✓ 10 AI credits
                                    </li>

                                    <li>
                                        ✓ Funnel generation
                                    </li>

                                    <li>
                                        ✓ Core marketing assets
                                    </li>

                                </ul>

                                <button
                                    type="button"
                                    className="marketing-price-button"
                                    onClick={goToRegister}
                                >
                                    Get Started
                                </button>

                            </div>


                            <div className="marketing-price-card marketing-price-featured">

                                <div className="marketing-price-badge">
                                    PRO
                                </div>

                                <span className="marketing-price-plan">
                                    PRO
                                </span>

                                <h3>
                                    Build Consistently
                                </h3>

                                <p className="marketing-price-description">
                                    For agents who want a more complete
                                    marketing workflow.
                                </p>

                                <div className="marketing-price-value">
                                    Pro
                                </div>

                                <ul>

                                    <li>
                                        ✓ Unlimited funnels
                                    </li>

                                    <li>
                                        ✓ 100 AI credits
                                    </li>

                                    <li>
                                        ✓ Version history
                                    </li>

                                    <li>
                                        ✓ PDF and DOCX export
                                    </li>

                                    <li>
                                        ✓ Public funnel sharing
                                    </li>

                                </ul>

                                <button
                                    type="button"
                                    className="marketing-price-button marketing-price-button-primary"
                                    onClick={goToPricing}
                                >
                                    View Pro Pricing
                                </button>

                            </div>


                            <div className="marketing-price-card">

                                <span className="marketing-price-plan">
                                    AGENCY
                                </span>

                                <h3>
                                    Scale the Operation
                                </h3>

                                <p className="marketing-price-description">
                                    For agencies managing more campaigns,
                                    data and marketing activity.
                                </p>

                                <div className="marketing-price-value">
                                    Agency
                                </div>

                                <ul>

                                    <li>
                                        ✓ Unlimited funnels
                                    </li>

                                    <li>
                                        ✓ 500 AI credits
                                    </li>

                                    <li>
                                        ✓ Team features
                                    </li>

                                    <li>
                                        ✓ Advanced analytics
                                    </li>

                                    <li>
                                        ✓ Public funnel sharing
                                    </li>

                                </ul>

                                <button
                                    type="button"
                                    className="marketing-price-button"
                                    onClick={goToPricing}
                                >
                                    View Agency Pricing
                                </button>

                            </div>


                        </div>


                        <p className="marketing-pricing-note">
                            View the Pricing page for the current plan
                            prices, payment options and full feature details.
                        </p>


                    </div>

                </section>


                {/* =====================================================
                    FAQ
                ===================================================== */}

                <section
                    id="faq"
                    className="marketing-faq-section"
                >

                    <div className="marketing-container marketing-narrow">


                        <div className="marketing-section-heading marketing-center">

                            <span className="marketing-section-label">
                                FAQ
                            </span>

                            <h2>
                                Questions before you start?
                            </h2>

                            <p>
                                Here are the things most people want
                                to know first.
                            </p>

                        </div>


                        <div className="marketing-faq-list">


                            {faqItems.map(
                                (item, index) => (

                                    <div
                                        className={
                                            openFaq === index
                                                ? "marketing-faq-item marketing-faq-open"
                                                : "marketing-faq-item"
                                        }
                                        key={item.question}
                                    >

                                        <button
                                            type="button"
                                            className="marketing-faq-question"
                                            onClick={() =>
                                                toggleFaq(index)
                                            }
                                            aria-expanded={
                                                openFaq === index
                                            }
                                        >

                                            <span>
                                                {item.question}
                                            </span>

                                            <span className="marketing-faq-plus">
                                                {openFaq === index
                                                    ? "−"
                                                    : "+"}
                                            </span>

                                        </button>


                                        {openFaq === index && (

                                            <div className="marketing-faq-answer">

                                                <p>
                                                    {item.answer}
                                                </p>

                                            </div>

                                        )}

                                    </div>

                                )
                            )}


                        </div>

                    </div>

                </section>


                {/* =====================================================
                    FINAL CTA
                ===================================================== */}

                <section className="marketing-final-cta">

                    <div className="marketing-container marketing-final-cta-inner">


                        <span className="marketing-section-label">
                            YOUR NEXT PROPERTY CAMPAIGN
                        </span>


                        <h2>

                            The next time you get a property to sell,
                            <span>
                                don't start from zero.
                            </span>

                        </h2>


                        <p>

                            Give Funnel AI Builder the property,
                            the audience and the offer.

                            <br />

                            Let it help you turn that information
                            into a complete marketing funnel.

                        </p>


                        <button
                            type="button"
                            className="marketing-final-button"
                            onClick={
                                user
                                    ? goToDashboard
                                    : goToRegister
                            }
                        >

                            {user
                                ? "Create Your Funnel"
                                : "Create Your First Funnel"}

                            <span>
                                →
                            </span>

                        </button>


                        <small>
                            From property details to campaign-ready.
                        </small>


                    </div>

                </section>


            </main>


            {/* =====================================================
                FOOTER
            ===================================================== */}

            <footer className="marketing-footer">

                <div className="marketing-container marketing-footer-inner">


                    <div>

                        <div className="marketing-footer-brand">

                            <span className="marketing-brand-mark">
                                F
                            </span>

                            <strong>
                                Funnel AI Builder
                            </strong>

                        </div>

                        <p>
                            AI-powered marketing funnels
                            for real estate professionals.
                        </p>

                    </div>


                    <div className="marketing-footer-links">

                        <a href="#how-it-works">
                            How It Works
                        </a>

                        <a href="#pricing">
                            Pricing
                        </a>

                        <a href="#faq">
                            FAQ
                        </a>

                        <button
                            type="button"
                            onClick={goToLogin}
                        >
                            Login
                        </button>

                    </div>


                </div>


                <div className="marketing-footer-bottom">

                    <div className="marketing-container">

                        © {new Date().getFullYear()}
                        {" "}
                        Funnel AI Builder.
                        All rights reserved.

                    </div>

                </div>

            </footer>


        </div>

    );

}