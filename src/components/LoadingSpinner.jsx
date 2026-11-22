export default function LoadingSpinner({

    title,

    message,

}) {

    return (

        <div>

            <h2>{title}</h2>

            <h1>⏳</h1>

            <p>{message}</p>

        </div>

    );

}
