import { assign, fromCallback, setup } from "xstate";

type Context = {
  audioFile: string;
  ref: HTMLAudioElement | null;
  currentTime: number;
  timelineLeft: number;
  timelineWidth: number;
};

type Event =
  | {
      type: "LOADED";
      ref: HTMLAudioElement | null;
    }
  | {
      type: "TOGGLE_PLAY";
    }
  | {
      type: "TIMELINE_LOADED";
      timelineLeft: number;
      timelineWidth: number;
    };

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
  },
  actors: {
    updateCurrentTime: fromCallback(({ sendBack }) => {
      sendBack({ type: "UPDATE_CURRENT_TIME" });
      const interval = setInterval(() => {
        sendBack({ type: "UPDATE_CURRENT_TIME" });
      }, 50);
      return () => clearInterval(interval);
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
      },
      invoke: {
        src: "updateCurrentTime",
        id: "updateCurrentTime",
      },
    },
  },
});
