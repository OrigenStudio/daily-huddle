import { useRouter } from "next/router";
import { useEffect, useMemo, useState } from "react";
import {
  membersAsQueryParam,
  PARAM_MEMBERS,
} from "../../member/hooks/useMembers";
import { Member } from "../../member/types";
import { PARAM_THEME, themeAsQueryParam } from "../../theme/hooks/useTheme";
import { Theme } from "../../theme/types";
import {
  PARAM_TIMER_BLOCKS,
  timerBlocksAsQueryParam,
} from "../../timer-block/hooks/useTimerBlocks";
import { TimerBlock } from "../../timer-block/types";
import { Huddle, HuddleCopy } from "../types";
import { copyAsQueryParam, PARAM_COPY } from "./useHuddleCopy";

export interface HuddleConfigurationFormStateValues {
  copy: HuddleCopy;
  members: Member[];
  timerBlocks: TimerBlock[];
  theme: Theme;
}

export interface HuddleConfigurationFormState {
  initialValues: HuddleConfigurationFormStateValues;
  values: HuddleConfigurationFormStateValues;
  dirty: boolean;
}

export interface UseHuddleConfigurationConfig {
  huddle: Huddle;
  theme: Theme;
}

export default function useHuddleConfiguration({
  huddle,
  theme,
}: UseHuddleConfigurationConfig) {
  const router = useRouter();

  const initialValues = {
    copy: useMemo(
      () => ({
        title: huddle.title,
        subtitle: huddle.subtitle,
      }),
      [huddle.title, huddle.subtitle]
    ),
    members: huddle.members,
    timerBlocks: huddle.timerBlocks,
    theme,
  };
  const [values, setValues] =
    useState<HuddleConfigurationFormStateValues>(initialValues);

  useEffect(
    () => {
      setValues(initialValues);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    Object.values(initialValues)
  );

  const formActions = {
    setValues,
    onConfigure: () => {
      router.replace({
        pathname: "/configure",
        query: { ...router.query, ...valuesAsQueryParams(initialValues) },
      });
    },
    onSave: () => {
      router.replace({
        pathname: "/",
        query: {
          ...router.query,
          ...valuesAsQueryParams({
            ...values,
            members: values.members.map((member, index) => ({
              ...member,
              id: index.toString(),
            })),
          }),
        },
      });
    },
    onCancel: () => {
      router.replace({
        pathname: "/",
        query: { ...router.query, ...valuesAsQueryParams(initialValues) },
      });
    },
  };

  return [
    {
      initialValues,
      values,
      dirty: isDirty({ initialValues, values }),
    },
    formActions,
  ] as [HuddleConfigurationFormState, typeof formActions];
}

function isDirty({
  initialValues,
  values,
}: {
  initialValues: HuddleConfigurationFormStateValues;
  values: HuddleConfigurationFormStateValues;
}) {
  return (
    isDirtyTimeBlocks() || isDirtyMembers() || isDirtyTheme() || isDirtyCopy()
  );

  function isDirtyTimeBlocks() {
    if (initialValues.timerBlocks.length !== values.timerBlocks.length) {
      return true;
    }
    return initialValues.timerBlocks.some((initialTimerBlock, index) => {
      const timerBlock = values.timerBlocks[index];
      return (
        !timerBlock ||
        initialTimerBlock.id !== timerBlock.id ||
        initialTimerBlock.label !== timerBlock.label ||
        initialTimerBlock.seconds !== timerBlock.seconds
      );
    });
  }
  function isDirtyMembers() {
    if (initialValues.members.length !== values.members.length) {
      return true;
    }
    return initialValues.members.some((initialMember, index) => {
      const member = values.members[index];
      return (
        !member ||
        initialMember.id !== member.id ||
        initialMember.name !== member.name
      );
    });
  }
  function isDirtyTheme() {
    return (
      initialValues.theme.mode !== values.theme.mode ||
      initialValues.theme.palette.primary.main !==
        values.theme.palette.primary.main ||
      initialValues.theme.palette.primary.light !==
        values.theme.palette.primary.light||
      initialValues.theme.favicon !==
        values.theme.favicon
    );
  }
  function isDirtyCopy() {
    return initialValues.copy.title !== values.copy.title;
  }
}

export function valuesAsQueryParams(
  values: HuddleConfigurationFormStateValues
) {
  return {
    [PARAM_COPY]: copyAsQueryParam(values.copy),
    [PARAM_MEMBERS]: membersAsQueryParam(values.members),
    [PARAM_TIMER_BLOCKS]: timerBlocksAsQueryParam(values.timerBlocks),
    [PARAM_THEME]: themeAsQueryParam(values.theme),
  };
}
