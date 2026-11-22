export default function Input(props) {
  return (
    <div className="form-field">

      <label className="form-field-label">
        {props.label}
      </label>

      <input
        className="form-input"
        type={props.type}
        placeholder={props.placeholder}
        value={props.value}
        onChange={props.onChange}
      />

    </div>
  );
}