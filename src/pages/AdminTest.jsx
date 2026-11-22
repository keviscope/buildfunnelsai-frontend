import { useEffect, useState } from "react";
import api from "../api/axios";

export default function AdminTest() {
    const [data, setData] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        api.get("/api/admin/growth")
            .then((response) => {
                console.log("ADMIN OVERVIEW:", response.data);
                setData(response.data);
            })
            .catch((error) => {
                console.error("ADMIN ERROR:", error.response?.data);
                setError(error.response?.data || error.message);
            });
    }, []);

    return (
        <div style={{ padding: "40px" }}>
            <h1>Admin API Test</h1>

            {data && (
                <pre>
                    {JSON.stringify(data, null, 2)}
                </pre>
            )}

            {error && (
                <pre>
                    {JSON.stringify(error, null, 2)}
                </pre>
            )}

            {!data && !error && <p>Testing admin API...</p>}
        </div>
    );
}