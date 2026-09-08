import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { projects, projectVideos, certificates, profile, contact, fablab, meta } from '../src/data.js';
const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const project = id => projects.find(p => p.id === id);
const source = p => readFileSync(resolve(root, p), 'utf8');

test('project IDs are unique and existing six projects remain represented', () => {
  assert.equal(projects.length, 6);
  assert.equal(new Set(projects.map(p => p.id)).size, projects.length);
  for (const id of ['dermai','expense','nimbusmart','homely','flashy','dotnet']) assert.ok(project(id));
});
test('featured order is DermAI, Expense, NimbusMart', () => {
  assert.deepEqual(projects.filter(p => p.featured).map(p => p.id), ['dermai','expense','nimbusmart']);
});
test('DermAI keeps collaborator and equal contribution in two sentences', () => {
  const text = project('dermai').contribution;
  assert.match(text, /Tanushri Khawale/); assert.match(text, /equally/);
  assert.equal(text.match(/\.(?:\s|$)/g)?.length, 2);
});
test('Expense keeps collaborator and equal contribution in two sentences', () => {
  const text = project('expense').contribution;
  assert.match(text, /Rahul Paghrut/); assert.match(text, /equally/);
  assert.equal(text.match(/\.(?:\s|$)/g)?.length, 2);
});
test('Expense uses the newly public repository and no stale private label', () => {
  assert.equal(project('expense').repo, 'https://github.com/Anshuman8705/.NET-Final-Project');
  assert.equal(project('expense').repoPending, undefined);
});
test('NimbusMart uses current stack and supplied live URL', () => {
  assert.equal(project('nimbusmart').demo, 'https://nimbusmart.onrender.com/');
  assert.ok(project('nimbusmart').tags.includes('React'));
  assert.equal(project('nimbusmart').repo, 'https://github.com/Anshuman8705/Amazon.clone');
});
test('DermAI retains the clinical-use boundary and known fallback limitation', () => {
  assert.match(project('dermai').callout.body, /Not intended for clinical decision-making/);
  assert.match(project('dermai').callout.body, /melanoma/);
  assert.ok(project('dermai').figures.every(f => f.label === 'Classes' || f.label.startsWith('Reported')));
});
test('the CS50 link is preserved separately from the Expense project', () => {
  assert.equal(projectVideos.find(v => v.id === 'cs50').url, 'https://youtu.be/6BmrqPzGUOw');
  assert.ok(!JSON.stringify(project('expense')).includes('6BmrqPzGUOw'));
});
test('the Webstack video ID is preserved', () => {
  assert.equal(projectVideos.find(v => v.id === 'webstack').url, 'https://youtu.be/MpdouLRX3zw');
});
test('both videos are described as walkthroughs, not live applications', () => {
  assert.equal(projectVideos.length, 2);
  assert.ok(projectVideos.every(v => /walkthrough/i.test(v.title)));
  assert.match(source('src/components/ProjectVideos.jsx'), /Recorded presentations, separate/);
});
test('no autoplay, third-party embed, or injected HTML was introduced', () => {
  const text = source('src/components/ProjectVideos.jsx');
  assert.doesNotMatch(text, /<iframe|<script|dangerouslySetInnerHTML|autoPlay=/);
});
test('every project, video and credential URL uses HTTPS', () => {
  const urls = [
    ...projects.flatMap(p => [p.repo, p.demo]), ...projectVideos.map(v => v.url),
    ...certificates.map(c => c.credentialUrl), contact.linkedin, contact.github, meta.siteUrl,
  ].filter(Boolean);
  for (const url of urls) assert.equal(new URL(url).protocol, 'https:');
});
test('credential entries do not assert unverified Credly validation', () => {
  assert.equal(certificates.length, 6);
  assert.doesNotMatch(JSON.stringify(certificates), /Credly verified/i);
  assert.ok(certificates.every(c => !c.credentialUrl || c.credentialUrl.startsWith('https://')));
});
test('project notes use native accessible details and link labels describe purpose', () => {
  const text = source('src/components/Projects.jsx');
  assert.match(text, /<details/); assert.match(text, /<summary/);
  assert.match(text, /View source/); assert.match(text, /View live demo/);
  assert.match(text, /Team contribution/);
});
test('new external-link components use new-tab isolation', () => {
  for (const file of ['Projects.jsx','ProjectVideos.jsx','Skills.jsx']) {
    const text = source('src/components/' + file);
    const tags = text.match(/<a\b[\s\S]*?>/g) || [];
    for (const tag of tags) if (tag.includes('target="_blank"')) assert.ok(tag.includes('rel="noopener noreferrer"'));
  }
});
test('photo and resume paths remain present in original project', () => {
  for (const path of [profile.photo, profile.photoWebp, profile.resume]) {
    assert.ok(existsSync(resolve(root, 'public', path.replace(/^\//, ''))), path);
  }
});
test('all eight Fab Lab modules are retained', () => {
  assert.equal(fablab.modules.length, 8);
  assert.ok(fablab.modules.every(m => m.title && m.days.length > 0));
});
test('all relative source imports resolve to files', () => {
  function walk(dir) {
    return readdirSync(dir).flatMap(n => {
      const p = resolve(dir,n); return statSync(p).isDirectory() ? walk(p) : [p];
    });
  }
  for (const file of walk(resolve(root,'src')).filter(p => /\.(jsx?|mjs)$/.test(p))) {
    const text = readFileSync(file,'utf8');
    for (const match of text.matchAll(/(?:from\s*|import\s*)["'](\.[^"']+)["']/g)) {
      assert.ok(existsSync(resolve(dirname(file),match[1])), `${file}: ${match[1]}`);
    }
  }
});
