import { cpSync, existsSync, mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, resolve, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';
import { projects, certificates, meta } from '../src/data.js';
import { layout, homePage, caseStudy, certificatePage, privacyPage, notFoundPage, projectsPage, learningPage, experiencePage } from '../src/templates.mjs';

const root=resolve(dirname(fileURLToPath(import.meta.url)),'..');
const dist=join(root,'dist');
function walk(dir){return readdirSync(dir,{withFileTypes:true}).flatMap(entry=>entry.isDirectory()?walk(join(dir,entry.name)):[join(dir,entry.name)]);}
const forbidden=walk(join(root,'public')).filter(p=>/\.(ttf|otf|woff2?|eot|env)$/i.test(p));
if(forbidden.length)throw new Error('Unexpected private or font assets in public: '+forbidden.join(', '));
rmSync(dist,{recursive:true,force:true});mkdirSync(dist,{recursive:true});
cpSync(join(root,'public'),dist,{recursive:true});mkdirSync(join(dist,'assets'),{recursive:true});
const hash=text=>createHash('sha256').update(text).digest('hex').slice(0,12);
const form=readFileSync(join(root,'src/form.mjs'),'utf8');const formName=`assets/form-${hash(form)}.js`;
const css=readFileSync(join(root,'src/styles.css'),'utf8');const cssName=`assets/styles-${hash(css)}.css`;
const js=readFileSync(join(root,'src/ui.js'),'utf8').replace("'./form.mjs'",JSON.stringify('/'+formName));const jsName=`assets/ui-${hash(js)}.js`;
for(const [name,content] of [[formName,form],[cssName,css],[jsName,js]])writeFileSync(join(dist,name),content);
const assetNames={css:cssName,js:jsName};
const preview=process.env.VERCEL_ENV==='preview'||process.env.PORTFOLIO_NOINDEX==='1';
// Content-addressed project images can be cached without serving stale revisions.
const versionedDir=join(dist,'assets/versioned');mkdirSync(versionedDir,{recursive:true});
const imageUrls=new Map();
for(const p of projects){
 for(const url of [p.screenshot,...(p.gallery||[]).map(g=>g.image)].filter(Boolean)){
  if(imageUrls.has(url))continue;
  const bytes=readFileSync(join(root,'public',url));
  const name=url.split('/').pop();const dot=name.lastIndexOf('.');
  const versioned=`/assets/versioned/${name.slice(0,dot)}-${hash(bytes)}${name.slice(dot)}`;
  writeFileSync(join(dist,versioned),bytes);imageUrls.set(url,versioned);
 }
}
const versionImages=html=>{for(const [original,versioned] of imageUrls)html=html.replaceAll(original,versioned);return html;};
const pages=[{path:'/',filename:'index.html',home:true,body:homePage()},
 {path:'/projects/',filename:'projects/index.html',body:projectsPage(),title:'Projects & walkthroughs — Anshuman Agrawal',description:'Explore six projects by Anshuman Agrawal: machine learning, .NET, commerce and learning tools, with source code, screenshots and walkthroughs.'},
 {path:'/learning/',filename:'learning/index.html',body:learningPage(),title:'Fab Lab & learning — Anshuman Agrawal',description:'Explore Anshuman Agrawal’s eight Digital Fablab modules, hardware prototypes and hands-on learning in software, electronics and fabrication.'},
 {path:'/experience/',filename:'experience/index.html',body:experiencePage(),title:'Experience & leadership — Anshuman Agrawal',description:'Anshuman Agrawal’s internships, mentoring and technical leadership in machine learning, software development and robotics.'},
 ...projects.map(p=>({path:p.href,filename:`projects/${p.id}/index.html`,body:caseStudy(p),title:`${p.title} — Anshuman Agrawal`,description:p.body})),
 ...certificates.map(c=>({path:c.href,filename:`certificates/${c.id}/index.html`,body:certificatePage(c),title:`${c.title} — Anshuman Agrawal`,description:`${c.kind} · ${c.issuer} · ${c.date}. ${c.description}`})),
 {path:'/privacy/',filename:'privacy/index.html',body:privacyPage(),title:'Privacy & site information — Anshuman Agrawal',description:'How contact messages, videos and documents work on this portfolio.'},
 {path:'/404.html',filename:'404.html',body:notFoundPage(),title:'Page not found — Anshuman Agrawal',noindex:true}];
for(const page of pages){const file=join(dist,page.filename);mkdirSync(dirname(file),{recursive:true});writeFileSync(file,versionImages(layout({...page,noindex:preview||page.noindex,assetNames})));}
// Legacy project URLs are handled by permanent host redirects.
const indexable=pages.filter(p=>!p.noindex);
writeFileSync(join(dist,'sitemap.xml'),`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${indexable.map(p=>`\n<url><loc>${meta.siteUrl}${p.path}</loc></url>`).join('')}\n</urlset>\n`);
writeFileSync(join(dist,'robots.txt'),`User-agent: *\n${preview?'Disallow: /':'Allow: /'}\nSitemap: ${meta.siteUrl}/sitemap.xml\n`);
writeFileSync(join(dist,'build-info.json'),JSON.stringify({version:'2.0.0',contentUpdated:meta.contentUpdated,htmlPages:pages.length,projects:projects.length,certificates:certificates.length,build:'Native Node.js static rendering; no framework runtime or package dependencies'},null,2));
for(const file of walk(dist).filter(f=>f.endsWith('.html'))){
 const html=readFileSync(file,'utf8');
 for(const match of html.matchAll(/(?:href|src)="(\/(?!\/)[^"#?]*)/g)){
  const path=decodeURIComponent(match[1]);const target=join(dist,path,path.endsWith('/')?'index.html':'');
  if(path&&!existsSync(target))throw new Error(`Missing asset/link ${path} from ${file}`);
 }
}
console.log(`Built ${pages.length} HTML pages: ${projects.length} case studies, ${certificates.length} certificate pages, home, privacy and 404.`);
console.log('All local page and asset references resolve. Output: dist/');
