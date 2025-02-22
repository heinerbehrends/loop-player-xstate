import { Event } from "./machine";

type HandleKeyDownProps = {
  event: React.KeyboardEvent<HTMLButtonElement>;
  currentTime: number;
  duration: number;
  send: (event: Event) => void;
};

export function handleTimelineKeys({
  event,
  currentTime,
  duration,
  send,
}: HandleKeyDownProps) {
  const keyToTimeMap = {
    "0": 0,
    "1": duration * 0.1,
    "2": duration * 0.2,
    "3": duration * 0.3,
    "4": duration * 0.4,
    "5": duration * 0.5,
    "6": duration * 0.6,
    "7": duration * 0.7,
    "8": duration * 0.8,
    "9": duration * 0.9,
  };
  if (event.key in keyToTimeMap) {
    const time = keyToTimeMap[event.key as keyof typeof keyToTimeMap];
    send({
      type: "SEEK",
      time,
    });
  }
  if (event.key === "ArrowLeft") {
    const time = event.shiftKey
      ? Math.max(0, currentTime - 2)
      : Math.max(0, currentTime - 10);
    send({
      type: "SEEK",
      time,
    });
  }
  if (event.key === "ArrowRight") {
    const time = event.shiftKey
      ? Math.min(duration, currentTime + 2)
      : Math.min(duration, currentTime + 10);
    send({
      type: "SEEK",
      time,
    });
  }
  if (["Enter", " "].includes(event.key)) {
    send({
      type: "TOGGLE_PLAY",
    });
  }
}
