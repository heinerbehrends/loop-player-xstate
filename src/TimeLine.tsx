import { useState, useEffect, useRef } from "react";
import { Snapshot } from "./AudioElement";
import { LoopPlayerContext } from "./ContextProvider";

const { useSelector, useActorRef } = LoopPlayerContext;

function getTimelineData(snapshot: Snapshot) {
  return {
    currentTime: snapshot.context.currentTime,
    duration: snapshot.context.ref?.duration ?? 0,
    timelineWidth: snapshot.context.timelineWidth,
  };
}

export function TimeLine() {
  const timelineRef = useRef<HTMLDivElement>(null);
  const { currentTime, duration, timelineWidth } = useSelector(getTimelineData);
  const progress = currentTime / duration;
  const offset = timelineWidth * progress;

  useTimelineLoaded(timelineRef);

  return (
    <div ref={timelineRef} className="w-full grid grid-cols-1 grid-rows-1 h-6">
      <div className="w-full bg-gray-100 row-start-1 col-start-1" />
      <div className="flex w-full row-start-1 col-start-1 ">
        <button
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
    </div>
  );
}

function useTimelineLoaded(
  timelineRef: React.RefObject<HTMLDivElement | null>
): DOMRect {
  const [rect, setRect] = useState<DOMRect | undefined>();
  const { send } = useActorRef();
  useEffect(() => {
    if (!timelineRef?.current) {
      return;
    }
    const rect = timelineRef.current?.getBoundingClientRect();
    setRect(rect);
    send({
      type: "TIMELINE_LOADED",
      timelineLeft: rect?.left ?? 0,
      timelineWidth: rect?.width ?? 1,
    });
  }, [send, timelineRef]);
  return rect ?? new DOMRect(0, 0, 1, 1);
}
