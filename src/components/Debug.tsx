import { LoopPlayerContext } from "./ContextProvider";
import { Snapshot } from "../machine";

const { useSelector } = LoopPlayerContext;

function getStateAndContext(snapshot: Snapshot) {
  return {
    state: snapshot.value,
    context: snapshot.context,
  };
}

export function Debug() {
  const { state, context } = useSelector(getStateAndContext);
  return (
    <div>
      <pre>
        {JSON.stringify(
          {
            audioFile: context.audioFile,
            timelineLeft: context.timelineLeft,
            timelineWidth: context.timelineWidth,
            dragXOffset: context.dragXOffset,
            track: state.track,
            dragTime: state.dragTime,
          },
          null,
          2
        )}
      </pre>
    </div>
  );
}
