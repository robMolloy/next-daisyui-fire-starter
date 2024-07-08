import { useEffect, useState } from "react";

export const useSignal = () => {
  const [signal, setSignal] = useState(0);
  const changeSignal = () => setSignal(signal + 1);

  return { signal, changeSignal };
};

export function useSignalListener(p: {
  signal: ReturnType<typeof useSignal>;
  onSignalChange: () => void;
}) {
  const [firstSignalChange, setFirstSignalChange] = useState(true);

  useEffect(() => {
    if (!firstSignalChange) p.onSignalChange();
  }, [p.signal.signal]);

  useEffect(() => setFirstSignalChange(false), []);

  return { signal: p.signal };
}
