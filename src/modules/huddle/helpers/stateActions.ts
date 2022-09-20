import { HuddleStateAction } from "../types";
import { canStart } from "./stateChecks";

export const start: HuddleStateAction = (huddle) =>
  canStart(huddle)
    ? {
        ...huddle,
        secondsLeft: huddle.timerBlocks[0]?.seconds ?? 0,
        status: "ongoing",
        currentMemberIndex: 0,
        currentMemberTimer: 0,
      }
    : huddle;

export const pause: HuddleStateAction = (huddle) =>
  huddle.status === "ongoing" ? { ...huddle, status: "paused" } : huddle;

export const resume: HuddleStateAction = (huddle) =>
  huddle.status === "paused" ? { ...huddle, status: "ongoing" } : huddle;

export const reset: HuddleStateAction = (huddle) => ({
  ...huddle,
  status: "stopped",
  secondsLeft: null,
  currentMemberIndex: null,
  currentMemberTimer: null,
});

export const next: HuddleStateAction = (huddle) => {
  if (huddle.status === "stopped") {
    return huddle;
  }

  const nextMemberTimer = huddle.currentMemberTimer + 1;

  if (nextMemberTimer >= huddle.timerBlocks.length) {
    const nextMemberIndex = huddle.currentMemberIndex + 1;
    if (nextMemberIndex > huddle.members.length - 1) {
      // no more members, finish huddle
      return reset(huddle);
    }
    // next member
    return {
      ...huddle,
      currentMemberIndex: huddle.currentMemberIndex + 1,
      currentMemberTimer: 0,
    };
  }
  // next timer
  return {
    ...huddle,
    currentMemberTimer: nextMemberTimer,
  };
};
