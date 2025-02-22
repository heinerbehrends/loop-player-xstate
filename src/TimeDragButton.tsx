import { useEffect } from "react";
import { LoopPlayerContext } from "./ContextProvider";
import { Snapshot } from "./machine";
import { handleTimelineKeys } from "./handleTimelineKeys";

const { useActorRef, useSelector } = LoopPlayerContext;

function getTimeDragData(snapshot: Snapshot) {
  return {
    currentTime: snapshot.context.currentTime,
    duration: snapshot.context.ref?.duration ?? 0,
    timelineWidth: snapshot.context.timelineWidth,
    timelineLeft: snapshot.context.timelineLeft,
    dragXOffset: snapshot.context.dragXOffset,
    isDragging: snapshot.value.dragTime === "dragging",
  };
}

export function TimeDragButton() {
  const { currentTime, duration, timelineWidth, dragXOffset, isDragging } =
    useSelector(getTimeDragData);
  const { send } = useActorRef();
  const progress = currentTime / duration;
  const offset = isDragging ? dragXOffset : timelineWidth * progress;
  useDrag();
  return (
    <button
      className="h-6 w-6 bg-pink-600 row-start-1 col-start-1 rounded-full absolute z-10"
      style={{
        left: `calc(${offset}px - 12px)`,
      }}
      onPointerDown={() => {
        send({
          type: "DRAG_START",
          clientX: offset,
          element: "timeline",
        });
      }}
      onKeyDown={(event) =>
        handleTimelineKeys({ event, currentTime, duration, send })
      }
    />
  );
}

function useDrag() {
  const { send } = useActorRef();
  const { duration, timelineWidth, timelineLeft, dragXOffset, isDragging } =
    useSelector(getTimeDragData);
  useEffect(() => {
    function onPointerUp() {
      const relativeTime = (dragXOffset / timelineWidth) * duration;
      send({
        type: "DRAG_END",
        clientX: dragXOffset,
        time: relativeTime,
      });
    }
    function onPointerMove({ clientX }: PointerEvent) {
      if (!isDragging) {
        return;
      }
      send({ type: "DRAG", clientX: clientX - timelineLeft });
    }

    window.addEventListener("pointerup", onPointerUp);
    window.addEventListener("pointermove", onPointerMove);
    return () => {
      window.removeEventListener("pointerup", onPointerUp);
      window.removeEventListener("pointermove", onPointerMove);
    };
  }, [isDragging, dragXOffset]);
}
