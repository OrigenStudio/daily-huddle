import { Member } from "../../member/types";
import { Member } from "../../timer-block/types";

export interface HuddleBase {
  title: string;
  subtitle: string;
}

export interface HuddleOngoing extends HuddleBase {
  status: "ongoing" | "paused";
  secondsLeft: number;
  members: Member[];
  currentMemberIndex: number;
  timerBlocks: TimerBlock[];
  currentMemberTimer: number;
}
export interface HuddlePaused extends HuddleBase {
  status: "stopped";
  secondsLeft: null;
  members: Member[];
  currentMemberIndex: null;
  timerBlocks: TimerBlock[];
  currentMemberTimer: null;
}

export type Huddle = HuddleOngoing | HuddlePaused;

export type HuddleStatus = Huddle["status"];

export type HuddleStateAction = (value: Huddle) => Huddle;

export type HuddleStateCheck = (value: Huddle) => boolean;

export interface HuddleCopy {
  title: string;
  subtitle: string;
}
