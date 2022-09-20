import { Theme } from "../types";

export const setMode = (theme: Theme, mode: Theme["mode"]) => ({
  ...theme,
  mode,
});

type ColorKey =
  `${keyof Theme["palette"]}.${keyof Theme["palette"][keyof Theme["palette"]]}`;

export const setColor = (theme: Theme, key: ColorKey, color: string) => {
  const [paletteKey, colorKey] = key.split(".") as [
    keyof Theme["palette"],
    keyof Theme["palette"][keyof Theme["palette"]]
  ];
  return {
    ...theme,
    palette: {
      ...theme.palette,
      [paletteKey]: {
        ...theme.palette.primary,
        [colorKey]: color,
      },
    },
  };
};

export const setFavicon = (theme: Theme, favicon: Theme["favicon"]) => ({
  ...theme,
  favicon,
});
