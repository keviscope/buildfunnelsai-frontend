import api from "../api/axios";
import Button from "../components/Button";
import Card from "../components/Card";
import DashboardLayout from "../layouts/DashboardLayout";
import { useEffect, useState } from "react";
import EditableSection from "../components/EditableSection";
import LandingPageEditor from "../components/LandingPageEditor";
import LoadingSpinner from "../components/LoadingSpinner";
import VariationModal from "../components/VariationModal";
import HistoryModal from "../components/HistoryModal";
import CompareVersionsModal from "../components/CompareVersionsModal";
import PrintableFunnel from "../components/PrintableFunnel";
import {
    updateOnboardingStep
} from "../utils/onboarding"; 
import {
    useNavigate,
    useParams
} from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { analytics } from "../analytics";

export default function FunnelResult() {

    const [exporting, setExporting] =
        useState(null);

    const { id } = useParams();

    const [funnel, setFunnel] =
        useState(null);

    const [editingLandingPage, setEditingLandingPage] =
        useState(false);

    const [regeneratingField, setRegeneratingField] =
        useState(null);

    const [showModal, setShowModal] =
        useState(false);

    const [variationField, setVariationField] =
        useState("");

    const [variations, setVariations] =
        useState([]);

    const [loadingVariations, setLoadingVariations] =
        useState(false);

    const [history, setHistory] =
        useState([]);

    const [historyField, setHistoryField] =
        useState("");

    const [showHistory, setShowHistory] =
        useState(false);

    const [showCompare, setShowCompare] =
        useState(false);

    const [selectedHistory, setSelectedHistory] =
        useState(null);

    const [loadingFunnel, setLoadingFunnel] =
        useState(true);

    const [loadError, setLoadError] =
        useState(null);

    const [sharing, setSharing] =
        useState(false);

    const [shareUrl, setShareUrl] =
        useState("");

    const [loadingHistory, setLoadingHistory] =
        useState(false);

const [savingField, setSavingField] =
    useState(null);

const [applyingVariation, setApplyingVariation] =
    useState(false);


    const { showToast } =
        useToast();

    const navigate =
        useNavigate();

    const { user } =
        useAuth();


    const hasProAccess =
        user?.plan === "pro" ||
        user?.plan === "agency";


    const hasPublicSharing =
        user?.plan === "pro" ||
        user?.plan === "agency";


    function getFunnelLoadError(error) {

        const status =
            error?.response?.status;

        const errorCode =
            error?.response?.data?.error_code;

        if (
            status === 404 ||
            errorCode === "RESOURCE_NOT_FOUND"
        ) {
            return "not_found";
        }

        if (
            status === 403 ||
            errorCode === "UNAUTHORIZED_RESOURCE"
        ) {
            return "unauthorized";
        }

        if (
            status === 401 ||
            status === 419 ||
            errorCode === "SESSION_EXPIRED" ||
            errorCode === "CSRF_TOKEN_MISMATCH"
        ) {
            return "session_expired";
        }

        if (
            error?.code === "ERR_NETWORK" ||
            error?.message === "Network Error" ||
            !error?.response
        ) {
            return "network";
        }

        if (
            status >= 500 ||
            errorCode === "SERVER_ERROR"
        ) {
            return "server_error";
        }

        return "server_error";

    }


    async function loadFunnel() {

        try {

            setLoadingFunnel(true);
            setLoadError(null);

            const response =
                await api.get(
                    `/api/funnels/${id}`
                );

            const normalizedFunnel =
                normalizeFunnel(
                    response.data
                );

            if (!normalizedFunnel) {

                setFunnel(null);
                setLoadError("server_error");

                return;

            }

            setFunnel(
                normalizedFunnel
            );


            if (
                normalizedFunnel?.share_token
            ) {

                const existingShareUrl =
                    `${window.location.origin}/share/${normalizedFunnel.share_token}`;

                setShareUrl(
                    existingShareUrl
                );

            } else {

                setShareUrl("");

            }

        } catch (error) {

            console.error(
                "LOAD FUNNEL ERROR:",
                error.response?.data ||
                error.message
            );

            setFunnel(null);

            setLoadError(
                getFunnelLoadError(error)
            );

        } finally {

            setLoadingFunnel(false);

        }

    }


    useEffect(() => {

        loadFunnel();

    }, [id]);


    if (loadingFunnel) {

        return (

            <DashboardLayout>

                <div className="screen-content">

           <LoadingSpinner />

<h2>
    Loading your funnel...
</h2>

<p>
    Preparing your generated content.
</p>

                </div>

            </DashboardLayout>

        );

    }


    if (!funnel) {

        const loadErrorStates = {

            not_found: {
                title: "This funnel could not be found.",
                message:
                    "The funnel may have been deleted or the link may be invalid.",
                buttonText: "Back to Funnel History",
                onClick: () =>
                    navigate("/history")
            },

            unauthorized: {
                title:
                    "You don't have permission to access this funnel.",
                message:
                    "This funnel belongs to another account or you no longer have access to it.",
                buttonText: "Back to Funnel History",
                onClick: () =>
                    navigate("/history")
            },

            session_expired: {
                title:
                    "Your session has expired. Please log in again.",
                message:
                    "Your login session is no longer valid.",
                buttonText: "Log In Again",
                onClick: () =>
                    navigate("/login")
            },

            network: {
                title:
                    "Unable to connect to Funnel AI.",
                message:
                    "Please check your connection and try again.",
                buttonText: "Try Again",
                onClick: loadFunnel
            },

            server_error: {
                title:
                    "Something went wrong on the server.",
                message:
                    "Please try again in a moment.",
                buttonText: "Try Again",
                onClick: loadFunnel
            }

        };

        const errorState =
            loadErrorStates[
                loadError
            ] || loadErrorStates.server_error;

        return (

            <DashboardLayout>

                <div className="screen-content">

                    <h2>
                        {errorState.title}
                    </h2>

                    <p>
                        {errorState.message}
                    </p>

                    <Button
                        text={
                            errorState.buttonText
                        }
                        onClick={
                            errorState.onClick
                        }
                    />

                </div>

            </DashboardLayout>

        );

    }


    function normalizeFunnel(funnel) {

        if (!funnel || !funnel.id) {

            return null;

        }

        let landingPage =
            funnel.landing_page;


        try {

            if (
                typeof landingPage ===
                "string"
            ) {

                landingPage =
                    JSON.parse(
                        landingPage
                    );

            }

        } catch {

            landingPage = {
                headline: "",
                subheadline: "",
                benefits: [],
                cta: ""
            };

        }


        return {

            ...funnel,

            landing_page:
                landingPage

        };

    }


    async function copyText(text) {

        try {

            await navigator.clipboard.writeText(
                text
            );

            showToast(
                "Content copied successfully.",
                "success"
            );

        } catch {

            showToast(
                "Something went wrong while copying.\nPlease try again.",
                "error"
            );

        }

    }


    const landingPageText = funnel
        ? `
Headline:
${funnel.landing_page.headline}

Subheadline:
${funnel.landing_page.subheadline}

Benefits:
${funnel.landing_page.benefits.join("\n")}

CTA:
${funnel.landing_page.cta}
`
        : "";




















   













async function saveSection(
    field,
    content
) {

    setSavingField(field);

    try {

        const response =
            await api.patch(
                `/api/funnels/${id}/section`,
                {
                    field,
                    content
                }
            );

        setFunnel(
            normalizeFunnel(
                response.data.funnel
            )
        );

        await updateOnboardingStep(
    "generate_first_campaign"
);

await updateOnboardingStep(
    "edit_section"
);

        showToast(
            "Changes saved successfully.",
            "success"
        );

        return true;

    } catch (error) {

        console.error(
            "SAVE SECTION ERROR:",
            error.response?.data ||
            error.message
        );

        showToast(
            error.response?.data?.message ||
            "Something went wrong while saving your changes.\nPlease try again.",
            "error"
        );

        return false;

    } finally {

        setSavingField(null);

    }

}


















    async function regenerateSection(
        field
    ) {

        setRegeneratingField(field);

        try {

            const response =
                await api.post(
                    `/api/funnels/${id}/regenerate`,
                    {
                        field
                    }
                );


            setFunnel(
                normalizeFunnel(
                    response.data.funnel
                )
            );


            showToast(
                "Section regenerated successfully.",
                "success"
            );

        } catch (error) {

            console.error(
                "REGENERATE ERROR:",
                error.response?.data ||
                error.message
            );

            showToast(
                error.response?.data?.message ||
                "Something went wrong while regenerating this section.\nPlease try again.",
                "error"
            );

        } finally {

            setRegeneratingField(
                null
            );

        }

    }


    async function generateVariations(
        field
    ) {

        setVariationField(field);

        setLoadingVariations(true);

        try {

            const response =
                await api.post(
                    `/api/funnels/${id}/variations`,
                    {
                        field
                    }
                );


            setVariations(
                response.data.versions ||
                []
            );


            setShowModal(true);


            showToast(
                "Three new versions are ready.",
                "success"
            );

        } catch (error) {

            console.error(
                "VARIATION ERROR:",
                error.response?.data ||
                error.message
            );

            showToast(
                error.response?.data?.message ||
                "Something went wrong while generating variations.\nPlease try again.",
                "error"
            );

        } finally {

            setLoadingVariations(false);

        }

    }


    async function saveLandingPage(
        updatedLandingPage
    ) {

        try {

            const response =
                await api.patch(
                    `/api/funnels/${id}/section`,
                    {
                        field: "landing_page",
                        content:
                            JSON.stringify(
                                updatedLandingPage
                            )
                    }
                );


            setFunnel(
                normalizeFunnel(
                    response.data.funnel
                )
            );


            setEditingLandingPage(
                false
            );


            showToast(
                "Landing page saved successfully.",
                "success"
            );

        } catch (error) {

            console.error(
                "SAVE LANDING PAGE ERROR:",
                error.response?.data ||
                error.message
            );

            showToast(
                error.response?.data?.message ||
                "Something went wrong while saving the landing page.\nPlease try again.",
                "error"
            );

        }

    }


    async function useVariation(text) {

        try {

            const response =
                await api.patch(
                    `/api/funnels/${id}/variation`,
                    {
                        field:
                            variationField,
                        content:
                            text
                    }
                );


            setFunnel(
                normalizeFunnel(
                    response.data.funnel
                )
            );


            setShowModal(false);

            setVariationField("");


            showToast(
                "Version applied successfully.",
                "success"
            );

        } catch (error) {

            console.error(
                "USE VARIATION ERROR:",
                error.response?.data ||
                error.message
            );

            showToast(
                error.response?.data?.message ||
                "Something went wrong while saving this version.\nPlease try again.",
                "error"
            );

        }

    }


    async function enablePublicSharing() {

        setSharing(true);

        try {

            const response =
                await api.post(
                    `/api/funnels/${id}/share`
                );



        const url =
    response.data.share_url;

setShareUrl(url || "");

analytics.publicSharingEnabled({
    funnel_id: id,
    plan: user?.plan
});




            if (url) {

                try {

                    await navigator.clipboard.writeText(
                        url
                    );


                    showToast(
                        response.data.message ===
                        "Public sharing enabled."
                            ? "Public sharing link created and copied."
                            : "Public sharing link copied.",
                        "success"
                    );

                } catch {

                    showToast(
                        "Public sharing is enabled, but the link could not be copied.\nYou can copy it manually.",
                        "warning"
                    );

                }

            }

        } catch (error) {

            console.error(
                "PUBLIC SHARING ERROR:",
                error.response?.data ||
                error.message
            );

            showToast(
                error.response?.data?.message ||
                "Something went wrong while enabling public sharing.\nPlease try again.",
                "error"
            );

        } finally {

            setSharing(false);

        }

    }


    async function regeneratePublicShareLink() {

        setSharing(true);

        try {

            const response =
                await api.post(
                    `/api/funnels/${id}/share/regenerate`
                );


          const url =
    response.data.share_url;

setShareUrl(url || "");

analytics.publicShareLinkRegenerated({
    funnel_id: id,
    plan: user?.plan
});






            if (url) {

                try {

                    await navigator.clipboard.writeText(
                        url
                    );

                    showToast(
                        "Public sharing link regenerated and copied.",
                        "success"
                    );

                } catch {

                    showToast(
                        "Public sharing link regenerated, but the new link could not be copied.\nYou can copy it manually.",
                        "warning"
                    );

                }

            }

        } catch (error) {

            console.error(
                "REGENERATE PUBLIC SHARE LINK ERROR:",
                error.response?.data ||
                error.message
            );

            showToast(
                error.response?.data?.message ||
                "Something went wrong while regenerating the public sharing link.\nPlease try again.",
                "error"
            );

        } finally {

            setSharing(false);

        }

    }


    async function disablePublicSharing() {

        setSharing(true);

        try {

        await api.delete(
    `/api/funnels/${id}/share`
);

analytics.publicSharingDisabled({
    funnel_id: id,
    plan: user?.plan
});

setShareUrl("");



            showToast(
                "Public sharing has been disabled.",
                "success"
            );

        } catch (error) {

            console.error(
                "DISABLE PUBLIC SHARING ERROR:",
                error.response?.data ||
                error.message
            );

            showToast(
                error.response?.data?.message ||
                "Something went wrong while disabling public sharing.\nPlease try again.",
                "error"
            );

        } finally {

            setSharing(false);

        }

    }


    function openPublicFunnel() {

        if (!shareUrl) {

            return;

        }

        window.open(
            shareUrl,
            "_blank",
            "noopener,noreferrer"
        );

    }


    async function loadHistory(
        field
    ) {

        setLoadingHistory(true);

        try {

            const response =
                await api.get(
                    `/api/funnels/${id}/history/${field}`
                );


            const historyData =
                Array.isArray(
                    response.data.history
                )
                    ? response.data.history
                    : [];


            setHistory(
                historyData
            );

            setHistoryField(
                field
            );

            setShowHistory(
                true
            );

        } catch (error) {

            console.error(
                "HISTORY ERROR:",
                error.response?.data ||
                error.message
            );

            setHistory([]);

            showToast(
                error.response?.data?.message ||
                "Something went wrong while loading version history.\nPlease try again.",
                "error"
            );

        } finally {

            setLoadingHistory(
                false
            );

        }

    }


    async function restoreVersion(
        field,
        content
    ) {

        try {

            const response =
                await api.patch(
                    `/api/funnels/${id}/restore`,
                    {
                        field,
                        content
                    }
                );


            setFunnel(
                normalizeFunnel(
                    response.data.funnel
                )
            );


            setShowHistory(
                false
            );

            setShowCompare(
                false
            );


            showToast(
                "Version restored successfully.",
                "success"
            );

        } catch (error) {

            console.error(
                "RESTORE VERSION ERROR:",
                error.response?.data ||
                error.message
            );

            showToast(
                error.response?.data?.message ||
                "Something went wrong while restoring this version.\nPlease try again.",
                "error"
            );

        }

    }


    function compareVersion(
        content
    ) {

        setSelectedHistory(
            content
        );

        setShowCompare(
            true
        );

    }


    async function copyEntireFunnel() {

        const text = `
FUNNEL AI BUILDER
Marketing Funnel Report

================================
CAMPAIGN DETAILS
================================

Campaign: ${funnel.campaign}
Property Type: ${funnel.propertyType}
Bedrooms: ${funnel.bedrooms}
Budget: ${funnel.budgetLevel}
Audience: ${funnel.audience}
Location: ${funnel.location}
Offer: ${funnel.offer}


================================
LEAD MAGNET
================================

${funnel.lead_magnet}


================================
LANDING PAGE
================================

${funnel.landing_page.headline}

${funnel.landing_page.subheadline}

Benefits:

${funnel.landing_page.benefits
    .map(
        benefit =>
            `• ${benefit}`
    )
    .join("\n")}

CTA:

${funnel.landing_page.cta}


================================
FACEBOOK AD
================================

${funnel.facebook_ad}


================================
INSTAGRAM AD
================================

${funnel.instagram_ad}


================================
EMAIL
================================

${funnel.email}


================================
WHATSAPP
================================

${funnel.whatsapp}


================================
THANK YOU PAGE
================================

${funnel.thank_you}
`;


        try {

            await navigator.clipboard.writeText(
                text
            );

            showToast(
                "Entire funnel copied successfully.",
                "success"
            );

        } catch {

            showToast(
                "Something went wrong while copying the funnel.\nPlease try again.",
                "error"
            );

        }

    }


    function scrollToSection(
        sectionId
    ) {

        const section =
            document.getElementById(
                sectionId
            );

        if (section) {

            section.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });

        }

    }









   function startExport(type) {

    setExporting(type);

    let url = "";

    if (type === "pdf") {
        url =
            `https://api.buildfunnelsai.com/api/funnels/${id}/pdf`;
    }

    if (type === "docx") {
        url =
            `https://api.buildfunnelsai.com/api/funnels/${id}/docx`;
    }

    if (type === "package") {
        url =
            `https://api.buildfunnelsai.com/api/funnels/${id}/download-package`;
    }

    window.open(
        url,
        "_blank"
    );

    analytics.funnelExported({
        funnel_id: id,
        format: type,
        plan: user?.plan
    });

    updateOnboardingStep(
        "export_funnel"
    );

    setTimeout(() => {
        setExporting(null);
    }, 2000);

}


















async function useVariation(text) {

    setApplyingVariation(true);

    try {

        const response =
            await api.patch(
                `/api/funnels/${id}/variation`,
                {
                    field: variationField,
                    content: text
                }
            );

        setFunnel(
            normalizeFunnel(
                response.data.funnel
            )
        );

        setShowModal(false);

        setVariationField("");

        showToast(
            "Version applied successfully.",
            "success"
        );

    } catch (error) {

        console.error(
            "USE VARIATION ERROR:",
            error.response?.data ||
            error.message
        );

        showToast(
            error.response?.data?.message ||
            "Something went wrong while applying this version.\nPlease try again.",
            "error"
        );

    } finally {

        setApplyingVariation(false);

    }

}





return (

    <div>
<br/><br/>
        <DashboardLayout>

            <div className="screen-content">

                <div className="funnel-details-header">

                    <div>

                        <h1>
                            {
                                funnel.campaign ||
                                "Funnel Details"
                            }
                        </h1>

                        <p>

                            {
                                funnel.propertyType ||
                                "Property not specified"
                            }

                            {" • "}

                            {
                                funnel.audience ||
                                "Audience not specified"
                            }

                            {" • "}

                            {
                                funnel.location ||
                                "Location not specified"
                            }

                        </p>

                    </div>


                    <div className="funnel-header-actions">

                        <Button
                            text="Copy Entire Funnel"
                            onClick={
                                copyEntireFunnel
                            }
                        />


                        {hasPublicSharing ? (

                            <Button
                                text={
                                    sharing
                                        ? shareUrl
                                            ? "Updating Link..."
                                            : "Creating Link..."
                                        : shareUrl
                                            ? "Public Sharing Enabled"
                                            : "Enable Public Sharing"
                                }
                                disabled={
                                    sharing
                                }
                                onClick={
                                    shareUrl
                                        ? () => copyText(shareUrl)
                                        : enablePublicSharing
                                }
                            />

                        ) : (

                            <Button
                                text="Public Sharing — Requires Pro"
                                onClick={() =>
                                    navigate(
                                        "/pricing"
                                    )
                                }
                            />

                        )}


                        <Button
                            text="Back to History"
                            onClick={() =>
                                navigate(
                                    "/history"
                                )
                            }
                        />

                    </div>


                    {hasPublicSharing &&
                    shareUrl && (

                        <div className="public-sharing-box">

                            <h3>
                                Public Share Link
                            </h3>

                            <p>
                                Anyone with this link
                                can view this funnel.
                            </p>

                            <div className="public-sharing-link-row">

                                <input
                                    type="text"
                                    value={
                                        shareUrl
                                    }
                                    readOnly
                                />

                                <Button
                                    text="Copy Link"
                                    disabled={
                                        sharing
                                    }
                                    onClick={() =>
                                        copyText(
                                            shareUrl
                                        )
                                    }
                                />

                            </div>

                            <div className="public-sharing-actions">

                                <Button
                                    text="Open Funnel"
                                    disabled={
                                        sharing
                                    }
                                    onClick={
                                        openPublicFunnel
                                    }
                                />

                                <Button
                                    text={
                                        sharing
                                            ? "Regenerating..."
                                            : "Regenerate Link"
                                    }
                                    disabled={
                                        sharing
                                    }
                                    onClick={
                                        regeneratePublicShareLink
                                    }
                                />

                                <Button
                                    text={
                                        sharing
                                            ? "Disabling..."
                                            : "Disable Sharing"
                                    }
                                    disabled={
                                        sharing
                                    }
                                    onClick={
                                        disablePublicSharing
                                    }
                                />

                            </div>

                        </div>

                    )}

                </div>


                <div className="funnel-section-nav">

                    <button
                        onClick={() =>
                            scrollToSection(
                                "lead-magnet"
                            )
                        }
                    >
                        Lead Magnet
                    </button>

                    <button
                        onClick={() =>
                            scrollToSection(
                                "landing-page"
                            )
                        }
                    >
                        Landing Page
                    </button>

                    <button
                        onClick={() =>
                            scrollToSection(
                                "facebook-ad"
                            )
                        }
                    >
                        Facebook Ad
                    </button>

                    <button
                        onClick={() =>
                            scrollToSection(
                                "instagram-ad"
                            )
                        }
                    >
                        Instagram Ad
                    </button>

                    <button
                        onClick={() =>
                            scrollToSection(
                                "whatsapp"
                            )
                        }
                    >
                        WhatsApp
                    </button>

                    <button
                        onClick={() =>
                            scrollToSection(
                                "email"
                            )
                        }
                    >
                        Email
                    </button>

                    <button
                        onClick={() =>
                            scrollToSection(
                                "thank-you"
                            )
                        }
                    >
                        Thank You Page
                    </button>

                </div>


                {/* Lead Magnet */}

                <div id="lead-magnet">

                    <Card
                        title="Lead Magnet"
                    >

                        <EditableSection
                            title="Lead Magnet"
                            field="lead_magnet"
                            value={
                                funnel.lead_magnet
                            }
                            onSave={
                                saveSection
                            }
                            onCopy={
                                copyText
                            }
                            saving={
                                savingField === "lead_magnet"
                            }
                        />


                        <div className="funnel-export-section">

                            <div className="funnel-export-header">

                                <div>

                                    <h3>
                                        Export Funnel
                                    </h3>

                                    <p>
                                        Download or print
                                        your complete funnel.
                                    </p>

                                </div>

                            </div>


                            <div className="funnel-export-grid">

                                <div className="funnel-export-card">

                                    <div className="funnel-export-icon">
                                        PDF
                                    </div>

                                    <div className="funnel-export-content">

                                        <h4>
                                            PDF
                                        </h4>

                                        <p>
                                            Download a polished
                                            PDF version of
                                            your funnel.
                                        </p>

                                    </div>

                                    <Button
                                        text={
                                            exporting ===
                                            "pdf"
                                                ? "Generating PDF..."
                                                : "Download PDF"
                                        }
                                        disabled={
                                            exporting ===
                                            "pdf"
                                        }
                                        onClick={() =>
                                            startExport(
                                                "pdf"
                                            )
                                        }
                                    />

                                </div>


                                <div className="funnel-export-card">

                                    <div className="funnel-export-icon">
                                        DOCX
                                    </div>

                                    <div className="funnel-export-content">

                                        <h4>
                                            Word Document
                                        </h4>

                                        <p>
                                            Download your funnel
                                            as an editable Word
                                            document.
                                        </p>

                                    </div>

                                    <Button
                                        text={
                                            exporting ===
                                            "docx"
                                                ? "Generating Word..."
                                                : "Download Word"
                                        }
                                        disabled={
                                            exporting ===
                                            "docx"
                                        }
                                        onClick={() =>
                                            startExport(
                                                "docx"
                                            )
                                        }
                                    />

                                </div>


                                <div className="funnel-export-card">

                                    <div className="funnel-export-icon">
                                        ZIP
                                    </div>

                                    <div className="funnel-export-content">

                                        <h4>
                                            Complete Funnel
                                        </h4>

                                        <p>
                                            Download all funnel
                                            assets in one package.
                                        </p>

                                    </div>

                                    <Button
                                        text={
                                            exporting ===
                                            "package"
                                                ? "Preparing Package..."
                                                : "Download Package"
                                        }
                                        disabled={
                                            exporting ===
                                            "package"
                                        }
                                        onClick={() =>
                                            startExport(
                                                "package"
                                            )
                                        }
                                    />

                                </div>


                                <div className="funnel-export-card">

                                    <div className="funnel-export-icon">
                                        PRINT
                                    </div>

                                    <div className="funnel-export-content">

                                        <h4>
                                            Print Funnel
                                        </h4>

                                        <p>
                                            Open the browser
                                            print dialog for
                                            your funnel.
                                        </p>

                                    </div>

                                    <Button
                                        text="Print Funnel"
                                        onClick={() =>
                                            window.print()
                                        }
                                    />

                                </div>

                            </div>

                        </div>


                        <div className="funnel-action-buttons">

                            <Button
                                disabled={
                                    regeneratingField ===
                                    "lead_magnet"
                                }
                                text={
                                    regeneratingField ===
                                    "lead_magnet"
                                        ? "Regenerating..."
                                        : "🔄 Regenerate"
                                }
                                onClick={() =>
                                    regenerateSection(
                                        "lead_magnet"
                                    )
                                }
                            />


                            {hasProAccess ? (

                                <Button
                                    text={
                                        loadingHistory &&
                                        historyField ===
                                        "lead_magnet"
                                            ? "Loading..."
                                            : "History"
                                    }
                                    disabled={
                                        loadingHistory &&
                                        historyField ===
                                        "lead_magnet"
                                    }
                                    onClick={() =>
                                        loadHistory(
                                            "lead_magnet"
                                        )
                                    }
                                />

                            ) : (

                                <Button
                                    text="History — Requires Pro"
                                    onClick={() =>
                                        navigate(
                                            "/pricing"
                                        )
                                    }
                                />

                            )}


                            <Button
                                text={
                                    loadingVariations &&
                                    variationField ===
                                    "lead_magnet"
                                        ? "Generating..."
                                        : "Generate 3 More Versions"
                                }
                                disabled={
                                    loadingVariations &&
                                    variationField ===
                                    "lead_magnet"
                                }
                                onClick={() =>
                                    generateVariations(
                                        "lead_magnet"
                                    )
                                }
                            />

                        </div>

                    </Card>

                </div>


                <hr />


                {/* Landing Page */}

                <div id="landing-page">

                    <Card
                        title="Landing Page"
                    >

                        {editingLandingPage ? (

                            <LandingPageEditor
                                landingPage={
                                    funnel.landing_page
                                }
                                onSave={
                                    saveLandingPage
                                }
                                onCancel={() =>
                                    setEditingLandingPage(
                                        false
                                    )
                                }
                            />

                        ) : (

                            <>

                                <p>
                                    <strong>
                                        Headline:
                                    </strong>{" "}
                                    {
                                        funnel.landing_page
                                            .headline
                                    }
                                </p>

                                <p>
                                    <strong>
                                        Subheadline:
                                    </strong>{" "}
                                    {
                                        funnel.landing_page
                                            .subheadline
                                    }
                                </p>

                                <ul>

                                    {funnel.landing_page
                                        .benefits
                                        .map(
                                            (
                                                benefit,
                                                index
                                            ) => (
                                                <li
                                                    key={
                                                        index
                                                    }
                                                >
                                                    {
                                                        benefit
                                                    }
                                                </li>
                                            )
                                        )}

                                </ul>

                                <p>
                                    <strong>
                                        CTA:
                                    </strong>{" "}
                                    {
                                        funnel.landing_page
                                            .cta
                                    }
                                </p>


                                <div className="funnel-action-buttons">

                                    <Button
                                        text="Copy"
                                        onClick={() =>
                                            copyText(
                                                landingPageText
                                            )
                                        }
                                    />

                                    <Button
                                        text="Edit"
                                        onClick={() =>
                                            setEditingLandingPage(
                                                true
                                            )
                                        }
                                    />

                                    <Button
                                        disabled={
                                            regeneratingField ===
                                            "landing_page"
                                        }
                                        text={
                                            regeneratingField ===
                                            "landing_page"
                                                ? "Regenerating..."
                                                : "🔄 Regenerate"
                                        }
                                        onClick={() =>
                                            regenerateSection(
                                                "landing_page"
                                            )
                                        }
                                    />

                                </div>

                            </>

                        )}

                    </Card>

                </div>


                <hr />


                {/* Facebook Ad */}

                <div id="facebook-ad">

                    <Card
                        title="Facebook Ad"
                    >

                        <EditableSection
                            title="Facebook Ad"
                            field="facebook_ad"
                            value={
                                funnel.facebook_ad
                            }
                            onSave={
                                saveSection
                            }
                            onCopy={
                                copyText
                            }
                            saving={
                                savingField === "facebook_ad"
                            }
                        />


                        <div className="funnel-action-buttons">

                            <Button
                                disabled={
                                    regeneratingField ===
                                    "facebook_ad"
                                }
                                text={
                                    regeneratingField ===
                                    "facebook_ad"
                                        ? "Regenerating..."
                                        : "🔄 Regenerate"
                                }
                                onClick={() =>
                                    regenerateSection(
                                        "facebook_ad"
                                    )
                                }
                            />


                            {hasProAccess ? (

                                <Button
                                    text={
                                        loadingHistory &&
                                        historyField ===
                                        "facebook_ad"
                                            ? "Loading..."
                                            : "History"
                                    }
                                    disabled={
                                        loadingHistory &&
                                        historyField ===
                                        "facebook_ad"
                                    }
                                    onClick={() =>
                                        loadHistory(
                                            "facebook_ad"
                                        )
                                    }
                                />

                            ) : (

                                <Button
                                    text="History — Requires Pro"
                                    onClick={() =>
                                        navigate(
                                            "/pricing"
                                        )
                                    }
                                />

                            )}


                            <Button
                                text={
                                    loadingVariations &&
                                    variationField ===
                                    "facebook_ad"
                                        ? "Generating..."
                                        : "Generate 3 More Versions"
                                }
                                disabled={
                                    loadingVariations &&
                                    variationField ===
                                    "facebook_ad"
                                }
                                onClick={() =>
                                    generateVariations(
                                        "facebook_ad"
                                    )
                                }
                            />

                        </div>

                    </Card>

                </div>


                <hr />


                {/* Instagram Ad */}

                <div id="instagram-ad">

                    <Card
                        title="Instagram Ad"
                    >

                        <EditableSection
                            title="Instagram Ad"
                            field="instagram_ad"
                            value={
                                funnel.instagram_ad
                            }
                            onSave={
                                saveSection
                            }
                            onCopy={
                                copyText
                            }
                            saving={
                                savingField === "instagram_ad"
                            }
                        />


                        <div className="funnel-action-buttons">

                            <Button
                                disabled={
                                    regeneratingField ===
                                    "instagram_ad"
                                }
                                text={
                                    regeneratingField ===
                                    "instagram_ad"
                                        ? "Regenerating..."
                                        : "🔄 Regenerate"
                                }
                                onClick={() =>
                                    regenerateSection(
                                        "instagram_ad"
                                    )
                                }
                            />


                            {hasProAccess ? (

                                <Button
                                    text={
                                        loadingHistory &&
                                        historyField ===
                                        "instagram_ad"
                                            ? "Loading..."
                                            : "History"
                                    }
                                    disabled={
                                        loadingHistory &&
                                        historyField ===
                                        "instagram_ad"
                                    }
                                    onClick={() =>
                                        loadHistory(
                                            "instagram_ad"
                                        )
                                    }
                                />

                            ) : (

                                <Button
                                    text="History — Requires Pro"
                                    onClick={() =>
                                        navigate(
                                            "/pricing"
                                        )
                                    }
                                />

                            )}


                            <Button
                                text={
                                    loadingVariations &&
                                    variationField ===
                                    "instagram_ad"
                                        ? "Generating..."
                                        : "Generate 3 More Versions"
                                }
                                disabled={
                                    loadingVariations &&
                                    variationField ===
                                    "instagram_ad"
                                }
                                onClick={() =>
                                    generateVariations(
                                        "instagram_ad"
                                    )
                                }
                            />

                        </div>

                    </Card>

                </div>


                <hr />


                {/* Email Sequence */}

                <div id="email">

                    <Card
                        title="Email Sequence"
                    >

                        <EditableSection
                            title="Email"
                            field="email"
                            value={
                                funnel.email
                            }
                            onSave={
                                saveSection
                            }
                            onCopy={
                                copyText
                            }
                            saving={
                                savingField === "email"
                            }
                        />


                        <div className="funnel-action-buttons">

                            <Button
                                disabled={
                                    regeneratingField ===
                                    "email"
                                }
                                text={
                                    regeneratingField ===
                                    "email"
                                        ? "Regenerating..."
                                        : "🔄 Regenerate"
                                }
                                onClick={() =>
                                    regenerateSection(
                                        "email"
                                    )
                                }
                            />


                            {hasProAccess ? (

                                <Button
                                    text={
                                        loadingHistory &&
                                        historyField ===
                                        "email"
                                            ? "Loading..."
                                            : "History"
                                    }
                                    disabled={
                                        loadingHistory &&
                                        historyField ===
                                        "email"
                                    }
                                    onClick={() =>
                                        loadHistory(
                                            "email"
                                        )
                                    }
                                />

                            ) : (

                                <Button
                                    text="History — Requires Pro"
                                    onClick={() =>
                                        navigate(
                                            "/pricing"
                                        )
                                    }
                                />

                            )}


                            <Button
                                text={
                                    loadingVariations &&
                                    variationField ===
                                    "email"
                                        ? "Generating..."
                                        : "Generate 3 More Versions"
                                }
                                disabled={
                                    loadingVariations &&
                                    variationField ===
                                    "email"
                                }
                                onClick={() =>
                                    generateVariations(
                                        "email"
                                    )
                                }
                            />

                        </div>

                    </Card>

                </div>


                <hr />


                {/* WhatsApp Sequence */}

                <div id="whatsapp">

                    <Card
                        title="WhatsApp Sequence"
                    >

                        <EditableSection
                            title="WhatsApp"
                            field="whatsapp"
                            value={
                                funnel.whatsapp
                            }
                            onSave={
                                saveSection
                            }
                            onCopy={
                                copyText
                            }
                            saving={
                                savingField === "whatsapp"
                            }
                        />


                        <div className="funnel-action-buttons">

                            <Button
                                disabled={
                                    regeneratingField ===
                                    "whatsapp"
                                }
                                text={
                                    regeneratingField ===
                                    "whatsapp"
                                        ? "Regenerating..."
                                        : "🔄 Regenerate"
                                }
                                onClick={() =>
                                    regenerateSection(
                                        "whatsapp"
                                    )
                                }
                            />


                            {hasProAccess ? (

                                <Button
                                    text={
                                        loadingHistory &&
                                        historyField ===
                                        "whatsapp"
                                            ? "Loading..."
                                            : "History"
                                    }
                                    disabled={
                                        loadingHistory &&
                                        historyField ===
                                        "whatsapp"
                                    }
                                    onClick={() =>
                                        loadHistory(
                                            "whatsapp"
                                        )
                                    }
                                />

                            ) : (

                                <Button
                                    text="History — Requires Pro"
                                    onClick={() =>
                                        navigate(
                                            "/pricing"
                                        )
                                    }
                                />

                            )}


                            <Button
                                text={
                                    loadingVariations &&
                                    variationField ===
                                    "whatsapp"
                                        ? "Generating..."
                                        : "Generate 3 More Versions"
                                }
                                disabled={
                                    loadingVariations &&
                                    variationField ===
                                    "whatsapp"
                                }
                                onClick={() =>
                                    generateVariations(
                                        "whatsapp"
                                    )
                                }
                            />

                        </div>

                    </Card>

                </div>


                <hr />


                {/* Thank You Page */}

                <div id="thank-you">

                    <Card
                        title="Thank You Page"
                    >

                        <EditableSection
                            title="Thank You"
                            field="thank_you"
                            value={
                                funnel.thank_you
                            }
                            onSave={
                                saveSection
                            }
                            onCopy={
                                copyText
                            }
                        />


                        <div className="funnel-action-buttons">

                            <Button
                                disabled={
                                    regeneratingField ===
                                    "thank_you"
                                }
                                text={
                                    regeneratingField ===
                                    "thank_you"
                                        ? "Regenerating..."
                                        : "🔄 Regenerate"
                                }
                                onClick={() =>
                                    regenerateSection(
                                        "thank_you"
                                    )
                                }
                            />


                            {hasProAccess ? (

                                <Button
                                    text={
                                        loadingHistory &&
                                        historyField ===
                                        "thank_you"
                                            ? "Loading..."
                                            : "History"
                                    }
                                    disabled={
                                        loadingHistory &&
                                        historyField ===
                                        "thank_you"
                                    }
                                    onClick={() =>
                                        loadHistory(
                                            "thank_you"
                                        )
                                    }
                                />

                            ) : (

                                <Button
                                    text="History — Requires Pro"
                                    onClick={() =>
                                        navigate(
                                            "/pricing"
                                        )
                                    }
                                />

                            )}


                            <Button
                                text={
                                    loadingVariations &&
                                    variationField ===
                                    "thank_you"
                                        ? "Generating..."
                                        : "Generate 3 More Versions"
                                }
                                disabled={
                                    loadingVariations &&
                                    variationField ===
                                    "thank_you"
                                }
                                onClick={() =>
                                    generateVariations(
                                        "thank_you"
                                    )
                                }
                            />

                        </div>

                    </Card>

                </div>


                <VariationModal
                    open={
                        showModal
                    }
                    field={
                        variationField
                    }
                    variations={
                        variations
                    }
                    applying={
                        applyingVariation
                    }
                    onClose={() => {
                        if (!applyingVariation) {
                            setShowModal(
                                false
                            );

                            setVariationField(
                                ""
                            );
                        }
                    }}
                    onUse={
                        useVariation
                    }
                />


                {showHistory && (

                    <HistoryModal
                        field={
                            historyField
                        }
                        history={
                            history
                        }
                        onClose={() =>
                            setShowHistory(
                                false
                            )
                        }
                        onCompare={
                            compareVersion
                        }
                    />

                )}


                <CompareVersionsModal
                    open={
                        showCompare
                    }
                    field={
                        historyField
                    }
                    current={
                        funnel[
                            historyField
                        ]
                    }
                    previous={
                        selectedHistory
                    }
                    onRestore={() =>
                        restoreVersion(
                            historyField,
                            selectedHistory
                        )
                    }
                    onClose={() =>
                        setShowCompare(
                            false
                        )
                    }
                />

            </div>


            <div className="print-content">

                <PrintableFunnel
                    funnel={funnel}
                />

            </div>

        </DashboardLayout>

    </div>

);

}
