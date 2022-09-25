import { useRouter } from "next/router";
import { useMemo } from "react";
import omitBy from "../../../helpers/omitBy";
import parseQueryParam from "../../../helpers/parseQueryParam";
import stringifyQueryParam from "../../../helpers/stringifyQueryParam";
import { HuddleCopy } from "../types";
import { defaultHuddle } from "./useHuddle";

export const PARAM_COPY = "copy";

export function useHuddleCopy() {
  return useRouterCopy();
}

const defaultHuddleCopy: HuddleCopy = {
  title: defaultHuddle.title,
  subtitle: defaultHuddle.subtitle,
};

function useRouterCopy() {
  const router = useRouter();
  const rawValue = router.query[PARAM_COPY];
  return useMemo(() => {
    const copy = parseQueryParam<HuddleCopy>(rawValue, defaultHuddleCopy);
    return Object.keys(defaultHuddleCopy).reduce<HuddleCopy>(
      (acc, key) => ({
        ...acc,
        [key]:
          copy?.[key as keyof HuddleCopy] ??
          defaultHuddleCopy[key as keyof HuddleCopy],
      }),
      {} as HuddleCopy
    );
  }, [rawValue]);
}

export function copyAsQueryParam(copy: HuddleCopy) {
  return stringifyQueryParam(
    omitBy(copy, (value, key) => !value || value === defaultHuddle[key])
  );
}
