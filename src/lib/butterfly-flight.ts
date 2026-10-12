export type FlightPhase = "waiting" | "arrival" | "idle";
export const ARRIVAL_MS = 3000;
export const REST_START = 185;
export const REST_END = 195;

export function idleFrame(elapsed: number) {
  const progress = (elapsed % 3600) / 1800;
  return Math.round(REST_START + (REST_END - REST_START) * (progress <= 1 ? progress : 2 - progress));
}

/** Leaving view settles arrival once; a waiting book stays waiting until first seen. */
export function phaseForVisibility(phase: FlightPhase, visible: boolean): FlightPhase {
  return phase === "arrival" && !visible ? "idle" : phase;
}

export function phaseAfterElapsed(phase: FlightPhase, elapsed: number): FlightPhase {
  return phase === "arrival" && elapsed >= ARRIVAL_MS ? "idle" : phase;
}

export function shouldAnimate(phase: FlightPhase, visible: boolean, hidden: boolean, paused: boolean, still: boolean) {
  return phase !== "waiting" && visible && !hidden && !paused && !still;
}
