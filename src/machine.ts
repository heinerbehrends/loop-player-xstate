import { assign, setup } from "xstate";

type Context = {
  audioFile: string;
  ref: HTMLAudioElement | null;
};

type Event = {
  type: "LOADED";
  ref: HTMLAudioElement | null;
} | {
  type: "TOGGLE_PLAY";
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
  },
}).createMachine({
  id: "loopPlayer",
  initial: "loading",
  context: {
    audioFile: "The-Race.mp3",
    ref: null,
  },
  states: {
    loading: {
      on: {
        LOADED: {
          target: "paused",
          actions: "assignRef",
        },
      },
    },
    paused: {
      on: {
        TOGGLE_PLAY: {
          target: "playing",
          actions: "togglePlay",
        }
      },
    },
    playing: {
      on: {
        TOGGLE_PLAY: {
          target: "paused",
          actions: "togglePlay",
        }
      },
    },
  },
});