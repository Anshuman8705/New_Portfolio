import test from 'node:test';
import { createHash } from 'node:crypto';
import assert from 'node:assert/strict';
import { readFileSync, existsSync, readdirSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { profile,projects,certificates,projectVideos,experience,fablab,meta,contact } from '../src/data.js';
import { validateMessage } from '../src/form.mjs';
import { escapeHtml,safeJson,homePage,caseStudy,certificatePage,layout } from '../src/templates.mjs';
const root=resolve(dirname(fileURLToPath(import.meta.url)),'..');
const valid={name:'Anshuman Agrawal',email:'test@example.com',message:'A project enquiry.'};
test('All six projects have unique stable IDs and real source links',()=>{assert.equal(projects.length,6);assert.equal(new Set(projects.map(p=>p.id)).size,6);projects.forEach(p=>{assert.match(p.repo,/^https:\/\/github\.com\/Anshuman8705\//);assert.equal(p.href,`/projects/${p.id}/`);});});
test('Fifteen supported credentials are represented, not an invented Fab Lab certificate',()=>{assert.equal(certificates.length,15);assert.equal(new Set(certificates.map(c=>c.id)).size,15);assert.equal(certificates.some(c=>c.id==='fablab'),false);});
test('All certificate files and previews are present',()=>{certificates.forEach(c=>{for(const f of [c.document,c.preview,c.thumbnail,c.originalDocument].filter(Boolean))assert.ok(existsSync(join(root,'public',f)),f);});});
test('Source documents are byte-identical to the supplied originals',()=>{const records=JSON.parse(readFileSync(join(root,'docs/source-manifest.json')));assert.equal(records.length,13);for(const record of records){const actual=createHash('sha256').update(readFileSync(join(root,record.path))).digest('hex');assert.equal(actual,record.sha256,record.sourceFilename);}});
test('Photos and resume assets exist',()=>{[profile.photo,profile.photoWebp,profile.resume,meta.ogImage].forEach(f=>assert.ok(existsSync(join(root,'public',f))));});
test('Equal-contribution wording is retained for both team projects',()=>{const a=projects.find(p=>p.id==='dermai').contribution;const b=projects.find(p=>p.id==='expense').contribution;assert.match(a,/Tanushri Khawale/);assert.match(a,/equally/);assert.match(b,/Rahul Paghrut/);assert.match(b,/equally/);});
test('Expense project uses the public .NET source',()=>{assert.equal(projects.find(p=>p.id==='expense').repo,'https://github.com/Anshuman8705/.NET-Final-Project');});
test('Research boundary and project-reported metrics are visible',()=>{const html=caseStudy(projects.find(p=>p.id==='dermai'));assert.match(html,/not intended for clinical decision-making/i);assert.match(html,/Project-reported evaluation/);assert.match(html,/low-confidence fallback/);});
test('Source-supported internship dates are used',()=>{assert.equal(experience.find(x=>x.where==='IEEE EMBS Pune Chapter').when,'1–30 Jun 2026');assert.equal(experience.find(x=>x.where.startsWith('Webstack')).when,'3 Sep–20 Nov 2025');});
test('AWS and Red Hat have the correct training/attendance labels',()=>{assert.equal(certificates.find(c=>c.id==='redhat-rh104').kind,'Course attendance');assert.equal(certificates.find(c=>c.id==='aws-foundations').date,'2026');assert.ok(certificates.find(c=>c.id==='aws-foundations').note.includes('05/06/2026'));});
test('Credential links match the supplied documents',()=>{assert.equal(certificates.filter(c=>c.credentialUrl).length,6);assert.match(certificates.find(c=>c.id==='cs50p').credentialUrl,/dda7d5fe-37ad-4894-a37c-62e425103aad$/);});
test('Two owner-supplied videos are distinct from application demos',()=>{assert.deepEqual(projectVideos.map(v=>v.youtubeId),['6BmrqPzGUOw','MpdouLRX3zw']);assert.ok(!projects.find(p=>p.id==='expense').videoId);assert.ok(!homePage().includes('<iframe'));});
test('All eight Fab Lab module journeys remain',()=>{assert.equal(fablab.modules.length,8);fablab.modules.forEach(m=>assert.ok(m.days.length>0));});
test('HTML escaping prevents markup injection',()=>{assert.equal(escapeHtml('<img a="x" &\'>'),'&lt;img a=&quot;x&quot; &amp;&#39;&gt;');});
test('JSON script data cannot terminate its own script',()=>{assert.ok(!safeJson({title:'</script><script>alert(1)</script>'}).includes('<'));});
test('Home and all detail pages have one H1',()=>{for(const body of [homePage(),...projects.map(caseStudy),...certificates.map(certificatePage)])assert.equal((body.match(/<h1[ >]/g)||[]).length,1);});
test('Generated pages include static metadata and a canonical URL',()=>{const html=layout({body:homePage(),home:true});assert.match(html,/<link rel="canonical"/);assert.match(html,/application\/ld\+json/);assert.match(html,/<html lang="en-IN">/);});
test('No-JS fallbacks link to real detail pages',()=>{assert.match(homePage(),/href="\/certificates\/cs50p\/"/);assert.match(homePage(),/href="\/projects\/dermai\/"/);assert.match(homePage(),/<details class="module">/);});
test('Valid contact data is trimmed',()=>{const r=validateMessage({...valid,name:' Anshuman Agrawal '});assert.equal(r.valid,true);assert.equal(r.values.name,'Anshuman Agrawal');});
test('Missing contact fields all have actionable errors',()=>{const r=validateMessage({});assert.equal(r.valid,false);assert.deepEqual(Object.keys(r.errors),['name','email','message']);});
test('Contact rejects bad email and excessive lengths',()=>{assert.ok(validateMessage({...valid,email:'not an address'}).errors.email);assert.ok(validateMessage({...valid,name:'a'.repeat(101)}).errors.name);assert.ok(validateMessage({...valid,message:'x'.repeat(5001)}).errors.message);});
test('No font files, dependencies, or private environment files are packaged as public assets',()=>{const walk=dir=>readdirSync(dir,{withFileTypes:true}).flatMap(x=>x.isDirectory()?walk(join(dir,x.name)):[join(dir,x.name)]);assert.deepEqual(walk(join(root,'public')).filter(f=>/\.(woff2?|ttf|otf|eot|env)$/i.test(f)),[]);assert.equal(Object.keys(JSON.parse(readFileSync(join(root,'package.json'))).dependencies||{}).length,0);});

test('ANSHUVO branding, source, and live demo match the current project',()=>{
 const p=projects.find(p=>p.id==='anshuvo');
 assert.equal(p.title,'ANSHUVO');
 assert.equal(p.repo,'https://github.com/Anshuman8705/Anshuvo');
 assert.equal(p.demo,'https://anshuvo.onrender.com/');
 assert.equal(p.href,'/projects/anshuvo/');
 for(const html of [homePage(),caseStudy(p)]) {
  assert.match(html,/https:\/\/anshuvo.onrender.com\//);
  assert.doesNotMatch(html,/NimbusMart|Amazon\.clone|nimbusmart\.onrender/);
 }
});
test('Contact details match the GitHub profile',()=>{
 assert.equal(contact.github,'https://github.com/Anshuman8705');
 assert.equal(contact.linkedin,'https://www.linkedin.com/in/anshumanagrawal08072005/');
 assert.equal(contact.email,'anshumanagrawal89@gmail.com');
});
