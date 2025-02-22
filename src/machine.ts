import { assign, fromCallback, setup, SnapshotFrom } from "xstate";
import { TogglePlayEvent } from "./PlayButton";
import { LoadedEvent } from "./AudioElement";
import { SeekEvent, TimelineLoadedEvent } from "./TimeLine";

export const loopPlayerMachine = setup({
  types: {
    context: {} as Context,
    events: {} as Event,
  },
  actions: {
    assignRef: assign({
      ref: ({ event }) => {
        if (event.type !== "LOADED") {
          return null;
        }
        return event.ref;
      },
    }),
    togglePlay: ({ context }) => {
      if (!context.ref) {
        return;
      }
      if (context.ref.paused) {
        context.ref.play();
        return;
      }
      context.ref.pause();
    },
    updateCurrentTime: assign({
      currentTime: ({ context }) => {
        return context.ref?.currentTime ?? 0;
      },
    }),
    setTimeline: assign({
      timelineLeft: ({ event, context }) => {
        if (event.type !== "TIMELINE_LOADED") {
          return context.timelineLeft;
        }
        return event.timelineLeft;
      },
      timelineWidth: ({ event, context }) => {
        if (event.type !== "TIMELINE_LOADED") {
          return context.timelineWidth;
        }
        return event.timelineWidth;
      },
    }),
    seek: ({ context, event }) => {
      if (event.type !== "SEEK") {
        return context.currentTime;
      }
      if (!context.ref) {
        return;
      }
      context.ref.currentTime = event.time;
    },
  },
  actors: {
    updateCurrentTime: fromCallback(({ sendBack }) => {
      let frame: number;
      const update = () => {
        sendBack({ type: "UPDATE_CURRENT_TIME" });
        frame = requestAnimationFrame(update);
      };
      frame = requestAnimationFrame(update);
      return () => cancelAnimationFrame(frame);
    }),
  },
}).createMachine({
  id: "loopPlayer",
  initial: "loading",
  context: {
    audioFile: "The-Race.mp3",
    ref: null,
    currentTime: 0,
    timelineLeft: 0,
    timelineWidth: 0,
  },
  states: {
    loading: {
      on: {
        LOADED: {
          target: "paused",
          actions: "assignRef",
        },
        TIMELINE_LOADED: {
          actions: "setTimeline",
        },
      },
    },
    paused: {
      on: {
        TOGGLE_PLAY: {
          target: "playing",
          actions: "togglePlay",
        },
        SEEK: {
          actions: ["seek", "updateCurrentTime"],
        },
      },
    },
    playing: {
      on: {
        TOGGLE_PLAY: {
          target: "paused",
          actions: "togglePlay",
        },
        UPDATE_CURRENT_TIME: {
          actions: "updateCurrentTime",
        },
        SEEK: {
          actions: "seek",
        },
      },
      invoke: {
        src: "updateCurrentTime",
        id: "updateCurrentTime",
      },
    },
  },
});

type Context = {
  audioFile: string;
  ref: HTMLAudioElement | null;
  currentTime: number;
  timelineLeft: number;
  timelineWidth: number;
};

export type Event =
  | LoadedEvent
  | TogglePlayEvent
  | TimelineLoadedEvent
  | UpdateCurrentTimeEvent
  | SeekEvent;

type UpdateCurrentTimeEvent = {
  type: "UPDATE_CURRENT_TIME";
  currentTime: number;
};

export type Snapshot = SnapshotFrom<typeof loopPlayerMachine>;
