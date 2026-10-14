import { describe, expect, it } from "vitest";
import {
  ARRIVAL_MS,
  idleFrame,
  phaseAfterElapsed,
  phaseForVisibility,
  shouldAnimate,
} from "@/lib/butterfly-flight";

describe("supplied butterfly flight", () => {
  it("completes one three-second arrival and stays idle indefinitely", () => {
    expect(ARRIVAL_MS).toBe(3000);
    expect(phaseAfterElapsed("arrival", 2999)).toBe("arrival");
    expect(phaseAfterElapsed("arrival", 3000)).toBe("idle");
    expect(phaseAfterElapsed("idle", 100000)).toBe("idle");
  });
  it("preserves the perched phase through repeated down/up visibility cycles", () => {
    let phase = phaseAfterElapsed("arrival", 3000);
    for (let cycle = 0; cycle < 3; cycle++) {
      phase = phaseForVisibility(phase, false);
      expect(phase).toBe("idle");
      phase = phaseForVisibility(phase, true);
      expect(phase).toBe("idle");
    }
  });
  it("settles an interrupted arrival offscreen and waits on a direct section visit", () => {
    expect(phaseForVisibility("arrival", false)).toBe("idle");
    expect(phaseForVisibility("idle", true)).toBe("idle");
    expect(phaseForVisibility("waiting", false)).toBe("waiting");
  });
  it("suspends idle offscreen, hidden or footer-paused without changing phase", () => {
    expect(shouldAnimate("idle", true, false, false, false)).toBe(true);
    expect(shouldAnimate("idle", false, false, false, false)).toBe(false);
    expect(shouldAnimate("idle", true, true, false, false)).toBe(false);
    expect(shouldAnimate("idle", true, false, true, false)).toBe(false);
    expect(phaseForVisibility("idle", true)).toBe("idle");
  });
  it("never starts a drawing loop for reduced-motion or waiting media", () => {
    expect(shouldAnimate("idle", true, false, false, true)).toBe(false);
    expect(shouldAnimate("waiting", true, false, false, false)).toBe(false);
  });
  it("keeps lively resting strokes continuous, bounded and anchored at cycle boundaries", () => {
    expect(idleFrame(0)).toBe(185);
    expect(idleFrame(450)).toBe(195);
    for (const boundary of [900, 2000, 2800, 4000]) {
      expect(idleFrame(boundary)).toBe(185);
      expect(Math.abs(idleFrame(boundary - 1) - idleFrame(boundary + 1))).toBeLessThanOrEqual(1);
    }
    for (let time = 0; time < 8000; time += 1000 / 30) {
      expect(idleFrame(time)).toBeGreaterThanOrEqual(185);
      expect(idleFrame(time)).toBeLessThanOrEqual(195);
      expect(Math.abs(idleFrame(time + 1000 / 30) - idleFrame(time))).toBeLessThanOrEqual(1);
    }
  });
});
