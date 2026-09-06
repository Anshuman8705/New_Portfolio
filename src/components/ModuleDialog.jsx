import { useEffect, useRef } from "react";

// Uses the native <dialog> element: the browser gives us the focus trap,
// Escape-to-close and the backdrop for free, which is far harder to get
// right by hand and much easier to get subtly wrong for keyboard users.
export default function ModuleDialog({ module, year, onClose }) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || !module) return;
    // showModal has been in every current browser since 2022. The old
    // setAttribute("open") fallback that used to sit here produced a dialog with
    // no backdrop and no focus trap, which is worse than not opening at all.
    if (!el.open) el.showModal();
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, [module]);

  if (!module) return null;

  // Fires on Escape as well as on our close button, so both paths clean up.
  function handleClose() { onClose(); }

  // Clicking the backdrop lands on the <dialog> itself, not its contents.
  function handleClick(e) {
    if (e.target === ref.current) {
      ref.current.close?.();
      onClose();
    }
  }

  return (
    <dialog
      ref={ref}
      className="modal"
      onClose={handleClose}
      onClick={handleClick}
      aria-labelledby="modal-title"
    >
      <div className="modal-inner">
        <div className="modal-head">
          <div>
            <span className="mod-year">{year}</span>
            <h3 id="modal-title">{module.title}</h3>
          </div>
          <button
            type="button"
            className="modal-close"
            onClick={() => { ref.current?.close?.(); onClose(); }}
            aria-label="Close"
          >
            <svg viewBox="0 0 20 20" width="18" height="18" aria-hidden="true">
              <path d="M5 5l10 10M15 5L5 15" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        <p className="modal-body">{module.body}</p>

        <ol className="days">
          {module.days.map((d, i) => (
            <li key={d}>
              <span className="day-n">Day {i + 1}</span>
              <span className="day-t">{d}</span>
            </li>
          ))}
        </ol>

        {module.takeaway ? <p className="modal-take">{module.takeaway}</p> : null}
      </div>
    </dialog>
  );
}
