import Link from "next/link";
import { slugify, type Settings } from "@/lib/content";

type Props = {
  course?: string[];
  lesson?: string[];
  article?: string[];
  settings: Pick<Settings, "spotlightEyebrow" | "spotlightTitle" | "spotlightText" | "spotlightCourseLabel" | "spotlightLessonLabel" | "spotlightArticleLabel" | "spotlightLinkLabel">;
};

export default function HomeSpotlight({ course, lesson, article, settings }: Props) {
  if (!course && !lesson && !article) return null;
  const courseTitle = course?.[0] ?? "مسار مختار";
  const lessonTitle = lesson?.[0] ?? "درس مختار";
  const articleTitle = article?.[0] ?? "مقال مختار";
  return <section className="home-spotlight" aria-labelledby="spotlight-title">
    <div className="spotlight-intro">
      <span className="directory-serial">03 / SPOTLIGHT</span>
      <p className="kicker">{settings.spotlightEyebrow}</p>
      <h2 id="spotlight-title">{settings.spotlightTitle}</h2>
      <p>{settings.spotlightText}</p>
    </div>
    <div className="spotlight-feature">
      <span className="spotlight-index">01</span>
      <small>{settings.spotlightCourseLabel} · {course?.[3] || "مفتوح"}</small>
      <h3>{courseTitle}</h3>
      <p>{course?.[1] || "مسار تعليمي مرتب يساعدك على البدء بخطوة عملية."}</p>
      <Link href={`/courses/${encodeURIComponent(slugify(courseTitle))}`} className="spotlight-link">{settings.spotlightLinkLabel} <b>←</b></Link>
    </div>
    <div className="spotlight-stack">
      <Link href={`/lessons/${encodeURIComponent(slugify(lessonTitle))}`} className="spotlight-mini spotlight-lesson"><span>02</span><div><small>{settings.spotlightLessonLabel}</small><b>{lessonTitle}</b><em>{lesson?.[1] || "استمع وتعلم بهدوء"}</em></div><strong>↗</strong></Link>
      <Link href={`/articles/${encodeURIComponent(slugify(articleTitle))}`} className="spotlight-mini spotlight-article"><span>03</span><div><small>{settings.spotlightArticleLabel}</small><b>{articleTitle}</b><em>{article?.[2] || "قراءة نافعة"}</em></div><strong>↗</strong></Link>
    </div>
  </section>;
}
