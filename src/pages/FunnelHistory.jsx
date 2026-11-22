
import DashboardLayout
    from "../layouts/DashboardLayout";

import Button
    from "../components/Button";

import Input
    from "../components/Input";

import Select
    from "../components/Select";

import LoadingSpinner
    from "../components/LoadingSpinner";

import ErrorState
    from "../components/ErrorState";

import ConfirmModal
    from "../components/ConfirmModal";

import {
    useEffect,
    useState
} from "react";

import {
    useNavigate
} from "react-router-dom";

import api
    from "../api/axios";

import {
    useToast
} from "../context/ToastContext";


export default function FunnelHistory() {

    const navigate =
        useNavigate();

    const {
        showToast
    } = useToast();


    const [
        funnels,
        setFunnels
    ] = useState([]);


    const [
        currentPage,
        setCurrentPage
    ] = useState(1);


    const [
        lastPage,
        setLastPage
    ] = useState(1);


    const [
        search,
        setSearch
    ] = useState("");


    const [
        propertyType,
        setPropertyType
    ] = useState("");


    const [
        location,
        setLocation
    ] = useState("");


    const [
        date,
        setDate
    ] = useState("");


    const [
        sortBy,
        setSortBy
    ] = useState("Newest First");


    const [
        loading,
        setLoading
    ] = useState(true);


    const [
        error,
        setError
    ] = useState("");


    const [
        deletingId,
        setDeletingId
    ] = useState(null);


    const [
        funnelToDelete,
        setFunnelToDelete
    ] = useState(null);


    async function loadFunnels(
        page = 1
    ) {

        try {

            setLoading(true);

            setError("");


            const response =
                await api.get(
                    `/api/funnels?page=${page}`
                );


            console.log(
                "FUNNEL HISTORY:",
                response.data
            );


            setFunnels(
                response.data.data || []
            );


            setCurrentPage(
                response.data.current_page || 1
            );


            setLastPage(
                response.data.last_page || 1
            );


        } catch (error) {

            console.error(
                "FUNNEL HISTORY ERROR:",
                error.response?.data ||
                error.message
            );


            const status =
                error.response?.status;


            if (
                status === 401
            ) {

                setError(
                    "Your session has expired. Please log in again."
                );

            } else if (
                status === 403
            ) {

                setError(
                    "You don't have permission to view your funnel history."
                );

            } else if (
                status >= 500
            ) {

                setError(
                    "Our server is having trouble loading your funnels."
                );

            } else {

                setError(
                    "We couldn't load your funnels right now."
                );

            }

        } finally {

            setLoading(false);

        }

    }


    useEffect(() => {

        loadFunnels(1);

    }, []);


    function viewFunnel(id) {

        navigate(
            `/result/${id}`
        );

    }


    function openDeleteConfirmation(
        funnel
    ) {

        if (deletingId) {
            return;
        }

        setFunnelToDelete(
            funnel
        );

    }


    function closeDeleteConfirmation() {

        if (deletingId) {
            return;
        }

        setFunnelToDelete(
            null
        );

    }


    async function deleteFunnel() {

        if (
            !funnelToDelete
        ) {

            return;

        }


        const id =
            funnelToDelete.id;


        try {

            setDeletingId(id);


            const response =
                await api.delete(
                    `/api/funnels/${id}`
                );


            console.log(
                "DELETE FUNNEL:",
                response.data
            );


            setFunnelToDelete(
                null
            );


            showToast(
                "Funnel deleted successfully.",
                "success"
            );


            await loadFunnels(
                currentPage
            );


        } catch (error) {

            console.error(
                "DELETE FUNNEL ERROR:",
                error.response?.data ||
                error.message
            );


            showToast(
                error.response?.data?.message ||
                "We couldn't delete this funnel. Please try again.",
                "error"
            );

        } finally {

            setDeletingId(
                null
            );

        }

    }


    function getFilteredFunnels() {

        let result =
            [
                ...funnels
            ];


        /*
        |--------------------------------------------------------------------------
        | Search
        |--------------------------------------------------------------------------
        */

        if (
            search.trim()
        ) {

            const searchTerm =
                search.toLowerCase();


            result =
                result.filter(
                    (funnel) =>

                        funnel.campaign
                            ?.toLowerCase()
                            .includes(
                                searchTerm
                            )

                        ||

                        funnel.propertyType
                            ?.toLowerCase()
                            .includes(
                                searchTerm
                            )

                        ||

                        funnel.audience
                            ?.toLowerCase()
                            .includes(
                                searchTerm
                            )

                        ||

                        funnel.location
                            ?.toLowerCase()
                            .includes(
                                searchTerm
                            )

                );

        }


        /*
        |--------------------------------------------------------------------------
        | Property Filter
        |--------------------------------------------------------------------------
        */

        if (
            propertyType
        ) {

            result =
                result.filter(
                    funnel =>
                        funnel.propertyType ===
                        propertyType
                );

        }


        /*
        |--------------------------------------------------------------------------
        | Location Filter
        |--------------------------------------------------------------------------
        */

        if (
            location
        ) {

            result =
                result.filter(
                    funnel =>
                        funnel.location ===
                        location
                );

        }


        /*
        |--------------------------------------------------------------------------
        | Date Filter
        |--------------------------------------------------------------------------
        */

        if (
            date
        ) {

            const now =
                new Date();


            result =
                result.filter(
                    funnel => {

                        const created =
                            new Date(
                                funnel.created_at
                            );


                        if (
                            date ===
                            "Today"
                        ) {

                            return (
                                created.toDateString()
                                ===
                                now.toDateString()
                            );

                        }


                        if (
                            date ===
                            "This Week"
                        ) {

                            const weekAgo =
                                new Date();

                            weekAgo.setDate(
                                now.getDate()
                                - 7
                            );

                            return (
                                created >=
                                weekAgo
                            );

                        }


                        if (
                            date ===
                            "This Month"
                        ) {

                            return (

                                created.getMonth()
                                ===
                                now.getMonth()

                                &&

                                created.getFullYear()
                                ===
                                now.getFullYear()

                            );

                        }


                        if (
                            date ===
                            "This Year"
                        ) {

                            return (

                                created.getFullYear()
                                ===
                                now.getFullYear()

                            );

                        }


                        return true;

                    }
                );

        }


        /*
        |--------------------------------------------------------------------------
        | Sorting
        |--------------------------------------------------------------------------
        */

        result.sort(
            (a, b) => {

                if (
                    sortBy ===
                    "Newest First"
                ) {

                    return (
                        new Date(
                            b.created_at
                        )
                        -
                        new Date(
                            a.created_at
                        )
                    );

                }


                if (
                    sortBy ===
                    "Oldest First"
                ) {

                    return (
                        new Date(
                            a.created_at
                        )
                        -
                        new Date(
                            b.created_at
                        )
                    );

                }


                if (
                    sortBy ===
                    "A-Z"
                ) {

                    return (
                        (a.campaign || "")
                            .localeCompare(
                                b.campaign || ""
                            )
                    );

                }


                if (
                    sortBy ===
                    "Z-A"
                ) {

                    return (
                        (b.campaign || "")
                            .localeCompare(
                                a.campaign || ""
                            )
                    );

                }


                return 0;

            }
        );


        return result;

    }


    function clearFilters() {

        setSearch("");

        setPropertyType("");

        setLocation("");

        setDate("");

        setSortBy(
            "Newest First"
        );

    }


    const filteredFunnels =
        getFilteredFunnels();


    /*
    |--------------------------------------------------------------------------
    | Initial Loading
    |--------------------------------------------------------------------------
    */

    if (
        loading &&
        funnels.length === 0 &&
        !error
    ) {

        return (

            <DashboardLayout>

                <div className="screen-content">

                    <LoadingSpinner />

                    <h2>
                        Loading your funnels...
                    </h2>

                    <p>
                        Getting your funnel history ready.
                    </p>

                </div>

            </DashboardLayout>

        );

    }


    /*
    |--------------------------------------------------------------------------
    | Initial Error
    |--------------------------------------------------------------------------
    */

    if (
        error &&
        funnels.length === 0
    ) {

        return (

            <DashboardLayout>

                <div className="screen-content">

                    <ErrorState
                        title="Unable to Load Funnel History"
                        message={error}
                        buttonText="Try Again"
                        onRetry={() =>
                            loadFunnels(
                                currentPage
                            )
                        }
                        secondaryText="Go to Dashboard"
                        onSecondaryAction={() =>
                            navigate(
                                "/dashboard"
                            )
                        }
                    />

                </div>

            </DashboardLayout>

        );

    }


    return (

        <DashboardLayout>

            <div className="funnel-history-page">


                {/* HEADER */}

                <div className="history-header">

                    <div>

                        <h1>
                            Funnel History
                        </h1>

                        <p>
                            Manage and review your
                            AI-generated funnels.
                        </p>

                    </div>


                    <Button
                        text="Create New Funnel"
                        onClick={() =>
                            navigate(
                                "/dashboard"
                            )
                        }
                    />

                </div>


                {/* FILTER BAR */}

                <div className="history-filters">

                    <Input
                        type="text"
                        placeholder="Search campaign, property, audience, or location..."
                        value={search}
                        onChange={(event) =>
                            setSearch(
                                event.target.value
                            )
                        }
                    />


                    <Select
                        placeholder="Property Type"
                        value={propertyType}
                        onChange={(event) =>
                            setPropertyType(
                                event.target.value
                            )
                        }
                        options={[
                            "Apartment",
                            "Duplex",
                            "Detached House",
                            "Terraced House",
                            "Land",
                            "Commercial Property",
                            "Office Space",
                            "Warehouse",
                            "Short-let Apartment"
                        ]}
                    />


                    <Input
                        type="text"
                        placeholder="Location"
                        value={location}
                        onChange={(event) =>
                            setLocation(
                                event.target.value
                            )
                        }
                    />


                    <Select
                        placeholder="Date"
                        value={date}
                        onChange={(event) =>
                            setDate(
                                event.target.value
                            )
                        }
                        options={[
                            "Today",
                            "This Week",
                            "This Month",
                            "This Year"
                        ]}
                    />


                    <Select
                        placeholder="Sort By"
                        value={sortBy}
                        onChange={(event) =>
                            setSortBy(
                                event.target.value
                            )
                        }
                        options={[
                            "Newest First",
                            "Oldest First",
                            "A-Z",
                            "Z-A"
                        ]}
                    />

                </div>


                {/* ERROR */}

                {error && (

                    <div className="history-error">

                        <div>
                            {error}
                        </div>

                        <Button
                            text="Retry"
                            variant="secondary"
                            onClick={() =>
                                loadFunnels(
                                    currentPage
                                )
                            }
                        />

                    </div>

                )}


                {/* RESULT COUNT */}

                {funnels.length > 0 && (

                    <p className="history-result-count">

                        {filteredFunnels.length}{" "}

                        {
                            filteredFunnels.length ===
                            1
                                ? "funnel"
                                : "funnels"
                        }{" "}

                        found

                    </p>

                )}


                {/* EMPTY */}

                {!error &&
                    filteredFunnels.length === 0 && (

                        <>

                            {funnels.length === 0 ? (

                                <div className="empty-state">

                                    <div className="empty-state-content">

                                        <h2>
                                            No funnel history yet
                                        </h2>

                                        <p>
                                            Your generated funnels
                                            will appear here so you
                                            can revisit, manage,
                                            and review them.
                                        </p>

                                        <Button
                                            text="Create a Funnel"
                                            onClick={() =>
                                                navigate(
                                                    "/dashboard"
                                                )
                                            }
                                        />

                                    </div>

                                </div>

                            ) : (

                                <div className="empty-state">

                                    <div className="empty-state-content">

                                        <h2>
                                            No funnels found
                                        </h2>

                                        <p>
                                            No funnels match your
                                            current search or filters.
                                        </p>

                                        <Button
                                            text="Clear Filters"
                                            variant="secondary"
                                            onClick={
                                                clearFilters
                                            }
                                        />

                                    </div>

                                </div>

                            )}

                        </>

                    )}


                {/* TABLE */}

                {!error &&
                    filteredFunnels.length > 0 && (

                        <div className="history-table-wrapper">

                            <table className="history-table">

                                <thead>

                                    <tr>

                                        <th>
                                            Property
                                        </th>

                                        <th>
                                            Audience
                                        </th>

                                        <th>
                                            Location
                                        </th>

                                        <th>
                                            Created
                                        </th>

                                        <th>
                                            Status
                                        </th>

                                        <th>
                                            Actions
                                        </th>

                                    </tr>

                                </thead>


                                <tbody>

                                    {filteredFunnels.map(
                                        (funnel) => (

                                            <tr
                                                key={
                                                    funnel.id
                                                }
                                            >

                                                <td>

                                                    <strong>
                                                        {
                                                            funnel.propertyType
                                                            ||
                                                            "Not specified"
                                                        }
                                                    </strong>

                                                    <div className="history-campaign">

                                                        {
                                                            funnel.campaign
                                                        }

                                                    </div>

                                                </td>


                                                <td>

                                                    {
                                                        funnel.audience
                                                        ||
                                                        "Not specified"
                                                    }

                                                </td>


                                                <td>

                                                    {
                                                        funnel.location
                                                        ||
                                                        "Not specified"
                                                    }

                                                </td>


                                                <td>

                                                    {
                                                        funnel.created_at
                                                            ? new Date(
                                                                funnel.created_at
                                                            ).toLocaleDateString(
                                                                "en-US",
                                                                {
                                                                    month:
                                                                        "short",
                                                                    day:
                                                                        "numeric"
                                                                }
                                                            )
                                                            : "Unknown"
                                                    }

                                                </td>


                                                <td>

                                                    <span className="history-status">

                                                        {
                                                            funnel.status
                                                            ||
                                                            "Unknown"
                                                        }

                                                    </span>

                                                </td>


                                                <td>

                                                    <div className="history-actions">

                                                        <Button
                                                            text="View"
                                                            onClick={() =>
                                                                viewFunnel(
                                                                    funnel.id
                                                                )
                                                            }
                                                            disabled={
                                                                deletingId !==
                                                                null
                                                            }
                                                        />


                                                        <Button
                                                            text="Delete"
                                                            variant="danger"
                                                            disabled={
                                                                deletingId !==
                                                                null
                                                            }
                                                            onClick={() =>
                                                                openDeleteConfirmation(
                                                                    funnel
                                                                )
                                                            }
                                                        />

                                                    </div>

                                                </td>

                                            </tr>

                                        )
                                    )}

                                </tbody>

                            </table>


                            {/* PAGINATION */}

                            <div className="history-pagination">

                                <Button
                                    text="Previous"
                                    variant="secondary"
                                    onClick={() =>
                                        loadFunnels(
                                            currentPage -
                                            1
                                        )
                                    }
                                    disabled={
                                        currentPage ===
                                            1 ||
                                        loading ||
                                        deletingId !==
                                            null
                                    }
                                />


                                <span>

                                    Page{" "}
                                    {currentPage}{" "}
                                    of{" "}
                                    {lastPage}

                                </span>


                                <Button
                                    text="Next"
                                    variant="secondary"
                                    onClick={() =>
                                        loadFunnels(
                                            currentPage +
                                            1
                                        )
                                    }
                                    disabled={
                                        currentPage ===
                                            lastPage ||
                                        loading ||
                                        deletingId !==
                                            null
                                    }
                                />

                            </div>

                        </div>

                    )}


                {/* DELETE CONFIRMATION */}

                <ConfirmModal
                    open={
                        Boolean(
                            funnelToDelete
                        )
                    }
                    title="Delete this funnel?"
                    message={
                        funnelToDelete
                            ? `This will permanently delete the ${funnelToDelete.propertyType || "selected"} funnel from your history. This action cannot be undone.`
                            : ""
                    }
                    confirmText="Delete Funnel"
                    cancelText="Keep Funnel"
                    onConfirm={
                        deleteFunnel
                    }
                    onCancel={
                        closeDeleteConfirmation
                    }
                    loading={
                        deletingId !== null
                    }
                    variant="danger"
                />

            </div>

        </DashboardLayout>

    );

}
