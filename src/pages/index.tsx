import type { NextPage } from "next";
import Head from "next/head";
import {
  FiPlay,
  FiSkipForward,
  FiPause,
  FiX,
  FiSettings,
} from "react-icons/fi";

import styles from "./index.module.css";
import useMembers from "../modules/member/hooks/useMembers";
import useHuddle from "../modules/huddle/hooks/useHuddle";
import clsx from "clsx";
import { getTimerBlocksData } from "../modules/huddle/helpers/timerBlocksData";
import useHuddleConfiguration from "../modules/huddle/hooks/useHuddleConfiguration";
import { canStart } from "../modules/huddle/helpers/stateChecks";
import useTimerBlocks from "../modules/timer-block/hooks/useTimerBlocks";
import useTheme from "../modules/theme/hooks/useTheme";
import useThemeStyles from "../modules/theme/hooks/useThemeStyles";
import SanitizedTitle from "../components/SanitizedTitle/SanitizedTitle";
import { useHuddleCopy } from "../modules/huddle/hooks/useHuddleCopy";
import striptags from "striptags";
import Footer from "../components/Footer/Footer";
import { siteMetadata } from "../../config/siteMetadata";

const Home: NextPage = () => {
  const [huddle, huddleActions] = useHuddle({
    ...useHuddleCopy(),
    members: useMembers(),
    timerBlocks: useTimerBlocks(),
  });
  const [theme] = useTheme();
  const [themeStyles] = useThemeStyles(theme);
  const [, huddleConfigurationsActions] = useHuddleConfiguration({
    huddle,
    theme,
  });

  const currentMember =
    (typeof huddle.currentMemberIndex === "number" &&
      huddle.members[huddle.currentMemberIndex]) ||
    null;

  const currentTimerBlock =
    (typeof huddle.currentMemberTimer === "number" &&
      huddle.timerBlocks[huddle.currentMemberTimer]) ||
    null;

  return (
    <>
      <Head>
        <title>{striptags(huddle.title)}</title>
        <meta
          name="description"
          content={striptags(huddle.subtitle) || siteMetadata.description}
        />
      </Head>
      <div
        className={clsx(
          styles.themeBase,
          { light: styles.themeLight, dark: styles.themeDark }[theme.mode],
          themeStyles.className,
          styles.containerOuter,
          styles.huddle,
          {
            ongoing: styles.huddleOngoing,
            paused: styles.huddlePaused,
            stopped: styles.huddleStopped,
          }[huddle.status]
        )}
      >
        <div className={styles.containerInner}>
          <SanitizedTitle component="h1" className={styles.title}>
            {huddle.title}
          </SanitizedTitle>
          <SanitizedTitle component="h2" className={styles.subtitle}>
            {huddle.subtitle}
          </SanitizedTitle>
          <div className={clsx(styles.section)}>
            <div className={styles.buttonGroup}>
              {huddle.status === "ongoing" || huddle.status === "paused" ? (
                <>
                  {huddle.status === "ongoing" && (
                    <button
                      key="pause"
                      type="button"
                      className={clsx(styles.button, styles.buttonPause)}
                      onClick={huddleActions.pause}
                      aria-label="Pause"
                    >
                      <FiPause />
                    </button>
                  )}
                  {huddle.status === "paused" && (
                    <button
                      key="resume"
                      type="button"
                      className={clsx(styles.button, styles.buttonResume)}
                      onClick={huddleActions.resume}
                      aria-label="Resume"
                    >
                      <FiPlay />
                    </button>
                  )}
                  <button
                    key="next"
                    type="button"
                    className={clsx(styles.button, styles.buttonNext)}
                    onClick={huddleActions.next}
                    disabled={huddle.status === "paused"}
                    aria-label="Next"
                  >
                    <FiSkipForward />
                  </button>
                  <button
                    key="reset"
                    type="button"
                    className={clsx(styles.button, styles.buttonReset)}
                    onClick={huddleActions.reset}
                    aria-label="Reset"
                  >
                    <FiX />
                  </button>
                </>
              ) : (
                <>
                  {canStart(huddle) && (
                    <button
                      key="start"
                      type="button"
                      className={clsx(styles.button, styles.buttonStart)}
                      onClick={huddleActions.start}
                      aria-label="Start"
                    >
                      <FiPlay />
                    </button>
                  )}
                  <button
                    key="configure"
                    type="button"
                    className={clsx(styles.button, styles.buttonConfigure)}
                    onClick={huddleConfigurationsActions.onConfigure}
                    aria-label="Configure"
                  >
                    <FiSettings />
                  </button>
                </>
              )}
            </div>
          </div>
          <div className={clsx(styles.section, styles.members)}>
            {huddle.members.length === 0 && (
              <p className={styles.center}>
                Simple and configurable tool to manage daily huddles in a remote
                team.
              </p>
            )}
            {huddle.members.map((member, memberIndex) => (
              <div
                key={member.id}
                className={clsx(styles.member, {
                  [styles.memberCompleted || ""]:
                    typeof huddle.currentMemberIndex === "number" &&
                    huddle.currentMemberIndex > memberIndex,
                  [styles.memberActive || ""]: member.id === currentMember?.id,
                })}
              >
                <div className={styles.memberContent}>
                  <span className={clsx(styles.memberName, styles.flexGrow)}>
                    <span>{member.name}</span>
                  </span>
                  {member.id === currentMember?.id &&
                    currentTimerBlock &&
                    typeof huddle.secondsLeft === "number" && (
                      <span className={clsx(styles.memberTimerBlockSeconds)}>
                        <span role="timer">{huddle.secondsLeft}</span>
                      </span>
                    )}

                  <span
                    className={clsx(
                      styles.memberTimerBlockName,
                      styles.flexGrow
                    )}
                  >
                    <span>
                      {!!currentTimerBlock &&
                        member.id === currentMember?.id &&
                        currentTimerBlock.label}
                    </span>
                  </span>
                </div>
                {getTimerBlocksData({ huddle, memberIndex })?.map(
                  ({ active, offset, total, progress }, timerBlockIndex) => (
                    <div
                      key={timerBlockIndex}
                      className={clsx(styles.memberTimerBlockProgress, {
                        [styles.memberTimerBlockProgressCompleted || ""]:
                          progress >= total,
                        [styles.memberTimerBlockProgressActive || ""]: active,
                      })}
                      style={{
                        left: `${offset}%`,
                        width: `${progress}%`,
                      }}
                    />
                  )
                )}
              </div>
            ))}
          </div>
          <Footer
            classes={{
              root: styles.footer,
              buttonGroup: styles.buttonGroupSmall,
              button: clsx(styles.button, styles.buttonSmall),
            }}
          />
        </div>
      </div>
    </>
  );
};

export default Home;
