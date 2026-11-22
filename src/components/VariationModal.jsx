import Button from "./Button";

export default function VariationModal({
    open,
    field,
    variations,
    applying = false,
    onClose,
    onUse
}) {
    if (!open) return null;

    const versionNames = [
        "A",
        "B",
        "C"
    ];

    return (
        <div className="variation-overlay">

            <div className="variation-modal">

                {/* HEADER */}

                <div className="variation-modal-header">

                    <div>

                        <h2>
                            Compare Versions
                        </h2>

                        <p className="variation-field">

                            {field
                                .replaceAll("_", " ")
                                .replace(/\b\w/g, letter =>
                                    letter.toUpperCase()
                                )}

                        </p>

                    </div>

                    <button
                        className="variation-close"
                        onClick={onClose}
                        disabled={applying}
                        aria-label="Close variations"
                    >
                        ×
                    </button>

                </div>


                {/* VERSION CARDS */}

                <div className="variation-grid">

                    {variations.map(
                        (variation, index) => {

                            const version =
                                versionNames[index]
                                || String(index + 1);

                            return (

                                <div
                                    key={index}
                                    className="variation-card"
                                >

                                    {/* VERSION HEADER */}

                                    <div className="variation-card-header">

                                        <div className="variation-badge">

                                            {version}

                                        </div>

                                        <div>

                                            <span className="variation-label">
                                                Version
                                            </span>

                                            <h3>
                                                Version {version}
                                            </h3>

                                        </div>

                                    </div>


                                    {/* COPY */}

                                    <div className="variation-content">

                                        <p>
                                            {variation}
                                        </p>

                                    </div>


                                    {/* ACTION */}

                                    <div className="variation-card-action">

                                        <Button
                                            text={
                                                applying
                                                    ? "Applying..."
                                                    : "Use This Version"
                                            }
                                            disabled={applying}
                                            onClick={() =>
                                                onUse(variation)
                                            }
                                        />

                                    </div>

                                </div>

                            );

                        }
                    )}

                </div>


                {/* FOOTER */}

                <div className="variation-modal-footer">

                    <Button
                        text="Close"
                        disabled={applying}
                        onClick={onClose}
                    />

                </div>

            </div>

        </div>
    );
}
