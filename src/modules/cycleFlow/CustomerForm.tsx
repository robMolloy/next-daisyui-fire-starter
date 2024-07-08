import { Button, Input } from "@/components";
import { useState } from "react";

const initFormValues = {
  giverPhoneNumber: "",
};

export const CustomerForm = (p: {
  onFormSuccess: (x: typeof initFormValues) => void;
  onFormFail: () => void;
}) => {
  const [formValues, setFormValues] = useState({
    giverPhoneNumber: "",
  });
  const checkForm = () => {
    if (formValues.giverPhoneNumber.length < 5)
      return {
        success: false,
        error: {
          message: "giverPhoneNumber should be more than 4 characters",
          input: "giverPhoneNumber",
        },
      } as const;

    return { success: true } as const;
  };
  return (
    <div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          const checkFormResponse = checkForm();
          if (checkFormResponse.success) return p.onFormSuccess(formValues);

          p.onFormFail();
        }}
      >
        <Input
          type="text"
          label="Item Name"
          onInput={(x) => setFormValues({ ...formValues, giverPhoneNumber: x })}
          value={formValues.giverPhoneNumber}
        />
        <pre>{JSON.stringify({ formValues }, undefined, 2)}</pre>
        <Button type="submit" variant="primary">
          Submit
        </Button>
      </form>
    </div>
  );
};
