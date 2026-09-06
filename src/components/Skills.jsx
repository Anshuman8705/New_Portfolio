import { skills, certificates, about } from "../data.js";
import SectionHead from "./SectionHead.jsx";

export default function Skills() {
  return (
    <section id="skills" className="section">
      <div className="wrap">
        <SectionHead title="Skills and credentials" note="What I can be handed on day one" />
        <div className="two">
          <div>
            <p className="col-head">What I work with</p>
            {skills.map((s) => (
              <div className="skill-group" key={s.group}>
                <b>{s.group}</b>
                <span>{s.items}</span>
              </div>
            ))}
          </div>

          <div>
            <p className="col-head">Certificates</p>
            {certificates.map((c) => (
              <div className="cert" key={c.title}>
                <div>
                  <b>{c.title}</b>
                  <i>{c.issuer}</i>
                </div>
                <span>{c.year}</span>
              </div>
            ))}
          </div>

          <div>
            <p className="col-head">Education and other</p>
            {about.map((a) => (
              <div className="skill-group" key={a.group}>
                <b>{a.group}</b>
                <span>{a.items}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
