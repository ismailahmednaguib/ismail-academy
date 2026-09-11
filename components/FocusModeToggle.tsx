"use client";

import { useEffect, useState } from "react";

const storageKey = "academy-focus-mode-v1";

export default function FocusModeToggle() {
  const [active, setActive] = useState(false);

  useEffect(() => {
    const initial = window.localStorage.getItem(storageKey) === "on";
    const timer = window.setTimeout(() => { setActive(initial); if (initial) document.body.dataset.focusMode = "true"; }, 0);
    return () => { window.clearTimeout(timer); delete document.body.dataset.focusMode; };
  }, []);

  function toggle() {
    const next = !active;
    setActive(next);
    if (next) {
      document.body.dataset.focusMode = "true";
      window.localStorage.setItem(storageKey, "on");
    } else {
      delete document.body.dataset.focusMode;
      window.localStorage.removeItem(storageKey);
    }
  }

  return <button type="button" className="focus-mode-toggle" onClick={toggle} aria-pressed={active}>{active ? "الخروج من وضع التركيز" : "وضع التركيز"} <span aria-hidden="true">{active ? "×" : "◌"}</span></button>;
}
