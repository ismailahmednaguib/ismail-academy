"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { slugify } from "@/lib/content";

type BrowserKind = "courses" | "lessons" | "articles" | "books";

type Props = {
  kind: BrowserKind;
  items: string[][];
  actionLabel: string;
  emptyLabel: string;
  placeholder: string;
  soonLabel: string;
};

export default function ContentBrowser({ kind, items, actionLabel, emptyLabel, placeholder, soonLabel }: Props) {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("الكل");
  const filters = useMemo(() => {
    if (kind === "courses") return ["الكل", ...Array.from(new Set(items.map((row) => row[3]).filter(Boolean)))];
    if (kind === "articles") return ["الكل", ...Array.from(new Set(items.map((row) => row[1]).filter(Boolean)))];
    return [];
  }, [items, kind]);
  const filtered = useMemo(() => {
    const normalized = query.trim().toLocaleLowerCase("ar");
    return items.filter((row) => {
      const filterValue = kind === "courses" ? row[3] : kind === "articles" ? row[1] : "الكل";
      const matchesFilter = filter === "الكل" || filterValue === filter;
      return matchesFilter && (!normalized || row.join(" ").toLocaleLowerCase("ar").includes(normalized));
    });
  }, [filter, items, kind, query]);

  return <div className={`content-browser browser-${kind}`}>
    <div className="content-browser-toolbar">
      <label className="content-browser-search"><span aria-hidden="true">⌕</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder={placeholder} aria-label={placeholder} /></label>
      {filters.length > 0 && <div className="content-browser-filters" aria-label="تصفية المحتوى">{filters.map((value) => <button type="button" className={filter === value ? "active" : ""} key={value} onClick={() => setFilter(value)}>{value}</button>)}</div>}
      <span className="content-browser-count">{filtered.length} من {items.length}</span>
    </div>
    <div className="content-browser-summary"><span>{query || filter !== "الكل" ? "نتائج مطابقة" : "كل المحتوى"}</span><i /></div>
    {filtered.length === 0 ? <div className="content-browser-empty"><span className="article-placeholder" aria-hidden="true" /><b>{emptyLabel}</b><small>جرّب عبارة أخرى أو غيّر الفلتر.</small></div> : kind === "courses" ? <div className="course-grid">{filtered.map(([title, desc, count, level]) => <article className="course-card" key={title}><div className="course-card-topline"><span className="course-card-symbol">✦</span><span className="badge">{level}</span></div><div className="course-card-body"><h3><Link href={`/courses/${encodeURIComponent(slugify(title))}`}>{title}</Link></h3><p>{desc}</p></div><footer><span>{count}</span><Link className="card-action" href={`/courses/${encodeURIComponent(slugify(title))}`} aria-label={`فتح ${title}`}>فتح المسار <b>←</b></Link></footer></article>)}</div> : kind === "lessons" ? <div className="lesson-list">{filtered.map(([title, meta]) => <article key={title}><span className="lesson-row-icon">◌</span><div><b>{title}</b><small>{meta}</small></div><Link className="lesson-action" href={`/lessons/${encodeURIComponent(slugify(title))}`}>{actionLabel} <b>←</b></Link></article>)}</div> : kind === "articles" ? <div className="article-grid">{filtered.map(([title, cat, time, , cover], index) => <article className="article-card" key={title}><div className={`article-art art-${index % 3}${cover ? " has-cover" : ""}`} style={cover ? { backgroundImage: `url(${cover})` } : undefined} role={cover ? "img" : undefined} aria-label={cover ? title : undefined}>{cover ? null : <span className="article-placeholder" aria-hidden="true" />}</div><div className="article-card-copy"><small>{cat} · {time}</small><h3><Link href={`/articles/${encodeURIComponent(slugify(title))}`}>{title}</Link></h3><Link className="card-action" href={`/articles/${encodeURIComponent(slugify(title))}`}>{actionLabel} <b>←</b></Link></div></article>)}</div> : <div className="book-list">{filtered.map(([title, meta, fileUrl]) => <article className="book-card" key={title}><span className="book-file-badge">PDF</span><div><b>{title}</b><small>{meta}</small></div>{fileUrl ? <a className="book-action" href={fileUrl} download aria-label={`تحميل ${title}`}>تحميل <b>↓</b></a> : <span className="coming-soon" title={soonLabel}>قريبًا</span>}</article>)}</div>}
  </div>;
}
