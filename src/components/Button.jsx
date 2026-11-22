
export default function Button({
    text,
    onClick,
    type = "button",
    disabled = false,
    variant = "primary",
    loading = false,
    fullWidth = false
}) {

    const isDisabled =
        disabled || loading;

    return (
        <button
            type={type}
            onClick={onClick}
            disabled={isDisabled}
            className={`app-button app-button-${variant}${
                fullWidth
                    ? " app-button-full"
                    : ""
            }`}
        >
            {loading ? "Loading..." : text}
        </button>
    );
}

