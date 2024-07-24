export const TextInput = (p: {
  type?: "text" | "password";
  showError: boolean;
  errorMessage?: string;
  value: string;
  label: string;
  placeholder: string;
  onInput: (x: string) => void;
}) => {
  const { type = "text" } = p;
  return (
    <label className="form-control w-full">
      <div className="label mb-2 p-0">
        <span className={`label-text rounded py-1 ${p.showError ? "w-full bg-error" : ""}`}>
          {p.showError ? p.errorMessage : p.label}
        </span>
      </div>
      <input
        type={type}
        placeholder={p.placeholder}
        className={`input input-bordered w-full ${p.showError ? "input-error" : "input-info"}`}
        onInput={(e) => {
          const value = (e.target as HTMLInputElement).value;
          p.onInput(value);
        }}
        value={p.value}
      />
    </label>
  );
};
