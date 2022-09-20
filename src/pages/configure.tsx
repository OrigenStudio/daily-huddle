import type { NextPage } from "next";
import Head from "next/head";
import { FiSave, FiUserPlus, FiX, FiLogOut } from "react-icons/fi";
import { BsDice5 } from "react-icons/bs";
import {
  MdDragIndicator,
  MdOutlineMoreTime,
  MdDarkMode,
  MdLightMode,
} from "react-icons/md";
import { v4 as uuidV4 } from "uuid";

import styles from "./index.module.css";
import useMembers from "../modules/member/hooks/useMembers";
import clsx from "clsx";
import {
  ChangeEvent,
  ChangeEventHandler,
  MouseEvent,
  useCallback,
  useRef,
} from "react";
import { Member } from "../modules/member/types";
import { DropTargetMonitor, useDrag, useDrop, XYCoord } from "react-dnd";
import useHuddle, { defaultHuddle } from "../modules/huddle/hooks/useHuddle";
import useHuddleConfiguration from "../modules/huddle/hooks/useHuddleConfiguration";
import useTimerBlocks from "../modules/timer-block/hooks/useTimerBlocks";
import { TimerBlock } from "../modules/timer-block/types";
import useTheme, { defaultTheme } from "../modules/theme/hooks/useTheme";
import useThemeStyles from "../modules/theme/hooks/useThemeStyles";
import * as themeUpdateActions from "../modules/theme/helpers/updateActions";
import Input from "../components/Input/Input";
import striptags from "striptags";
import SanitizedTitle from "../components/SanitizedTitle/SanitizedTitle";
import { useHuddleCopy } from "../modules/huddle/hooks/useHuddleCopy";
import Footer from "../components/Footer/Footer";
import { siteMetadata } from "../../config/siteMetadata";

const Configure: NextPage = () => {
  const [huddle] = useHuddle({
    ...useHuddleCopy(),
    members: useMembers(),
    timerBlocks: useTimerBlocks(),
  });
  const [{ values, dirty }, { setValues, onSave, onCancel }] =
    useHuddleConfiguration({
      huddle,
      theme: useTheme()[0],
    });

  const [themeStyles] = useThemeStyles(values.theme);

  const handleMemberNameChange = useCallback<
    NonNullable<MemberConfigurationItemProps["onNameChange"]>
  >(
    (event, _2, index) => {
      setValues((prev) => {
        const members = [...prev.members];
        const member = members[index];
        if (!member) {
          return prev;
        }
        members.splice(index, 1, {
          ...member,
          name: event.target.value,
        });
        return { ...prev, members };
      });
    },
    [setValues]
  );

  const handleMemberRemove = useCallback<
    NonNullable<MemberConfigurationItemProps["onRemove"]>
  >(
    (_1, _2, index) => {
      setValues((prev) => {
        const members = [...prev.members];
        members.splice(index, 1);
        return { ...prev, members };
      });
    },
    [setValues]
  );

  const handleMemberMove = useCallback<
    NonNullable<MemberConfigurationItemProps["onMove"]>
  >(
    (_1, _2, indexSource, indexTarget) => {
      setValues((prev) => {
        const members = [...prev.members];
        const item = members[indexSource] as Member;
        members.splice(indexSource, 1);
        members.splice(indexTarget, 0, item);
        return { ...prev, members };
      });
    },
    [setValues]
  );

  const handleTimerBlockLabelChange = useCallback<
    NonNullable<TimerBlockConfigurationItemProps["onLabelChange"]>
  >(
    (event, _2, index) => {
      setValues((prev) => {
        const timerBlocks = [...prev.timerBlocks];
        const member = timerBlocks[index];
        if (!member) {
          return prev;
        }
        timerBlocks.splice(index, 1, {
          ...member,
          label: event.target.value,
        });
        return { ...prev, timerBlocks };
      });
    },
    [setValues]
  );

  const handleTimerBlockSecondsChange = useCallback<
    NonNullable<TimerBlockConfigurationItemProps["onSecondsChange"]>
  >(
    (event, _2, index) => {
      setValues((prev) => {
        const timerBlocks = [...prev.timerBlocks];
        const member = timerBlocks[index];
        if (!member) {
          return prev;
        }
        timerBlocks.splice(index, 1, {
          ...member,
          seconds: parseInt(event.target.value, 10),
        });
        return { ...prev, timerBlocks };
      });
    },
    [setValues]
  );

  const handleTimerBlockRemove = useCallback<
    NonNullable<TimerBlockConfigurationItemProps["onRemove"]>
  >(
    (_1, _2, index) => {
      setValues((prev) => {
        const timerBlocks = [...prev.timerBlocks];
        timerBlocks.splice(index, 1);
        return { ...prev, timerBlocks };
      });
    },
    [setValues]
  );

  const handleTimerBlockMove = useCallback<
    NonNullable<TimerBlockConfigurationItemProps["onMove"]>
  >(
    (_1, _2, indexSource, indexTarget) => {
      setValues((prev) => {
        const timerBlocks = [...prev.timerBlocks];
        const item = timerBlocks[indexSource] as TimerBlock;
        timerBlocks.splice(indexSource, 1);
        timerBlocks.splice(indexTarget, 0, item);
        return { ...prev, timerBlocks };
      });
    },
    [setValues]
  );

  return (
    <>
      <Head>
        <title>
          {striptags(values.copy.title || defaultHuddle.title)} - Configure
        </title>
        <meta
          name="description"
          content={striptags(huddle.subtitle) || siteMetadata.description}
        />
      </Head>
      <form
        className={clsx(
          styles.themeBase,
          {
            light: styles.themeLight,
            dark: styles.themeDark,
          }[values.theme.mode],
          themeStyles.className,
          styles.containerOuter,
          styles.membersConfiguration
        )}
        onSubmit={(event) => {
          event.preventDefault();
          onSave();
        }}
      >
        <div className={styles.containerInner}>
          <SanitizedTitle component="h1" className={styles.title}>
            {values.copy.title || defaultHuddle.title}
          </SanitizedTitle>
          <SanitizedTitle component="h2" className={styles.subtitle}>
            {values.copy.subtitle || defaultHuddle.subtitle}
          </SanitizedTitle>
          <div className={clsx(styles.section)}>
            <div className={styles.buttonGroup}>
              <button
                key="configure"
                type="submit"
                className={clsx(styles.button, styles.buttonSuccess)}
                aria-label="Save"
                disabled={!dirty}
              >
                <FiSave />
              </button>
              <button
                key="cancel"
                type="button"
                className={clsx(styles.button, styles.buttonDanger)}
                onClick={onCancel}
                aria-label="Save"
              >
                <FiLogOut />
              </button>
            </div>
          </div>
          <div className={clsx(styles.section, styles.copy)}>
            <div className={styles.fieldContent}>
              <Input
                label="Title"
                value={values.copy.title}
                placeholder={defaultHuddle.title}
                onChange={useCallback<ChangeEventHandler<HTMLInputElement>>(
                  (event) => {
                    setValues((prev) => ({
                      ...prev,
                      copy: { ...prev.copy, title: event.target.value },
                    }));
                  },
                  [setValues]
                )}
                classes={{ root: styles.field }}
              />
              <Input
                label="Subtitle"
                value={values.copy.subtitle}
                placeholder={defaultHuddle.subtitle}
                onChange={useCallback<ChangeEventHandler<HTMLInputElement>>(
                  (event) => {
                    setValues((prev) => ({
                      ...prev,
                      copy: { ...prev.copy, subtitle: event.target.value },
                    }));
                  },
                  [setValues]
                )}
                classes={{ root: styles.field }}
              />
            </div>
          </div>
          <div className={clsx(styles.section, styles.members)}>
            <h3 className={styles.subtitle}>Members</h3>
            {values.members.map((member, index) => (
              <MemberConfigurationItem
                key={member.id}
                member={member}
                index={index}
                onNameChange={handleMemberNameChange}
                onRemove={handleMemberRemove}
                onMove={handleMemberMove}
              />
            ))}
            <div className={styles.buttonGroup}>
              <button
                key="scramble"
                type="button"
                className={clsx(styles.button, styles.buttonWarning)}
                onClick={() => {
                  setValues((prev) => ({
                    ...prev,
                    members: prev.members
                      .map((value) => ({ value, sort: Math.random() }))
                      .sort((a, b) => a.sort - b.sort)
                      .map(({ value }) => value),
                  }));
                }}
                aria-label="Scramble"
              >
                <BsDice5 />
              </button>
              <button
                key="add"
                type="button"
                className={clsx(styles.button, styles.buttonSuccess)}
                aria-label="Add"
                onClick={() => {
                  setValues((prev) => ({
                    ...prev,
                    members: [...prev.members, { id: uuidV4(), name: "" }],
                  }));
                }}
              >
                <FiUserPlus />
              </button>
            </div>
          </div>
          <div className={clsx(styles.section, styles.timerBlocks)}>
            <h3 className={styles.subtitle}>Timer Blocks</h3>
            {values.timerBlocks.map((timerBlock, index) => (
              <TimerBlockConfigurationItem
                key={timerBlock.id}
                timerBlock={timerBlock}
                index={index}
                onLabelChange={handleTimerBlockLabelChange}
                onSecondsChange={handleTimerBlockSecondsChange}
                onRemove={handleTimerBlockRemove}
                onMove={handleTimerBlockMove}
              />
            ))}
            <div className={styles.buttonGroup}>
              <button
                key="add"
                type="button"
                className={clsx(styles.button, styles.buttonSuccess)}
                aria-label="Add"
                onClick={() => {
                  setValues((prev) => ({
                    ...prev,
                    timerBlocks: [
                      ...prev.timerBlocks,
                      { id: uuidV4(), label: "", seconds: NaN },
                    ],
                  }));
                }}
              >
                <MdOutlineMoreTime />
              </button>
            </div>
          </div>
          <div className={clsx(styles.section, styles.theme)}>
            <h3 className={styles.subtitle}>Theme</h3>
            <div className={styles.fieldContent}>
              <Input
                label="Primary Main"
                value={values.theme.palette.primary.main}
                placeholder={defaultTheme.palette.primary.main}
                onChange={useCallback<ChangeEventHandler<HTMLInputElement>>(
                  (event) => {
                    setValues((prev) => ({
                      ...prev,
                      theme: themeUpdateActions.setColor(
                        prev.theme,
                        "primary.main",
                        event.target.value
                      ),
                    }));
                  },
                  [setValues]
                )}
                classes={{ root: styles.field }}
              />
              <Input
                label="Primary Light"
                value={values.theme.palette.primary.light}
                placeholder={defaultTheme.palette.primary.light}
                onChange={useCallback<ChangeEventHandler<HTMLInputElement>>(
                  (event) => {
                    setValues((prev) => ({
                      ...prev,
                      theme: themeUpdateActions.setColor(
                        prev.theme,
                        "primary.light",
                        event.target.value
                      ),
                    }));
                  },
                  [setValues]
                )}
                classes={{ root: styles.field }}
              />
            </div>
            <div className={styles.fieldContent}>
              <Input
                label="Favicon"
                value={values.theme.favicon}
                placeholder={defaultTheme.favicon}
                onChange={useCallback<ChangeEventHandler<HTMLInputElement>>(
                  (event) => {
                    setValues((prev) => ({
                      ...prev,
                      theme: themeUpdateActions.setFavicon(
                        prev.theme,
                        event.target.value
                      ),
                    }));
                  },
                  [setValues]
                )}
                classes={{ root: styles.field }}
              />
            </div>
            <div className={styles.buttonGroup}>
              <button
                type="button"
                onClick={useCallback(() => {
                  setValues((prev) => ({
                    ...prev,
                    theme: themeUpdateActions.setMode(
                      prev.theme,
                      prev.theme.mode === "light" ? "dark" : "light"
                    ),
                  }));
                }, [setValues])}
                className={clsx(styles.button, styles.buttonThemeMode)}
              >
                {
                  {
                    light: <MdDarkMode />,
                    dark: <MdLightMode />,
                  }[values.theme.mode]
                }
              </button>
            </div>
          </div>
          <Footer
            classes={{
              root: styles.footer,
              buttonGroup: styles.buttonGroupSmall,
              button: clsx(styles.button, styles.buttonSmall),
            }}
          />
        </div>
      </form>
    </>
  );
};

export default Configure;

const DragTypes = {
  MEMBER: "member",
  TIMER_BLOCK: "timerBlock",
};

interface DragItem {
  id: string;
  index: number;
}

interface MemberConfigurationItemProps {
  member: Member;
  onNameChange?: (
    event: ChangeEvent<HTMLInputElement>,
    member: Member,
    index: number
  ) => void;
  onRemove?: (
    event: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>,
    member: Member,
    index: number
  ) => void;
  onMove?: (
    event: void,
    member: Member,
    indexSource: number,
    indextarget: number
  ) => void;
  index: number;
}

function MemberConfigurationItem({
  member,
  onNameChange,
  onRemove,
  onMove,
  index,
}: MemberConfigurationItemProps) {
  const ref = useRef<HTMLDivElement>(null);

  const [{ handlerId }, drop] = useDrop<
    DragItem,
    void,
    { handlerId: ReturnType<DropTargetMonitor<DragItem>["getHandlerId"]> }
  >({
    accept: DragTypes.MEMBER,
    collect: (monitor) => ({
      handlerId: monitor.getHandlerId(),
    }),
    hover: (item: DragItem, monitor) => {
      const element = ref.current;
      if (!onMove || !element) {
        return;
      }
      const dragIndex = item.index;
      const hoverIndex = index;

      if (!shouldMove({ dragIndex, hoverIndex, element, monitor })) {
        return;
      }

      // Time to actually perform the action
      onMove(undefined, member, dragIndex, hoverIndex);

      // Note: we're mutating the monitor item here!
      // Generally it's better to avoid mutations,
      // but it's good here for the sake of performance
      // to avoid expensive index searches.
      item.index = hoverIndex;
    },
  });

  const [{ isDragging }, drag, preview] = useDrag({
    type: DragTypes.MEMBER,
    item: (): DragItem => ({ id: member.id, index }),
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  preview(drop(ref));

  return (
    <div
      ref={onMove ? ref : null}
      className={clsx(styles.member, {
        [styles.memberDragging ?? ""]: isDragging,
      })}
      data-handler-id={handlerId}
    >
      <div className={styles.memberContent}>
        {onMove && (
          <button
            className={clsx(styles.button, styles.buttonDragHandle)}
            aria-label="Drag"
            ref={drag}
          >
            <MdDragIndicator size="1.2em" />
          </button>
        )}
        <span className={clsx(styles.memberName, styles.flexGrow)}>
          <Input
            label="Name"
            value={member.name}
            onChange={
              onNameChange && ((event) => onNameChange(event, member, index))
            }
            required
          />
        </span>
        <span>
          <button
            className={clsx(styles.button, styles.buttonDanger)}
            aria-label="Remove"
            onClick={onRemove && ((event) => onRemove(event, member, index))}
          >
            <FiX />
          </button>
        </span>
      </div>
    </div>
  );
}

interface TimerBlockConfigurationItemProps {
  timerBlock: TimerBlock;
  onLabelChange?: (
    event: ChangeEvent<HTMLInputElement>,
    timerBlock: TimerBlock,
    index: number
  ) => void;
  onSecondsChange?: (
    event: ChangeEvent<HTMLInputElement>,
    timerBlock: TimerBlock,
    index: number
  ) => void;
  onRemove?: (
    event: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>,
    timerBlock: TimerBlock,
    index: number
  ) => void;
  onMove?: (
    event: void,
    timerBlock: TimerBlock,
    indexSource: number,
    indextarget: number
  ) => void;
  index: number;
}

function TimerBlockConfigurationItem({
  timerBlock,
  onLabelChange,
  onSecondsChange,
  onRemove,
  onMove,
  index,
}: TimerBlockConfigurationItemProps) {
  const ref = useRef<HTMLDivElement>(null);

  const [{ handlerId }, drop] = useDrop<
    DragItem,
    void,
    { handlerId: ReturnType<DropTargetMonitor<DragItem>["getHandlerId"]> }
  >({
    accept: DragTypes.TIMER_BLOCK,
    collect: (monitor) => ({
      handlerId: monitor.getHandlerId(),
    }),
    hover: (item: DragItem, monitor) => {
      const element = ref.current;
      if (!onMove || !element) {
        return;
      }
      const dragIndex = item.index;
      const hoverIndex = index;

      if (!shouldMove({ dragIndex, hoverIndex, element, monitor })) {
        return;
      }

      // Time to actually perform the action
      onMove(undefined, timerBlock, dragIndex, hoverIndex);

      // Note: we're mutating the monitor item here!
      // Generally it's better to avoid mutations,
      // but it's good here for the sake of performance
      // to avoid expensive index searches.
      item.index = hoverIndex;
    },
  });

  const [{ isDragging }, drag, preview] = useDrag({
    type: DragTypes.TIMER_BLOCK,
    item: (): DragItem => ({ id: timerBlock.id, index }),
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  preview(drop(ref));

  return (
    <div
      ref={onMove ? ref : null}
      className={clsx(styles.timerBlock, {
        [styles.timerBlockDragging ?? ""]: isDragging,
      })}
      data-handler-id={handlerId}
    >
      <div className={styles.timerBlockContent}>
        {onMove && (
          <button
            className={clsx(styles.button, styles.buttonDragHandle)}
            aria-label="Drag"
            ref={drag}
          >
            <MdDragIndicator size="1.2em" />
          </button>
        )}
        <span className={clsx(styles.timerBlockLabel, styles.flexGrow)}>
          <Input
            label="Label"
            value={timerBlock.label}
            onChange={
              onLabelChange &&
              ((event) => onLabelChange(event, timerBlock, index))
            }
            required
          />
        </span>
        <span className={clsx(styles.timerBlockSeconds, styles.flexGrow)}>
          <Input
            label="Seconds"
            type="number"
            value={isNaN(timerBlock.seconds) ? "" : timerBlock.seconds}
            onChange={
              onSecondsChange &&
              ((event) => onSecondsChange(event, timerBlock, index))
            }
            required
            min={1}
          />
        </span>
        <span>
          <button
            className={clsx(styles.button, styles.buttonDanger)}
            aria-label="Remove"
            onClick={
              onRemove && ((event) => onRemove(event, timerBlock, index))
            }
          >
            <FiX />
          </button>
        </span>
      </div>
    </div>
  );
}

function shouldMove({
  dragIndex,
  hoverIndex,
  element,
  monitor,
}: {
  dragIndex: number;
  hoverIndex: number;
  element: HTMLDivElement;
  monitor: DropTargetMonitor<DragItem>;
}): boolean {
  // Don't replace items with themselves
  if (dragIndex === hoverIndex) {
    return false;
  }

  // Determine rectangle on screen
  const hoverBoundingRect = element?.getBoundingClientRect();

  // Get vertical middle
  const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;

  // Determine mouse position
  const clientOffset = monitor.getClientOffset();

  // Get pixels to the top
  const hoverClientY = (clientOffset as XYCoord).y - hoverBoundingRect.top;

  // Only perform the move when the mouse has crossed half of the items height
  // When dragging downwards, only move when the cursor is below 50%
  // When dragging upwards, only move when the cursor is above 50%

  // Dragging downwards
  if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
    return false;
  }

  // Dragging upwards
  if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
    return false;
  }
  return true;
}
