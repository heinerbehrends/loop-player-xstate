import { LoopPlayerContext } from "./ContextProvider";
import { TimeDragButton } from "./TimeDragButton";
import { handleTimelineKeys } from "./handleTimelineKeys";
import { Snapshot, Event } from "./machine";

const { useSelector, useActorRef } = LoopPlayerContext;

export function TimeLine() {
  const {
    currentTime,
    duration,
    timelineWidth,
    timelineLeft,
    isDragging,
    dragXOffset,
  } = useSelector(getTimelineData);
  const { send } = useActorRef();
  const progress = isDragging
    ? dragXOffset / timelineWidth
    : currentTime / duration;

  return (
    <div className="relative w-full h-6 grid grid-cols-1 grid-rows-1 ">
      <TimeDragButton />
      <button
        ref={(element) => sendTimelineLoaded({ element, send })}
        data-testid="timeline"
        className="w-full h-6 cursor-pointer col-start-1 row-start-1 grid subgrid"
        onKeyDown={(event) =>
          handleTimelineKeys({ event, currentTime, duration, send })
        }
        onMouseDown={(event) =>
          handleTimelineClick({
            event,
            timelineLeft,
            timelineWidth,
            duration,
            send,
          })
        }
      >
        <div className="w-full bg-gray-100 row-start-1 col-start-1 h-full" />
        <div
          className="bg-gray-300 w-full h-full col-start-1 row-start-1"
          style={{
            transform: `scaleX(${progress})`,
            transformOrigin: "left",
          }}
          role="progressbar"
          aria-valuenow={currentTime}
          aria-valuemin={0}
          aria-valuemax={duration}
          aria-label="audio progress"
        />
      </button>
    </div>
  );
}

function getTimelineData(snapshot: Snapshot) {
  return {
    currentTime: snapshot.context.currentTime,
    duration: snapshot.context.ref?.duration ?? 0,
    timelineWidth: snapshot.context.timelineWidth,
    timelineLeft: snapshot.context.timelineLeft,
    dragXOffset: snapshot.context.dragXOffset,
    isDragging: snapshot.value.dragTime === "dragging",
  };
}

function handleTimelineClick({
  event,
  timelineLeft,
  timelineWidth,
  duration,
  send,
}: HandleTimelineClickProps) {
  const time = ((event.clientX - timelineLeft) / timelineWidth) * duration;
  send({
    type: "SEEK",
    time,
  });
}

function sendTimelineLoaded({ element, send }: SendTimelineLoadedProps) {
  if (!element) {
    return;
  }
  const rect = element.getBoundingClientRect();
  send({
    type: "TIMELINE_LOADED",
    timelineLeft: rect.left,
    timelineWidth: rect.width,
  });
}

type HandleTimelineClickProps = {
  event: React.MouseEvent<HTMLButtonElement>;
  timelineLeft: number;
  timelineWidth: number;
  duration: number;
  send: (action: Event) => void;
};

type SendTimelineLoadedProps = {
  element: HTMLButtonElement | null;
  send: (action: Event) => void;
};
