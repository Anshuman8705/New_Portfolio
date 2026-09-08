import { projectVideos } from "../data.js";

// Ordinary links deliberately avoid autoplay, third-party embeds and extra
// network requests before the visitor chooses to open a video.
export default function ProjectVideos() {
  if (!projectVideos.length) return null;
  return (
    <section className="project-videos" aria-labelledby="walkthroughs-heading">
      <div className="walkthroughs-head">
        <h3 id="walkthroughs-heading">Project walkthroughs</h3>
        <p>Recorded presentations, separate from the live applications.</p>
      </div>
      <div className="video-grid">
        {projectVideos.map((video) => (
          <article className="video-card" key={video.id} aria-labelledby={`video-${video.id}`}>
            <span className="video-mark" aria-hidden="true">▶</span>
            <div>
              <h4 id={`video-${video.id}`}>{video.title}</h4>
              <p>{video.description}</p>
              <a className="project-action" href={video.url} target="_blank" rel="noopener noreferrer"
                aria-label={`Watch ${video.title} on YouTube in a new tab`}>Watch on YouTube <span aria-hidden="true">↗</span></a>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
