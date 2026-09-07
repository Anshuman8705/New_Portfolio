import { profile } from "../data.js";

// __BUILD_DATE__ is injected by vite.config.js at build time, so the footer
// always shows the month the site was actually last deployed.
export default function Footer() {
  return (
    <footer className="footer">
      <div className="wrap foot-in">
        <span>{profile.fullName} · {profile.location.replace(", India", "")}</span>
        <span>Last updated {__BUILD_DATE__}</span>
      </div>
    </footer>
  );
}
