import {
  SetStateAction,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import useCountDown from "react-countdown-hook";
import { Huddle } from "../types";
import * as huddleStateActions from "../helpers/stateActions";

export const defaultHuddle: Huddle = {
  title: /* html */ `Daily <b>Huddle</b>`,
  subtitle: /* html */ ``,
  status: "stopped",
  secondsLeft: null,
  members: [],
  currentMemberIndex: null,
  timerBlocks: [],
  currentMemberTimer: null,
};

export interface UseHuddleConfig {
  title: string;
  members: Huddle["members"];
  timerBlocks: Huddle["timerBlocks"];
}

export default function useHuddle(config: UseHuddleConfig) {
  const initialHuddle = {
    ...defaultHuddle,
    ...config,
  };

  const [huddle, setHuddle] = useState(initialHuddle);

  useEffect(
    () => {
      setHuddle(initialHuddle);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [config.members]
  );

  const huddleActions = useHuddleActions({ huddle, setHuddle });
  useHuddleCountDown({ huddle, setHuddle });

  return [huddle, huddleActions] as [typeof huddle, typeof huddleActions];
}

interface UseHuddleActionsConfig {
  huddle: Huddle;
  setHuddle: (value: Huddle | SetStateAction<Huddle>) => void;
}

function useHuddleActions({ setHuddle }: UseHuddleActionsConfig) {
  return {
    start: () => {
      setHuddle(huddleStateActions.start);
    },
    pause: () => {
      setHuddle(huddleStateActions.pause);
    },
    resume: () => {
      setHuddle(huddleStateActions.resume);
    },
    reset: () => {
      setHuddle(huddleStateActions.reset);
    },
    next: () => {
      setHuddle(huddleStateActions.next);
    },
  };
}

interface UseTimerStateConfig {
  huddle: Huddle;
  setHuddle: (value: Huddle | SetStateAction<Huddle>) => void;
}

function useHuddleCountDown({ huddle, setHuddle }: UseTimerStateConfig) {
  const [timeLeft, timerControls] = useCountDown(
    (huddle.timerBlocks[0]?.seconds ?? 0) * 1000
  );

  const previousStatusRef = useRef(huddle.status);
  useEffect(
    () => {
      const previousStatus = previousStatusRef.current;
      previousStatusRef.current = huddle.status;

      const timer = huddle.timerBlocks[huddle.currentMemberIndex ?? 0];

      switch (huddle.status) {
        case "ongoing":
          if (previousStatus === "paused") {
            timerControls.resume();
          } else {
            timerControls.start(timer?.seconds ?? 0 * 1000);
          }
          break;
        case "paused":
          timerControls.pause();
          break;
        case "stopped":
          timerControls.reset();
          break;
        default:
          break;
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [huddle.status]
  );

  useEffect(
    () => {
      const timer =
        (typeof huddle.currentMemberTimer === "number" &&
          huddle.timerBlocks[huddle.currentMemberTimer]) ||
        null;
      if (timer) {
        timerControls.start(timer.seconds * 1000);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [huddle.currentMemberTimer]
  );

  useLayoutEffect(
    () => {
      setHuddle((prev) => {
        if (prev.status !== "ongoing") {
          return prev;
        }

        const timerBlock = prev.timerBlocks[prev.currentMemberTimer ?? 0];
        if (!timerBlock) {
          return prev;
        }

        return timeLeft <= 0
          ? huddleStateActions.next({
              ...prev,
              secondsLeft: timerBlock.seconds,
            })
          : { ...prev, secondsLeft: timeLeft / 1000 };
      });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [timeLeft]
  );
}
