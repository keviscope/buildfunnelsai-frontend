import Button from "./Button";

export default function ConfirmModal({
    open,
    title = "Are you sure?",
    message = "This action cannot be undone.",
    confirmText = "Confirm",
    cancelText = "Cancel",
    onConfirm,
    onCancel,
    loading = false,
    variant = "danger"
}) {

    if (!open) {
        return null;
    }


    function handleOverlayClick(event) {

        if (
            event.target === event.currentTarget &&
            !loading
        ) {

            onCancel();

        }

    }


    return (

        <div
            className="confirm-overlay"
            onMouseDown={
                handleOverlayClick
            }
        >

            <div
                className="confirm-modal"
                role="dialog"
                aria-modal="true"
                aria-labelledby="confirm-modal-title"
                aria-describedby="confirm-modal-message"
            >

                <div className="confirm-modal-content">

                    <div className="confirm-modal-icon">
                        !
                    </div>


                    <h2 id="confirm-modal-title">
                        {title}
                    </h2>


                    <p id="confirm-modal-message">
                        {message}
                    </p>


                    <div className="confirm-modal-actions">

                        <Button
                            text={cancelText}
                            variant="secondary"
                            disabled={loading}
                            onClick={onCancel}
                        />


                        <Button
                            text={
                                loading
                                    ? "Deleting..."
                                    : confirmText
                            }
                            variant={variant}
                            disabled={loading}
                            onClick={onConfirm}
                        />

                    </div>

                </div>

            </div>

        </div>

    );

}
