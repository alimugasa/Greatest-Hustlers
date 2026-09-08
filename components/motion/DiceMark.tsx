"use client";

import { useEffect, useRef, useSyncExternalStore } from "react";
import styles from "./DiceMark.module.css";

/** Pointer tilt, in degrees, at the far edge of the viewport. */
const TILT_Y = 6.5;
const TILT_X = 5;
/** Parallax shift, as a fraction of the mark's own width. */
const SHIFT_X = 0.011;
const SHIFT_Y = 0.008;
/** Idle drift, as a fraction of the mark's own width. */
const DRIFT_X = 0.02;
const DRIFT_Y = 0.028;
const DRIFT_ROTATION = 0.34;
/** Compression on press. */
const PRESS_SCALE = 0.015;
/** How long the idle drift and pointer response take to reach full amplitude. */
const RAMP_MS = 1900;

const REDUCED_MOTION = "(prefers-reduced-motion: reduce)";

const subscribeToMotionPreference = (onChange: () => void) => {
  const query = window.matchMedia(REDUCED_MOTION);
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
};

const clamp = (value: number, min: number, max: number) =>
  value < min ? min : value > max ? max : value;

const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

/**
 * The mark is the whole experience, so it is treated as an object with mass:
 * a slow non-repeating drift, a weighted tilt toward the cursor that settles
 * back on its own, and a physical compression when pressed.
 *
 * Everything is composited — two transform writes per frame, no layout, no
 * library. Under prefers-reduced-motion nothing moves and no listener binds.
 */
export function DiceMark() {
  const driftRef = useRef<HTMLDivElement>(null);
  const tiltRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useSyncExternalStore(
    subscribeToMotionPreference,
    () => window.matchMedia(REDUCED_MOTION).matches,
    () => false,
  );

  useEffect(() => {
    const drift = driftRef.current;
    const tilt = tiltRef.current;
    if (!drift || !tilt || reducedMotion) return;

    // Pointer target, normalised to -1..1 across the viewport.
    let targetX = 0;
    let targetY = 0;
    // Smoothed position and its velocity — the weight in the interaction.
    let currentX = 0;
    let currentY = 0;
    let velocityX = 0;
    let velocityY = 0;
    // Press spring. Overshoots very slightly on release, which reads as a bounce.
    let pressTarget = 0;
    let press = 0;
    let pressVelocity = 0;

    let width = tilt.offsetWidth || 1;
    let elapsed = 0;
    let last = performance.now();
    let frame = 0;

    const measure = () => {
      width = tilt.offsetWidth || width;
    };

    const onPointerMove = (event: PointerEvent) => {
      if (event.pointerType === "touch") return;
      const halfWidth = window.innerWidth / 2;
      const halfHeight = window.innerHeight / 2;
      targetX = clamp((event.clientX - halfWidth) / halfWidth, -1, 1);
      targetY = clamp((event.clientY - halfHeight) / halfHeight, -1, 1);
    };

    // Cursor gone: settle back to rest rather than holding the last tilt.
    const onPointerOut = (event: PointerEvent) => {
      if (event.relatedTarget === null) {
        targetX = 0;
        targetY = 0;
      }
    };

    // Available on most Android browsers without a permission gate. iOS needs an
    // explicit grant, which this deliberately never asks for — the drift alone
    // carries the mobile experience.
    const onOrientation = (event: DeviceOrientationEvent) => {
      if (event.gamma === null || event.beta === null) return;
      targetX = clamp(event.gamma / 26, -1, 1) * 0.55;
      targetY = clamp((event.beta - 42) / 26, -1, 1) * 0.55;
    };

    const onPointerDown = (event: PointerEvent) => {
      pressTarget = 1;
      // Tip fractionally toward the point of contact.
      const bounds = tilt.getBoundingClientRect();
      const localX = (event.clientX - (bounds.left + bounds.width / 2)) / (bounds.width / 2);
      const localY = (event.clientY - (bounds.top + bounds.height / 2)) / (bounds.height / 2);
      velocityX += clamp(localX, -1, 1) * 0.05;
      velocityY += clamp(localY, -1, 1) * 0.05;
    };

    const onPointerUp = () => {
      pressTarget = 0;
    };

    const step = (now: number) => {
      const delta = Math.min(now - last, 64);
      last = now;
      // Springs are tuned at 60fps and normalised, so 120Hz feels identical.
      const k = delta / 16.6667;
      elapsed += delta;

      const ramp = easeOutCubic(Math.min(1, elapsed / RAMP_MS));

      velocityX = (velocityX + (targetX - currentX) * 0.03 * k) * Math.pow(0.86, k);
      velocityY = (velocityY + (targetY - currentY) * 0.03 * k) * Math.pow(0.86, k);
      currentX += velocityX * k;
      currentY += velocityY * k;

      pressVelocity = (pressVelocity + (pressTarget - press) * 0.16 * k) * Math.pow(0.74, k);
      press += pressVelocity * k;

      // Sums of sines on non-harmonic periods (roughly 27s, 15s, 33s, 20s), so
      // the path never visibly repeats.
      const driftX =
        width *
        DRIFT_X *
        ramp *
        (0.62 * Math.sin(elapsed * 0.00023) + 0.38 * Math.sin(elapsed * 0.00041 + 1.3));
      const driftY =
        width *
        DRIFT_Y *
        ramp *
        (0.58 * Math.sin(elapsed * 0.00019 + 0.7) + 0.42 * Math.sin(elapsed * 0.00031 + 2.2));
      const driftRotation =
        DRIFT_ROTATION *
        ramp *
        (0.66 * Math.sin(elapsed * 0.00013 + 0.4) + 0.34 * Math.sin(elapsed * 0.00027 + 1.9));

      drift.style.transform = `translate3d(${driftX.toFixed(2)}px, ${driftY.toFixed(
        2,
      )}px, 0) rotate(${driftRotation.toFixed(3)}deg)`;

      const shiftX = -currentX * width * SHIFT_X * ramp;
      const shiftY = -currentY * width * SHIFT_Y * ramp;
      const rotateY = currentX * TILT_Y * ramp;
      const rotateX = -currentY * TILT_X * ramp;
      const scale = 1 - PRESS_SCALE * press;

      tilt.style.transform =
        `perspective(1400px) translate3d(${shiftX.toFixed(2)}px, ${shiftY.toFixed(2)}px, 0)` +
        ` rotateX(${rotateX.toFixed(3)}deg) rotateY(${rotateY.toFixed(3)}deg)` +
        ` scale(${scale.toFixed(4)})`;

      frame = requestAnimationFrame(step);
    };

    const start = () => {
      if (frame) return;
      last = performance.now();
      frame = requestAnimationFrame(step);
    };

    const stop = () => {
      if (!frame) return;
      cancelAnimationFrame(frame);
      frame = 0;
    };

    // Nothing burns frames in a background tab.
    const onVisibility = () => (document.hidden ? stop() : start());

    const fine = window.matchMedia("(pointer: fine)");
    if (fine.matches) {
      window.addEventListener("pointermove", onPointerMove, { passive: true });
      document.addEventListener("pointerout", onPointerOut, { passive: true });
    } else {
      window.addEventListener("deviceorientation", onOrientation, { passive: true });
    }
    tilt.addEventListener("pointerdown", onPointerDown, { passive: true });
    window.addEventListener("pointerup", onPointerUp, { passive: true });
    window.addEventListener("pointercancel", onPointerUp, { passive: true });
    window.addEventListener("resize", measure, { passive: true });
    document.addEventListener("visibilitychange", onVisibility);

    start();

    return () => {
      stop();
      window.removeEventListener("pointermove", onPointerMove);
      document.removeEventListener("pointerout", onPointerOut);
      window.removeEventListener("deviceorientation", onOrientation);
      tilt.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("pointerup", onPointerUp);
      window.removeEventListener("pointercancel", onPointerUp);
      window.removeEventListener("resize", measure);
      document.removeEventListener("visibilitychange", onVisibility);
      drift.style.transform = "";
      tilt.style.transform = "";
    };
  }, [reducedMotion]);

  return (
    <div className={styles.stage}>
      <div className={styles.emerge}>
        <div className={styles.drift} ref={driftRef}>
          <div className={styles.tilt} ref={tiltRef}>
            <picture>
              <source
                type="image/webp"
                srcSet="/brand/gh-dice-700.webp 700w, /brand/gh-dice-1040.webp 1040w, /brand/gh-dice-1560.webp 1560w"
                sizes="(min-width: 1024px) min(34vw, 54vh, 780px), (min-width: 640px) min(52vw, 48vh), min(62vw, 52vh)"
              />
              {/* Deliberately not next/image: a single art-directed mark with a
                  known srcSet needs no optimiser round-trip or runtime. */}
              <img
                className={styles.mark}
                src="/brand/gh-dice-1040.png"
                alt="Greatest Hustlers"
                width={1342}
                height={1289}
                fetchPriority="high"
                decoding="async"
                draggable={false}
              />
            </picture>
          </div>
        </div>
      </div>
    </div>
  );
}
