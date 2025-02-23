import { LoopPlayerContext } from "../ContextProvider";
import { getTimelineData, handleTimelineKeys } from "./timeline";
import { Event } from "../../machine";
const { useSelector, useActorRef } = LoopPlayerContext;

export function TimelineSeekButton({
  children,
}: {
  children: React.ReactNode;
}) {
  const { currentTime, duration, timelineWidth, timelineLeft } =
    useSelector(getTimelineData);
  const { send } = useActorRef();
  return (
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
      {children}
    </button>
  );
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

type SendTimelineLoadedProps = {
  element: HTMLButtonElement | null;
  send: (action: Event) => void;
};

type HandleTimelineClickProps = {
  event: React.MouseEvent<HTMLButtonElement>;
  timelineLeft: number;
  timelineWidth: number;
  duration: number;
  send: (action: Event) => void;
};
