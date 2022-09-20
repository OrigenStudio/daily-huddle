import { useRouter } from "next/router";
import { useMemo } from "react";
import { TimerBlock } from "../types";

export const PARAM_TIMER_BLOCKS = "timerBlocks";

export default function useTimerBlocks() {
  const timerBlocks = useRouterTimerBlocks();

  return timerBlocks;
}

const defaultTimerBlocks: TimerBlock[] = [
  { id: "1", label: "Personal", seconds: 20 },
  { id: "2", label: "Work", seconds: 60 },
  { id: "3", label: "Blockers", seconds: 10 },
];

function useRouterTimerBlocks(): TimerBlock[] {
  const router = useRouter();

  const rawValue = router.query[PARAM_TIMER_BLOCKS];
  return useMemo(() => {
    const rawTimerBlocks =
      (Array.isArray(rawValue) ? rawValue[0] : rawValue) || "";

    let timerBlocks: null | TimerBlock[] = null;
    try {
      timerBlocks = JSON.parse(rawTimerBlocks) as TimerBlock[];
    } catch (error) {
      // do nothing
    } finally {
      timerBlocks = Array.isArray(timerBlocks) ? timerBlocks : [];
    }

    const valueArray = timerBlocks.reduce<TimerBlock[]>((acc, timerBlock) => {
      const { id, label, seconds: secondsRaw } = timerBlock || {};
      const seconds =
        typeof secondsRaw === "string" ? parseInt(secondsRaw) : secondsRaw;
      return id && label && typeof seconds === "number"
        ? [...acc, { id, label, seconds }]
        : acc;
    }, []);

    return valueArray.length ? valueArray : defaultTimerBlocks;
  }, [rawValue]);
}

export function timerBlocksAsQueryParam(timerBlocks: TimerBlock[]): string {
  return JSON.stringify(timerBlocks);
}
