import { useState } from "react";
import { fablab } from "../data.js";
import SectionHead from "./SectionHead.jsx";
import ModuleDialog from "./ModuleDialog.jsx";

export default function FabLab() {
  const [openTitle, setOpenTitle] = useState(null);
  const active = fablab.modules.find((m) => m.title === openTitle) || null;

  return (
    <section id="lab" className="section band">
      <div className="wrap">
        <SectionHead title={fablab.heading} note={fablab.subtitle} />
        <p className="band-intro">{fablab.intro}</p>

        <div className="mods">
          {fablab.modules.map((m) => (
            <button
              type="button"
              className="mod"
              key={m.title}
              onClick={() => setOpenTitle(m.title)}
              aria-haspopup="dialog"
            >
              <span className="mod-year">{m.year || fablab.year}</span>
              <h3>{m.title}</h3>
              <p>{m.body}</p>
              <span className="mod-more">
                {m.days.length} days
                <svg viewBox="0 0 16 16" width="13" height="13" aria-hidden="true">
                  <path d="M6 3l5 5-5 5" fill="none" stroke="currentColor" strokeWidth="1.7"
                        strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
            </button>
          ))}
        </div>
      </div>

      <ModuleDialog
        module={active}
        year={active?.year || fablab.year}
        onClose={() => setOpenTitle(null)}
      />
    </section>
  );
}
