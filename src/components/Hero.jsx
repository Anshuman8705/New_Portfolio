import { profile, facts } from "../data.js";

// Splits the intro so the emphasised phrase renders bold, without needing HTML in data.js.
function Intro({ text, emphasis }) {
  if (!emphasis || !text.includes(emphasis)) return <>{text}</>;
  const [before, ...rest] = text.split(emphasis);
  return (
    <>
      {before}
      <strong>{emphasis}</strong>
      {rest.join(emphasis)}
    </>
  );
}

export default function Hero() {
  return (
    <header id="top" className="hero-sec">
      <div className="wrap">
        <div className="hero">
          <div>
            <h1>{profile.headline}</h1>
            <p className="lede">
              <Intro text={profile.intro} emphasis={profile.introEmphasis} />
            </p>
            <div className="hero-actions">
              <a className="btn btn-solid" href="#work">See the projects</a>
              <a className="btn btn-ghost" href="#contact">Get in touch</a>
              {profile.resume ? (
                <a className="btn btn-quiet" href={profile.resume} download>
                  Download resume
                </a>
              ) : null}
            </div>
          </div>

          <div>
            <div className="portrait">
              <div className="portrait-frame">
                {profile.photo ? (
                  <img
                    src={profile.photo}
                    alt={profile.photoAlt}
                    width="880"
                    height="1100"
                    loading="eager"
                    decoding="async"
                  />
                ) : (
                  <div className="portrait-ph">
                    <b>{profile.initials}</b>
                    Add your photo at public/assets/anshuman.jpg, then set
                    profile.photo in src/data.js
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="facts">
        <div className="wrap">
          <div className="facts-in">
            {facts.map((f) => (
              <div className="fact" key={f.label}>
                <b>{f.label}</b>
                <span>{f.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </header>
  );
}
