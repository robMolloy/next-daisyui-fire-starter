import React from "react";
import { v4 as uuid } from "uuid";
import { create } from "zustand";

type TAlertPropsSeed = {
  id?: string;
  type?: "alert-success" | "alert-info" | "alert-error" | "alert-warning";
  heading?: string;
  children?: React.ReactNode;
  duration?: number;
};
type TAlertProps = Required<TAlertPropsSeed>;

type TNotifyStoreProps = {
  allAlerts: TAlertProps[];
  hideAlerts: TAlertProps[];
  getVisibleAlerts: () => TAlertProps[];
  push: (p: TAlertPropsSeed) => void;
  pushToHide: (p: TAlertProps) => void;
};

export const useNotifyStore = create<TNotifyStoreProps>((set, get) => ({
  allAlerts: [],
  hideAlerts: [],
  getVisibleAlerts: () => {
    const hiddenAlertIds = get().hideAlerts.map((x) => x.id);
    return get()
      .allAlerts.map((alert) => {
        const isAlertHidden = hiddenAlertIds.includes(alert.id);
        return isAlertHidden ? undefined : alert;
      })
      .filter((x) => !!x) as TAlertProps[];
  },
  smartCleanup: () => {
    const shouldCleanup = get().getVisibleAlerts().length === 0;
    if (shouldCleanup) return { allAlerts: [], hideAlerts: [] };
  },
  push: (initProps) =>
    set((state) => {
      const p: TAlertProps = {
        id: initProps.id ? initProps.id : uuid(),
        type: initProps.type ? initProps.type : "alert-info",
        heading: initProps.heading ?? "",
        children: initProps.children ?? <></>,
        duration: initProps.duration ? initProps.duration : 3000,
      };

      setTimeout(() => get().pushToHide(p), p.duration);

      const shouldCleanup = get().getVisibleAlerts().length === 0;
      return shouldCleanup
        ? { allAlerts: [p], hideAlerts: [] }
        : { allAlerts: [...state.allAlerts, p] };
    }),
  pushToHide: (p) =>
    set((state) => {
      return { hideAlerts: [...state.hideAlerts, p] };
    }),
}));

export const Notify = () => {
  const notifyStore = useNotifyStore();
  const visibleAlerts = notifyStore.getVisibleAlerts();

  if (visibleAlerts.length === 0) return <></>;
  return (
    <div className="toast toast-center toast-top z-[12]">
      {notifyStore.getVisibleAlerts().map((x) => (
        <div
          onClick={() => notifyStore.pushToHide(x)}
          key={x.id}
          className={`alert ${x.type} flex min-w-40 cursor-pointer justify-center`}
        >
          <div>
            <h2 className="text-center font-bold">{x.heading}</h2>
            <div>{x.children}</div>
          </div>
        </div>
      ))}
    </div>
  );
};
