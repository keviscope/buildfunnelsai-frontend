


export default function ErrorState({
    title = "Something went wrong",
    message = "We couldn't complete this request.",
    buttonText = "Try Again",
    onRetry,
    secondaryText,
    onSecondaryAction
}) {
    return (
        <div className="error-state">

            <div className="error-state-content">

                <div className="error-state-indicator">
                    !
                </div>

                <h2>
                    {title}
                </h2>

                <p>
                    {message}
                </p>

                <div className="error-state-actions">

                    {onRetry && (
                        <button
                            type="button"
                            className="app-button app-button-primary"
                            onClick={onRetry}
                        >
                            {buttonText}
                        </button>
                    )}

                    {onSecondaryAction && (
                        <button
                            type="button"
                            className="app-button app-button-secondary"
                            onClick={onSecondaryAction}
                        >
                            {secondaryText}
                        </button>
                    )}

                </div>

            </div>

        </div>
    );
}


