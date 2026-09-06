import { useEffect, useRef, useState } from "react";
import { profile } from "../data.js";

export default function Nav({ sections }) {
  const [active, setActive] = useState("");
  const [open, setOpen] = useState(false);
  const panelRef = useRef(null);
  const buttonRef = useRef(null);

  // Highlight the section currently in view.
  useEffect(() => {
    const els = sections.map((s) => document.getElementById(s.id)).filter(Boolean);
    if (!els.length) return;
    const obs = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: "-45% 0px -50% 0px" }
    );
    els.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, [sections]);

  // Close on Escape, on outside click, and if the viewport grows past the
  // breakpoint (otherwise the menu can be left open but hidden).
  useEffect(() => {
    if (!open) return;

    function onKey(e) {
      if (e.key === "Escape") {
        setOpen(false);
        buttonRef.current?.focus();
      }
    }
    function onPointer(e) {
      if (
        panelRef.current && !panelRef.current.contains(e.target) &&
        buttonRef.current && !buttonRef.current.contains(e.target)
      ) setOpen(false);
    }
    const mq = window.matchMedia("(min-width: 761px)");
    const onWide = (e) => { if (e.matches) setOpen(false); };

    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onPointer);
    mq.addEventListener("change", onWide);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onPointer);
      mq.removeEventListener("change", onWide);
    };
  }, [open]);

  return (
    <nav className="nav">
      <div className="wrap nav-in">
        <a className="brand" href="#top" onClick={() => setOpen(false)}>
          {profile.name}
        </a>

        <div className="nav-links">
          {sections.map((s) => (
            <a key={s.id} href={`#${s.id}`} aria-current={active === s.id ? "true" : undefined}>
              {s.label}
            </a>
          ))}
        </div>

        <button
          ref={buttonRef}
          className="nav-toggle"
          type="button"
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((v) => !v)}
        >
          <span className={`bars${open ? " x" : ""}`} aria-hidden="true"><i /><i /><i /></span>
        </button>
      </div>

      <div id="mobile-menu" ref={panelRef} className={`nav-panel${open ? " open" : ""}`} hidden={!open}>
        <div className="wrap">
          {sections.map((s) => (
            <a key={s.id} href={`#${s.id}`} onClick={() => setOpen(false)}
               aria-current={active === s.id ? "true" : undefined}>
              {s.label}
            </a>
          ))}
        </div>
      </div>
    </nav>
  );
}
