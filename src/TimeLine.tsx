import { useEffect, useRef } from "react";
import { LoopPlayerContext } from "./ContextProvider";
import { Event, Snapshot } from "./machine";

const { useSelector, useActorRef } = LoopPlayerContext;

export function TimeLine() {
  const timelineRef = useRef<HTMLButtonElement>(null);
  const { currentTime, duration, timelineWidth, timelineLeft } =
    useSelector(getTimelineData);
  const { send } = useActorRef();
  const progress = currentTime / duration;
  const offset = timelineWidth * progress;

  useTimelineLoaded(timelineRef);

  return (
    <button
      ref={timelineRef}
      data-testid="timeline"
      className="w-full grid grid-cols-1 grid-rows-1 h-6 cursor-pointer"
      onKeyDown={(event) =>
        handleKeyDown({ event, currentTime, duration, send })
      }
      onMouseDown={(event) =>
        handleMouseDown({ event, timelineLeft, timelineWidth, duration, send })
      }
    >
      <div className="w-full bg-gray-100 row-start-1 col-start-1 h-full" />
      <div className="flex w-full row-start-1 col-start-1 h-full">
        <div
          className="h-6 w-6 bg-pink-600 rounded-full absolute z-10"
          style={{
            transform: `translateX(calc(${offset}px - 12px))`,
          }}
        />
        <div
          className="bg-gray-300 w-full h-full"
          style={{
            transform: `scaleX(${progress})`,
            transformOrigin: "left",
          }}
          role="progressbar"
          aria-valuenow={currentTime}
          aria-valuemin={0}
          aria-valuemax={duration}
          aria-label="Audio progress"
        />
      </div>
    </button>
  );
}

function getTimelineData(snapshot: Snapshot) {
  return {
    currentTime: snapshot.context.currentTime,
    duration: snapshot.context.ref?.duration ?? 0,
    timelineWidth: snapshot.context.timelineWidth,
    timelineLeft: snapshot.context.timelineLeft,
  };
}

type HandleMouseDownProps = {
  event: React.MouseEvent<HTMLButtonElement>;
  timelineLeft: number;
  timelineWidth: number;
  duration: number;
  send: (action: Event) => void;
};

function handleMouseDown({
  event,
  timelineLeft,
  timelineWidth,
  duration,
  send,
}: HandleMouseDownProps) {
  const time = ((event.clientX - timelineLeft) / timelineWidth) * duration;
  send({
    type: "SEEK",
    time,
  });
}

type HandleKeyDownProps = {
  event: React.KeyboardEvent<HTMLButtonElement>;
  currentTime: number;
  duration: number;
  send: (event: Event) => void;
};

function handleKeyDown({
  event,
  currentTime,
  duration,
  send,
}: HandleKeyDownProps) {
  const keyToTimeMap = createSeekTimeMap(duration);
  if (event.key in keyToTimeMap) {
    const time = keyToTimeMap[event.key as keyof typeof keyToTimeMap];
    send({
      type: "SEEK",
      time,
    });
  }
  if (event.key === "ArrowLeft") {
    const time = event.shiftKey
      ? Math.max(0, currentTime - 2)
      : Math.max(0, currentTime - 10);
    send({
      type: "SEEK",
      time,
    });
  }
  if (event.key === "ArrowRight") {
    const time = event.shiftKey
      ? Math.min(duration, currentTime + 2)
      : Math.min(duration, currentTime + 10);
    send({
      type: "SEEK",
      time,
    });
  }
}

function createSeekTimeMap(duration: number) {
  return {
    "0": 0,
    "1": duration * 0.1,
    "2": duration * 0.2,
    "3": duration * 0.3,
    "4": duration * 0.4,
    "5": duration * 0.5,
    "6": duration * 0.6,
    "7": duration * 0.7,
    "8": duration * 0.8,
    "9": duration * 0.9,
  };
}

function useTimelineLoaded(
  timelineRef: React.RefObject<HTMLButtonElement | null>
) {
  const { send } = useActorRef();
  useEffect(() => {
    if (!timelineRef?.current) {
      return;
    }
    const rect = timelineRef.current?.getBoundingClientRect();
    send({
      type: "TIMELINE_LOADED",
      timelineLeft: rect?.left ?? 0,
      timelineWidth: rect?.width ?? 1,
    });
  }, [send, timelineRef]);
}

export type TimelineLoadedEvent = {
  type: "TIMELINE_LOADED";
  timelineLeft: number;
  timelineWidth: number;
};

export type SeekEvent = {
  type: "SEEK";
  time: number;
};
