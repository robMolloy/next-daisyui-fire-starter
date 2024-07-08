import React, { useEffect, useState } from "react";
import { useSignal, useSignalListener } from "@/utils/useSignal";

export type TDiceProps = {
  signal: ReturnType<typeof useSignal>;
  onChange: (p: number) => void;
};

export const Dice = (p: TDiceProps) => {
  const [value, setValue] = useState(0);

  const rollTheDice = () => setValue(Math.floor(Math.random() * 6));

  useSignalListener({
    signal: p.signal,
    onSignalChange: () => {
      rollTheDice();
      p.onChange(value);
    },
  });

  return (
    <div>
      <button onClick={rollTheDice}>roll the dice</button> {value}
    </div>
  );
};
