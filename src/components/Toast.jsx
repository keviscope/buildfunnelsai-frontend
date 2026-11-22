export default function Toast({
    message,
    type = "info",
    onClose
}) {

    if (!message) {
        return null;
    }


    const icons = {

        success: "✓",

        error: "✕",

        warning: "⚠",

        info: "ⓘ"

    };


    return (

        <div
            className={
                `toast toast-${type}`
            }
            role="alert"
            aria-live="polite"
        >

            <div className="toast-icon">

                {
                    icons[type] ||
                    icons.info
                }

            </div>


            <div className="toast-content">

                <p className="toast-message">
                    {message}
                </p>

            </div>


            <button
                type="button"
                className="toast-close"
                onClick={onClose}
                aria-label="Close notification"
            >
                ×
            </button>

        </div>

    );

}