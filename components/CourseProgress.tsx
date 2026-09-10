"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

const storageKey = "academy-learning-v1";

function localCompleted() {
  try {
    const value = JSON.parse(localStorage.getItem(storageKey) ?? "{}") as { completed?: unknown };
    return Array.isArray(value.completed) ? value.completed.filter((item): item is string => typeof item === "string") : [];
  } catch { return []; }
}

export default function CourseProgress({ lessonIds }: { lessonIds: string[] }) {
  const [completed, setCompleted] = useState<string[]>([]);
  useEffect(() => {
    let active = true;
    const load = async () => {
      let next = localCompleted();
      if (supabase) {
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          const { data } = await supabase.from("member_learning").select("completed").eq("user_id", session.user.id).maybeSingle();
          if (Array.isArray(data?.completed)) next = data.completed.filter((item): item is string => typeof item === "string");
        }
      }
      if (active) setCompleted(next);
    };
    void load();
    window.addEventListener("academy-learning-change", load);
    window.addEventListener("academy-auth-change", load);
    return () => { active = false; window.removeEventListener("academy-learning-change", load); window.removeEventListener("academy-auth-change", load); };
  }, []);
  const done = lessonIds.filter((id) => completed.includes(id)).length;
  const percent = lessonIds.length ? Math.round((done / lessonIds.length) * 100) : 0;
  return <div className="course-progress"><div><span>تقدمك في المسار</span><b>{percent}%</b></div><div className="course-progress-track"><i style={{ width: `${percent}%` }} /></div><small>{done} من {lessonIds.length} دروس مكتملة · احفظ تقدمك من داخل كل درس</small></div>;
}

