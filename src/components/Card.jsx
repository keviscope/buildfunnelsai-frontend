export default function Card({
    title,
    children,
    className = ""
}) {
    return (
        <section
            className={`app-card ${className}`.trim()}
        >

            {title && (
                <h2 className="app-card-title">
                    {title}
                </h2>
            )}

            <div className="app-card-content">
                {children}
            </div>

        </section>
    );
}

