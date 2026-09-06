import { useState } from "react";
import { contact, profile } from "../data.js";
import SectionHead from "./SectionHead.jsx";

const KEY_PLACEHOLDER = "REPLACE_WITH_YOUR_WEB3FORMS_KEY";
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

const EMPTY = { name: "", email: "", topic: contact.topics[0], message: "" };

export default function Contact() {
  const [values, setValues] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [sending, setSending] = useState(false);
  const [status, setStatus] = useState(null); // { kind: "ok" | "no", text, showEmail? }

  const configured = contact.accessKey && contact.accessKey !== KEY_PLACEHOLDER;

  function update(field, value) {
    setValues((v) => ({ ...v, [field]: value }));
    if (errors[field]) setErrors((e) => ({ ...e, [field]: undefined }));
  }

  function validate() {
    const next = {};
    if (!values.name.trim()) next.name = "Please tell me who you are.";
    if (!EMAIL_RE.test(values.email.trim()))
      next.email = "That does not look like a valid email address.";
    if (!values.message.trim())
      next.message = "Add a line or two so I know how to reply.";
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function onSubmit(event) {
    event.preventDefault();
    setStatus(null);
    if (!validate()) return;

    if (!configured) {
      setStatus({
        kind: "no",
        text: "The form is not connected to an inbox yet. Please email me directly at ",
        showEmail: true,
      });
      return;
    }

    setSending(true);
    try {
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          access_key: contact.accessKey,
          subject: `Portfolio message — ${values.topic}`,
          from_name: "Portfolio contact form",
          name: values.name.trim(),
          email: values.email.trim(),
          topic: values.topic,
          message: values.message.trim(),
          botcheck: false,
        }),
      });
      const data = await res.json();

      if (res.ok && data.success) {
        setStatus({
          kind: "ok",
          text: "Message sent. It has reached my inbox and I will reply within a couple of days.",
        });
        setValues(EMPTY);
      } else {
        setStatus({
          kind: "no",
          text:
            (data && data.message ? data.message + " " : "That did not send. ") +
            "You can reach me directly at ",
          showEmail: true,
        });
      }
    } catch {
      setStatus({
        kind: "no",
        text:
          "That did not send — the network request failed. Check your connection, or email me directly at ",
        showEmail: true,
      });
    } finally {
      setSending(false);
    }
  }

  return (
    <section id="contact" className="section surface-sec">
      <div className="wrap">
        <SectionHead
          title="Get in touch"
          note="Open to AI/ML internships and research collaboration"
        />
        <div className="contact-grid">
          <div>
            <p className="contact-intro">{contact.intro}</p>
            <div className="direct">
              <a href={`mailto:${contact.email}`}>
                {contact.email}
                <small>Email, usually the fastest route</small>
              </a>
              <a href={contact.linkedin} target="_blank" rel="noopener noreferrer">
                LinkedIn
                <small>{contact.linkedinHandle}</small>
              </a>
              <a href={contact.github} target="_blank" rel="noopener noreferrer">
                GitHub
                <small>{contact.githubHandle}</small>
              </a>
              {profile.resume ? (
                <a href={profile.resume} download>
                  Resume
                  <small>PDF download</small>
                </a>
              ) : null}
            </div>
          </div>

          <form className="form" onSubmit={onSubmit} noValidate>
            <div className={`f${errors.name ? " bad" : ""}`}>
              <label htmlFor="name">Your name</label>
              <input
                id="name"
                name="name"
                type="text"
                autoComplete="name"
                value={values.name}
                onChange={(e) => update("name", e.target.value)}
                aria-invalid={errors.name ? "true" : undefined}
                aria-describedby={errors.name ? "err-name" : undefined}
              />
              {errors.name && <span className="err" id="err-name">{errors.name}</span>}
            </div>

            <div className={`f${errors.email ? " bad" : ""}`}>
              <label htmlFor="email">Email</label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                value={values.email}
                onChange={(e) => update("email", e.target.value)}
                aria-invalid={errors.email ? "true" : undefined}
                aria-describedby={errors.email ? "err-email" : undefined}
              />
              {errors.email && <span className="err" id="err-email">{errors.email}</span>}
            </div>

            <div className="f">
              <label htmlFor="topic">What is this about</label>
              <select
                id="topic"
                name="topic"
                value={values.topic}
                onChange={(e) => update("topic", e.target.value)}
              >
                {contact.topics.map((t) => (
                  <option key={t}>{t}</option>
                ))}
              </select>
            </div>

            <div className={`f${errors.message ? " bad" : ""}`}>
              <label htmlFor="message">Message</label>
              <textarea
                id="message"
                name="message"
                value={values.message}
                onChange={(e) => update("message", e.target.value)}
                aria-invalid={errors.message ? "true" : undefined}
                aria-describedby={errors.message ? "err-message" : undefined}
              />
              {errors.message && <span className="err" id="err-message">{errors.message}</span>}
            </div>

            {/* Honeypot: real people never fill this in, bots usually do. */}
            <input
              type="checkbox"
              name="botcheck"
              className="hp"
              tabIndex="-1"
              autoComplete="off"
              aria-hidden="true"
            />

            <button className="submit" type="submit" disabled={sending}>
              {sending ? "Sending…" : "Send message"}
            </button>

            {/* Always present so assistive tech is already observing it when a
                message arrives. Empty and hidden from layout until then. */}
            <div className="status-region" role="status" aria-live="polite">
              {status && (
                <div className={`status ${status.kind}`}>
                  {status.text}
                  {status.showEmail && <a href={`mailto:${contact.email}`}>{contact.email}</a>}
                  {status.showEmail && "."}
                </div>
              )}
            </div>

            {!configured && (
              <p className="formnote">
                Setup note for you, not for visitors: add your Web3Forms access key to
                contact.accessKey in src/data.js and this note disappears.
              </p>
            )}
          </form>
        </div>
      </div>
    </section>
  );
}
