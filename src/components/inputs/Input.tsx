const sizeLabelGapMap = {
  "input-sm": "mb-0",
  "input-md": "mb-1",
};

export const TextInput = (p: {
  type?: "text" | "password";
  size?: "input-sm" | "input-md";
  showError?: boolean;
  errorMessage?: string;
  value: string;
  label: string;
  placeholder: string;
  onInput: (x: string) => void;
}) => {
  const { type = "text", size = "input-md" } = p;
  return (
    <label className="form-control w-full">
      <div className={`label ${sizeLabelGapMap[size]} p-0`}>
        <span
          className={`label-text rounded py-1 ${p.showError ? "w-full bg-error text-center" : ""}`}
        >
          {p.showError ? p.errorMessage : p.label}
        </span>
      </div>
      <input
        type={type}
        placeholder={p.placeholder}
        className={`input input-bordered ${size} w-full ${p.showError ? "input-error" : ""}`}
        onInput={(e) => {
          const value = (e.target as HTMLInputElement).value;
          p.onInput(value);
        }}
        value={p.value}
      />
    </label>
  );
};
