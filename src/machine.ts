import { assign, fromCallback, setup, SnapshotFrom } from "xstate";

export type Context = {
  audioFile: string;
  ref: HTMLAudioElement | null;
  currentTime: number;
  timelineLeft: number;
  timelineWidth: number;
  dragXOffset: number;
};

export type Event =
  | LoadedEvent
  | TogglePlayEvent
  | TimelineLoadedEvent
  | UpdateCurrentTimeEvent
  | SeekEvent
  | DragStartEvent
  | DraggingEvent
  | DragEndEvent;

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
      if (event.type !== "SEEK" && event.type !== "DRAG_END") {
        return;
      }
      if (!context.ref) {
        return;
      }
      context.ref.currentTime = event.time;
    },
    setDragXOffset: assign({
      dragXOffset: ({ event, context }) => {
        console.log("setting dragXOffset", event.type);
        if (event.type !== "DRAG" && event.type !== "DRAG_START") {
          return context.dragXOffset;
        }
        if (event.clientX < 0) {
          return 0;
        }
        if (event.clientX > context.timelineWidth) {
          return context.timelineWidth;
        }
        return event.clientX;
      },
    }),
    resetDragXOffset: assign({
      dragXOffset: 0,
    }),
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
  guards: {
    isTimeline: ({ event }) => {
      if (event.type !== "DRAG_START") {
        return false;
      }
      return event.element === "timeline";
    },
  },
}).createMachine({
  /** @xstate-layout N4IgpgJg5mDOIC5QBsD2qAOAFZBDAnmAE4B0ALkbgMYDWJauEAlgHZQDEAMgPICCAIgFF+AbQAMAXUSgMqWEzJNULaSAAeiACyaAnCQCMmgEwAOAKzb9ANjEB2IwBoQ+REaO2SZ24c36x+gGYjMTEdWwBfcKc0TBwCYnJKWnpURlYOABUASQBZQU4sgDlBAH0eAWFxKSQQWXlFZVUNBCMzMU8jANsdEzCjfVsrKycXBH02joCTOysjHStNMx1NSOj0bDxCUgpqOgxcAFdYSHYM7gBxc85SrE5eAE0q1TqFJRUa5u09Q1MLXxt7CMtEZNCQdCCrBYAoExCYAlZViAYht4tskntDscIOwAMqCQQAaSeNReDXeoGaVmsBmM5immlms00QIQQSsJEs0IZ2kWJiGiORcS2iV2JAwm3SpwuVxud0ekmeclejQ+Wl0NN+lgBjmciDM+j0+p6fICptMRgRUSR6yFCR2yXFBElAFUsPxeBlSgBhZ0AJV9gkKGRK2TyxJkSrJTUQgRMYOsQ3GVlsUxsARZmjEARI-U0ATEC2sOgsYQFNs2dvRYolbFx+KJCpJkbe0ZafhI8J0YgZQRMg1NZhZ+bjVK7tjz81sZkta1iFdIEEoUAyTAAtmASEwIMgwOx+L7eOcSjiMrxfRlw7VmyqKYh89nxppBsXuwMeoPdQhuh5wT3TYs3DsMs51REhF1wZc1w3cCoCgSV90PS9SRbVUEDMCwSEhJ8bBsLN9WGT97GzLpbDENxrDhbsZ2tEDhRgld1zApc4NrBCj0DURGwjeoUNvBBfGzTQTGmcFYVIg0WXHOMSLI0wAm0Ww+UiK0WFQCA4FUQV50VHib3URAAFoQRZIzsx0cyLMsyyAmAlFhXtGgdOVcl9JaHQWSsbMLQNLMTEMEw3B6WzbTRUUGGYNgnKjVC5nZHye3MKjxhZVp2n0HyAnmXQTC+MxgvnEUHUxSAot41zIX0EhemEgsAv+fQMzMIwOzcVoFhBXw+3y0CHOrJ1IqbXSXOaWxbBZNpmpEsx6S6cZMryq0tNA+ioNKvTmmMz9PLi8Z0rhaahOsbq6KXBiNy3Hc1uGxBAUIvycx+cwvlCfpjoSFbGJglioCu1svFBMiwm8cd9D5RSWQC5q+laTrEvhZTwiAA */
  id: "loopPlayer",
  context: {
    audioFile: "The-Race.mp3",
    ref: null,
    currentTime: 0,
    timelineLeft: 0,
    timelineWidth: 0,
    dragXOffset: 0,
  },
  type: "parallel",
  states: {
    track: {
      initial: "loading",
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
    },
    dragTime: {
      initial: "idle",
      states: {
        idle: {
          entry: "resetDragXOffset",
          on: {
            DRAG_START: {
              guard: "isTimeline",
              target: "dragging",
              actions: "setDragXOffset",
            },
          },
        },
        dragging: {
          on: {
            DRAG: {
              actions: "setDragXOffset",
            },
            DRAG_END: {
              target: "idle",
              actions: ["resetDragXOffset", "seek", "updateCurrentTime"],
            },
          },
        },
      },
    },
  },
});

export type LoadedEvent = {
  type: "LOADED";
  ref: HTMLAudioElement | null;
};

type UpdateCurrentTimeEvent = {
  type: "UPDATE_CURRENT_TIME";
  currentTime: number;
};

type TogglePlayEvent = {
  type: "TOGGLE_PLAY";
};

type TimelineLoadedEvent = {
  type: "TIMELINE_LOADED";
  timelineLeft: number;
  timelineWidth: number;
};

type SeekEvent = {
  type: "SEEK";
  time: number;
};

type DragStartEvent = {
  type: "DRAG_START";
  clientX: number;
  element: "timeline";
};

type DraggingEvent = {
  type: "DRAG";
  clientX: number;
};

type DragEndEvent = {
  type: "DRAG_END";
  clientX: number;
  time: number;
};

export type Snapshot = SnapshotFrom<typeof loopPlayerMachine>;
