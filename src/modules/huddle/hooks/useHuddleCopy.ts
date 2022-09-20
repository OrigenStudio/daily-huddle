import { useRouter } from "next/router";
import { useMemo } from "react";
import { HuddleCopy } from "../types";
import { defaultHuddle } from "./useHuddle";

export const PARAM_COPY = "copy";

export function useHuddleCopy() {
  return useRouterCopy();
}

function useRouterCopy() {
  const router = useRouter();
  const rawValue = router.query[PARAM_COPY];
  return useMemo(() => {
    const rawCopy = (Array.isArray(rawValue) ? rawValue[0] : rawValue) || "";
    let copy: null | HuddleCopy = null;
    try {
      copy = JSON.parse(rawCopy) as HuddleCopy;
    } catch (error) {
      // do nothing
    }
    return {
      title: copy?.title || defaultHuddle.title,
      subtitle: copy?.subtitle || defaultHuddle.subtitle,
    };
  }, [rawValue]);
}

export function copyAsQueryParam(copy: HuddleCopy) {
  return JSON.stringify(copy);
}
