import { AudioElement } from "./AudioElement";
import { PlayButton } from "./PlayButton";
import { TimeLine } from "./TimeLine";

export function LoopPlayer() {
  return (
    <main className="flex flex-col items-center h-screen max-w-[960px] mx-auto">
      <h1>Loop Player</h1>
      <TimeLine />
      <PlayButton />
      <AudioElement />
    </main>
  );
}
