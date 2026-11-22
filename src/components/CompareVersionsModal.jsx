import Button from "./Button";
import './style.css'
export default function CompareVersionsModal({

    open,

    field,

    current,

    previous,

    onRestore,

    onClose

}) {

    if (!open) return null;

    return (

        <div className="modal-overlay">

            <div className="modal compare-modal">

                <h2>
                    Compare Versions
                </h2>

                <p>{field}</p>

             <div className="compare-grid">

    <div className="compare-card">

        <h3>Current Version</h3>

        <div className="compare-content">

            {current}

        </div>

    </div>

    <div className="compare-card">

        <h3>Previous Version</h3>

        <div className="compare-content">

            {previous}

        </div>

    </div>

</div>

                <Button
                    text="Restore This Version"
                    onClick={onRestore}
                />

                <Button
                    text="Close"
                    onClick={onClose}
                />

            </div>

        </div>

    );

}