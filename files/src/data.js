// ─────────────────────────────────────────────────────────────────────────────
//  EVERYTHING ON THE SITE LIVES IN THIS FILE.
//  To update the site, edit the values below. Never touch the components.
//  After editing: git add . && git commit -m "update" && git push
// ─────────────────────────────────────────────────────────────────────────────

export const profile = {
  name: "Anshuman Agrawal",
  fullName: "Anshuman Rupesh Agrawal",
  headline: "I build machine learning systems and practical web applications.",
  intro:
    "Third-year Information Technology student at SSGMCE Shegaon and an AI/ML Developer Intern at One Smarter, Inc. My work spans machine learning, full-stack development and hardware prototyping, with an emphasis on useful applications and honest evaluation.",
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
//  PROJECTS — featured projects first, then additional work.
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
    role: "IEEE EMBS Pune Chapter AI/ML internship · team project",
    thumb: "heat",
    featured: true,
    body: "A research prototype for seven-class skin-lesion classification, combining an EfficientNetB3 model, Grad-CAM visualisations and a Streamlit application for reviewing results.",
    contribution: "I co-developed DermAI Monitor with Tanushri Khawale, with both of us contributing equally to the project. Our combined work brought together model development, evaluation and the supporting application.",
    figures: [
      { value: "68.97%", label: "Reported test accuracy" },
      { value: "0.9143", label: "Reported macro ROC-AUC" },
      { value: "0.5426", label: "Reported macro F1" },
      { value: "7", label: "Classes" },
    ],
    callout: {
      title: "Research use only.",
      body: "Not intended for clinical decision-making. The documented low-confidence fallback can label a melanoma image as healthy skin; that limitation must be addressed before considering any real-world use.",
    },
    details: [
      { heading: "Implementation", body: "The documented pipeline uses a merged HAM10000 and ISIC 2019 dataset, two-phase transfer learning, focal loss and oversampling. The application adds Grad-CAM visualisation, an ABCD-style score, longitudinal records and PDF reporting." },
      { heading: "Evaluation and limitations", body: "The figures above are the project's recorded evaluation results, not evidence of clinical validation. Performance across individual classes and the unsafe low-confidence fallback need to be considered alongside overall accuracy." },
      { heading: "Collaboration", body: "Co-developed DermAI Monitor with Tanushri Khawale, contributing to the model and supporting application." },
    ],
    tags: ["TensorFlow", "EfficientNetB3", "Grad-CAM", "Streamlit", "SQLite"],
    repo: "https://github.com/Anshuman8705/Skin_Classification_DermAI",
  },
  {
    id: "expense",
    title: "Expense & Budget Management",
    role: ".NET training project · One Smarter, Inc. · team project",
    thumb: "bars",
    featured: true,
    body: "An ASP.NET Core MVC application for recording income and expenses, setting monthly category budgets, and exploring spending through dashboards and reports.",
    contribution: "I co-developed the Expense & Budget Management System with Rahul Paghrut, sharing the project work equally. Our combined work delivered the application's account management, transaction tracking, budgeting and reporting features.",
    details: [
      { heading: "Architecture", body: "Controllers handle web requests, services contain business rules, and Entity Framework Core accesses SQLite. Account-scoped queries use the signed-in user's identity rather than trusting a user ID submitted in a form." },
      { heading: "Money calculations", body: "The implementation uses C# decimal values and aggregates amounts in the service layer. This keeps the calculation approach explicit without relying on floating-point SQL sums." },
      { heading: "Testing", body: "The public repository includes a smoke-test script covering registration, sign-in, transactions, budget calculations and isolation between users. Its setup and execution instructions are in the README; no current pass count is asserted here." },
    ],
    tags: ["C#", "ASP.NET Core MVC", "EF Core", "SQLite", "Chart.js"],
    repo: "https://github.com/Anshuman8705/.NET-Final-Project",
  },
  {
    id: "nimbusmart",
    title: "NimbusMart",
    role: "Full-stack e-commerce demonstration",
    thumb: "cart",
    featured: true,
    body: "A React and Express shopping application with accounts, guest and account carts, inventory, reviews, order management and an administrator area. Payments are simulated.",
    details: [
      { heading: "Application", body: "The project evolved from a static storefront into a React application backed by an Express API and SQLite. Customer and administrator screens share the same catalogue and order records." },
      { heading: "Order processing", body: "The server validates checkout data and updates order records and stock within a database transaction. The repository includes API, validation and user-flow tests." },
      { heading: "Demo boundaries", body: "This is a learning project, not a real retailer. No actual goods are sold, shipped or charged for. The India/INR localisation and free-tier persistence improvements are planned; they are not claimed as deployed." },
    ],
    tags: ["React", "Express", "SQLite", "Tailwind CSS", "Vitest"],
    repo: "https://github.com/Anshuman8705/Amazon.clone",
    demo: "https://nimbusmart.onrender.com/",
  },
  {
    id: "homely",
    title: "Homely Hub",
    role: "Webstack Academy MERN internship",
    thumb: "house",
    body: "A full-stack property-rental platform for tenants and owners, with authentication, searchable listings, image uploads and an administrator dashboard.",
    tags: ["React", "Node.js", "Express", "MongoDB", "JWT"],
    repo: "https://github.com/Anshuman8705/Homely-Hub",
  },
  {
    id: "flashy",
    title: "Flashy Learn",
    role: "Innovo Hackathon, SSGMCE · team project",
    thumb: "cards",
    body: "A study-flashcard application built with Mohammad Ammar, Kamran Ali and Kartik Hande during the Innovo Hackathon. The repository provides the implementation for review.",
    tags: ["Study tools", "Hackathon", "Team project"],
    repo: "https://github.com/Anshuman8705/Flashy_Learn",
  },
  {
    id: "dotnet",
    title: "ASP.NET MVC exercises",
    role: ".NET training · One Smarter, Inc.",
    thumb: "stack",
    body: "Focused exercises covering MVC, model binding, validation, session and cookie state, authentication and routing—the groundwork for the budget-management application.",
    tags: ["C#", "ASP.NET MVC", "Razor", "REST"],
    repo: "https://github.com/Anshuman8705/Dot-Net-Training",
  },
];

// Links supplied by the portfolio owner. These are video walkthroughs, not
// live application demos. Do not infer a project title from an inaccessible video.
export const projectVideos = [
  {
    id: "cs50",
    title: "CS50 project walkthrough",
    description: "Watch my CS50 project presentation on YouTube.",
    url: "https://youtu.be/6BmrqPzGUOw",
  },
  {
    id: "webstack",
    title: "Webstack project walkthrough",
    description: "Watch my Webstack project presentation on YouTube.",
    url: "https://youtu.be/MpdouLRX3zw",
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
    body: "Model development, evaluation and application development for DermAI Monitor with Tanushri Khawale.",
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

// Add credentialUrl only when it is a genuine issuer/credential URL.
// Public LinkedIn posts are supporting profile evidence, not issuer verification.
export const certificates = [
  { title: "CS50P: Introduction to Programming with Python", issuer: "Harvard University · CS50 course completion", year: "2026" },
  { title: "AWS Academy Graduate, Cloud Foundations", issuer: "AWS Academy · Cloud Foundations training", year: "2026" },
  { title: "Getting Started with Linux Fundamentals (RH104)", issuer: "Red Hat · system navigation and command line", year: "2026" },
  { title: "AI and Machine Learning industrial training", issuer: "iBase Electrosoft with SSGMCE · 10 days", year: "2026" },
  { title: "Generative AI workshop", issuer: "NxtWave · workshop participation", year: "2025" },
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
