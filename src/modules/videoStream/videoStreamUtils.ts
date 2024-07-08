import { TAspectRatio } from "@/stores/useVideoStreamDimensionsStore";

export const getVideoStream = async (p: {
  aspectRatio: TAspectRatio;
  idealWidth: number;
}) => {
  const constraints = {
    video: {
      width: { ideal: p.idealWidth },
      height: { ideal: p.idealWidth / (p.aspectRatio[0] / p.aspectRatio[1]) },
    },
  };
  return navigator.mediaDevices.getUserMedia(constraints);
};

export const safeGetVideoStream = async (
  p: Parameters<typeof getVideoStream>[0]
) => {
  try {
    return { success: true, data: await getVideoStream(p) } as const;
  } catch (e) {
    const { message, name } = e as Error;
    return { success: false, error: { message, name } } as const;
  }
};

export const displayVideoStreamInVideoElement = (p: {
  videoElm: HTMLVideoElement;
  videoStream: MediaStream;
}) => {
  p.videoElm.srcObject = p.videoStream;
};
export const stopVideoStream = (p: MediaStream) => {
  p.getTracks().forEach((track) => track.stop());
};

export const getVideoStreamSettings = (p: MediaStream) => {
  const mediaStreamTrack = p.getTracks().find((x) => !!x);
  if (mediaStreamTrack) return mediaStreamTrack.getSettings();
};

export const checkVideoStream = (p: {
  videoStream: MediaStream;
  idealDimensions: { width: number; height: number };
}) => {
  const videoStreamSettings = getVideoStreamSettings(p.videoStream);

  const height = videoStreamSettings?.height;
  const width = videoStreamSettings?.width;

  if (!width || !height)
    return {
      success: false,
      error: {
        message: `seems like the height or width of the videoStream isn't set; width: ${width}, height: ${height}`,
      },
    } as const;

  const heightRatio = height / p.idealDimensions.height;
  const widthRatio = width / p.idealDimensions.width;

  if (heightRatio < 0.95 || heightRatio > 1.05)
    return {
      success: false,
      error: {
        message: `seems like there's a mismatch between the ideal height and the actual height; ideal:${p.idealDimensions.height}, actual: ${height}`,
      },
    } as const;
  if (widthRatio < 0.95 || widthRatio > 1.05)
    return {
      success: false,
      error: {
        message: `seems like there's a mismatch between the ideal width and the actual width; ideal:${p.idealDimensions.height}, actual: ${height}`,
      },
    } as const;

  return { success: true } as const;
};

export const checkVideoElement = (p: {
  videoElement: HTMLVideoElement;
  idealDimensions: { width: number; height: number };
}) => {
  const { height, width } = p.videoElement.getBoundingClientRect();

  if (!width || !height)
    return {
      success: false,
      error: {
        message: `seems like the height or width of the videoStream isn't set; width: ${width}, height: ${height}`,
      },
    } as const;

  const heightRatio = height / p.idealDimensions.height;
  const widthRatio = width / p.idealDimensions.width;

  if (heightRatio < 0.95 || heightRatio > 1.05)
    return {
      success: false,
      error: {
        message: `seems like there's a mismatch between the ideal height and the actual height; ideal:${p.idealDimensions.height}, actual: ${height}`,
      },
    } as const;
  if (widthRatio < 0.95 || widthRatio > 1.05)
    return {
      success: false,
      error: {
        message: `seems like there's a mismatch between the ideal width and the actual width; ideal:${p.idealDimensions.height}, actual: ${height}`,
      },
    } as const;

  return { success: true } as const;
};

export const getImageDataUrlFromVideoElement = (p: {
  videoElement: HTMLVideoElement;
}) => {
  const canvas = document.createElement("canvas");

  const width = true ? p.videoElement.videoWidth : 1080;
  const height = true ? p.videoElement.videoHeight : 720;

  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  ctx.scale(-1, 1);
  ctx.drawImage(p.videoElement, -width, 0, width, height);
  ctx.setTransform(1, 0, 0, 1, 0, 0);

  const imageDataUrl = canvas.toDataURL("image/png");
  canvas.remove();
  return imageDataUrl;
};
