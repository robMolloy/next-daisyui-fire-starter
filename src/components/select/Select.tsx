import { TDaisyStateColor } from "@/stores";
import React from "react";

type THTMLSelectElementInit = React.SelectHTMLAttributes<HTMLSelectElement>;
type THTMLSelectElement = Omit<
  THTMLSelectElementInit,
  "label" | "onChange" | "value"
>;

type TSelectProps<T> = THTMLSelectElement & {
  label?: string;
  rightSlot?: React.ReactNode;
  options: { value: T; label: string }[];
  value: T;
  onChange?: (e: T) => void;
  variant?: TDaisyStateColor;
};

const variantToVariantClassMap: { [k in TDaisyStateColor]: `select-${k}` } = {
  info: "select-info",
  success: "select-success",
  warning: "select-warning",
  error: "select-error",
};

export function Select<T>(p: TSelectProps<T>) {
  const {
    onChange,
    label,
    className = "",
    value,
    options,
    variant,
    ...other
  } = p;
  const variantClass = !!variant ? variantToVariantClassMap[variant] : "";

  return (
    <label className="form-control w-full max-w-xs">
      {label && (
        <div className="label">
          <span className="label-text">{label}</span>
        </div>
      )}
      <select
        onChange={(evt) => {
          const event = evt as unknown as { target: { value: string } };
          if (onChange) {
            const val = JSON.parse(event.target.value) as T;
            onChange(val);
          }
        }}
        value={JSON.stringify(value)}
        className={`select select-bordered ${variantClass} flex items-center gap-2 px-2 ${className}`}
        {...other}
      >
        {options.map((x) => (
          <option key={x.label} value={JSON.stringify(x.value)}>
            {x.label}
          </option>
        ))}
      </select>
    </label>
  );
}
