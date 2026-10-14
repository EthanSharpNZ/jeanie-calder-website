import { useEffect, useRef, useState, type ComponentType } from "react";

// Keep the optional animation and its frame manifest off the initial JS path.
export function DeferredButterfly({ paused }: { paused: boolean }) {
  const host = useRef<HTMLSpanElement>(null);
  const [Animation, setAnimation] = useState<ComponentType<{ paused: boolean }> | null>(null);
  useEffect(() => {
    const cover = host.current?.parentElement?.querySelector<HTMLImageElement>(".book-cover");
    let cancelled = false;
    let idle: number | undefined;
    let timer: number | undefined;
    const load = () => {
      void import("./hero-butterfly")
        .then((module) => {
          if (!cancelled) setAnimation(() => module.HeroButterfly);
        })
        .catch(() => {
          /* Decorative animation must never block the page. */
        });
    };
    const schedule = () => {
      // Give the cover and above-the-fold text time to paint before decorative media.
      timer = window.setTimeout(() => {
        if (typeof window.requestIdleCallback === "function")
          idle = window.requestIdleCallback(load, { timeout: 1200 });
        else load();
      }, 600);
    };
    if (cover?.complete) schedule();
    else cover?.addEventListener("load", schedule, { once: true });
    return () => {
      cancelled = true;
      cover?.removeEventListener("load", schedule);
      if (idle !== undefined) window.cancelIdleCallback(idle);
      if (timer !== undefined) window.clearTimeout(timer);
    };
  }, []);
  return (
    <span ref={host} aria-hidden="true">
      {Animation && <Animation paused={paused} />}
    </span>
  );
}
