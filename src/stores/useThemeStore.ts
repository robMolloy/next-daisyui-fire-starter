import { useEffect } from "react";
import { create } from "zustand";

export type TDaisyBrandColor =
  | "neutral"
  | "primary"
  | "secondary"
  | "accent"
  | "ghost";
export type TDaisyStateColor = "info" | "success" | "warning" | "error";
export type TDaisySize = "xs" | "sm" | "md" | "lg";

const themeNames = [
  "light",
  "dark",
  "cupcake",
  "bumblebee",
  "emerald",
  "corporate",
  "synthwave",
  "retro",
  "cyberpunk",
  "valentine",
  "halloween",
  "garden",
  "forest",
  "aqua",
  "lofi",
  "pastel",
  "fantasy",
  "wireframe",
  "black",
  "luxury",
  "dracula",
  "cmyk",
  "autumn",
  "business",
  "acid",
  "lemonade",
  "night",
  "coffee",
  "winter",
  "dim",
  "nord",
  "sunset",
] as const;

type TThemeNames = typeof themeNames;
type TThemeName = TThemeNames[number];
interface ThemeState {
  themeNames: TThemeNames;
  themeName: TThemeName | undefined;
  setThemeName: (themeName: TThemeName) => void;
  setRandomThemeName: () => void;
}

export const useThemeStoreBase = create<ThemeState>()((set, get) => ({
  themeNames,
  themeName: undefined,
  setThemeName: (themeName) => set(() => ({ themeName })),
  setRandomThemeName: () => {
    const randomNumber = Math.floor(Math.random() * themeNames.length);
    const newThemeName = get().themeNames[randomNumber];

    if (newThemeName) get().setThemeName(newThemeName);
  },
}));

export const useThemeStore = () => {
  const themeStoreBase = useThemeStoreBase();
  useEffect(() => {
    const initThemeName = localStorage?.getItem("themeName");

    const confirmedThemeName = themeNames.find((x) => x === initThemeName);
    if (confirmedThemeName) themeStoreBase.setThemeName(confirmedThemeName);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!themeStoreBase.themeName) return;

    localStorage.setItem("themeName", themeStoreBase.themeName);

    const htmlElm = document.querySelector("html");
    if (!htmlElm)
      throw new Error("can't find html element so unable to change theme");

    htmlElm.setAttribute("data-theme", themeStoreBase.themeName);
  }, [themeStoreBase.themeName]);

  return themeStoreBase;
};
