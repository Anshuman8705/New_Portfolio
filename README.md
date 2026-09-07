# Anshuman Agrawal — portfolio

A static React site. No backend, no database, no server to maintain. Vite compiles it
to plain HTML, CSS and JavaScript that any host can serve for free, forever. The build
also pre-renders the page, so the HTML that ships already contains the content — a
search engine or a browser with JavaScript turned off sees the real page, not an
empty div. React attaches to that markup in the browser rather than rebuilding it.

---

## Running it locally

You need Node.js 20.19 or newer (22.12+ also fine — Vite 7 requires one of those, and
`package.json` will refuse older versions rather than fail halfway through a build).
Then, in this folder:

```bash
npm install
npm run dev
```

Open the address it prints (usually http://localhost:5173).

To check the production build before deploying:

```bash
npm run build
npm run preview
```

---

## Updating the site — the only file you need

**Everything on the site lives in `src/data.js`.** Your projects, experience, Fab Lab
modules, skills, certificates and contact details are all plain text in there. Edit that
file, save, and the page updates. You never need to open a component or touch any CSS.

To add a project, copy an existing block inside the `projects` array and change the values:

```js
{
  id: "something-unique",
  title: "Project name",
  role: "Where it came from",
  thumb: "stack",              // heat | bars | house | cards | scatter | stack | cart
  body: "Two or three sentences on what it does and how.",
  figures: [                   // use 2, 3 or 4 — the layout adjusts
    { value: "41/41", label: "Tests passing" },
  ],
  callout: {                   // optional; delete these three lines if not needed
    title: "A note.",
    body: "Something honest about a limitation or a decision.",
  },
  tags: ["Python", "Flask"],
  repo: "https://github.com/Anshuman8705/repo-name",
  demo: "https://optional-live-url.com",   // optional; delete if none
}
```

Projects appear in the order they are listed, newest first. If a repo is not published
yet, set `repo: ""` and the card shows the `repoPending` text instead of a dead link.

Then publish the change:

```bash
git add .
git commit -m "Add new project"
git push
```

Vercel and Netlify rebuild automatically on push.

---

## Two things to do before you go live

### 1. Add your photo and resume

Put the file at `public/assets/anshuman.jpg`, then in `src/data.js` change:

```js
photo: "",                        // to →
photo: "/assets/anshuman.jpg",
```

Crop it 4:5 portrait, shoulders up, plain background. 720x900 is plenty — the layout
never renders it wider than 360 CSS pixels, so anything larger is bytes your visitors
download for nothing. Until you set this, a placeholder with your initials shows in its
place. If you also drop a `.webp` of the same picture next to it and point
`profile.photoWebp` at it, browsers that support WebP take the smaller file.

The resume PDF is already at `public/assets/Anshuman_Agrawal_Resume.pdf` and
`profile.resume` points at it, so the "Download resume" button in the hero and the Resume
link in the contact column both render. Set `resume: ""` and neither appears — no broken
download.

The PDF is generated, not hand-made. `scripts/build_resume.py` builds it in the same
typefaces, palette and section rules as the site, from the same content as `data.js`:

```bash
pip install reportlab
python scripts/build_resume.py
```

Edit the content near the bottom of that script and re-run it. Two pages of A4, real
selectable text with working links (so an applicant tracking system can read it), and
fonts loaded from `assets-src/fonts` rather than the network.

### 2. Make the contact form deliver email

The form posts straight to Web3Forms, which emails you the message. You run no server.

1. Go to https://web3forms.com and enter **anshumanagrawal89@gmail.com**
2. They email you an access key
3. In `src/data.js`, replace `REPLACE_WITH_YOUR_WEB3FORMS_KEY` with that key
4. Push

Until you do this, the form validates normally and then tells the visitor it is not
connected yet, showing your email address instead. It never fails silently and never
loses a message without saying so. The reminder to set the key only renders while you
are running `npm run dev` — visitors to the live site never see setup instructions.

The free tier covers 250 submissions a month. The access key sitting in public
JavaScript is expected and safe — the worst anyone can do with it is send you a message
through your own form, and a hidden honeypot field plus Web3Forms' own spam filtering
guard against that. The honeypot's real state is read off the form and sent with the
request, so a bot that ticks it gets rejected on Web3Forms' side.

**Send yourself a test the moment it goes live.** The first message can land in Gmail's
spam folder because it arrives from Web3Forms' servers. Mark it "not spam" once and
everything after that goes to your inbox.

### 3. Set your live URL

Once deployed, put the address in `meta.siteUrl` in `src/data.js`, for example
`"https://anshuman.vercel.app"`, then push. This switches on `og:url`, `og:image` and
the canonical link, which is what makes your link show a proper preview card with an
image when shared on LinkedIn or WhatsApp rather than a plain grey box. The preview
image itself is at `public/assets/og-image.jpg` — replace it with your own 1200x630
design any time.

If you deploy to Vercel or Netlify and forget this step, the build falls back to the
deployment URL those hosts put in the environment, so the preview card still works. You
can also set `SITE_URL` yourself on any other host. Setting `meta.siteUrl` explicitly is
still better, because it pins the canonical link to your real domain rather than to
whatever preview URL the host happened to generate.

---

## Deploying

### Vercel (recommended)

1. Push this folder to a GitHub repository
2. Go to vercel.com, sign in with GitHub, click **Add New → Project**
3. Select the repository. Vercel detects Vite on its own — accept the defaults
4. Deploy

Every `git push` after that redeploys automatically. The GitHub Actions workflow in
`.github/workflows/build.yml` runs `npm ci && npm run build` on every push too, so a
broken edit to `data.js` shows up as a red cross on the commit before Vercel ships it.

### GitHub Pages

Works too, with one extra step. If your site will live at
`anshuman8705.github.io/portfolio`, open `vite.config.js` and set:

```js
base: "/portfolio/",
```

Then build and publish the `dist` folder to a `gh-pages` branch. Leave `base: "/"` if
you use Vercel, Netlify, or a custom domain at the root.

---

## What is in here

```
src/
  data.js                  ← all your content. This is the file you edit.
  styles.css               ← the design system: colours, type, spacing, @font-face
  App.jsx                  ← assembles the sections in order
  main.jsx                 ← React entry point (hydrates the pre-rendered markup)
  entry-server.jsx         ← build-time only: renders the page to HTML
  components/
    Nav.jsx                sticky nav, highlights the section you are reading
    Hero.jsx               headline, intro, photo, facts strip
    Projects.jsx           the project grid
    Experience.jsx         the role timeline
    FabLab.jsx             the eight modules, each opening its journey panel
    ModuleDialog.jsx       the day-by-day panel a module opens
    Workshops.jsx          the ESP32 and Raspberry Pi builds
    Skills.jsx             skills, certificates, education
    Contact.jsx            the working contact form
    Footer.jsx
    SectionHead.jsx        shared section heading
    Thumb.jsx              the small SVG icons on each project card
public/assets/             photo, resume PDF, social preview image
public/fonts/              self-hosted woff2 fonts (no Google Fonts request)
public/robots.txt          lets search engines index the site
.github/workflows/         CI: builds on every push
scripts/
  sync-meta.mjs            writes the meta block in index.html from data.js
  prerender.mjs            injects the pre-rendered HTML into dist/index.html
  build_resume.py          regenerates the resume PDF in the site's own style
assets-src/fonts/          fonts the resume script renders with (not served)
```

Colours, fonts and spacing are all CSS custom properties at the top of `styles.css`. If
you ever want to change the palette, change them there and the whole site follows. The
footer's "Last updated" month is written by `vite.config.js` at build time, so it is
always the month of the last deploy without anyone touching it.

---

## Accessibility and quality notes

- Skip-to-content link for keyboard users
- Visible focus outlines throughout, and `scroll-padding-top` so anchor jumps never land
  a heading underneath the sticky nav
- Form errors linked to their inputs via `aria-describedby`, status announced via
  `aria-live`, and focus moved to the first invalid field on a failed submit
- Respects `prefers-reduced-motion`
- Responsive from 320px up; the project grid drops to one column below 940px
- Mobile menu below 760px: opens from the header, closes on link tap, on Escape (which
  returns focus to the button), on an outside tap, and automatically if the window is
  widened past the breakpoint

## The Fab Lab modules

Each module tile opens a panel listing its day-by-day journey. Both the tile text and the
day list come from `fablab.modules` in `src/data.js`:

```js
{
  title: "Laser cutting",
  body: "The one-line summary shown on the tile.",
  days: ["Introduction and applications", "Hardware and software"],
  takeaway: "Optional closing line at the bottom of the panel.",
}
```

Add or remove days freely — the tile's "N days" label and the panel both count the array,
so they can never disagree. The panel uses the browser's native `<dialog>`, which handles
the focus trap, Escape-to-close and the backdrop properly for keyboard and screen reader
users.

## Page metadata

`index.html` contains a generated block between `<!-- meta:start -->` and
`<!-- meta:end -->`. Do not edit it by hand — it is rewritten from `meta` in
`src/data.js` every time you run `npm run dev` or `npm run build`, and again whenever you
save `data.js` while the dev server is running. Social crawlers do not execute
JavaScript, so these tags have to exist in the static HTML; that is why they are baked in
at build time rather than set by React. The block also carries a JSON-LD `Person` record,
which is what lets a search engine understand the page is a person rather than a document
about one. The college is listed there as `memberOf` while you are a student; switch
`meta.memberOf` to `meta.alumniOf` in `data.js` after graduation.
