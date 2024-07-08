import { useVideoStreamDimensionsStore } from "@/stores/useVideoStreamDimensionsStore";
import { VideoHTMLAttributes, useEffect, useRef, useState } from "react";
import {
  checkVideoStream,
  displayVideoStreamInVideoElement,
  getImageDataUrlFromVideoElement,
  safeGetVideoStream,
  stopVideoStream,
} from ".";
import { useSignal, useSignalListener } from "@/utils/useSignal";

type THTMLVideoElement = VideoHTMLAttributes<HTMLVideoElement>;

export type TDumbVideoStreamProps = THTMLVideoElement & {
  onCapture: (x: string) => void;
  signal: ReturnType<typeof useSignal>;
};

export const DumbVideoStream = (p: TDumbVideoStreamProps) => {
  const { className, style, onCapture, signal, ...other } = p;
  const store = useVideoStreamDimensionsStore();

  const videoElmRef = useRef<HTMLVideoElement>(null);
  const [videoStream, setVideoStream] = useState<MediaStream | undefined>(
    undefined
  );
  useSignalListener({
    signal,
    onSignalChange: () => {
      const videoElement = videoElmRef.current;
      if (!videoElement) return;
      const imageDataUrl = getImageDataUrlFromVideoElement({ videoElement });

      if (imageDataUrl) onCapture(imageDataUrl);
    },
  });

  const init = async () => {
    if (videoStream) stopVideoStream(videoStream);

    const videoStreamResponse = await safeGetVideoStream({
      aspectRatio: store.aspectRatio,
      idealWidth: store.width,
    });
    if (!videoElmRef.current || !videoStreamResponse.success) return;
    setVideoStream(videoStreamResponse.data);

    displayVideoStreamInVideoElement({
      videoElm: videoElmRef.current,
      videoStream: videoStreamResponse.data,
    });

    const checkVideoStreamResponse = checkVideoStream({
      videoStream: videoStreamResponse.data,
      idealDimensions: { width: store.width, height: store.height },
    });
    if (!checkVideoStreamResponse.success)
      console.error(checkVideoStreamResponse.error);
  };

  useEffect(() => {
    init();
  }, [store.aspectRatio, store.width]);

  return (
    <video
      ref={videoElmRef}
      autoPlay
      style={style}
      className={`absolute transform scale-x-[-1] h-full w-full ${className}`}
      {...other}
    />
  );
};
