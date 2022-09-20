import { HuddleStateCheck } from "../types";

export const canStart: HuddleStateCheck = (huddle) =>
  huddle.timerBlocks.length > 0 && huddle.members.length > 0;
