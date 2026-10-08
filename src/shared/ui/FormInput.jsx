export default function FormInput({ label, id, error, ...inputProps }) {
  return (
    <div className="field">
      <label htmlFor={id}>{label}</label>
      <input id={id} className={error ? "invalid" : ""} {...inputProps} />
      {error && <p className="field-error">{error}</p>}
    </div>
  );
}
