"""Focused offline Chromium regression checks for the UI review.
Test-only dependencies: playwright, beautifulsoup4.
Run after npm run build: python tests/ui_review.py
The fixture renders actual built markup, CSS and assets. Local modules are
combined for execution only because this environment blocks browser network
navigation. These are not live Vercel, email-delivery or video-playback tests.
"""
from pathlib import Path
import json,re,os
from playwright.sync_api import sync_playwright
from ui_fixture import load
ROOT=Path(__file__).resolve().parents[1];RESULTS=[]
def check(name,passed):
 if not passed:raise AssertionError(name)
 RESULTS.append({'check':name,'result':'PASS'});print('PASS',name,flush=True)
def aligned(rows,key):
 groups={}
 for row in rows:groups.setdefault(round(row['top']),[]).append(row[key])
 return all(max(values)-min(values)<1 for values in groups.values())
with sync_playwright() as pw:
 binary=os.environ.get('CHROMIUM_PATH') or ('/usr/bin/chromium' if Path('/usr/bin/chromium').exists() else None)
 b=pw.chromium.launch(executable_path=binary,headless=True,args=['--no-sandbox']);p=b.new_page(viewport={'width':1440,'height':1000},reduced_motion='reduce');errors=[];p.on('pageerror',lambda e:errors.append(str(e)))
 load(p,ROOT)
 check('Four home download links display Resume without accents',p.locator('.nav-resume,.hero-actions a[download],.mobile-nav a[download],.contact-socials a[download]').evaluate_all("es=>es.length===4&&es.every(e=>e.textContent.includes('Resume')&&!e.textContent.includes('é'))"))
 widths=[320,360,375,390,414,600,601,640,700,720,721,768,820,821,1024,1080,1081,1280,1440,1920]
 for w in widths:
  p.set_viewport_size({'width':w,'height':900})
  check(f'Home {w}px: no horizontal overflow',p.evaluate('document.documentElement.scrollWidth<=innerWidth'))
 for w in [320,360,375]:
  p.set_viewport_size({'width':w,'height':844});r=p.locator('.hero-actions a').evaluate_all('es=>es.map(e=>({w:e.getBoundingClientRect().width,y:e.getBoundingClientRect().y,h:e.getBoundingClientRect().height}))')
  check(f'{w}px: stacked hero buttons have matching width and height',abs(r[0]['w']-r[1]['w'])<1 and abs(r[0]['h']-r[1]['h'])<1 and r[1]['y']>r[0]['y'])
 for w in [601,640,700,720]:
  p.set_viewport_size({'width':w,'height':900})
  check(f'{w}px: small-tablet portrait sits below text, not beside a cramped column',p.evaluate("document.querySelector('.portrait').getBoundingClientRect().top>=document.querySelector('.hero-copy').getBoundingClientRect().bottom"))
  check(f'{w}px: project cards use one readable column',p.locator('.project-grid').evaluate("e=>getComputedStyle(e).gridTemplateColumns.split(' ').length===1"))
 for w in [320,640,768,1440]:
  p.set_viewport_size({'width':w,'height':900})
  check(f'{w}px: contact heading keeps words separated',re.sub(r'\s+',' ',p.locator('.contact-copy h2').inner_text()).strip()=='Something worth building together?')
 for w in [721,768,821,1024,1081,1440]:
  p.set_viewport_size({'width':w,'height':1000})
  rows=p.locator('.project-card').evaluate_all("es=>es.map(e=>({top:e.getBoundingClientRect().top,body:e.querySelector('.project-card-body>p').getBoundingClientRect().top,action:e.querySelector('.project-actions').getBoundingClientRect().top}))")
  check(f'{w}px: project summaries align within each row',aligned(rows,'body'))
  check(f'{w}px: project action rows align',aligned(rows,'action'))
 p.set_viewport_size({'width':390,'height':844})
 check('Mobile form controls use readable 16px text',p.locator('.contact-form input:not([type="checkbox"]),.contact-form select,.contact-form textarea').evaluate_all("es=>es.every(e=>getComputedStyle(e).fontSize==='16px')"))
 p.locator('#name').fill('Local UI test');p.locator('#email').fill('test@example.com');p.locator('#message').fill('A local test. Not sent to an inbox.')
 p.evaluate("window.fetch=()=>new Promise(resolve=>window.__finish=()=>resolve({ok:false,json:async()=>({success:false})}));void 0")
 w0=p.locator('.form-submit').bounding_box()['width'];p.locator('.form-submit').click()
 check('Sending state preserves arrow and announces busy state',p.locator('.form-submit svg').count()==1 and p.locator('.form-submit').get_attribute('aria-busy')=='true')
 p.evaluate('__finish()');p.wait_for_function("!document.querySelector('.form-submit').disabled")
 check('Failure restores label and arrow without width shift',p.locator('.form-submit svg').count()==1 and p.locator('[data-submit-label]').inner_text()=='Send message' and abs(p.locator('.form-submit').bounding_box()['width']-w0)<1)
 p.evaluate("window.fetch=async()=>({ok:true,json:async()=>({success:true})});void 0");p.locator('.form-submit').click();p.wait_for_function("document.querySelector('#form-status').classList.contains('success')")
 check('Successful retry also preserves the arrow',p.locator('.form-submit svg').count()==1 and p.locator('#message').input_value()=='')
 p.evaluate('document.execCommand=()=>false;void 0');p.locator('[data-copy]').click()
 check('Copy fallback leaves keyboard focus on the button',p.locator('[data-copy]').evaluate('e=>e===document.activeElement'))
 # Block any real provider call. A browser admin policy may block the frame itself;
 # this check concerns our parent page focus and iframe attributes, not playback.
 p.route('https://www.youtube-nocookie.com/**',lambda r:r.fulfill(status=200,content_type='text/html',body='<p>Offline player fixture</p>'))
 p.locator('[data-video="6BmrqPzGUOw"] button').click()
 check('Loading a video moves focus off the hidden trigger to its frame',p.locator('iframe').evaluate('e=>e===document.activeElement') and p.locator('iframe').get_attribute('tabindex')=='0')
 p.locator('[data-certificate="cs50p"]').click()
 check('Mobile certificate dialog stays inside the viewport',p.locator('dialog').evaluate('e=>{const r=e.getBoundingClientRect();return r.left>=0&&r.right<=innerWidth&&r.height<=innerHeight}'))
 p.keyboard.press('Escape')
 check('Certificate close restores the opener focus',p.locator('[data-certificate="cs50p"]').evaluate('e=>e===document.activeElement'))
 # Check all generated pages at mobile/tablet/desktop sizes, including 404.
 pages=sorted((ROOT/'dist').rglob('*.html'))
 for f in pages:
  load(p,ROOT,str(f.relative_to(ROOT/'dist')))
  ok=True
  for w in [320,768,1440]:
   p.set_viewport_size({'width':w,'height':900})
   ok=ok and p.evaluate('document.documentElement.scrollWidth<=innerWidth')
  check(f'All three viewports fit: {f.relative_to(ROOT/"dist")}',ok)
 check('No uncaught UI JavaScript errors',not errors)
 b.close()
report=ROOT/'docs/ui-review-results.json';report.write_text(json.dumps({'scope':'Offline built-page Chromium fixtures; no external delivery or playback','checks':RESULTS},indent=2))
print(f'{len(RESULTS)} focused UI checks passed.')
