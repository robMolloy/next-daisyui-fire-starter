import { auth } from "@/config/firebaseConfig";
import { createFirebaseUser } from "@/utils/firebaseAuthUtils";
import React, { useState } from "react";
import { z } from "zod";

type TRule = ({ validSchema: z.ZodTypeAny } | { invalidSchema: z.ZodTypeAny }) & {
  message: string;
};
type TRules = TRule[];

const createRuleMap = <T extends { [k: string]: TRules }>(p: T) => {
  return p;
};

const checkRules = (p: { rules: TRules; value: string }) => {
  const errorRule = p.rules.find((x) => {
    if ("validSchema" in x) return !x.validSchema.safeParse(p.value).success;
    return x.invalidSchema.safeParse(p.value).success;
  });

  return errorRule?.message ?? "";
};

const ruleMap = createRuleMap({
  password: [
    {
      validSchema: z.string().regex(/[!@#$%^&*(),.?":{}|<>]/),
      message: "string must contain a special character",
    },
    {
      validSchema: z.string().min(8),
      message: "string must be longer than 8 characters",
    },
  ],
  email: [
    {
      validSchema: z.string(),
      message: "string must contain a special character",
    },
    {
      validSchema: z.string().min(8),
      message: "string must be longer than 8 characters",
    },
    {
      validSchema: z.string().email(),
      message: "this does not appear to be an email",
    },
  ],
});

export type TAuthCreateUserFormProps = {
  onCreateUserSuccess: () => void;
  onCreateUserFail: () => void;
};

export const AuthCreateUserForm = (p: TAuthCreateUserFormProps) => {
  const [userEmail, setUserEmail] = useState("");
  const [userEmailErrorMessage, setUserEmailErrorMessage] = useState("");
  const [userPassword, setUserPassword] = useState("");
  const [userPasswordErrorMessage, setUserPasswordErrorMessage] = useState("");
  const [userPasswordConfirm, setUserPasswordConfirm] = useState("");
  const [userPasswordConfirmErrorMessage, setUserPasswordConfirmErrorMessage] = useState("");
  const [formErrorMessage, setFormErrorMessage] = useState("");

  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async () => {
    if (!!isLoading) return;

    checkUserEmailValid();
    checkUserPasswordValid();
    checkUserPasswordConfirmValid();

    if (!!userEmailErrorMessage || !!userPasswordErrorMessage || !!userPasswordConfirmErrorMessage)
      return;
    setIsLoading(true);

    const createResponse = await createFirebaseUser({
      auth,
      userEmail: userEmail,
      userPassword: userPassword,
    });

    if (createResponse.success) p.onCreateUserSuccess();
    else p.onCreateUserFail();

    const errorMessage = createResponse?.error?.message;
    setFormErrorMessage(errorMessage ?? "");

    setIsLoading(false);
  };

  const checkUserEmailValid = (initValue?: string) => {
    const value = initValue ?? userEmail;
    const errMsg = checkRules({ rules: ruleMap.email, value });
    setUserEmailErrorMessage(errMsg);
  };

  const checkUserPasswordValid = (initValue?: string) => {
    const value = initValue ?? userPassword;
    const errMsg = checkRules({ rules: ruleMap.password, value });
    setUserPasswordErrorMessage(errMsg);
  };

  const checkUserPasswordConfirmValid = (initValue?: string) => {
    const value = initValue ?? userPasswordConfirm;
    const errMsg = (() => {
      if (userPassword === value) return "";
      return "password confirmation does not match password";
    })();
    setUserPasswordConfirmErrorMessage(errMsg);
  };

  return (
    <form className="w-full">
      <div>
        {formErrorMessage && (
          <div style={{ textAlign: "center" }} className="bg-error">
            {formErrorMessage}
          </div>
        )}
        <label className="form-control w-full">
          <div className="label">
            <span className={`label-text ${userEmailErrorMessage ? "bg-error" : ""}`}>
              {userEmailErrorMessage || "Type your email"}
            </span>
          </div>
          <input
            type="text"
            placeholder="email"
            className={`input input-bordered input-info w-full${
              !userEmailErrorMessage || "input-error"
            }`}
            onInput={(e) => {
              const value = (e.target as HTMLInputElement).value;
              setUserEmail(value);
              checkUserEmailValid(value);
            }}
            value={userEmail}
          />
        </label>
      </div>
      <br />
      <div>
        <label className="form-control">
          <div className="label">
            <span className={`label-text ${userPasswordErrorMessage ? "bg-error" : ""}`}>
              {userPasswordErrorMessage || "Type your password"}
            </span>
          </div>
          <input
            type="password"
            placeholder="password"
            className={`input input-bordered input-info w-full${
              !userPasswordErrorMessage || "input-error"
            }`}
            onInput={(e) => {
              const value = (e.target as HTMLInputElement).value;
              setUserPassword(value);
              checkUserPasswordValid(value);
            }}
            value={userPassword}
          />
        </label>
      </div>
      <br />
      <div>
        <label className="form-control">
          <div className="label">
            <span className={`label-text ${userPasswordConfirmErrorMessage ? "bg-error" : ""}`}>
              {userPasswordConfirmErrorMessage || "Confirm your password"}
            </span>
          </div>
          <input
            type="password"
            placeholder="confirm password"
            className={`input input-bordered input-info w-full${
              !userPasswordConfirmErrorMessage || "input-error"
            }`}
            onInput={(e) => {
              const value = (e.target as HTMLInputElement).value;
              setUserPasswordConfirm(value);
              checkUserPasswordConfirmValid(value);
            }}
            value={userPasswordConfirm}
          />
        </label>
      </div>
      <br />
      <br />
      <button
        type="submit"
        className="btn btn-primary"
        onClick={(e) => {
          e.preventDefault();
          onSubmit();
        }}
      >
        Submit
        {!!isLoading && <span className="loading loading-spinner loading-md"></span>}
      </button>
    </form>
  );
};
