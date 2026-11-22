import {
    useEffect,
    useState
} from "react";

import Button from "./Button";

export default function EditableSection({
    title,
    field,
    value,
    onSave,
    onCopy,
    saving = false
}) {

    const [editing, setEditing] =
        useState(false);

    const [text, setText] =
        useState(value || "");


    async function handleSave() {

        try {

            const success =
                await onSave(
                    field,
                    text
                );

            /*
            |--------------------------------------------------------------------------
            | Only close the editor when the parent confirms success.
            |--------------------------------------------------------------------------
            */

            if (success !== false) {

                setEditing(false);

            }

        } catch (error) {

            console.error(
                "EDITABLE SECTION SAVE ERROR:",
                error
            );

        }

    }


    useEffect(() => {

        setText(
            value || ""
        );

    }, [value]);


    function handleEdit() {

        if (saving) {
            return;
        }

        setEditing(true);

    }


    function handleCancel() {

        if (saving) {
            return;
        }

        setText(
            value || ""
        );

        setEditing(false);

    }


    return (

        <>

            {editing ? (

                <textarea
                    rows="8"
                    value={text}
                    onChange={(event) =>
                        setText(
                            event.target.value
                        )
                    }
                    disabled={saving}
                    style={{
                        width: "100%"
                    }}
                />

            ) : (

                <p>
                    {value}
                </p>

            )}


            {!editing && (

                <Button
                    text="Copy"
                    onClick={() =>
                        onCopy(value)
                    }
                />

            )}


            {editing ? (

                <>

                    <Button
                        text={
                            saving
                                ? "Saving..."
                                : "Save Changes"
                        }
                        disabled={saving}
                        onClick={
                            handleSave
                        }
                    />

                    <Button
                        text="Cancel"
                        disabled={saving}
                        onClick={
                            handleCancel
                        }
                    />

                </>

            ) : (

                <Button
                    text="Edit"
                    disabled={saving}
                    onClick={
                        handleEdit
                    }
                />

            )}

        </>

    );

}

