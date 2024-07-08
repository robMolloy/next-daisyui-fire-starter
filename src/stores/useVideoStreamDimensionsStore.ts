import { create } from "zustand";

const aspectRatios = [
  [2, 1],
  [3, 2],
  [4, 3],
  [1, 1],
  [3, 4],
  [2, 3],
  [1, 2],
] as const;

type TAspectRatios = typeof aspectRatios;
export type TAspectRatio = TAspectRatios[number];

type TVideoStreamDimensionsState = {
  aspectRatios: TAspectRatios;
  aspectRatio: TAspectRatio;
  setAspectRatio: (aspectRatio: TAspectRatio) => void;
  width: number;
  setWidth: (width: number) => void;
  getHeight: () => number;
};

const useVideoStreamDimensionsStoreBase = create<TVideoStreamDimensionsState>()(
  (set, get) => ({
    aspectRatios: aspectRatios,
    aspectRatio: aspectRatios[0],
    setAspectRatio: (aspectRatio) => set(() => ({ aspectRatio })),
    width: 500,
    setWidth: (width) => set(() => ({ width })),
    getHeight: () => {
      const aspectRatio = get().aspectRatio;
      return Math.floor((get().width * aspectRatio[1]) / aspectRatio[0]);
    },
  })
);

export const useVideoStreamDimensionsStore = () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { getHeight, ...store } = useVideoStreamDimensionsStoreBase();

  const set = (p: {
    aspectRatio: typeof store.aspectRatio;
    width: typeof store.width;
  }) => {
    store.setAspectRatio(p.aspectRatio);
    store.setWidth(p.width);
  };

  return {
    ...store,
    height: getHeight(),
    calculateRatio: () => store.aspectRatio[0] / store.aspectRatio[1],
    set,
  };
};
