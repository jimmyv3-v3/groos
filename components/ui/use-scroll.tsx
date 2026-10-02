"use client";

import { useEffect, useState } from "react";

/**
 * Returns true once the page is scrolled past `threshold` pixels. Used by the
 * header to switch to a frosted, bordered state on scroll.
 */
export function useScroll(threshold = 10) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > threshold);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [threshold]);

  return scrolled;
}
