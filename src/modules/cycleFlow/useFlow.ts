import { CustomerForm, ItemForm } from "@/modules/cycleFlow";
import { useSignal } from "@/utils/useSignal";
import { useState } from "react";

const delay = async (x: number) => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(true), x);
  });
};

type TFlowStatus =
  | "item_form"
  | "giver_form"
  | "capturing"
  | "selecting"
  | "sending"
  | "fail"
  | "success";

type TItemFormValues = Parameters<
  React.ComponentProps<typeof ItemForm>["onFormSuccess"]
>[0];
type TCustomerFormValues = Parameters<
  React.ComponentProps<typeof CustomerForm>["onFormSuccess"]
>[0];

export const useFlow = () => {
  const [itemFormValues, setItemFormValues] = useState<
    TItemFormValues | undefined
  >();
  const [giverFormValues, setGiverFormValues] = useState<
    TCustomerFormValues | undefined
  >();
  const [imageDataUrl, setImageDataUrl] = useState<string | undefined>();

  const flashSignal = useSignal();
  const captureSignal = useSignal();

  const capture = () => {
    flashSignal.changeSignal();
    captureSignal.changeSignal();
  };

  const [status, setStatus] = useState<TFlowStatus>("item_form");

  return {
    itemFormValues,
    setItemFormValues,
    giverFormValues,
    setGiverFormValues,
    status,
    setStatus,
    imageDataUrl,
    setImageDataUrl,
    flashSignal,
    captureSignal,
    capture,
  };
};
