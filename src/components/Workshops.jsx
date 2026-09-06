import { workshops } from "../data.js";
import SectionHead from "./SectionHead.jsx";

export default function Workshops() {
  return (
    <section id="hardware" className="section">
      <div className="wrap">
        <SectionHead title={workshops.heading} note={workshops.subtitle} />
        <p className="section-intro">{workshops.intro}</p>
        <div className="builds">
          {workshops.items.map((w) => (
            <div className="build" key={w.title}>
              <h3>{w.title}</h3>
              <p>{w.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
