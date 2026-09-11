"use client";

import { useEffect, useRef, useState } from "react";
import { supabase } from "@/lib/supabase";

type Props = { src: string; contentId: string; kind: "audio" | "video" };
const progressPrefix = "ismail-academy-media:";

async function remoteProgress(contentId: string) {
  if (!supabase) return 0;
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) return 0;
  const { data } = await supabase.from("member_media_progress").select("seconds").eq("user_id", session.user.id).eq("content_id", contentId).maybeSingle();
  return typeof data?.seconds === "number" ? data.seconds : 0;
}

async function saveRemoteProgress(contentId: string, seconds: number, duration: number) {
  if (!supabase) return;
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) return;
  await supabase.from("member_media_progress").upsert({ user_id: session.user.id, content_id: contentId, seconds: Math.round(seconds), duration: Math.round(duration), updated_at: new Date().toISOString() }, { onConflict: "user_id,content_id" });
}

function formatTime(seconds: number) {
  const safe = Math.max(0, Math.round(seconds));
  const minutes = Math.floor(safe / 60);
  const remainder = safe % 60;
  return `${minutes}:${String(remainder).padStart(2, "0")}`;
}

export default function MediaPlayer({ src, contentId, kind }: Props) {
  const ref = useRef<HTMLMediaElement>(null);
  const [resumeSeconds, setResumeSeconds] = useState(0);
  const [resumeReady, setResumeReady] = useState(false);
  useEffect(() => {
    const media = ref.current;
    if (!media) return;
    const localKey = progressPrefix + contentId;
    let remoteSeconds = 0;
    const apply = () => {
      const stored = remoteSeconds || Number(window.localStorage.getItem(localKey) ?? 0);
      setResumeSeconds(stored > 3 ? stored : 0);
      setResumeReady(true);
      if (stored > 3 && media.duration && stored < media.duration - 3) media.currentTime = stored;
    };
    const load = async () => { remoteSeconds = await remoteProgress(contentId); apply(); };
    const save = () => { window.localStorage.setItem(localKey, String(Math.round(media.currentTime))); void saveRemoteProgress(contentId, media.currentTime, media.duration || 0); };
    media.addEventListener("loadedmetadata", apply);
    media.addEventListener("pause", save);
    media.addEventListener("ended", save);
    void load();
    return () => { media.removeEventListener("loadedmetadata", apply); media.removeEventListener("pause", save); media.removeEventListener("ended", save); };
  }, [contentId]);
  function resume() {
    const media = ref.current;
    if (!media || resumeSeconds <= 0) return;
    media.currentTime = resumeSeconds;
    void media.play().catch(() => undefined);
  }

  return <div className="media-player-shell"><div className="media-player-toolbar"><span>{kind === "video" ? "فيديو الدرس" : "صوت الدرس"}</span>{resumeReady && resumeSeconds > 3 && <button type="button" onClick={resume}>استئناف من {formatTime(resumeSeconds)} ↗</button>}</div>{kind === "video" ? <video ref={ref as React.RefObject<HTMLVideoElement>} controls preload="metadata" className="lesson-video"><source src={src} />متصفحك لا يدعم تشغيل الفيديو.</video> : <audio ref={ref as React.RefObject<HTMLAudioElement>} controls preload="metadata" src={src} />}</div>;
}
