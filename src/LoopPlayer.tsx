import { AudioElement } from "./AudioElement";
import { PlayButton } from "./PlayButton";
import { TimeLine } from "./TimeLine";
export function LoopPlayer() {
  return (
    <>
      <h1>Loop Player</h1>
      <PlayButton />
      <AudioElement />
      <TimeLine />
    </>
  );
}
