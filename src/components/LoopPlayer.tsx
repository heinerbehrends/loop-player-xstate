import { AudioElement } from "./AudioElement";
import { Debug } from "./Debug";
import { PlayButton } from "./PlayButton";
import Timeline from "./timeline/TimeLine";

export function LoopPlayer() {
  return (
    <main className="flex flex-col gap-4 pt-6 items-center h-screen max-w-[960px] mx-auto">
      <h1 className="text-3xl font-light">Loop Player</h1>
      <Timeline>
        <Timeline.SeekButton>
          <Timeline.Background />
          <Timeline.Progress />
        </Timeline.SeekButton>
        <Timeline.DragButton />
      </Timeline>
      <PlayButton />
      <AudioElement />
      <Debug />
    </main>
  );
}
