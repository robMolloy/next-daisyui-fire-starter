import React from "react";

type THTMLInputElementInit = React.InputHTMLAttributes<HTMLInputElement>;
type THTMLInputElement = Omit<
  THTMLInputElementInit,
  "type" | "onInput" | "value"
>;
type TInputDefaultProps = { label?: string; rightSlot?: React.ReactNode };

type TInputProps<T extends "number" | "string"> = T extends "number"
  ? THTMLInputElement &
      TInputDefaultProps & {
        type: "number";
        onInput?: (e: number) => void;
        value?: number;
      }
  : THTMLInputElement &
      TInputDefaultProps & {
        type?: "text";
        onInput?: (e: string) => void;
        value?: string;
      };

export function Input<T extends "number" | "string">(p: TInputProps<T>) {
  const { type, onInput, label, className = "", rightSlot, ...other } = p;

  return (
    <label className="form-control w-full max-w-xs">
      {label && (
        <div className="label">
          <span className="label-text">{label}</span>
        </div>
      )}
      <div className="input input-bordered flex items-center gap-2 px-2">
        <input
          type={type}
          onInput={(evt) => {
            const event = evt as unknown as { target: { value: unknown } };
            if (type === "number") {
              if (onInput) onInput(Number(event.target.value));
            } else {
              if (onInput) onInput(event.target.value as string);
            }
          }}
          className={`w-full max-w-xs px-0 ${className}`}
          {...other}
        />
        {!!rightSlot && rightSlot}
      </div>
    </label>
  );
}

type TInputBasicProps<T extends "number" | "string"> = T extends "number"
  ? { type: T; value: number; onInput: (value: number) => void }
  : { type: T; value: string; onInput: (value: string) => void };
export function InputBasic<T extends "number" | "string">(
  props: TInputBasicProps<T>
) {
  return (
    <input
      type={props.type === "number" ? "number" : "text"}
      value={props.value.toString()}
      onInput={(evt) => {
        const event = evt as unknown as {
          target: { value: T extends "string" ? string : number };
        };
        if (props.type === "number") {
          props.onInput(Number(event.target.value) as number);
        } else {
          props.onInput(event.target.value as string);
        }
      }}
      placeholder={props.type === "number" ? "Enter a number" : "Enter text"}
    />
  );
}
