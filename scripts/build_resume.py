"""Regenerate the two-page resume from src/data.js (requires reportlab).
No font files or external downloads are required. The website build itself
uses only Node and does not need Python; the generated PDF is included.
"""
from pathlib import Path
import json, subprocess
from xml.sax.saxutils import escape
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, PageBreak, Table, TableStyle, KeepTogether
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib import colors
from reportlab.lib.enums import TA_LEFT
from reportlab.lib.pagesizes import A4

ROOT=Path(__file__).resolve().parents[1]
js="import * as d from './src/data.js'; console.log(JSON.stringify(d));"
d=json.loads(subprocess.check_output(['node','--input-type=module','-e',js],cwd=ROOT,text=True,encoding='utf-8'))
OUT=ROOT/'public/assets/Anshuman_Agrawal_Resume.pdf'
S=getSampleStyleSheet()
ink=colors.HexColor('#202923'); muted=colors.HexColor('#59625b'); accent=colors.HexColor('#733447')
for name,kw in {
 'Name':dict(fontName='Helvetica-Bold',fontSize=24,leading=28,textColor=ink,spaceAfter=6),
 'Subtitle':dict(fontName='Helvetica',fontSize=10.5,leading=14,textColor=accent,spaceAfter=7),
 'ContactLine':dict(fontName='Helvetica',fontSize=8.1,leading=11,textColor=muted,spaceAfter=3),
 'Section':dict(fontName='Helvetica-Bold',fontSize=11.2,leading=14,textColor=accent,spaceBefore=13,spaceAfter=7),
 'Role':dict(fontName='Helvetica-Bold',fontSize=10.2,leading=13,textColor=ink,spaceAfter=3),
 'Meta':dict(fontName='Helvetica',fontSize=8.4,leading=11,textColor=muted,spaceAfter=5),
 'BodyResume':dict(fontName='Helvetica',fontSize=9.1,leading=13,textColor=ink,spaceAfter=6),
 'SmallResume':dict(fontName='Helvetica',fontSize=8.5,leading=12,textColor=muted,spaceAfter=5),
}.items(): S.add(ParagraphStyle(name,**kw))
E=lambda v:escape(str(v))
P=lambda text,style='BodyResume':Paragraph(text,S[style])
link=lambda url,label:f'<link href="{E(url)}" color="#733447">{E(label)}</link>'
story=[]
profile=d['profile']; contact=d['contact']
story.extend([P(E(profile['fullName']),'Name'),P('AI/ML &amp; full-stack developer | Python, .NET and MERN','Subtitle'),P(link('mailto:'+contact['email'],contact['email'])+' | Shegaon, Maharashtra, India','ContactLine'),P(link(contact['github'],'GitHub: Anshuman8705')+' | '+link(contact['linkedin'],'LinkedIn')+' | '+link(d['meta']['siteUrl'],'Portfolio & project evidence'),'ContactLine')])
story.append(P('PROFILE','Section'))
story.append(P('Third-year B.E. Information Technology student at SSGMCE Shegaon and an AI/ML Developer Intern at One Smarter, Inc. Work spans machine learning research prototypes, account-based web applications and hardware prototyping, with an emphasis on practical implementation and honest evaluation.'))
story.append(P('EXPERIENCE','Section'))
for x in d['experience']:
 text=x['body']
 if x['title']=='AI/ML Developer Intern': text='Healthcare data automation: transforming EDI transaction data into structured formats and generating reports. Proprietary implementation remains private.'
 if x['title']=='AI/ML Intern': text='Collaborative model development, evaluation and application work for DermAI Monitor under Dr. Ankita Tidake. Co-authored an IEEE-format manuscript covering methods, results and limitations; publication is not asserted.'
 story.extend([P(E(x['title']),'Role'),P(E(x['where'])+' | '+E(x['when']),'Meta'),P(E(text))])
story.append(P('TECHNICAL SKILLS','Section'))
for s in d['skills']:
 story.append(P('<b>'+E(s['group'])+':</b> '+E(s['items']),'SmallResume'))
story.append(P('EDUCATION','Section'))
story.append(P('<b>B.E. Information Technology</b> | Shri Sant Gajanan Maharaj College of Engineering, Shegaon<br/>September 2024–July 2028 (expected). CGPA 8.57 across the first three semesters.'))
story.append(PageBreak())
story.append(P('SELECTED PROJECTS','Section'))
for id in ['dermai','expense','nimbusmart','homely']:
 x=next(p for p in d['projects'] if p['id']==id)
 story.append(P(E(x['title']),'Role'))
 story.append(P(E(x['category'])+' | '+link(x['repo'],'Source code')+' | '+link(d['meta']['siteUrl']+x['href'],'Case study'),'Meta'))
 story.append(P(E(x['body'])))
 if id in ['dermai','expense']: story.append(P(E(x['contribution']),'SmallResume'))
 if id=='dermai': story.append(P('Project-reported results: 68.97% accuracy, 0.9143 macro ROC-AUC, 0.5426 macro F1. Research use only—not for clinical decisions. The documented low-confidence fallback is a known safety limitation.','SmallResume'))
 if id=='expense': story.append(P('Controller/service/data separation, EF Core with SQLite, account-scoped queries and decimal-based calculations. The repository includes HTTP smoke-test instructions; no current pass count is claimed.','SmallResume'))
 if id=='nimbusmart': story.append(P('React, Express, SQLite and Tailwind CSS. Demo payments only; no real goods, charges or shipments.','SmallResume'))
 story.append(Spacer(1,5))
story.append(P('CERTIFICATES & TRAINING','Section'))
for id in ['cs50p','ieee-internship','webstack-internship','aws-foundations','redhat-rh104']:
 c=next(c for c in d['certificates'] if c['id']==id)
 story.append(P('<b>'+E(c['title'])+'</b> — '+E(c['issuer'])+'<br/>'+E(c['kind'])+' | '+E(c['date'])+' | '+link(d['meta']['siteUrl']+c['href'],'View document'),'SmallResume'))
story.append(P('More credentials: iBase AI/ML training, NxtWave workshop, Pursuit 2026 participation and TCS Tech Day appreciation. Original documents are on the portfolio.','SmallResume'))
story.append(P('HARDWARE & LEADERSHIP','Section'))
story.append(P('Eight SSGMCE Digital Fablab learning modules; member since March 2025 and mentor since January 2026. Hardware work includes an ESP8266 ultrasonic monitor, Raspberry Pi IR detector and ESP32 prototyping. State-level softball; district-level cricket and chess.','SmallResume'))

def page(canvas,doc):
 canvas.saveState(); width,height=A4
 canvas.setStrokeColor(colors.HexColor('#d7dcd4'));canvas.line(42,35,width-42,35)
 canvas.setFont('Helvetica',7.5);canvas.setFillColor(muted)
 canvas.drawString(42,23,'Anshuman Rupesh Agrawal | Portfolio updated 9 September 2026')
 canvas.drawRightString(width-42,23,f'{doc.page}')
 if doc.page>1:
  canvas.setFont('Helvetica-Bold',8);canvas.setFillColor(ink);canvas.drawString(42,height-28,'ANSHUMAN AGRAWAL / PROJECTS & CREDENTIALS')
 canvas.restoreState()
OUT.parent.mkdir(parents=True,exist_ok=True)
doc=SimpleDocTemplate(str(OUT),pagesize=A4,rightMargin=42,leftMargin=42,topMargin=43,bottomMargin=47,title='Anshuman Agrawal — Resume',author=profile['fullName'])
doc.build(story,onFirstPage=page,onLaterPages=page)
print(OUT)
