import { supabase } from "@/lib/supabase";

const visitorKey = "ismail-academy-visitor-v1";

function getVisitorId() {
  if (typeof window === "undefined") return "";
  const existing = window.localStorage.getItem(visitorKey);
  if (existing) return existing;
  const value = typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
  window.localStorage.setItem(visitorKey, value);
  return value;
}

export async function trackSiteEvent(eventName: string, path = window.location.pathname) {
  if (!supabase || typeof window === "undefined") return;
  await supabase.rpc("track_site_event", { p_event_name: eventName, p_path: path, p_visitor_id: getVisitorId(), p_metadata: { referrer: document.referrer.slice(0, 240) } });
}

