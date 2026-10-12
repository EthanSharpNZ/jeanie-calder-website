import "@testing-library/jest-dom/vitest";

// jsdom has no drawing surface; real canvas playback is verified in Chromium.
Object.defineProperty(HTMLCanvasElement.prototype, "getContext", { writable: true, value: () => null });

Object.defineProperty(window, "scrollTo", {
  writable: true,
  value: () => {},
});

Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => {},
  }),
});
