import Button from "./Button";

export default function HistoryModal({

    field,

    history,

    onClose,

    onCompare

}) {
    return (
        <div className="modal-overlay">

            <div className="modal">

                <h2>{field} History</h2>

                {history.length === 0 ? (

                    <p>No previous versions.</p>

                ) : (

             history.map((item) => (

    <div
        key={item.id}
        className="history-card"
    >

        <p>{item.content}</p>

        <small>
            {new Date(item.created_at).toLocaleString()}
        </small>

        <br />

      <Button
    text="Compare"
    onClick={() =>
        onCompare(item.content)
    }
/>

    </div>

))

                )}

                <Button
                    text="Close"
                    onClick={onClose}
                />

            </div>

        </div>
    );
}