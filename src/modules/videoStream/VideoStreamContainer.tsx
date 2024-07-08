import { useVideoStreamDimensionsStore } from "@/stores/useVideoStreamDimensionsStore";
import React from "react";

export type TVideoStreamContainerProps = {
  children: React.ReactNode;
  className?: HTMLDivElement["className"];
  onClick?: () => void;
};

export const VideoStreamContainer = (p: TVideoStreamContainerProps) => {
  const store = useVideoStreamDimensionsStore();

  return (
    <div
      className={`relative h-[40vh] ${p.className}`}
      style={{ width: `${40 * store.calculateRatio()}vh` }}
      onClick={p.onClick}
    >
      {p.children}
    </div>
  );
};

export const VideoStreamContainerItem = (p: {
  children: React.ReactNode;
  onClick?: () => void;
  style?: HTMLDivElement["style"];
  className?: HTMLDivElement["className"];
}) => {
  const { style = {} } = p;
  return (
    <div
      className={`absolute flex h-full w-full ${p.className}`}
      style={style}
      onClick={p.onClick}
    >
      {p.children}
    </div>
  );
};
