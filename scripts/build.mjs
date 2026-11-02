import { cpSync, existsSync, mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, resolve, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';
import { projects, certificates, meta } from '../src/data.js';
import { layout, homePage, caseStudy, certificatePage, privacyPage, notFoundPage, projectsPage, learningPage } from '../src/templates.mjs';

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
const pages=[{path:'/',filename:'index.html',home:true,body:homePage()},
 {path:'/projects/',filename:'projects/index.html',body:projectsPage(),title:'Projects & walkthroughs — Anshuman Agrawal'},
 {path:'/learning/',filename:'learning/index.html',body:learningPage(),title:'Experience & learning — Anshuman Agrawal'},
 ...projects.map(p=>({path:p.href,filename:`projects/${p.id}/index.html`,body:caseStudy(p),title:`${p.title} — Anshuman Agrawal`,description:p.body})),
 ...certificates.map(c=>({path:c.href,filename:`certificates/${c.id}/index.html`,body:certificatePage(c),title:`${c.title} — Anshuman Agrawal`,description:`${c.kind} · ${c.issuer} · ${c.date}. ${c.description}`})),
 {path:'/privacy/',filename:'privacy/index.html',body:privacyPage(),title:'Privacy & site information — Anshuman Agrawal',description:'How contact messages, videos and documents work on this portfolio.'},
 {path:'/404.html',filename:'404.html',body:notFoundPage(),title:'Page not found — Anshuman Agrawal',noindex:true}];
for(const page of pages){const file=join(dist,page.filename);mkdirSync(dirname(file),{recursive:true});writeFileSync(file,layout({...page,noindex:preview||page.noindex,assetNames}));}
// Preserve the old case-study link on static hosts as well as Vercel.
const legacyPage=join(dist,'projects/nimbusmart/index.html');
mkdirSync(dirname(legacyPage),{recursive:true});
writeFileSync(legacyPage,`<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="robots" content="noindex, follow"><meta http-equiv="refresh" content="0;url=/projects/anshuvo/"><link rel="canonical" href="${meta.siteUrl}/projects/anshuvo/"><title>ANSHUVO — project page moved</title></head><body><p>This project is now ANSHUVO. <a href="/projects/anshuvo/">Continue to the case study</a>.</p></body></html>`);
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
