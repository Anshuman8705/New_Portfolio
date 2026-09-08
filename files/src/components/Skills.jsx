import { skills, certificates, about, contact } from "../data.js";
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
            <p className="col-head">Courses and certificates</p>
            {certificates.map((c) => (
              <div className="cert" key={c.title}>
                <div>
                  <b>{c.title}</b>
                  <i>{c.issuer}</i>
                  {c.credentialUrl && <a className="credential-link" href={c.credentialUrl}
                    target="_blank" rel="noopener noreferrer"
                    aria-label={`Open credential for ${c.title} in a new tab`}>View credential ↗</a>}
                </div>
                <span>{c.year}</span>
              </div>
            ))}
            <p className="credential-note">Course-completion and training credentials.
              {" "}<a href={contact.linkedin} target="_blank" rel="noopener noreferrer">View LinkedIn profile ↗</a>
            </p>
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
