import { Button, Input } from "@/components";
import { useState } from "react";

const initFormValues = {
  itemName: "",
  itemDescription: "",
};

export const ItemForm = (p: {
  onFormSuccess: (x: typeof initFormValues) => void;
  onFormFail: (
    x: Extract<ReturnType<typeof checkForm>, { success: false }>["error"]
  ) => void;
}) => {
  const [formValues, setFormValues] = useState({
    itemName: "",
    itemDescription: "",
  });
  const checkForm = () => {
    if (formValues.itemName.length < 5)
      return {
        success: false,
        error: {
          message: "itemName should be more than 4 characters",
          input: "itemName",
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

          p.onFormFail(checkFormResponse.error);
        }}
      >
        <Input
          type="text"
          label="Item Name"
          onInput={(x) => setFormValues({ ...formValues, itemName: x })}
          value={formValues.itemName}
        />
        <Input
          type="text"
          label="Item Description"
          onInput={(x) => setFormValues({ ...formValues, itemDescription: x })}
          value={formValues.itemDescription}
        />
        <pre>{JSON.stringify({ formValues }, undefined, 2)}</pre>
        <Button type="submit" variant="primary">
          Submit
        </Button>
      </form>
    </div>
  );
};
