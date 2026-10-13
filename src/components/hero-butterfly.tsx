import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { ARRIVAL_MS, REST_START, idleFrame, phaseAfterElapsed, phaseForVisibility, shouldAnimate, type FlightPhase } from "@/lib/butterfly-flight";
import sequence from "@/assets/butterfly-sequence/manifest.json";
import atlas0Url from "@/assets/butterfly-sequence/butterfly-atlas-0.webp";
const atlas0 = { url: atlas0Url };
import atlas1Url from "@/assets/butterfly-sequence/butterfly-atlas-1.webp";
const atlas1 = { url: atlas1Url };
import atlas2Url from "@/assets/butterfly-sequence/butterfly-atlas-2.webp";
const atlas2 = { url: atlas2Url };
import atlas3Url from "@/assets/butterfly-sequence/butterfly-atlas-3.webp";
const atlas3 = { url: atlas3Url };
import atlas4Url from "@/assets/butterfly-sequence/butterfly-atlas-4.webp";
const atlas4 = { url: atlas4Url };
import atlas5Url from "@/assets/butterfly-sequence/butterfly-atlas-5.webp";
const atlas5 = { url: atlas5Url };
import posterAssetUrl from "@/assets/butterfly-sequence/butterfly-poster.webp";
const posterAsset = { url: posterAssetUrl };

const atlasAssets = [atlas0, atlas1, atlas2, atlas3, atlas4, atlas5];
const FOOT = { x: 638, y: 371 };

function decodeImage(url: string, signal: AbortSignal) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image();
    const finish = () => { clearTimeout(timeout); signal.removeEventListener("abort", abort); image.onload = null; image.onerror = null; };
    const abort = () => { finish(); image.src = ""; reject(new Error("Media cancelled")); };
    const timeout = window.setTimeout(() => { finish(); reject(new Error("Media unavailable")); }, 12000);
    signal.addEventListener("abort", abort, { once: true });
    image.onload = () => {
      image.decode().then(() => { finish(); resolve(image); }, () => { finish(); reject(new Error("Media unavailable")); });
    };
    image.onerror = () => { finish(); reject(new Error("Media unavailable")); };
    image.src = url;
  });
}

/** Client-supplied video frames, not the CC-licensed Wikimedia fee image. */
export function HeroButterfly({ paused = false }: { paused?: boolean }) {
  const anchorRef = useRef<HTMLSpanElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pausedRef = useRef(paused);
  const refreshRef = useRef<(() => void) | undefined>(undefined);
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);
  useEffect(() => { pausedRef.current = paused; refreshRef.current?.(); }, [paused]);

  useEffect(() => {
    if (!mounted) return;
    const anchor = anchorRef.current;
    const canvas = canvasRef.current;
    const book = anchor?.closest<HTMLElement>(".book-object");
    const cover = book?.querySelector<HTMLImageElement>(".book-cover");
    const context = canvas?.getContext("2d");
    if (!anchor || !canvas || !book || !cover || !context) return;

    const abortController = new AbortController();
    let disposed = false;
    let readyToPlay = false;
    let raf = 0;
    let readinessTimer = 0;
    let phase: FlightPhase = "waiting";
    let elapsed = 0;
    let previous = 0;
    let lastDraw = 0;
    let atlases: HTMLImageElement[] = [];
    let atlasLoad: Promise<void> | undefined;
    let poster: HTMLImageElement | undefined;
    let currentFrame = REST_START;
    let viewportWidth = window.innerWidth;
    let viewportHeight = window.innerHeight;
    let failed = false;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const connection = (navigator as Navigator & { connection?: { saveData?: boolean; addEventListener?: (event: string, handler: () => void) => void; removeEventListener?: (event: string, handler: () => void) => void } }).connection;
    let still = reduced.matches || Boolean(connection?.saveData);

    function visible() {
      const rect = cover?.getBoundingClientRect();
      // Hide with the book, even when a sliver of its bottom remains visible.
      const perch = anchor?.getBoundingClientRect();
      return Boolean(rect && perch && rect.bottom > 0 && rect.top < viewportHeight && perch.y > -50 && perch.y < viewportHeight + 50);
    }
    function point() {
      const rect = anchor?.getBoundingClientRect();
      const width = book?.getBoundingClientRect().width ?? 0;
      return { x: rect?.x ?? 0, y: rect?.y ?? 0, scale: width * 0.22 / 123 };
    }
    function clear() { context?.clearRect(0, 0, viewportWidth, viewportHeight); }
    function setPhase(next: FlightPhase) {
      if (phase === next) return;
      phase = next;
      elapsed = 0;
      canvas?.setAttribute("data-phase", next);
    }
    function draw(frameIndex: number, at: ReturnType<typeof point>, usePoster = false) {
      if (!context) return;
      clear();
      if (usePoster && poster) {
        const [x, y, right, bottom] = sequence.posterBounds;
        if (x === undefined || y === undefined || right === undefined || bottom === undefined) return;
        context.drawImage(poster, at.x + (x - FOOT.x) * at.scale, at.y + (y - FOOT.y) * at.scale, (right - x) * at.scale, (bottom - y) * at.scale);
      } else {
        const frame = sequence.frames[frameIndex];
        const image = frame && atlases[frame.atlas];
        if (!frame || !image || !frame.w || !frame.h) return;
        context.drawImage(image, frame.sx, frame.sy, frame.w, frame.h, at.x + (frame.x - FOOT.x) * at.scale, at.y + (frame.y - FOOT.y) * at.scale, frame.w * at.scale, frame.h * at.scale);
      }
      canvas?.setAttribute("data-frame", String(frameIndex));
      canvas?.setAttribute("data-anchor", `${at.x.toFixed(2)},${at.y.toFixed(2)}`);
    }
    function cancel() {
      cancelAnimationFrame(raf);
      raf = 0;
      previous = 0;
      canvas?.setAttribute("data-running", "false");
    }
    function refresh() {
      cancel();
      if (!readyToPlay || disposed) return;
      const inView = visible();
      const next = phaseForVisibility(phase, inView);
      if (next !== phase) { setPhase(next); currentFrame = REST_START; }
      if (!inView || document.hidden) { clear(); return; }
      if (phase === "waiting") setPhase(still || pausedRef.current ? "idle" : "arrival");
      if (still) { setPhase("idle"); draw(REST_START, point(), true); }
      else if (phase === "idle") draw(currentFrame, point());
      if (shouldAnimate(phase, inView, document.hidden, pausedRef.current, still)) {
        canvas?.setAttribute("data-running", "true");
        raf = requestAnimationFrame(tick);
      }
    }
    function resize() {
      if (!canvas || !context) return;
      viewportWidth = window.innerWidth;
      viewportHeight = window.innerHeight;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(viewportWidth * dpr);
      canvas.height = Math.round(viewportHeight * dpr);
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
      refresh();
    }
    function tick(now: number) {
      raf = 0;
      if (disposed) return;
      if (!shouldAnimate(phase, visible(), document.hidden, pausedRef.current, still)) { refresh(); return; }
      const delta = previous ? Math.min(now - previous, 60) : 0;
      previous = now;
      elapsed += delta;
      if (now - lastDraw >= 1000 / 30) {
        lastDraw = now;
        if (phase === "arrival") {
          const p = Math.min(elapsed / ARRIVAL_MS, 1);
          currentFrame = Math.round(12 + p * (REST_START - 12));
          const at = point();
          const approach = (1 - p) ** 3;
          at.x -= (at.x + 120) * approach;
          at.y -= 100 * approach;
          draw(currentFrame, at);
          if (phaseAfterElapsed(phase, elapsed) === "idle") { setPhase("idle"); currentFrame = REST_START; }
        } else if (phase === "idle") {
          currentFrame = idleFrame(elapsed);
          draw(currentFrame, point());
        }
      }
      raf = requestAnimationFrame(tick);
    }
    function loadAtlases() {
      atlasLoad ??= Promise.all(atlasAssets.map(asset => decodeImage(asset.url, abortController.signal)))
        .then(images => { atlases = images; })
        .catch(() => { failed = true; still = true; });
      return atlasLoad;
    }
    async function motionChanged() {
      still = failed || reduced.matches || Boolean(connection?.saveData);
      if (!still && !atlases.length) {
        cancel();
        await loadAtlases();
      }
      refresh();
    }
    refreshRef.current = refresh;
    resize();
    const observer = new ResizeObserver(resize);
    observer.observe(book);
    const intersection = new IntersectionObserver(refresh);
    intersection.observe(book);
    window.addEventListener("resize", resize);
    window.addEventListener("scroll", refresh, { passive: true });
    document.addEventListener("visibilitychange", refresh);
    reduced.addEventListener("change", motionChanged);
    connection?.addEventListener?.("change", motionChanged);
    let resolveCover: (() => void) | undefined;
    const coverLoaded = () => resolveCover?.();
    const coverReady = cover.complete && cover.naturalWidth ? Promise.resolve() : new Promise<void>(resolve => { resolveCover = resolve; cover.addEventListener("load", coverLoaded, { once: true }); cover.addEventListener("error", coverLoaded, { once: true }); });
    async function ready() {
      await coverReady;
      if (disposed) return;
      try { poster = await decodeImage(posterAsset.url, abortController.signal); } catch { /* Quiet empty fallback. */ }
      if (disposed) return;
      // Reduced-motion and save-data visitors need only the 5 KB poster.
      if (!still) await loadAtlases();
      if (disposed) return;
      await new Promise(resolve => { readinessTimer = window.setTimeout(resolve, 150); });
      if (disposed || !cover?.naturalWidth) return;
      readyToPlay = true;
      refresh();
    }
    void ready();
    return () => {
      disposed = true;
      refreshRef.current = undefined;
      abortController.abort();
      clearTimeout(readinessTimer);
      cover.removeEventListener("load", coverLoaded);
      cover.removeEventListener("error", coverLoaded);
      resolveCover?.();
      cancel();
      observer.disconnect();
      intersection.disconnect();
      window.removeEventListener("resize", resize);
      window.removeEventListener("scroll", refresh);
      document.removeEventListener("visibilitychange", refresh);
      reduced.removeEventListener("change", motionChanged);
      connection?.removeEventListener?.("change", motionChanged);
    };
  }, [mounted]);

  return <>
    <span ref={anchorRef} className="hero-butterfly-anchor" aria-hidden="true" />
    {mounted && createPortal(<canvas ref={canvasRef} className="hero-butterfly-canvas" aria-hidden="true" data-phase="waiting" data-running="false" />, document.body)}
  </>;
}
