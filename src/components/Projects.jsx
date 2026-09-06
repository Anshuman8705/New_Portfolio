import { projects } from "../data.js";
import SectionHead from "./SectionHead.jsx";
import Thumb from "./Thumb.jsx";

function repoLabel(url) {
  return url.replace(/^https?:\/\//, "");
}

export default function Projects() {
  return (
    <section id="work" className="section">
      <div className="wrap">
        <SectionHead title="Projects" note={`${projects.length} builds · newest first`} />
        <div className="grid">
          {projects.map((p) => (
            <article className="card" key={p.id}>
              <div className="card-top">
                <div>
                  <h3>{p.title}</h3>
                  <p className="role">{p.role}</p>
                </div>
                <Thumb name={p.thumb} id={p.id} />
              </div>

              <p className="card-body">{p.body}</p>

              {p.figures?.length ? (
                <div className="figs" data-count={p.figures.length}>
                  {p.figures.map((f) => (
                    <div className="fig" key={f.label}>
                      <b>{f.value}</b>
                      <span>{f.label}</span>
                    </div>
                  ))}
                </div>
              ) : null}

              {p.callout ? (
                <p className="callout">
                  <b>{p.callout.title}</b> {p.callout.body}
                </p>
              ) : null}

              {p.tags?.length ? (
                <div className="tagrow">
                  {p.tags.map((t) => (
                    <span className="tag" key={t}>{t}</span>
                  ))}
                </div>
              ) : null}

              <div className="card-foot">
                {p.repo ? (
                  <a className="repo" href={p.repo} target="_blank" rel="noopener noreferrer">
                    {repoLabel(p.repo)}
                  </a>
                ) : (
                  <span className="repo-pending">
                    {p.repoPending || "Repository publishing shortly"}
                  </span>
                )}
                {p.demo ? (
                  <>
                    {" · "}
                    <a className="repo" href={p.demo} target="_blank" rel="noopener noreferrer">
                      Live demo
                    </a>
                  </>
                ) : null}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
