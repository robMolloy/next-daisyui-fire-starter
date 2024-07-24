import { auth } from "@/config/firebaseConfig";
import { TCreateUserFormData, createFirebaseUser } from "@/utils/firebaseAuthUtils";
import { useState } from "react";
import { z } from "zod";
import { checkFormDataAgainstRuleMap, checkFormDataValue, createRuleMap } from "../checkFormData";
import { TextInput } from "@/components";

export type TAuthCreateUserFormProps = {
  formData: TCreateUserFormData;
  onFormDataChange: (x: TCreateUserFormData) => void;
  onCreateUserSuccess: (x: TCreateUserFormData) => void;
  onCreateUserFail: (x: Partial<TCreateUserFormData & { actionError: string }>) => void;
};

export const AuthCreateUserForm = (p: TAuthCreateUserFormProps) => {
  const ruleMap = createRuleMap({
    formData: p.formData,
    ruleMapper: (formData) => ({
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
      userPasswordConfirm: [
        {
          validSchema: z.literal(formData.userPassword),
          message: "this does not match the password",
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
    userPasswordConfirm: "",
  });

  const overwriteFormDataErrorMessages = (x: Partial<TCreateUserFormData>) =>
    setFormDataErrorMessages({ ...formDataErrorMessages, ...x });
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async () => {
    if (!!isLoading) return;

    const checkFormDataResponse = checkFormDataAgainstRuleMap({ formData: p.formData, ruleMap });
    if (!checkFormDataResponse.success) {
      p.onCreateUserFail(checkFormDataResponse.errors);

      return overwriteFormDataErrorMessages(checkFormDataResponse.errors);
    }
    setIsLoading(true);

    const createResponse = await createFirebaseUser({ auth, formData: p.formData });
    if (createResponse.success) p.onCreateUserSuccess(p.formData);
    else {
      const errorMessage = createResponse?.error?.message;
      p.onCreateUserFail({ actionError: errorMessage });
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
      <TextInput
        type="password"
        showError={!!formDataErrorMessages.userPasswordConfirm}
        errorMessage={formDataErrorMessages.userPasswordConfirm}
        value={p.formData.userPasswordConfirm}
        label="Confirm your password"
        placeholder="confirm password"
        onInput={(value) => {
          p.onFormDataChange({ ...p.formData, userPasswordConfirm: value });
          const checkResponse = checkFormDataValue({ ruleMap, key: "userPasswordConfirm", value });
          overwriteFormDataErrorMessages({ userPasswordConfirm: checkResponse.error ?? "" });
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
