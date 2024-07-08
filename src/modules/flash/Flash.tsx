import { useSignal, useSignalListener } from "@/utils/useSignal";
import { useEffect, useState } from "react";
import { v4 as uuid } from "uuid";

export const Flash = (p: {
  signal: ReturnType<typeof useSignal>;
  children?: React.ReactNode;
}) => {
  const [flashes, setFlashes] = useState<string[]>([]);
  const [finishedFlashes, setFinishedFlashes] = useState<string[]>([]);

  const addFlash = () => setFlashes((prevFlashes) => [...prevFlashes, uuid()]);
  const removeFlash = (x: string) =>
    setFinishedFlashes([...finishedFlashes, x]);

  useSignalListener({
    signal: p.signal,
    onSignalChange: () => {
      addFlash();
    },
  });

  useEffect(() => {
    if (flashes.length === 0) return;
    if (finishedFlashes.length === flashes.length) {
      setFlashes([]);
      setFinishedFlashes([]);
    }
  }, [finishedFlashes]);

  return (
    <>
      <div className="relative w-full h-full z-[99]">
        {flashes
          .filter((flash) => !finishedFlashes.includes(flash))
          .map((x) => (
            <div
              key={x}
              onAnimationEndCapture={() => removeFlash(x)}
              className="absolute opacity-0 h-full w-full bg-white"
              style={{ animation: "flashFade 1s" }}
            />
          ))}
      </div>
      {p.children}
    </>
  );
};
