import {
    useEffect,
    useRef,
    useState
} from "react";

import {
    useLocation,
    useNavigate
} from "react-router-dom";

import LoadingSpinner
    from "../components/LoadingSpinner";

import ErrorState
    from "../components/ErrorState";

import api
    from "../api/axios";

import {
    useAuth
} from "../context/AuthContext";

import {
    analytics
} from "../analytics";


export default function Loading() {

    const navigate = useNavigate();

    const {
        state
    } = useLocation();

    const funnelData = state;

    const {
        user
    } = useAuth();

    const generateStarted =
        useRef(false);


    const steps = [

        "Understanding Property",

        "Creating Lead Magnet",

        "Writing Landing Page",

        "Writing Facebook Ad",

        "Writing Instagram Ad",

        "Writing WhatsApp Follow-up",

        "Writing Email Sequence",

        "Creating Thank You Page"

    ];


    const stepMessages = [

        "Analyzing your property and target audience...",

        "Creating a compelling lead magnet...",

        "Building your landing page...",

        "Writing your Facebook advertising copy...",

        "Creating your Instagram advertising copy...",

        "Creating your WhatsApp follow-up sequence...",

        "Writing your email follow-up sequence...",

        "Creating your thank-you page..."

    ];


    const [
        currentStep,
        setCurrentStep
    ] = useState(0);


    const [
        generationError,
        setGenerationError
    ] = useState(null);


    const [
        creditsExhausted,
        setCreditsExhausted
    ] = useState(false);


    const [
        retrying,
        setRetrying
    ] = useState(false);


    /*
    |--------------------------------------------------------------------------
    | Fake Progress
    |--------------------------------------------------------------------------
    */

    useEffect(() => {

        /*
        |--------------------------------------------------------------------------
        | Stop fake progress when AI credits are exhausted
        |--------------------------------------------------------------------------
        */

        if (creditsExhausted) {
            return;
        }


        const timer =
            setInterval(() => {

                setCurrentStep(
                    previous => {

                        if (
                            previous <
                            steps.length - 1
                        ) {

                            return (
                                previous + 1
                            );

                        }

                        return previous;

                    }
                );

            }, 800);


        return () =>
            clearInterval(timer);

    }, [creditsExhausted]);


    /*
    |--------------------------------------------------------------------------
    | Generate Funnel
    |--------------------------------------------------------------------------
    */

    async function generateAI() {

        if (!funnelData) {
            return;
        }


        if (
            generateStarted.current &&
            !retrying
        ) {

            return;

        }


        generateStarted.current =
            true;


        try {

            setGenerationError(null);

            setCreditsExhausted(false);


            console.log(
                "GENERATE AI REQUEST STARTED:",
                new Date().toISOString()
            );


            /*
            |--------------------------------------------------------------------------
            | Analytics — Funnel Creation Started
            |--------------------------------------------------------------------------
            */

            analytics.funnelCreationStarted({

                plan:
                    user?.plan,

                property_type:
                    funnelData.propertyType

            });


            /*
            |--------------------------------------------------------------------------
            | Analytics — AI Generation Started
            |--------------------------------------------------------------------------
            */

            analytics.aiGenerationStarted({

                plan:
                    user?.plan,

                property_type:
                    funnelData.propertyType

            });


            const response =
                await api.post(
                    "/api/generate-ai",
                    funnelData,
                    {
                        /*
                        |--------------------------------------------------------------------------
                        | Loading handles its own error UI.
                        |
                        | Prevent Axios global Toast from showing a duplicate
                        | generic error for this request.
                        |--------------------------------------------------------------------------
                        */

                        skipGlobalToast: true
                    }
                );


            console.log(
                "AI FUNNEL CREATED:",
                response.data
            );


            /*
            |--------------------------------------------------------------------------
            | Analytics — AI Generation Completed
            |--------------------------------------------------------------------------
            */

            analytics.aiGenerationCompleted({

                funnel_id:
                    response.data.id,

                plan:
                    user?.plan,

                property_type:
                    funnelData.propertyType

            });


            analytics.aiCreditsUsed({
    funnel_id: response.data.id,
    plan: user?.plan,
    credits_used: 1
});








            /*
            |--------------------------------------------------------------------------
            | Analytics — Funnel Created
            |--------------------------------------------------------------------------
            */

analytics.funnelCreated({
    funnel_id: response.data.id,
    plan: user?.plan,
    property_type: funnelData.propertyType,
    funnel_number: response.data.funnel_number,
    is_first_funnel: response.data.is_first_funnel
});


if (response.data.funnel_number === 2) {
    analytics.secondFunnelCreated({
        funnel_id: response.data.id,
        plan: user?.plan,
        property_type: funnelData.propertyType,
        funnel_number: response.data.funnel_number
    });
}

console.log(
    "FIRST FUNNEL DATA:",
    response.data.is_first_funnel,
    response.data.funnel_number
);






if (response.data.is_first_funnel) {
    analytics.firstFunnelCompleted({
        funnel_id: response.data.id,
        plan: user?.plan,
        property_type: funnelData.propertyType,
        funnel_number: response.data.funnel_number
    });
}




            navigate(
                `/result/${response.data.id}`
            );


        } catch (error) {

            console.error(
                "AI FUNNEL ERROR:",
                error.response?.data ||
                error.message
            );


            /*
            |--------------------------------------------------------------------------
            | Analytics — AI Generation Failed
            |--------------------------------------------------------------------------
            */

            analytics.aiGenerationFailed({

                plan:
                    user?.plan,

                property_type:
                    funnelData.propertyType,

                status:
                    error?.response?.status,

                error_code:
                    error?.response?.data?.error_code ||
                    error?.userErrorCode ||
                    null

            });


            /*
            |--------------------------------------------------------------------------
            | Analytics — Funnel Creation Failed
            |--------------------------------------------------------------------------
            */

            analytics.funnelCreationFailed({

                plan:
                    user?.plan,

                property_type:
                    funnelData.propertyType,

                status:
                    error?.response?.status,

                error_code:
                    error?.response?.data?.error_code ||
                    error?.userErrorCode ||
                    null

            });


            generateStarted.current =
                false;


            /*
            |--------------------------------------------------------------------------
            | Read Backend Error Code
            |--------------------------------------------------------------------------
            |
            | AI_CREDITS_EXHAUSTED is returned by the backend as:
            |
            | {
            |     "message": "...",
            |     "error_code": "AI_CREDITS_EXHAUSTED"
            | }
            |
            | Check the raw backend response first.
            |
            |--------------------------------------------------------------------------
            */

            const errorCode =
                error?.response?.data?.error_code ||
                error?.userErrorCode ||
                null;


            console.log(
                "AI ERROR CODE:",
                errorCode
            );


            /*
            |--------------------------------------------------------------------------
            | AI Credits Exhausted
            |--------------------------------------------------------------------------
            |
            | IMPORTANT:
            |
            | This must happen BEFORE generic 429 handling.
            |
            | AI_CREDITS_EXHAUSTED also uses HTTP 429,
            | but it is NOT a normal rate-limit error.
            |
            |--------------------------------------------------------------------------
            */

            if (
                errorCode ===
                "AI_CREDITS_EXHAUSTED"
            ) {

                console.log(
                    "AI CREDITS EXHAUSTED UI TRIGGERED"
                );


                setCreditsExhausted(
                    true
                );


                setGenerationError(
                    null
                );


                setRetrying(
                    false
                );


                return;

            }


            /*
            |--------------------------------------------------------------------------
            | Normal Error Handling
            |--------------------------------------------------------------------------
            */

            const status =
                error?.response?.status;


            let message =
                error?.response?.data?.message ||
                error?.userMessage ||
                null;


            if (
                status === 401
            ) {

                message =
                    "Your session has expired. Please log in again.";

            } else if (
                status === 403
            ) {

                message =
                    "You don't have permission to generate this funnel.";

            } else if (
                status === 409
            ) {

                message =
                    "You may have reached a plan or credit limit. Please check your account.";

            } else if (
                status === 422
            ) {

                message =
                    "Some of the information provided is invalid. Please return to the dashboard and review it.";

            } else if (
                status === 429
            ) {

                message =
                    "Too many requests were made. Please wait a moment and try again.";

            } else if (
                status >= 500
            ) {

                message =
                    "Our AI service is temporarily unavailable. Please try again.";

            } else if (
                !message
            ) {

                message =
                    "We couldn't generate your funnel. Please try again.";

            }


            setGenerationError(
                message
            );


            setRetrying(
                false
            );

        }

    }


    /*
    |--------------------------------------------------------------------------
    | Start Generation
    |--------------------------------------------------------------------------
    */

    useEffect(() => {

        if (!funnelData) {
            return;
        }


        generateAI();

    }, [funnelData]);


    /*
    |--------------------------------------------------------------------------
    | Missing Funnel Data
    |--------------------------------------------------------------------------
    */

    if (!funnelData) {

        return (

            <div className="screen-content">

                <ErrorState
                    title="No funnel data found"
                    message={
                        "We don't have the information needed to generate your funnel."
                    }
                    buttonText="Go to Dashboard"
                    onRetry={() =>
                        navigate(
                            "/dashboard"
                        )
                    }
                />

            </div>

        );

    }


    /*
    |--------------------------------------------------------------------------
    | AI Credits Exhausted
    |--------------------------------------------------------------------------
    */

    if (creditsExhausted) {

        return (

            <div className="screen-content">

                <ErrorState
                    title="AI Credits Exhausted"
                    message={
                        "You've used all of your available AI credits. Upgrade your plan or purchase additional credits to continue generating funnels and AI content."
                    }
                    buttonText="Manage Credits"
                    onRetry={() =>
                        navigate(
                            "/pricing"
                        )
                    }
                    secondaryText="Return to Dashboard"
                    onSecondaryAction={() =>
                        navigate(
                            "/dashboard"
                        )
                    }
                />

            </div>

        );

    }


    /*
    |--------------------------------------------------------------------------
    | Generation Error
    |--------------------------------------------------------------------------
    */

    if (generationError) {

        return (

            <div className="screen-content">

                <ErrorState
                    title="Unable to Generate Funnel"
                    message={generationError}
                    buttonText={
                        retrying
                            ? "Trying Again..."
                            : "Try Again"
                    }
                    onRetry={() => {

                        if (retrying) {
                            return;
                        }


                        setRetrying(
                            true
                        );


                        setGenerationError(
                            null
                        );


                        setCreditsExhausted(
                            false
                        );


                        generateStarted.current =
                            false;


                        setCurrentStep(
                            0
                        );


                        setTimeout(() => {

                            generateAI();

                        }, 100);

                    }}
                    secondaryText="Return to Dashboard"
                    onSecondaryAction={() =>
                        navigate(
                            "/dashboard"
                        )
                    }
                />

            </div>

        );

    }


    /*
    |--------------------------------------------------------------------------
    | Loading Screen
    |--------------------------------------------------------------------------
    */

    return (

        <div className="screen-content">

            <LoadingSpinner
                title="Generating Your Funnel"
                message="AI is building your marketing system..."
            />


            <h1>
                Building Your Funnel
            </h1>


            <p>
                We're creating your marketing
                funnel based on the information
                you provided.
            </p>


            <p>
                This usually takes about
                5–20 seconds.
            </p>


            <p>
                {stepMessages[currentStep]}
            </p>


            <hr />


            <p>
                Generation progress
            </p>


            <ul>

                {steps.map(
                    (step, index) => (

                        <li
                            key={index}
                        >

                            {index < currentStep
                                ? "Completed"
                                : index === currentStep
                                    ? "In progress"
                                    : "Waiting"
                            }

                            {" — "}

                            {step}

                        </li>

                    )
                )}

            </ul>


            <hr />


            <h3>
                Your Funnel Details
            </h3>


            <p>
                Property Type:{" "}
                {funnelData.propertyType}
            </p>


            <p>
                Bedrooms:{" "}
                {funnelData.bedrooms}
            </p>


            <p>
                Budget:{" "}
                {funnelData.budgetLevel}
            </p>


            <p>
                Audience:{" "}
                {funnelData.audience}
            </p>


            <p>
                Location:{" "}
                {funnelData.location}
            </p>


            <p>
                Offer:{" "}
                {funnelData.offer}
            </p>


            <p>
                Please keep this page open
                while your funnel is being generated.
            </p>

        </div>

    );

}
