import { Huddle } from "../types";

interface TimerBlockData {
  active: boolean;
  offset: number;
  total: number;
  progress: number;
}

export interface GetTimerBlocksDataConfig {
  huddle: Huddle;
  memberIndex: number;
}

export function getTimerBlocksData({
  memberIndex,
  huddle,
}: GetTimerBlocksDataConfig): TimerBlockData[] {
  return reduceMemberTimerBlocksData({
    huddle,
    variant:
      (memberIndex === huddle.currentMemberIndex && "active") ||
      (typeof huddle.currentMemberIndex === "number" &&
        memberIndex < huddle.currentMemberIndex &&
        "completed") ||
      "remaining",
  });
}

export interface ReduceMemberTimerBlocksDataConfig {
  huddle: Huddle;
  variant: "active" | "completed" | "remaining";
}

export function reduceMemberTimerBlocksData({
  huddle,
  variant,
}: ReduceMemberTimerBlocksDataConfig): TimerBlockData[] {
  const totalSeconds = huddle.timerBlocks.reduce(
    (acc, timerBlock) => acc + timerBlock.seconds,
    0
  );

  return huddle.timerBlocks.reduce<TimerBlockData[]>((acc, timerBlock, index) => {
    const active = variant === "active" && index === huddle.currentMemberTimer;
    const total = (timerBlock.seconds * 100) / totalSeconds;
    const prevTimerBlock = acc[index - 1];
    const offset = prevTimerBlock
      ? prevTimerBlock.offset + prevTimerBlock.total
      : 0;
    return [
      ...acc,
      {
        active,
        offset,
        total,
        progress: {
          active: active
            ? ((timerBlock.seconds - huddle.secondsLeft) * 100) / totalSeconds
            : typeof huddle.currentMemberTimer === "number" &&
              index < huddle.currentMemberTimer
            ? total
            : 0,
          completed: total,
          remaining: 0,
        }[variant],
      },
    ];
  }, []);
}
