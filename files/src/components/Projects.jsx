import { projects } from "../data.js";
import SectionHead from "./SectionHead.jsx";
import Thumb from "./Thumb.jsx";
import ProjectVideos from "./ProjectVideos.jsx";

export default function Projects() {
  return (
    <section id="work" className="section">
      <div className="wrap">
        <SectionHead title="Projects" note="Selected work · source code and walkthroughs" />
        <div className="grid">
          {projects.map((p) => (
            <article className="card" key={p.id} aria-labelledby={`project-${p.id}`}>
              {p.featured && <p className="project-featured">Featured project</p>}
              <div className="card-top">
                <div>
                  <h3 id={`project-${p.id}`}>{p.title}</h3>
                  <p className="role">{p.role}</p>
                </div>
                <Thumb name={p.thumb} id={p.id} />
              </div>

              <p className="card-body">{p.body}</p>
              {p.contribution && <p className="project-contribution"><b>Team contribution.</b> {p.contribution}</p>}

              {p.figures?.length ? (
                <div className="figs" data-count={p.figures.length}>
                  {p.figures.map((f) => (
                    <div className="fig" key={f.label}>
                      <b>{f.value}</b><span>{f.label}</span>
                    </div>
                  ))}
                </div>
              ) : null}

              {p.callout && <p className="callout"><b>{p.callout.title}</b> {p.callout.body}</p>}

              {p.details?.length ? (
                <details className="project-details">
                  <summary>Read project notes<span className="sr-only"> for {p.title}</span></summary>
                  <div className="project-details-body">
                    {p.details.map((d) => (
                      <div key={d.heading}><h4>{d.heading}</h4><p>{d.body}</p></div>
                    ))}
                  </div>
                </details>
              ) : null}

              {p.tags?.length ? (
                <div className="tagrow">{p.tags.map((t) => <span className="tag" key={t}>{t}</span>)}</div>
              ) : null}

              <div className="card-foot project-actions">
                {p.demo && (
                  <a className="project-action project-action-primary" href={p.demo} target="_blank" rel="noopener noreferrer"
                    aria-label={`Open ${p.title} live demo in a new tab`}>View live demo <span aria-hidden="true">↗</span></a>
                )}
                {p.repo ? (
                  <a className="project-action" href={p.repo} target="_blank" rel="noopener noreferrer"
                    aria-label={`View source code for ${p.title} in a new tab`}>View source <span aria-hidden="true">↗</span></a>
                ) : <span className="repo-pending">{p.repoPending || "Source not publicly available"}</span>}
              </div>
            </article>
          ))}
        </div>
        <ProjectVideos />
      </div>
    </section>
  );
}
