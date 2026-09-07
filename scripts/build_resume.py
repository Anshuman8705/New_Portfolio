"""
Builds Anshuman's resume as a PDF in the same visual language as the portfolio
site: Archivo for anything structural, Source Serif 4 for prose, the same ink /
slate / heat palette, and the same section-head rule.

Content is reconciled against src/data.js, which is newer than the uploaded PDF
Keep the two in step: every date, figure and skill here should match data.js.
"""

import os

from reportlab.lib.pagesizes import A4
from reportlab.lib.colors import HexColor
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.units import mm
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.platypus import (
    BaseDocTemplate, PageTemplate, Frame, Paragraph, Spacer, Table, TableStyle,
    Flowable, KeepTogether,
)

FONTS = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "assets-src", "fonts")
OUT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "public", "assets", "Anshuman_Agrawal_Resume.pdf")

# ── palette, straight from styles.css ────────────────────────────────────────
INK = HexColor("#15181B")
SLATE = HexColor("#5C646B")
RULE = HexColor("#D2D8D5")
HEAT2 = HexColor("#B4306E")
HEAT3 = HexColor("#E8913C")

for w in (400, 500, 600, 700, 800):
    pdfmetrics.registerFont(TTFont(f"Archivo-{w}", f"{FONTS}/Archivo-{w}.ttf"))
pdfmetrics.registerFont(TTFont("Serif-400", f"{FONTS}/SourceSerif4-400.ttf"))

PAGE_W, PAGE_H = A4
MARGIN = 42
CONTENT_W = PAGE_W - 2 * MARGIN


def style(name, **kw):
    base = dict(fontName="Serif-400", fontSize=8.85, leading=11.85, textColor=SLATE,
                spaceBefore=0, spaceAfter=0)
    base.update(kw)
    return ParagraphStyle(name, **base)


S = {
    "name": style("name", fontName="Archivo-800", fontSize=25, leading=27,
                  textColor=INK),
    "tagline": style("tagline", fontName="Archivo-500", fontSize=9.8, leading=13.6,
                     textColor=SLATE),
    "contact": style("contact", fontName="Archivo-500", fontSize=8.5, leading=12,
                     textColor=INK),
    "sec": style("sec", fontName="Archivo-700", fontSize=12.4, leading=14,
                 textColor=INK),
    "secnote": style("secnote", fontName="Archivo-500", fontSize=7.9, leading=14,
                     textColor=SLATE, alignment=2),
    "role": style("role", fontName="Archivo-700", fontSize=10.2, leading=13,
                  textColor=INK),
    "where": style("where", fontName="Archivo-500", fontSize=8.7, leading=11.8,
                   textColor=SLATE),
    "when": style("when", fontName="Archivo-600", fontSize=8.3, leading=13,
                  textColor=HEAT2, alignment=2),
    "body": style("body"),
    "bullet": style("bullet", leftIndent=10, bulletIndent=0, spaceAfter=1.6),
    "figs": style("figs", fontName="Archivo-600", fontSize=8.1, leading=11.4,
                  textColor=INK),
    "tags": style("tags", fontName="Archivo-400", fontSize=8.1, leading=11.4,
                  textColor=SLATE),
    "skillhead": style("skillhead", fontName="Archivo-600", fontSize=8.6,
                       leading=12, textColor=INK),
    "skills": style("skills", fontSize=9.0, leading=12.4),
    "certtitle": style("certtitle", fontName="Archivo-600", fontSize=9.0,
                       leading=12.2, textColor=INK),
    "certmeta": style("certmeta", fontSize=8.6, leading=12, textColor=SLATE),
}


class Rule(Flowable):
    """The hairline under a section heading, or a lighter one between entries."""

    def __init__(self, width, thickness=1.3, color=INK, space_before=0, space_after=0):
        Flowable.__init__(self)
        self.width = width
        self.thickness = thickness
        self.color = color
        self.space_before = space_before
        self.space_after = space_after
        self.height = thickness + space_before + space_after

    def draw(self):
        self.canv.setStrokeColor(self.color)
        self.canv.setLineWidth(self.thickness)
        y = self.space_after + self.thickness / 2
        self.canv.line(0, y, self.width, y)


def section(title, note=None):
    """Mirrors .sec-head on the site: title left, small note right, ink rule."""
    row = Table(
        [[Paragraph(title, S["sec"]), Paragraph(note or "", S["secnote"])]],
        colWidths=[CONTENT_W * 0.55, CONTENT_W * 0.45],
    )
    row.setStyle(TableStyle([
        ("VALIGN", (0, 0), (-1, -1), "BOTTOM"),
        ("LEFTPADDING", (0, 0), (-1, -1), 0),
        ("RIGHTPADDING", (0, 0), (-1, -1), 0),
        ("TOPPADDING", (0, 0), (-1, -1), 0),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 3),
    ]))
    return [Spacer(1, 8), row, Rule(CONTENT_W, 1.3, INK, space_after=0), Spacer(1, 5.5)]


def open_section(title, note=None, first=None):
    """A heading with nothing under it at the foot of a page looks like a
    mistake, so the heading and its first entry travel together."""
    flows = section(title, note)
    if first is None:
        return flows
    first = first if isinstance(first, list) else [first]
    return [KeepTogether(flows + first)]


def head_row(left_flows, when):
    """Role/title on the left, date right-aligned on the same baseline."""
    t = Table([[left_flows, Paragraph(when, S["when"])]],
              colWidths=[CONTENT_W - 118, 118])
    t.setStyle(TableStyle([
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
        ("LEFTPADDING", (0, 0), (-1, -1), 0),
        ("RIGHTPADDING", (0, 0), (-1, -1), 0),
        ("TOPPADDING", (0, 0), (-1, -1), 0),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 0),
    ]))
    return t


def bullets(lines):
    return [Paragraph(t, S["bullet"], bulletText="\u2022") for t in lines]


def entry(role, where, when, lines, extra=None, last=False):
    block = [head_row([Paragraph(role, S["role"]), Paragraph(where, S["where"])], when),
             Spacer(1, 3)]
    block += bullets(lines)
    if extra:
        block += [Spacer(1, 2)] + extra
    block += [Spacer(1, 3)] if last else [
        Spacer(1, 3.5), Rule(CONTENT_W, 0.6, RULE, space_after=0), Spacer(1, 4)]
    return block


def figs(items):
    """The compact numbers strip, echoing the figure row on the project cards."""
    parts = " &nbsp;&nbsp;<font color='#E8913C'>|</font>&nbsp;&nbsp; ".join(
        f"<b>{v}</b> <font color='#5C646B' face='Archivo-400'>{l}</font>"
        for v, l in items)
    return Paragraph(parts, S["figs"])


def tags(items):
    return Paragraph(" &nbsp;·&nbsp; ".join(items), S["tags"])


# ── content ──────────────────────────────────────────────────────────────────
story = []

story.append(Paragraph("Anshuman Rupesh Agrawal", S["name"]))
story.append(Spacer(1, 5))
story.append(Paragraph(
    "AI/ML and software developer &nbsp;<font color='#B4306E'>·</font>&nbsp; "
    "deep learning for medical imaging, .NET and MERN, hardware prototyping",
    S["tagline"]))
story.append(Spacer(1, 7))

link = lambda url, text: f'<link href="{url}" color="#15181B">{text}</link>'
sep = " &nbsp;<font color='#D2D8D5'>|</font>&nbsp; "
contact = Table([[
    Paragraph(sep.join([
        link("mailto:anshumanagrawal89@gmail.com", "anshumanagrawal89@gmail.com"),
        # This PDF is public and indexed by search engines. Delete this line if you
        # would rather not publish the number.
        "+91 70209 57850",
        "Shegaon, Maharashtra, India",
    ]), S["contact"]),
    Paragraph(sep.join([
        link("https://github.com/Anshuman8705", "github.com/Anshuman8705"),
        link("https://www.linkedin.com/in/anshumanagrawal08072005", "linkedin.com/in/anshumanagrawal08072005"),
    ]), ParagraphStyle("c2", parent=S["contact"], alignment=2)),
]], colWidths=[CONTENT_W * 0.48, CONTENT_W * 0.52])
contact.setStyle(TableStyle([
    ("VALIGN", (0, 0), (-1, -1), "TOP"),
    ("LEFTPADDING", (0, 0), (-1, -1), 0),
    ("RIGHTPADDING", (0, 0), (-1, -1), 0),
    ("TOPPADDING", (0, 0), (-1, -1), 0),
    ("BOTTOMPADDING", (0, 0), (-1, -1), 0),
]))
story.append(contact)
story.append(Spacer(1, 9))
story.append(Rule(CONTENT_W, 1.6, INK))

# Summary
story += section("Summary")
story.append(Paragraph(
    "Third-year B.E. Information Technology student at SSGMCE Shegaon and an AI/ML Developer "
    "Intern at One Smarter, Inc. I work across deep learning for medical imaging, ASP.NET Core "
    "and MERN applications, and hardware prototyping, and co-authored an IEEE-format paper on "
    "multiclass skin lesion classification with EfficientNetB3, focal loss and Grad-CAM. "
    "Comfortable across the whole lifecycle, and as interested in what a model gets wrong as "
    "in what it gets right.", S["body"]))

# Experience
story += open_section("Experience", "Internships and roles", entry(
    "AI/ML Developer Intern", "One Smarter, Inc. · Ohio, remote", "Aug 2026 – Present",
    ["Healthcare data automation: transforming EDI transaction data into structured formats "
     "and generating reports without manual handling.",
     "First system I have written where handling sensitive data set the constraints rather "
     "than the features. Code is proprietary and stays private."]))

story += (entry(
    "Chairperson, Robotics and Automation Society", "SSGMCE Shegaon", "Jul 2026 – Present",
    ["On the organising team for ICICGR 2026, the IEEE International Conference on "
     "Innovations in Communication, Geoscience and Robotics, coordinating technical "
     "sessions and hybrid presentations."]))

story += (entry(
    "AI/ML Intern", "IEEE EMBS Pune Chapter", "Jun – Jul 2026",
    ["Model training, system architecture and application development for DermAI Monitor, "
     "under the mentorship of Dr. Ankita Tidake.",
     "Co-authored the accompanying IEEE-format paper covering methodology, results and "
     "documented limitations."]))

story += (entry(
    "MERN Stack Development Intern", "Webstack Academy, Bangalore", "Aug – Nov 2025",
    ["Built Homely Hub end to end across an SDLC-structured cycle, from foundational HTML, "
     "CSS, JavaScript and React through to a deployed full-stack application."], last=True))


# Skills
skills_head = section("Skills", "What I can be handed on day one")

skill_rows = [
    ("Machine learning", "TensorFlow, Keras, scikit-learn, transfer learning, focal loss, "
                         "Grad-CAM, model evaluation, computer vision"),
    ("Generative AI", "OpenAI API, prompt engineering"),
    ("Languages", "Python, C#, JavaScript, Java, C, SQL"),
    ("Web and software", "ASP.NET Core MVC, Entity Framework Core, React, Node.js, Express, "
                         "Flask, REST APIs"),
    ("Data", "MongoDB, MySQL, SQLite, pandas, NumPy, Matplotlib, Chart.js"),
    ("Tools", "Git, GitHub, Linux, AWS fundamentals, Streamlit, Visual Studio, Jupyter, "
              "Google Colab, Fusion 360"),
]
t = Table([[Paragraph(g, S["skillhead"]), Paragraph(v, S["skills"])] for g, v in skill_rows],
          colWidths=[112, CONTENT_W - 112])
t.setStyle(TableStyle([
    ("VALIGN", (0, 0), (-1, -1), "TOP"),
    ("LEFTPADDING", (0, 0), (-1, -1), 0),
    ("RIGHTPADDING", (0, 0), (0, -1), 10),
    ("TOPPADDING", (0, 0), (-1, -1), 3),
    ("BOTTOMPADDING", (0, 0), (-1, -1), 3),
    ("LINEBELOW", (0, 0), (-1, -2), 0.6, RULE),
]))
story += skills_head
story.append(t)

# Projects
story += open_section("Selected projects", "Newest first", entry(
    "DermAI Monitor", "Deep learning system for skin lesion classification and monitoring",
    "2026",
    ["Seven-class dermoscopic classifier on an EfficientNetB3 backbone, trained on a merged, "
     "deduplicated HAM10000 and ISIC 2019 set. Two-phase transfer learning, focal loss, class "
     "weighting and targeted oversampling cut a 58× class imbalance to roughly 28×.",
     "Grad-CAM explains what drove each prediction and a classical ABCD dermoscopic score "
     "cross-checks it independently. Shipped as a Streamlit application with SQLite-backed "
     "longitudinal patient history and automated PDF reporting via ReportLab.",
     "At 0.5426 macro F1 this is a triage aid, not a diagnostic tool. Documented as an open "
     "problem in the paper rather than hidden."],
    extra=[figs([("68.97%", "test accuracy"), ("0.9143", "macro ROC-AUC"),
                 ("15,615", "images"), ("7", "classes")]),
           Spacer(1, 3),
           tags(["TensorFlow", "EfficientNetB3", "Grad-CAM", "Streamlit", "SQLite"])]))

story += (entry(
    "Expense Budget Management", "ASP.NET Core MVC on .NET 10 · One Smarter, Inc.", "2026",
    ["Income, expense and per-category monthly budget tracking, built over four weekly "
     "iterations. Three layers held strictly apart: controllers never build queries, "
     "services hold every rule, EF Core sits underneath.",
     "Every query filters on the user id from the auth cookie rather than form input, so a "
     "changed id in a URL returns not-found. Money is decimal(18,2), never float — SQLite has "
     "no decimal type, so services total the period's amounts in C# rather than rounding in SQL."],
    extra=[figs([("41/41", "smoke tests pass"), ("~2,800", "lines of C#")]),
           Spacer(1, 3),
           tags(["C#", "ASP.NET Core MVC", "EF Core", "SQLite", "Chart.js"])]))

story += (entry(
    "Homely Hub", "Full-stack property rental platform · Webstack Academy", "2025",
    ["Serves both tenants and owners: JWT authentication, listings with filtered search "
     "across price, location and amenities, an admin dashboard and image uploads. Frontend "
     "on Vercel, API on Render, data in MongoDB Atlas."],
    extra=[tags(["React", "Node.js", "Express", "MongoDB", "JWT"])]))

story += (entry(
    "Flashy Learn", "AI flashcard generator · Innovo Hackathon, SSGMCE", "2025",
    ["Flask application generating study flashcards from a topic prompt through the OpenAI "
     "API, for students without access to prepared material. Decks persist so a learner can "
     "come back to them. Built with a team of four under hackathon deadline."],
    extra=[tags(["Python", "Flask", "OpenAI API", "SQLite"])], last=True))

# Education
edu_head = section("Education")
story.append(KeepTogether(edu_head + [head_row(
    [Paragraph("B.E. Information Technology", S["role"]),
     Paragraph("Shri Sant Gajanan Maharaj College of Engineering, Shegaon", S["where"])],
    "Sep 2024 – Jul 2028"), Spacer(1, 3), Paragraph(
    "CGPA 8.57 across the first three semesters. "
    "HSC and SSC at School of Scholars, 2024 and 2022.", S["body"])]))

# Certificates
cert_head = section("Certificates and training")
cert_rows = [
    ("CS50P: Introduction to Programming with Python",
     "Harvard University · nine problem sets, final project", "2026"),
    ("AWS Academy Graduate, Cloud Foundations",
     "Amazon Web Services · 20 hours, Credly verified", "2026"),
    ("Red Hat Linux Fundamentals, RH104",
     "Red Hat · system navigation and command line", "2026"),
    ("AI and Machine Learning industrial training",
     "iBase Electrosoft with SSGMCE · 10 days", "2026"),
    ("Generative AI workshop", "NxtWave · first end-to-end AI model", "2025"),
    ("Digital Fablab completion", "SSGMCE · all eight modules, later a mentor there", "2025"),
]


def cert_cell(a, b, y):
    return Paragraph(
        f"{a}<br/><font face='Serif-400' size='8.5' color='#5C646B'>{b} · "
        f"<font color='#B4306E' face='Archivo-600' size='8'>{y}</font></font>",
        S["certtitle"])


col = (CONTENT_W - 22) / 2
pairs = [cert_rows[i:i + 2] for i in range(0, len(cert_rows), 2)]
t = Table([[cert_cell(*c) for c in row] for row in pairs], colWidths=[col + 22, col])
t.setStyle(TableStyle([
    ("VALIGN", (0, 0), (-1, -1), "TOP"),
    ("LEFTPADDING", (0, 0), (0, -1), 0),
    ("LEFTPADDING", (1, 0), (1, -1), 22),
    ("RIGHTPADDING", (0, 0), (0, -1), 22),
    ("RIGHTPADDING", (1, 0), (1, -1), 0),
    ("TOPPADDING", (0, 0), (-1, -1), 4),
    ("BOTTOMPADDING", (0, 0), (-1, -1), 4),
    ("LINEBELOW", (0, 0), (-1, -2), 0.6, RULE),
]))
story += cert_head
story.append(t)

# Beyond
story += open_section("Hardware, and away from the screen", None, Paragraph(
    "Three builds from the IEEE SSGMCE Prototype to Product series: an HC-SR04 ultrasonic "
    "monitor on an ESP8266 serving its own page of live readings, built at IIT Bombay; a "
    "Raspberry Pi infrared presence detector; and ESP32 interfacing at Pursuit 2026. All eight "
    "SSGMCE Digital Fablab modules completed, mentoring there since January 2026. State-level "
    "softball; district level in cricket and chess.", S["body"]))


def footer(canvas, doc):
    canvas.saveState()
    canvas.setFont("Archivo-400", 7.6)
    canvas.setFillColor(SLATE)
    canvas.drawString(MARGIN, 24, "Anshuman Rupesh Agrawal")
    canvas.drawRightString(PAGE_W - MARGIN, 24, f"Page {doc.page}")
    canvas.setStrokeColor(RULE)
    canvas.setLineWidth(0.6)
    canvas.line(MARGIN, 36, PAGE_W - MARGIN, 36)
    canvas.restoreState()


doc = BaseDocTemplate(
    OUT, pagesize=A4,
    leftMargin=MARGIN, rightMargin=MARGIN, topMargin=36, bottomMargin=42,
    title="Anshuman Rupesh Agrawal — Resume",
    author="Anshuman Rupesh Agrawal",
    subject="AI/ML and software developer",
)
frame = Frame(MARGIN, 42, CONTENT_W, PAGE_H - 36 - 42, id="body",
              leftPadding=0, rightPadding=0, topPadding=0, bottomPadding=0)
doc.addPageTemplates([PageTemplate(id="page", frames=[frame], onPage=footer)])
doc.build(story)
print("wrote", OUT)
