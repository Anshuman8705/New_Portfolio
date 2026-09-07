// ─────────────────────────────────────────────────────────────────────────────
//  EVERYTHING ON THE SITE LIVES IN THIS FILE.
//  To update the site, edit the values below. Never touch the components.
//  After editing: git add . && git commit -m "update" && git push
// ─────────────────────────────────────────────────────────────────────────────

export const profile = {
  name: "Anshuman Agrawal",
  fullName: "Anshuman Rupesh Agrawal",
  headline: "I build machine learning systems and the software around them.",
  intro:
    "Third-year Information Technology student at SSGMCE Shegaon and an AI/ML Developer Intern at One Smarter, Inc. I work across deep learning for medical imaging, ASP.NET Core and MERN applications, and hardware prototyping — and I care as much about evaluating a system honestly as about getting it to run.",
  // Bold this phrase inside the intro above. Leave "" for no emphasis.
  introEmphasis: "AI/ML Developer Intern at One Smarter, Inc.",
  location: "Shegaon, Maharashtra, India",

  // ── YOUR PHOTO ──
  // 1. Put your photo in:  public/assets/anshuman.jpg  (4:5 crop, e.g. 800x1000)
  // 2. Change photo below to: "/assets/anshuman.jpg"
  // Until then a placeholder with your initials shows instead.
  photo: "/assets/anshuman.jpg",
  // Optional. A WebP of the same picture, served to browsers that take it.
  // Leave "" and the JPEG above is used everywhere.
  photoWebp: "/assets/anshuman.webp",
  photoWidth: 720,
  photoHeight: 900,
  photoAlt: "Anshuman Agrawal",
  initials: "AA",

  // ── YOUR RESUME ──
  // The PDF lives at public/assets/Anshuman_Agrawal_Resume.pdf. Set this to ""
  // and the download button simply does not render — no broken link.
  resume: "/assets/Anshuman_Agrawal_Resume.pdf",
  // Filename the browser saves it under, rather than whatever the path says.
  resumeFilename: "Anshuman-Agrawal-Resume.pdf",
};

export const facts = [
  { label: "Currently", value: "AI/ML Developer Intern, One Smarter, Inc." },
  { label: "Studying", value: "B.E. Information Technology, SSGMCE ’28" },
  { label: "Working in", value: "Deep learning, .NET, MERN, IoT" },
  { label: "Open to", value: "AI/ML internships and research work" },
];

// ─────────────────────────────────────────────────────────────────────────────
//  PROJECTS — newest first.
//  thumb: one of "heat" | "bars" | "house" | "cards" | "scatter" | "stack" | "cart"
//  repo:  full GitHub URL, or "" if not published yet
//  repoPending: text shown when repo is ""
//  demo:  optional live URL, or omit
//  callout: optional { title, body } — the small note with the amber rule
// ─────────────────────────────────────────────────────────────────────────────
export const projects = [
  {
    id: "dermai",
    title: "DermAI Monitor",
    role: "IEEE EMBS Pune Chapter AI/ML Internship",
    thumb: "heat",
    body: "Seven-class dermoscopic lesion classifier on an EfficientNetB3 backbone, trained on a merged HAM10000 and ISIC 2019 set. Two-phase transfer learning, focal loss and oversampling cut a 58× class imbalance to roughly 28×. Grad-CAM shows what drove each prediction, a classical ABCD score cross-checks it, and a Streamlit app tracks lesions across visits with PDF reporting. Built with Tanushri Khawale, who co-authored the accompanying IEEE-format paper.",
    figures: [
      { value: "68.97%", label: "Test accuracy" },
      { value: "0.9143", label: "Macro ROC-AUC" },
      { value: "15,615", label: "Images" },
      { value: "7", label: "Classes" },
    ],
    callout: {
      title: "Where it falls short.",
      body: "At 0.5426 macro F1 this is a triage aid, not a diagnostic tool, and the confidence fallback can still relabel a low-confidence melanoma as healthy skin. Documented as an open problem, not hidden.",
    },
    tags: ["TensorFlow", "EfficientNetB3", "Grad-CAM", "Streamlit", "SQLite"],
    repo: "https://github.com/Anshuman8705/Skin_Classification_DermAI",
  },
  {
    id: "expense",
    title: "Expense Budget Management",
    role: ".NET training project, One Smarter Inc. USA",
    thumb: "bars",
    body: "ASP.NET Core MVC on .NET 10 for tracking income, expenses and per-category monthly budgets, built with Rahul Paghrut over four weekly iterations. Three layers held strictly apart: controllers never build queries, services hold every rule, EF Core sits underneath. Every query filters on the user id from the auth cookie, never from form input, so a changed id in a URL returns not-found.",
    figures: [
      { value: "41/41", label: "Smoke tests pass" },
      { value: "~2,800", label: "Lines of C#" },
    ],
    callout: {
      title: "A decision worth recording.",
      body: "Money is decimal(18,2), never float. SQLite has no decimal type, so summing in SQL would round — services fetch the period's amounts and total them in C# instead. Slightly slower, exactly correct.",
    },
    tags: ["C#", "ASP.NET Core MVC", "EF Core", "SQLite", "Chart.js"],
    repo: "",
    repoPending: "Private repository · built as One Smarter, Inc. training material",
  },
  {
    id: "homely",
    title: "Homely Hub",
    role: "Webstack Academy MERN internship",
    thumb: "house",
    body: "Full-stack property rental platform serving both tenants and owners. JWT authentication, listings with filtered search across price, location and amenities, an admin dashboard and image uploads. Frontend on Vercel, API on Render, data in MongoDB Atlas.",
    tags: ["React", "Node.js", "Express", "MongoDB", "JWT"],
    repo: "https://github.com/Anshuman8705/Homely-Hub",
  },
  {
    id: "flashy",
    title: "Flashy Learn",
    role: "Innovo Hackathon, SSGMCE",
    thumb: "cards",
    body: "Flask application generating study flashcards from a topic prompt through the OpenAI API, built for students without access to prepared material. Decks persist so a learner can return to them. Built with Mohammad Ammar, Kamran Ali and Kartik Hande under hackathon deadline.",
    tags: ["Python", "Flask", "OpenAI API", "SQLite"],
    repo: "https://github.com/Anshuman8705/Flashy_Learn",
  },
  {
    id: "dotnet",
    title: "ASP.NET MVC exercises",
    role: ".NET training, One Smarter Inc. USA",
    thumb: "stack",
    body: "The groundwork the budget application was built on: models, controllers and views, model binding and validation, session and cookie state, authentication and routing, each worked as a separate exercise before being assembled into something real.",
    tags: ["C#", "ASP.NET MVC", "Razor", "REST"],
    repo: "https://github.com/Anshuman8705/Dot-Net-Training",
  },
  {
    id: "amazon",
    title: "Amazon storefront clone",
    role: "First-year self-directed build, 2024",
    thumb: "cart",
    body: "Fourteen linked pages rebuilding a storefront from scratch in plain HTML, CSS and JavaScript — category pages, gift cards, sign-in, payment and customer support. Live search filters the product grid as you type, clicking an item opens a detail modal, and a scroll-triggered control returns you to the top. No framework, no library, every rule in the stylesheet written by hand.",
    figures: [
      { value: "14", label: "Pages" },
      { value: "563", label: "Lines of CSS" },
      { value: "0", label: "Dependencies" },
    ],
    callout: {
      title: "Kept on purpose.",
      body: "This is the oldest thing here and it shows. It stays because the distance between it and the two projects at the top of this page is the most useful thing either of them says about me.",
    },
    tags: ["HTML", "CSS", "JavaScript", "DOM API"],
    repo: "",
    repoPending: "Repository not yet public",
  },
];

export const experience = [
  {
    when: "Aug 2026 – Present",
    where: "One Smarter, Inc. · Ohio, remote",
    title: "AI/ML Developer Intern",
    body: "Healthcare data automation: transforming EDI transaction data into structured formats and generating reports without manual handling. The code is proprietary and stays private, which is the point — it is the first system I have written where handling sensitive data set the constraints rather than the features.",
  },
  {
    when: "Jul 2026 – Present",
    where: "SSGMCE Shegaon",
    title: "Chairperson, Robotics and Automation Society",
    body: "Also on the organising team for ICICGR 2026, the IEEE International Conference on Innovations in Communication, Geoscience and Robotics, coordinating technical sessions and hybrid presentations.",
  },
  {
    when: "Jun – Jul 2026",
    where: "IEEE EMBS Pune Chapter",
    title: "AI/ML Intern",
    body: "Model training, system architecture and application development for DermAI Monitor under the mentorship of Dr. Ankita Tidake, with a co-authored IEEE-format paper covering methodology, results and limitations.",
  },
  {
    when: "Aug – Nov 2025",
    where: "Webstack Academy, Bangalore",
    title: "MERN Stack Development Intern",
    body: "Built Homely Hub end to end across an SDLC-structured cycle, from foundational HTML, CSS, JavaScript and React through to a deployed full-stack application.",
  },
];

export const fablab = {
  heading: "The Fab Lab years",
  subtitle: "Eight modules, 2024–25 · member since Mar 2025 · mentor since Jan 2026",
  intro:
    "Before any of the machine learning, there was a room with a 3D printer and a laser cutter in it. The Digital Fablab at SSGMCE is where I learned that a thing either works when you switch it on or it does not, which turns out to be the same lesson a confusion matrix teaches. I completed every module the lab offers, joined as a member in March 2025, and have been mentoring there since January 2026.",
  // Year badge on every module tile. All eight were completed in the 2024–25
  // academic year; membership and mentoring came after, and the subtitle above
  // carries those dates. A module can override this with its own `year:` line.
  year: "2024–25",
  // Each module opens a panel listing its day-by-day journey.
  // Add or edit days in the arrays below; the panel adjusts on its own.
  modules: [
    {
    title: "Web development",
    body: "HTML, CSS and JavaScript from the ground up, the first place I put something on a screen that other people could use.",
    days: ["Getting started with VS Code", "HTML fundamentals", "Advanced HTML: forms and tables", "Introduction to CSS", "The CSS box model and Flexbox"],
    takeaway: "The module that made everything else possible — every project on this site has a front end because of it.",
  },
    {
    title: "CAD design",
    body: "Parametric modelling and assemblies in Fusion 360, including a working excavator arm mechanism.",
    days: ["Introduction to Autodesk Fusion 360", "Basic 3D modelling: a Pikachu character", "Precision modelling: star and cylinder practice", "Technical drawing documentation", "Final project: excavator arm assembly"],
    takeaway: "The excavator arm was the first thing I designed that had moving parts and actually articulated.",
  },
    {
    title: "Java programming",
    body: "Language fundamentals and object-oriented structure, the first code I wrote that was longer than a script.",
    days: ["Programming fundamentals", "Functions and recursion", "Classes and objects", "Encapsulation and abstraction", "Inheritance", "Polymorphism", "Mini project: library management system"],
    takeaway: "Seven days from a first loop to a working library management system, which is where object-oriented thinking finally clicked.",
  },
    {
    title: "AI and machine learning",
    body: "The introduction that everything since has been built on, from first principles rather than from a tutorial.",
    days: ["Python fundamentals for AI/ML", "NumPy for numerical computing", "Data visualisation with Matplotlib", "Statistical visualisation with Seaborn", "Hands-on projects and applications"],
    takeaway: "NumPy, Matplotlib and Seaborn here are the same tools I used two years later to evaluate DermAI.",
  },
    {
    title: "3D printing",
    body: "Filament behaviour, tolerances and the gap between a model that looks right and one that actually prints.",
    days: ["3D printing fundamentals", "Materials and safety", "CAD and STL file management", "Slicing software", "First print and calibration", "Troubleshooting and quality optimisation", "Post-processing and advanced applications"],
    takeaway: "Learning to diagnose a failed print is closer to debugging than it looks.",
  },
    {
    title: "Laser cutting",
    body: "Material selection, kerf allowance and designing joints that hold without adhesive.",
    days: ["Introduction and applications", "Hardware and software", "Design basics", "Materials and settings", "Operating the laser", "Project day", "Review and maintenance"],
    takeaway: "Kerf allowance taught me that a design is only correct once you account for the tool that makes it.",
  },
    {
    title: "PCB design and IoT",
    body: "Schematic capture and board layout, and the point where the software and the hardware sides met.",
    days: ["IoT module fundamentals", "Wi-Fi connectivity and web server", "Sensor integration and real-time monitoring", "Mobile app development and IoT integration", "PCB design fundamentals", "PCB layout and routing", "Advanced PCB design project"],
    takeaway: "Where the software side and the hardware side finally met, and the reason the ESP8266 workshop builds later made sense.",
  },
    {
    title: "Networking",
    body: "Addressing, routing and the fundamentals that later made Linux and cloud foundations make sense.",
    days: ["Introduction to networking", "Types of networks and the nature of data", "The OSI model demystified", "Inside the web: HTTP and DNS", "Revision and DHCP in action", "Low-level protocols and diagnostics", "From theory to a Zynq-based app"],
    takeaway: "The OSI model is the thing I still reach for whenever something on a network does not behave.",
  },
  ],
};

// ─────────────────────────────────────────────────────────────────────────────
//  HARDWARE WORKSHOPS — its own section. Nothing to do with the Fab Lab.
// ─────────────────────────────────────────────────────────────────────────────
export const workshops = {
  heading: "Hardware and prototyping",
  subtitle: "IEEE SSGMCE workshop series, ESP32 and Raspberry Pi",
  intro:
    "Three builds from the IEEE SSGMCE Prototype to Product workshop series, where the brief each time was to take an idea to something that works inside a day.",
  items: [
    { title: "Ultrasonic distance monitor", body: "An HC-SR04 sensor on an ESP8266 hosting its own web server, streaming live distance readings to a phone. Built at the Prototype to Product workshop at IIT Bombay under IEEE SSGMCE." },
    { title: "IR presence detector", body: "A Raspberry Pi reading an infrared sensor and driving an LED response, built with a five-person team at the I3PLI workshop." },
    { title: "ESP32 prototyping", body: "Hardware interfacing and the product development lifecycle, from the Prototype to Product session at the Pursuit 2026 national technical symposium." },
  ],
};

export const skills = [
  { group: "Machine learning", items: "TensorFlow, Keras, scikit-learn, transfer learning, focal loss, Grad-CAM, model evaluation, computer vision" },
  { group: "Generative AI", items: "OpenAI API, prompt engineering" },
  { group: "Languages", items: "Python, C#, JavaScript, Java, C, SQL" },
  { group: "Web and software", items: "ASP.NET Core MVC, Entity Framework Core, React, Node.js, Express, Flask, REST APIs" },
  { group: "Data", items: "MongoDB, MySQL, SQLite, pandas, NumPy, Matplotlib, Chart.js" },
  { group: "Tools", items: "Git, GitHub, Linux, AWS fundamentals, Streamlit, Visual Studio, Google Colab, Fusion 360" },
];

export const certificates = [
  { title: "CS50P: Introduction to Programming with Python", issuer: "Harvard University · nine problem sets and a final project", year: "2026" },
  { title: "AWS Academy Graduate, Cloud Foundations", issuer: "Amazon Web Services · 20 hours, Credly verified", year: "2026" },
  { title: "Red Hat Linux Fundamentals, RH104", issuer: "Red Hat · system navigation and command line", year: "2026" },
  { title: "AI and Machine Learning industrial training", issuer: "iBase Electrosoft with SSGMCE · 10 days", year: "2026" },
  { title: "Generative AI workshop", issuer: "NxtWave · first end-to-end AI model", year: "2025" },
  { title: "Fab Lab completion", issuer: "SSGMCE Digital Fablab · all modules", year: "2025" },
];

export const about = [
  { group: "Education", items: "B.E. Information Technology, Shri Sant Gajanan Maharaj College of Engineering, Shegaon. September 2024 to July 2028. CGPA 8.57 across the first three semesters." },
  { group: "Outside the screen", items: "State-level softball player, district level in cricket and chess." },
];

export const contact = {
  intro:
    "If you are hiring for machine learning or .NET work, or building something in healthcare AI and want another pair of hands, I would like to hear about it. I read everything that comes through here and reply within a couple of days.",

  // ── MAKING THE CONTACT FORM SEND REAL EMAIL ──
  // 1. Go to https://web3forms.com and enter anshumanagrawal89@gmail.com
  // 2. They email you an access key (a long string of letters, numbers and dashes)
  // 3. Paste it below, replacing REPLACE_WITH_YOUR_WEB3FORMS_KEY
  // 4. Push. Messages then arrive in your inbox. No server, no cost.
  // Until you do this, the form tells the visitor it is not configured yet
  // and offers your email address instead — it never fails silently.
  accessKey: "b24173b5-cb1b-4449-bd0d-4851b5fec5d4",

  email: "anshumanagrawal89@gmail.com",
  linkedin: "https://www.linkedin.com/in/anshumanagrawal08072005",
  linkedinHandle: "anshumanagrawal08072005",
  github: "https://github.com/Anshuman8705",
  githubHandle: "Anshuman8705",
  topics: [
    "An internship or role",
    "A project collaboration",
    "A question about a project",
    "Something else",
  ],
};

// ─────────────────────────────────────────────────────────────────────────────
//  PAGE METADATA — this is what Google shows in results and what LinkedIn,
//  WhatsApp and Twitter show when someone shares your link.
//  These values are written into index.html automatically every time you run
//  `npm run build` (see scripts/sync-meta.mjs), so this file stays the single
//  source of truth. Do not edit the meta tags in index.html by hand.
// ─────────────────────────────────────────────────────────────────────────────
export const meta = {
  title: "Anshuman Agrawal — AI/ML and software developer",
  description:
    "Anshuman Agrawal builds machine learning systems and full-stack applications. AI/ML Developer Intern at One Smarter, Inc. B.E. Information Technology, SSGMCE Shegaon.",

  // No trailing slash. Pinning it here rather than relying on the Vercel
  // environment keeps the canonical link on one address, so preview deploys
  // never compete with the real site in search results. This must be the ONE
  // address the site lives at: when you put a custom domain in front of it,
  // change this line and delete any older Vercel projects still serving a copy.
  siteUrl: "https://portfolio-kohl-theta-24.vercel.app",

  // Preview image shown when the link is shared. 1200x630.
  ogImage: "/assets/og-image.jpg",
  ogImageAlt: "Anshuman Agrawal — AI/ML and software developer",

  // Used only in the structured data block that search engines read.
  jobTitle: "AI/ML Developer Intern",
  affiliation: "One Smarter, Inc.",
  // Still a student, so this is memberOf in the structured data, not alumniOf.
  memberOf: "Shri Sant Gajanan Maharaj College of Engineering, Shegaon",

  // The footer date is generated at build time (see vite.config.js), so it can
  // never go stale. Nothing to edit here.
};
