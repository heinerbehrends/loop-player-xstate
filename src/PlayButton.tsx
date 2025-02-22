import { Snapshot } from "./machine";
import { LoopPlayerContext } from "./ContextProvider";

const { useActorRef, useSelector } = LoopPlayerContext;

const ariaLabel = {
  playing: "Pause audio",
  paused: "Play audio",
  loading: "Loading audio",
};

export function PlayButton() {
  const { send } = useActorRef();
  const state = useSelector(getState);
  const isPlaying = state === "playing";

  return (
    <button
      onClick={() => send({ type: "TOGGLE_PLAY" })}
      disabled={state === "loading"}
      aria-pressed={isPlaying}
      aria-label={ariaLabel[state]}
      className="rounded-full bg-white p-2 h-16 w-16 border-2 border-gray-300 aspect-square"
    >
      {state === "playing" ? "Pause" : "Play"}
    </button>
  );
}

function getState(snapshot: Snapshot) {
  return snapshot.value.track;
}
