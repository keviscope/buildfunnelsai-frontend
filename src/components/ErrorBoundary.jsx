
import {
    Component
} from "react";

import ErrorState from "./ErrorState";
import { analytics } from "../analytics";
export default class ErrorBoundary extends Component {

    constructor(props) {
        super(props);

        this.state = {
            hasError: false,
            error: null
        };
    }


    static getDerivedStateFromError(error) {
        return {
            hasError: true,
            error
        };
    }


  componentDidCatch(error, errorInfo) {

    console.error(
        "REACT ERROR BOUNDARY:",
        error
    );

    console.error(
        "REACT ERROR DETAILS:",
        errorInfo
    );

    analytics.track(
        "frontend_error",
        {
            message: error?.message || "Unknown frontend error",
            name: error?.name || "Error",
            route: window.location.pathname,
            component_stack:
                errorInfo?.componentStack || null
        }
    );

}


    handleReload = () => {

        window.location.reload();

    };


    handleGoDashboard = () => {

        window.location.href =
            "/dashboard";

    };


    render() {

        if (this.state.hasError) {

            return (

                <div className="error-boundary-page">

                    <ErrorState
                        title="Something went wrong"
                        message={
                            "We ran into an unexpected problem while loading this page. Your data has not been deleted."
                        }
                        buttonText="Reload Page"
                        onRetry={
                            this.handleReload
                        }
                        secondaryText="Go to Dashboard"
                        onSecondaryAction={
                            this.handleGoDashboard
                        }
                    />

                </div>

            );

        }

        return this.props.children;
    }

}




















































































































































