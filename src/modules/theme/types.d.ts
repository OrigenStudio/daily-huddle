export interface PaletteColor {
  main: string;
  light: string;
}

export interface Palette {
  primary: PaletteColor;
}

export interface Theme {
  mode: "light" | "dark";
  palette: Palette;
  favicon: string;
}
