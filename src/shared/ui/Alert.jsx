// type: "error" | "success"
export default function Alert({ type = "error", children }) {
  return (
    <div className={`alert alert-${type}`} role={type === "error" ? "alert" : "status"}>
      {children}
    </div>
  );
}
