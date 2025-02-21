import { useRef } from "react";
import { LoopPlayerContext } from "./ContextProvider";
import { loopPlayerMachine } from "./machine";
import { SnapshotFrom } from "xstate";

const { useSelector, useActorRef } = LoopPlayerContext; 
export type Snapshot = SnapshotFrom<typeof loopPlayerMachine>;
  
function getAudioFile(snapshot: Snapshot) {
  return snapshot.context.audioFile;
}

export function AudioElement() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const { send } = useActorRef();
  const audioFile = useSelector(getAudioFile);

  return (
    <audio
      aria-label="loop player"
      ref={audioRef}
      onCanPlay={() => send({ type: "LOADED", ref: audioRef.current })}
      src={audioFile}
    />
  );

}
