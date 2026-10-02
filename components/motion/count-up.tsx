"use client";

import { useEffect, useRef } from "react";
import {
  animate,
  useInView,
  useMotionValue,
  useReducedMotion,
  useTransform,
  motion,
} from "framer-motion";

/**
 * Counts from 0 up to `value` once the element scrolls into view. Honours
 * reduced-motion by rendering the final value immediately. Formats with an
 * optional prefix/suffix and locale grouping.
 */
export function CountUp({
  value,
  prefix = "",
  suffix = "",
  duration = 1.6,
  className,
}: {
  value: number;
  prefix?: string;
  suffix?: string;
  duration?: number;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const reduce = useReducedMotion();
  const count = useMotionValue(0);
  const rounded = useTransform(count, (latest) =>
    Math.round(latest).toLocaleString("nl-NL"),
  );

  useEffect(() => {
    if (!inView) return;
    if (reduce) {
      count.set(value);
      return;
    }
    const controls = animate(count, value, { duration, ease: [0.22, 1, 0.36, 1] });
    return controls.stop;
  }, [inView, value, duration, reduce, count]);

  return (
    <span ref={ref} className={className}>
      {prefix}
      <motion.span>{rounded}</motion.span>
      {suffix}
    </span>
  );
}
