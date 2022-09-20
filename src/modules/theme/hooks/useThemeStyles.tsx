import { useEffect, useRef } from "react";
import { Palette, PaletteColor, Theme } from "../types";
import { defaultTheme } from "./useTheme";

export interface StylesObj {
  className: string;
}

export default function useThemeStyles(theme: Theme) {
  // TODO: generate dynamic class name?
  const className = `useThemeStyles_theme_${theme.mode}`;

  const stylesRef = useRef<HTMLStyleElement | null>(null);
  const iconRef = useRef<HTMLLinkElement | null>(null);

  useEffect(() => {
    if (typeof document === "undefined") {
      return;
    }
    if (!stylesRef.current) {
      stylesRef.current = document.createElement("style");
      stylesRef.current.setAttribute("type", "text/css");
      document.head.appendChild(stylesRef.current);
    }
    if (!iconRef.current) {
      iconRef.current = document.createElement("link");
      iconRef.current.setAttribute("rel", "icon");
      document.head.appendChild(iconRef.current);
    }
    return () => {
      if (stylesRef.current) {
        document.head.removeChild(stylesRef.current);
        stylesRef.current = null;
      }
      if (iconRef.current) {
        document.head.removeChild(iconRef.current);
        iconRef.current = null;
      }
    };
  }, []);
  useEffect(() => {
    if (!stylesRef.current) {
      return;
    }

    const { declareColorVar } = curryThemeStylesHelpers(theme);

    stylesRef.current.innerHTML = /* css */ `
      .${className} {
        ${declareColorVar("primary.main")}
        ${declareColorVar("primary.light")}
      }
    `;

    iconRef.current?.setAttribute(
      "href",
      theme.favicon || defaultTheme.favicon
    );
  }, [theme, className]);

  return [
    {
      className,
    },
  ] as [StylesObj];
}

function declareVar(name: string, value: string) {
  return `--${name}: ${value};`;
}

function curryThemeStylesHelpers(theme: Theme) {
  return {
    declareColorVar: (key: `${keyof Palette}.${keyof PaletteColor}`) => {
      const [color, variant] = key.split(".") as [
        keyof Palette,
        keyof PaletteColor
      ];
      return declareVar(
        `color-${color}-${variant}`,
        theme.palette[color][variant] || defaultTheme.palette[color][variant]
      );
    },
  };
}
