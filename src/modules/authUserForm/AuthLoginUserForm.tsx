import { auth } from "@/config/firebaseConfig";
import { TLoginFormData, loginFirebaseUser } from "@/utils/firebaseAuthUtils";
import React, { useState } from "react";
import { z } from "zod";
import {
  checkFormDataAgainstRuleMap,
  checkFormDataValue,
  createRuleMap,
} from "@/modules/checkFormData";
import { TextInput } from "@/components";

export const AuthLoginUserForm = (p: {
  formData: TLoginFormData;
  onFormDataChange: (x: TLoginFormData) => void;
  onLoginSuccess: (x: TLoginFormData) => void;
  onLoginFail: (x: Partial<TLoginFormData & { actionError: string }>) => void;
}) => {
  const ruleMap = createRuleMap({
    formData: p.formData,
    ruleMapper: () => ({
      userPassword: [
        {
          validSchema: z.string().regex(/[!@#$%^&*(),.?":{}|<>]/),
          message: "string must contain a special character",
        },
        {
          validSchema: z.string().min(8),
          message: "string must be longer than 8 characters",
        },
      ],
      userEmail: [
        {
          validSchema: z.string().regex(/[!@#$%^&*(),.?":{}|<>]/),
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
    }),
  });

  const [formDataErrorMessages, setFormDataErrorMessages] = useState<typeof p.formData>({
    userEmail: "",
    userPassword: "",
  });
  const overwriteFormDataErrorMessages = (x: Partial<TLoginFormData>) =>
    setFormDataErrorMessages({ ...formDataErrorMessages, ...x });

  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async () => {
    if (!!isLoading) return;

    const checkFormDataResponse = checkFormDataAgainstRuleMap({ formData: p.formData, ruleMap });
    if (!checkFormDataResponse.success) {
      p.onLoginFail(checkFormDataResponse.errors);

      return overwriteFormDataErrorMessages(checkFormDataResponse.errors);
    }

    setIsLoading(true);

    const loginResponse = await loginFirebaseUser({ formData: p.formData, auth });
    if (loginResponse.success) {
      p.onLoginSuccess(p.formData);
    } else {
      const errorMessage = loginResponse.error.message;
      p.onLoginFail({ actionError: errorMessage });
    }
    setIsLoading(false);
  };

  return (
    <form className="flex w-full flex-col gap-8">
      <TextInput
        showError={!!formDataErrorMessages.userEmail}
        errorMessage={formDataErrorMessages.userEmail}
        value={p.formData.userEmail}
        label="Type your email"
        placeholder="email"
        onInput={(value) => {
          p.onFormDataChange({ ...p.formData, userEmail: value });
          const checkResponse = checkFormDataValue({ ruleMap, key: "userEmail", value });
          overwriteFormDataErrorMessages({ userEmail: checkResponse.error ?? "" });
        }}
      />
      <TextInput
        type="password"
        showError={!!formDataErrorMessages.userPassword}
        errorMessage={formDataErrorMessages.userPassword}
        value={p.formData.userPassword}
        label="Type your password"
        placeholder="password"
        onInput={(value) => {
          p.onFormDataChange({ ...p.formData, userPassword: value });
          const checkResponse = checkFormDataValue({ ruleMap, key: "userPassword", value });
          overwriteFormDataErrorMessages({ userPassword: checkResponse.error ?? "" });
        }}
      />
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
