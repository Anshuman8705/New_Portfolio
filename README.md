# Anshuman Agrawal — Portfolio

[Live portfolio](https://portfolio-kohl-theta-24.vercel.app) · [GitHub](https://github.com/Anshuman8705) · [LinkedIn](https://www.linkedin.com/in/anshumanagrawal08072005/)

Portfolio of an Information Technology undergraduate at SSGMCE Shegaon and **AI/ML Developer Intern at One Smarter, Inc.** Portfolio presentation updated on 3 November 2026.

## Projects

- **DermAI Monitor:** co-developed with Tanushri Khawale during the IEEE EMBS Pune Chapter internship. EfficientNetB3, Grad-CAM, Streamlit and SQLite; a research prototype, not a clinical product. Project-reported test accuracy: 68.97%; macro ROC-AUC: 0.9143. No paper authorship is claimed.
- **ANSHUVO:** the current e-commerce project, with React, Express, SQLite and simulated checkout. [Live demo](https://anshuvo.onrender.com/) · [Source](https://github.com/Anshuman8705/Anshuvo).
- **Expense & Budget Management:** collaborative ASP.NET Core MVC application with Rahul Paghrut.
- **Homely Hub:** MERN property-rental platform from the Webstack Academy internship.
- **Flashy Learn:** collaborative hackathon study tool.
- **ASP.NET MVC exercises:** foundational .NET training work.
- **Hardware and CAD:** Fusion 360 excavator arm, ESP8266 ultrasonic distance monitor, Raspberry Pi IR presence detector and ESP32 prototyping.

## Experience and credentials

Includes One Smarter (August 2026–present), IEEE EMBS (1–30 June 2026), Webstack Academy (3 September–20 November 2025), Digital Fablab mentoring and Robotics and Automation Society leadership.

Fifteen records cover CS50 Python, IEEE and Webstack internship completion, AWS Academy Cloud Foundations, Red Hat RH104, iBase AI/ML training, NxtWave, Pursuit 2026, TCS Tech Day appreciation, CertifyEra Advanced DotNet and SQL Server, NPTEL Data Base Management System and Operating System Fundamentals, AWS Cloud Developing, and Red Hat RH124 and DO180. All fifteen entries include local documents and previews. The DotNet and DBMS PDFs are now included, and the ESP32 and NxtWave previews use higher-resolution originals. NxtWave retains the crop present in its source. Training and appreciation are labelled accurately, not presented as professional certifications.

## Run and maintain

Requires Node.js 20+. The website has no external package dependencies.

```sh
npm run check
npm run preview
```

Open http://127.0.0.1:4173. Edit `src/data.js` for content, `src/templates.mjs` for markup and `src/styles.css` for styling. `npm run build` generates `dist/` and validates local links and assets. The root HTML/assets are a synchronized static export. The historical `files/` migration directory is not the active application.

`npm run resume` regenerates the linked résumé with Python and ReportLab. Review its layout after changes. Original certificate files are under `public/assets/certificates/`.

## Deployment

The existing `vercel.json` uses `npm run build` and serves `dist/`. Publish from the repository root. The old `/projects/nimbusmart/` path redirects to `/projects/anshuvo/` for existing bookmarks.

The public Web3Forms identifier is intended for the browser. Never place private credentials in public assets. Contact validation is tested with mocked responses; real inbox delivery requires a manual check. Videos load only when requested.

The homepage features three projects; `/projects/` retains all six and video walkthroughs. `/learning/` contains the complete experience timeline and eight Fab Lab modules. Screenshots for Expense Management were captured from the running development app with synthetic data; ANSHUVO was captured from its live demo, and Homely Hub uses the screenshot in its source repository. Evidence summaries link to repository notes and distinguish reported results from newly run checks.


## Maintaining the static export

Use `npm run export` after source changes to refresh the root HTML/assets and remove obsolete hashed bundles. Vercel builds `dist/` directly. The active renderer is `src/templates.mjs`; obsolete React/Vite entrypoints have been removed. Project screenshots receive content-hashed URLs under `/assets/versioned/` and immutable caching; replacing an image produces a new URL. Legacy NimbusMart URLs redirect through `vercel.json`.
