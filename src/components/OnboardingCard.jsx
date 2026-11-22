import {
    useEffect,
    useState
} from "react";

import Button
    from "./Button";

import api
    from "../api/axios";

import {
    updateOnboardingStep
} from "../utils/onboarding";


const DEFAULT_PROGRESS = {
    create_first_funnel: false,
    generate_first_campaign: false,
    edit_section: false,
    export_funnel: false,
};


const STEPS = [
    {
        key: "create_first_funnel",
        title: "Create your first funnel",
        description:
            "Start by telling Funnel AI about your property, audience, location, and offer.",
    },
    {
        key: "generate_first_campaign",
        title: "Generate your first campaign",
        description:
            "Let AI turn your information into a complete marketing funnel.",
    },
    {
        key: "edit_section",
        title: "Edit a section",
        description:
            "Customize any part of your generated funnel to make it your own.",
    },
    {
        key: "export_funnel",
        title: "Export your funnel",
        description:
            "Download or print your finished funnel when you're ready to use it.",
    },
];


export default function OnboardingCard() {

    const [
        progress,
        setProgress
    ] = useState(DEFAULT_PROGRESS);


    const [
        visible,
        setVisible
    ] = useState(false);


    const [
        loading,
        setLoading
    ] = useState(true);


    async function loadOnboarding() {

        try {

            const response =
                await api.get(
                    "/api/onboarding"
                );


            if (
                response.data?.visible
            ) {

                setProgress({
                    ...DEFAULT_PROGRESS,
                    ...(response.data.progress || {})
                });

                setVisible(true);

            } else {

                setVisible(false);

            }

        } catch (error) {

            console.error(
                "ONBOARDING LOAD ERROR:",
                error.response?.data ||
                error.message
            );

            setVisible(false);

        } finally {

            setLoading(false);

        }

    }


    useEffect(() => {

        loadOnboarding();

    }, []);


    async function completeStep(
        step
    ) {

        const response =
            await updateOnboardingStep(
                step
            );


        if (!response) {
            return;
        }


        setProgress({
            ...DEFAULT_PROGRESS,
            ...(response.progress || {})
        });


        if (
            response.completed
        ) {

            setVisible(false);

        }

    }


    async function handleCreateFunnel() {

        await completeStep(
            "create_first_funnel"
        );


        const createSection =
            document.querySelector(
                "#create-funnel"
            );


        if (createSection) {

            createSection.scrollIntoView({
                behavior: "smooth",
                block: "start",
            });

        }


        window.dispatchEvent(
            new Event(
                "funnel-ai-create-funnel"
            )
        );

    }


    if (
        loading ||
        !visible
    ) {

        return null;

    }


    const completedCount =
        STEPS.filter(
            (step) =>
                progress[step.key]
        ).length;


    const completionPercentage =
        Math.round(
            (
                completedCount /
                STEPS.length
            ) * 100
        );


    return (

        <section className="onboarding-card">

            <div className="onboarding-header">

                <div>

                    <span className="dashboard-eyebrow">
                        Getting Started
                    </span>

                    <h2>
                        Welcome to Funnel AI Builder
                    </h2>

                    <p>
                        Let's get your first
                        marketing funnel built
                        in a few simple steps.
                    </p>

                </div>

                <div className="onboarding-progress-summary">

                    <strong>
                        {completionPercentage}%
                    </strong>

                    <span>
                        Complete
                    </span>

                </div>

            </div>


            <div className="onboarding-progress-bar">

                <div
                    className="onboarding-progress-fill"
                    style={{
                        width:
                            `${completionPercentage}%`
                    }}
                />

            </div>


            <div className="onboarding-checklist">

                {STEPS.map(
                    (
                        step,
                        index
                    ) => {

                        const completed =
                            Boolean(
                                progress[
                                    step.key
                                ]
                            );


                        return (

                            <div
                                className={
                                    `onboarding-step ${
                                        completed
                                            ? "onboarding-step-completed"
                                            : ""
                                    }`
                                }
                                key={
                                    step.key
                                }
                            >

                                <div className="onboarding-step-indicator">

                                    {completed
                                        ? "✓"
                                        : index + 1}

                                </div>


                                <div className="onboarding-step-content">

                                    <h3>
                                        {step.title}
                                    </h3>

                                    <p>
                                        {step.description}
                                    </p>

                                </div>

                            </div>

                        );

                    }
                )}

            </div>


            {!progress.create_first_funnel && (

                <div className="onboarding-actions">

                    <Button
                        text="Create My First Funnel"
                        onClick={
                            handleCreateFunnel
                        }
                    />

                </div>

            )}

        </section>

    );

}