import { profile, meta } from "../data.js";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="wrap foot-in">
        <span>{profile.fullName} · {profile.location.replace(", India", "")}</span>
        <span>{meta.footerUpdated}</span>
      </div>
    </footer>
  );
}
