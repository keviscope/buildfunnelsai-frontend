export default function StatCard({
    title,
    value,
    icon,
    children
}) {

    return (

        <div className="stat-card">

            <div className="stat-card-header">

                <span className="stat-card-icon">
                    {icon}
                </span>

                <span className="stat-card-title">
                    {title}
                </span>

            </div>


            {value && (

                <h2 className="stat-card-value">
                    {value}
                </h2>

            )}


            {children}

        </div>

    );

}