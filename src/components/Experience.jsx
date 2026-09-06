import { experience } from "../data.js";
import SectionHead from "./SectionHead.jsx";

export default function Experience() {
  return (
    <section id="experience" className="section surface-sec">
      <div className="wrap">
        <SectionHead title="Experience" note="Internships and roles" />
        <div className="tl">
          {experience.map((e) => (
            <div className="tl-item" key={e.title + e.when}>
              <div className="tl-meta">
                <span className="tl-when">{e.when}</span>
                <span className="tl-where">{e.where}</span>
              </div>
              <div className="tl-role">
                <h3>{e.title}</h3>
              </div>
              <div className="tl-desc">
                <p>{e.body}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
