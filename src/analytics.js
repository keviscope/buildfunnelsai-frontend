import posthog from "posthog-js";


// =====================================================
// ANALYTICS HELPER
// =====================================================

export const analytics = {



planUpgradeStarted(properties = {}) {
    this.track("plan_upgrade_started", properties);
},

paymentCompleted(properties = {}) {
    this.track("payment_completed", properties);
},

paymentFailed(properties = {}) {
    this.track("payment_failed", properties);
},


    // -------------------------------------------------
    // Track a custom event
    // -------------------------------------------------

    track(eventName, properties = {}) {

        posthog.capture(
            eventName,
            properties
        );

    },


    // -------------------------------------------------
    // Identify a logged-in user
    // -------------------------------------------------

    identify(userId, properties = {}) {

        posthog.identify(
            String(userId),
            properties
        );

    },


    // -------------------------------------------------
    // Reset analytics identity on logout
    // -------------------------------------------------

    reset() {

        posthog.reset();

    },


    // -------------------------------------------------
    // Track page views
    // -------------------------------------------------

    pageViewed(path) {

        posthog.capture(
            "page_viewed",
            {
                path
            }
        );

    },


    // -------------------------------------------------
    // Funnel events
    // -------------------------------------------------

    funnelCreationStarted(properties = {}) {

        this.track(
            "funnel_creation_started",
            properties
        );

    },


    funnelCreated(properties = {}) {

        this.track(
            "funnel_created",
            properties
        );

    },


    secondFunnelCreated(properties = {}) {
    this.track("second_funnel_created", properties);
},


firstFunnelCompleted(properties = {}) {
    this.track(
        "first_funnel_completed",
        properties
    );
},


    funnelCreationFailed(properties = {}) {

        this.track(
            "funnel_creation_failed",
            properties
        );

    },


    // -------------------------------------------------
    // AI generation events
    // -------------------------------------------------

    aiGenerationStarted(properties = {}) {

        this.track(
            "ai_generation_started",
            properties
        );

    },


    aiGenerationCompleted(properties = {}) {

        this.track(
            "ai_generation_completed",
            properties
        );

    },


    aiGenerationFailed(properties = {}) {

        this.track(
            "ai_generation_failed",
            properties
        );

    },


    aiCreditsUsed(properties = {}) {

        this.track(
            "ai_credits_used",
            properties
        );

    },


    aiCreditsPurchased(properties = {}) {

        this.track(
            "ai_credits_purchased",
            properties
        );

    },


    // -------------------------------------------------
    // Authentication events
    // -------------------------------------------------

 
userRegistered(properties = {}) {
    // Keep existing PostHog tracking
    this.track("user_registered", properties);

    // Send Meta Pixel registration event
    if (typeof window !== "undefined" &&
        typeof window.fbq === "function") {
        window.fbq("track", "CompleteRegistration");
    }
},



    loginCompleted(properties = {}) {

        this.track(
            "login_completed",
            properties
        );

    },


    logoutCompleted(properties = {}) {

        this.track(
            "logout_completed",
            properties
        );

    },


    // -------------------------------------------------
    // Funnel editing
    // -------------------------------------------------

    funnelSectionEdited(properties = {}) {

        this.track(
            "funnel_section_edited",
            properties
        );

    },


    funnelSectionRegenerated(properties = {}) {

        this.track(
            "funnel_section_regenerated",
            properties
        );

    },


    // -------------------------------------------------
    // Export events
    // -------------------------------------------------

    funnelExported(properties = {}) {

        this.track(
            "funnel_exported",
            properties
        );

    },


    // -------------------------------------------------
    // Public sharing
    // -------------------------------------------------

    publicSharingEnabled(properties = {}) {

        this.track(
            "public_sharing_enabled",
            properties
        );

    },


    publicSharingDisabled(properties = {}) {

        this.track(
            "public_sharing_disabled",
            properties
        );

    },


    publicShareLinkRegenerated(properties = {}) {

        this.track(
            "public_share_link_regenerated",
            properties
        );

    },


    // -------------------------------------------------
    // Payments / upgrades
    // -------------------------------------------------

    planUpgradeStarted(properties = {}) {

        this.track(
            "plan_upgrade_started",
            properties
        );

    },


    paymentCompleted(properties = {}) {

        this.track(
            "payment_completed",
            properties
        );

    },


    paymentFailed(properties = {}) {

        this.track(
            "payment_failed",
            properties
        );

    }



    

};