import { LoopPlayerContext } from "../ContextProvider";
import { TimelineDragButton } from "./TimelineDragButton";
import { getTimelineData } from "./timeline";
import { TimelineSeekButton } from "./TimelineSeekButton";

const { useSelector } = LoopPlayerContext;

function TimelineProgress() {
  const { currentTime, duration, isDragging, dragXOffset, timelineWidth } =
    useSelector(getTimelineData);
  const progress = isDragging
    ? dragXOffset / timelineWidth
    : currentTime / duration;
  return (
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
  );
}

function TimelineContainer({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative w-full h-6 grid grid-cols-1 grid-rows-1 ">
      {children}
    </div>
  );
}

function TimelineBackground() {
  return <div className="w-full bg-gray-100 row-start-1 col-start-1 h-full" />;
}

type TimelineComponent = React.FC<{ children: React.ReactNode }> & {
  Background: typeof TimelineBackground;
  Progress: typeof TimelineProgress;
  SeekButton: typeof TimelineSeekButton;
  DragButton: typeof TimelineDragButton;
};

const Timeline = TimelineContainer as TimelineComponent;

Timeline.Background = TimelineBackground;
Timeline.Progress = TimelineProgress;
Timeline.SeekButton = TimelineSeekButton;
Timeline.DragButton = TimelineDragButton;

export default Timeline;
