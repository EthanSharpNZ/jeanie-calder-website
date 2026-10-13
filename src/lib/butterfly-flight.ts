export type FlightPhase = "waiting" | "arrival" | "idle";
export const ARRIVAL_MS = 3000;
export const REST_START = 185;
export const REST_END = 195;

// Play the supplied resting poses at a livelier cadence, with subtle variation
// between strokes. Each cycle returns to the landing pose without a jump.
const REST_CYCLES_MS = [900, 1100, 800, 1200];
const REST_SEQUENCE_MS = REST_CYCLES_MS.reduce((total, duration) => total + duration, 0);

export function idleFrame(elapsed: number) {
  let time = elapsed % REST_SEQUENCE_MS;
  for (const duration of REST_CYCLES_MS) {
    if (time < duration) {
      const progress = time / (duration / 2);
      return Math.round(REST_START + (REST_END - REST_START) * (progress <= 1 ? progress : 2 - progress));
    }
    time -= duration;
  }
  return REST_START;
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
