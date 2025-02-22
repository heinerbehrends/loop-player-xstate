import { useRef } from "react";
import { LoopPlayerContext } from "./ContextProvider";
import { Snapshot } from "./machine";

const { useSelector, useActorRef } = LoopPlayerContext;

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
    >
      <track kind="captions">
        {/* TODO: add captions with metadata from the audio file */}
      </track>
    </audio>
  );
}

function getAudioFile(snapshot: Snapshot) {
  return snapshot.context.audioFile;
}

