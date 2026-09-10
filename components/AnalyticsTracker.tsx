"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { trackSiteEvent } from "@/lib/analytics";

export default function AnalyticsTracker() {
  const pathname = usePathname();
  useEffect(() => { void trackSiteEvent("page_view", pathname || "/"); }, [pathname]);
  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      const target = event.target instanceof Element ? event.target.closest("a") : null;
      if (!(target instanceof HTMLAnchorElement)) return;
      if (target.hasAttribute("download") || /\.pdf(?:$|\?)/i.test(target.href)) void trackSiteEvent("download");
    };
    const onPlay = (event: Event) => { if (event.target instanceof HTMLMediaElement) void trackSiteEvent("media_play"); };
    document.addEventListener("click", onClick);
    document.addEventListener("play", onPlay, true);
    return () => { document.removeEventListener("click", onClick); document.removeEventListener("play", onPlay, true); };
  }, []);
  return null;
}

