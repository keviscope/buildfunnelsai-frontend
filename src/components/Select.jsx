export default function Select({
  label,
  placeholder,
  options,
  value,
  onChange,
}) {
  return (
    <div className="form-field">
      <label className="form-field-label">
        {label}
      </label>

      <div className="select-wrapper">
        <select
          className={`form-select ${
            value ? "form-select-has-value" : ""
          }`}
          value={value}
          onChange={onChange}
        >
          <option value="" disabled>
            {placeholder}
          </option>

          {options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>

        <span className="select-arrow">⌄</span>
      </div>
    </div>
  );
}