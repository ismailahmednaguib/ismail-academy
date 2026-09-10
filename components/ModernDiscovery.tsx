"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { Settings } from "@/lib/content";
import { slugify } from "@/lib/content";
import { LearningActions } from "@/components/LearningTools";

type Kind = "all" | "course" | "lesson" | "article" | "book";

type DiscoveryItem = {
  id: string;
  title: string;
  description: string;
  meta: string;
  kind: Exclude<Kind, "all">;
  kindLabel: string;
  href: string;
  mark: string;
};

type Props = {
  settings: Settings;
  courses: string[][];
  lessons: string[][];
  articles: string[][];
  books: string[][];
};

const filters: { value: Kind; label: string }[] = [
  { value: "all", label: "الكل" },
  { value: "course", label: "الدورات" },
  { value: "lesson", label: "الدروس" },
  { value: "article", label: "المقالات" },
  { value: "book", label: "الكتب" },
];

export default function ModernDiscovery({ settings, courses, lessons, articles, books }: Props) {
  const [filter, setFilter] = useState<Kind>("all");
  const items = useMemo<DiscoveryItem[]>(() => [
    ...courses.map(([title, description, count, level], index) => ({ id: `course:${slugify(title)}`, title, description, meta: `${level || "مسار"} · ${count || "تعلّم مرتب"}`, kind: "course" as const, kindLabel: "دورة", href: `/courses/${encodeURIComponent(slugify(title))}`, mark: String(index + 1).padStart(2, "0") })),
    ...lessons.map(([title, meta], index) => ({ id: `lesson:${slugify(title)}`, title, description: "جرعة تعليمية قصيرة يمكنك إكمالها بهدوء.", meta: meta || "درس مختصر", kind: "lesson" as const, kindLabel: "درس", href: `/lessons/${encodeURIComponent(slugify(title))}`, mark: `L${String(index + 1).padStart(2, "0")}` })),
    ...articles.map(([title, category, time], index) => ({ id: `article:${slugify(title)}`, title, description: "قراءة مركزة تفتح لك سؤالًا جديدًا وخطوة قابلة للتطبيق.", meta: `${category || "قراءة"} · ${time || "قراءة قصيرة"}`, kind: "article" as const, kindLabel: "مقال", href: `/articles/${encodeURIComponent(slugify(title))}`, mark: `A${String(index + 1).padStart(2, "0")}` })),
    ...books.map(([title, meta], index) => ({ id: `book:${slugify(title)}`, title, description: "ملف يعود إليك وقت المراجعة والقراءة الهادئة.", meta: meta || "ملف قابل للتحميل", kind: "book" as const, kindLabel: "كتاب", href: "/library", mark: `B${String(index + 1).padStart(2, "0")}` })),
  ], [articles, books, courses, lessons]);
  const visible = items.filter((item) => filter === "all" || item.kind === filter).slice(0, 8);

  return <section className="modern-discovery" id="modern-discovery" aria-labelledby="modern-discovery-title">
    <div className="modern-discovery-head">
      <div>
        <span className="directory-serial">03 / DISCOVER</span>
        <p className="kicker">{settings.homeExploreEyebrow}</p>
        <h2 id="modern-discovery-title">{settings.homeExploreTitle}</h2>
      </div>
      <p>{settings.homeExploreText}</p>
    </div>
    <div className="modern-discovery-toolbar">
      <div className="modern-discovery-tabs" role="tablist" aria-label="تصفية المحتوى">
        {filters.map((item) => <button type="button" role="tab" aria-selected={filter === item.value} className={filter === item.value ? "active" : ""} key={item.value} onClick={() => setFilter(item.value)}>{item.label}</button>)}
      </div>
      <span>{visible.length} مواد مختارة</span>
    </div>
    <div className="modern-discovery-grid">
      {visible.map((item, index) => <article className={`modern-discovery-card card-tone-${index % 4}`} key={item.id}>
        <div className="modern-discovery-card-top"><span>{item.mark}</span><small>{item.kindLabel}</small></div>
        <Link href={item.href} className="modern-discovery-card-link"><h3>{item.title}</h3><p>{item.description}</p><b>{item.meta}</b></Link>
        <LearningActions id={item.id} title={item.title} />
      </article>)}
    </div>
    {visible.length === 0 && <div className="modern-discovery-empty">لا توجد مواد في هذا القسم بعد.</div>}
  </section>;
}
