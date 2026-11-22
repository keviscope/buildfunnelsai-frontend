import api from "../api/axios";

export async function updateOnboardingStep(step) {
    try {
        const response = await api.patch(
            "/api/onboarding",
            {
                step,
            }
        );

        return response.data;
    } catch (error) {
        console.error(
            "ONBOARDING UPDATE ERROR:",
            error.response?.data || error.message
        );

        return null;
    }
}