import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

export default function DashboardLayout({
    children
}) {

    return (

        <div className="dashboard-layout">

            <Navbar />

            <Sidebar />

            <main className="dashboard-layout-main">

                {children}

            </main>

        </div>

    );

}
