import { useRouter } from "next/router";
import { useMemo } from "react";
import { Theme } from "../types";

export const PARAM_THEME = "theme";

export default function useTheme() {
  const router = useRouter();
  const theme = useRouterTheme();

  const themeActions = {
    toggleThemeMode: () => {
      router.replace({
        ...router,
        query: {
          ...router.query,
          [PARAM_THEME]: themeAsQueryParam({
            ...theme,
            mode: theme.mode === "light" ? "dark" : "light",
          }),
        },
      });
    },
  };

  return [theme, themeActions] as [Theme, typeof themeActions];
}

export const defaultTheme: Theme = {
  mode: "light",
  palette: {
    primary: {
      main: /* css */ `rgb(242, 29, 117)`,
      light: /* css */ `rgb(245, 96, 158)`,
    },
  },
  favicon: "/favicon.ico",
};

function useRouterTheme(): Theme {
  const router = useRouter();

  const rawValue = router.query[PARAM_THEME];
  return useMemo(() => {
    const rawTheme = (Array.isArray(rawValue) ? rawValue[0] : rawValue) || "";
    let theme: null | Theme = null;
    try {
      theme = JSON.parse(rawTheme) as Theme;
    } catch (error) {
      // do nothing
    }
    return {
      ...defaultTheme,
      mode:
        theme && ["light", "dark"].includes(theme.mode ?? "")
          ? (theme.mode as Theme["mode"])
          : defaultTheme.mode,
      palette: {
        primary: {
          main:
            theme?.palette.primary.main ?? defaultTheme.palette.primary.main,
          light:
            theme?.palette.primary.light ?? defaultTheme.palette.primary.light,
        },
      },
      favicon: theme?.favicon ?? defaultTheme.favicon,
    };
  }, [rawValue]);
}

export function themeAsQueryParam(theme: Theme): string {
  return JSON.stringify(theme);
}
