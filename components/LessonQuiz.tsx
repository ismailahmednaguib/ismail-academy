"use client";

import { useMemo, useState } from "react";

export default function LessonQuiz({ definition }: { definition?: string }) {
  const parsed = useMemo(() => {
    const parts = (definition ?? "").split("||").map((part) => part.trim()).filter(Boolean);
    if (parts.length < 4) return null;
    return { question: parts[0], answer: parts[1], options: parts.slice(2) };
  }, [definition]);
  const [selected, setSelected] = useState("");
  const [submitted, setSubmitted] = useState(false);
  if (!parsed) return null;
  const correct = submitted && selected === parsed.answer;
  return <section className="lesson-quiz"><p className="kicker">مراجعة سريعة</p><h2>{parsed.question}</h2><div className="quiz-options">{parsed.options.map((option) => <button type="button" className={submitted && option === parsed.answer ? "correct" : submitted && selected === option ? "wrong" : selected === option ? "selected" : ""} key={option} onClick={() => { setSelected(option); setSubmitted(false); }}>{option}</button>)}</div><button type="button" className="primary quiz-submit" disabled={!selected} onClick={() => setSubmitted(true)}>تحقق من إجابتك</button>{submitted && <p className={correct ? "quiz-result success" : "quiz-result error"}>{correct ? "إجابة صحيحة — أحسنت." : `ليست الإجابة الصحيحة. الإجابة: ${parsed.answer}`}</p>}</section>;
}

