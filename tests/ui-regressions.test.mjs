import test from 'node:test';
import assert from 'node:assert/strict';
import { homePage, layout, caseStudy, certificatePage } from '../src/templates.mjs';
import { projects, certificates, profile } from '../src/data.js';

const html=layout({body:homePage(),home:true});
test('All four home resume links use plain Resume wording',()=>{
  assert.equal((html.match(/>Download Resume</g)||[]).length,2);
  assert.equal((html.match(/>Resume</g)||[]).length,2);
  assert.doesNotMatch(html,/résumé/i);
});
test('Resume download URLs and filenames are unchanged',()=>{
  const links=[...html.matchAll(/<a\b[^>]*\bdownload="([^"]+)"[^>]*>[^<]*Resume</g)];
  assert.equal(links.length,4);
  for(const match of links){assert.equal(match[1],profile.resumeFilename);assert.ok(match[0].includes(`href="${profile.resume}"`));}
});
test('Project and certificate page navigation also uses plain Resume',()=>{
  for(const body of [...projects.map(caseStudy),...certificates.map(certificatePage)]){
    const page=layout({body});assert.doesNotMatch(page,/résumé/i);assert.match(page,/>Resume</);
  }
});
test('Contact heading keeps a word separator when its line break is hidden',()=>{
  assert.match(homePage(),/Something worth<br> building together\?/);
});
test('Contact submit label and arrow are separate so async states preserve the icon',()=>{
  assert.match(homePage(),/<span data-submit-label>Send message<\/span><svg/);
});
