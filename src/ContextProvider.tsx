import { createActorContext } from "@xstate/react";
import { loopPlayerMachine } from "./machine";

export const LoopPlayerContext = createActorContext(loopPlayerMachine);

export function Provider({ children }: { children: React.ReactNode }) {
  return <LoopPlayerContext.Provider>{children}</LoopPlayerContext.Provider>;
}
