"""Chromium UI checks. Install test-only tools: pip install playwright beautifulsoup4
Then: playwright install chromium
Run a real preview server, then: python tests/browser_check.py
Use --offline for an in-memory DOM fixture in network-restricted environments.
Offline mode inlines the built CSS/images and combines the unchanged form/UI
modules for execution; it does not test HTTP navigation or external delivery.
"""
from pathlib import Path
import argparse,base64,json,mimetypes,os,time
from bs4 import BeautifulSoup
from playwright.sync_api import sync_playwright
ROOT=Path(__file__).resolve().parents[1]
parser=argparse.ArgumentParser();parser.add_argument('--offline',action='store_true');parser.add_argument('--base-url',default='http://127.0.0.1:4173');parser.add_argument('--screenshots',action='store_true');args=parser.parse_args()
RESULTS=[]
def check(name,condition):
 if not condition:raise AssertionError(name)
 RESULTS.append({'check':name,'result':'PASS'});print('PASS',name,flush=True)
def data_url(file):return 'data:'+(mimetypes.guess_type(str(file))[0]or'application/octet-stream')+';base64,'+base64.b64encode(file.read_bytes()).decode()
def load(page,path='index.html',js=True):
 if not args.offline:
  url='/' if path=='index.html' else '/'+path.removesuffix('index.html')
  page.goto(args.base_url+url,wait_until='networkidle');return
 soup=BeautifulSoup((ROOT/'dist'/path).read_text(),'html.parser')
 for link in list(soup.find_all('link',rel='stylesheet')):
  style=soup.new_tag('style');style.string=(ROOT/'dist'/link['href'].lstrip('/')).read_text();link.replace_with(style)
 for script in list(soup.find_all('script',src=True)):script.decompose()
 for tag in soup.find_all(['img','source']):
  for attr in ['src','srcset']:
   if tag.get(attr,'').startswith('/'):tag[attr]=data_url(ROOT/'dist'/tag[attr].lstrip('/'))
  if tag.name=='img':tag['loading']='eager'
 cd=soup.find(id='certificate-data')
 if cd:
  values=json.loads(cd.string)
  for c in values:c['preview']=data_url(ROOT/'dist'/c['preview'].lstrip('/'))
  cd.string=json.dumps(values)
 # Avoid resetting content in a navigated, destroyed frame. Tests do not follow
 # external links or submit real messages; a fresh document is always used.
 page.set_content(str(soup),wait_until='domcontentloaded')
 if js:
  form=(ROOT/'src/form.mjs').read_text().replace('export const','const').replace('export function','function')
  ui=(ROOT/'src/ui.js').read_text().replace("import { validateMessage } from './form.mjs';",'')
  page.add_script_tag(content='(()=>{'+form+'\n'+ui+'})()')
 page.evaluate("Promise.all([...document.images].map(i=>i.decode().catch(()=>{})))")
def fill_form(page):
 page.locator('#name').fill('Portfolio test');page.locator('#email').fill('portfolio-test@example.com');page.locator('#message').fill('A local automated test, never sent to the real inbox.')

with sync_playwright() as pw:
 executable=os.getenv('CHROMIUM_PATH') or ('/usr/bin/chromium' if Path('/usr/bin/chromium').exists() else None)
 b=pw.chromium.launch(executable_path=executable,headless=True,args=['--no-sandbox'])
 context=b.new_context(viewport={'width':1440,'height':1000},reduced_motion='reduce')
 page=context.new_page();errors=[];page.on('pageerror',lambda error:errors.append(str(error)))
 load(page)
 check('Homepage: one H1 and six rendered projects',page.locator('h1').count()==1 and page.locator('.project-card:visible').count()==6)
 check('Default gallery displays five featured certificates',page.locator('.certificate-card:visible').count()==5)
 for kind,count in [('ml',1),('web',3),('tools',2),('all',6)]:
  page.locator(f'[data-project-filter="{kind}"]').click();check('Project filter: '+kind,page.locator('.project-card:visible').count()==count)
 for kind,count in [('all',9),('internship',2),('course',4),('workshop',2),('recognition',1),('featured',5)]:
  page.locator(f'[data-certificate-filter="{kind}"]').click();check('Certificate filter: '+kind,page.locator('.certificate-card:visible').count()==count)
 opener=page.locator('[data-certificate="cs50p"]');opener.click()
 check('Certificate preview opens with correct title',page.locator('dialog[open]').count()==1 and 'Python' in page.locator('#certificate-modal-title').inner_text())
 check('Certificate preview includes an actual download target',page.locator('#certificate-modal-download').get_attribute('href').endswith('cs50p.pdf'))
 page.keyboard.press('Tab');check('Modal keeps keyboard focus inside',page.evaluate("document.querySelector('dialog').contains(document.activeElement)"))
 page.keyboard.press('Escape');check('Escape closes preview and restores opener focus',page.locator('dialog[open]').count()==0 and opener.evaluate('(el)=>el===document.activeElement'))
 check('Videos make no connection before user activation',page.locator('iframe').count()==0)
 # Prevent any actual network playback in both fixture and HTTP mode.
 page.route('https://www.youtube-nocookie.com/**',lambda r:r.fulfill(status=200,body='<html><body>Test player fixture</body></html>',content_type='text/html'))
 page.locator('[data-video="6BmrqPzGUOw"] button').click()
 check('Click-to-load video uses the supplied ID and privacy-enhanced domain','youtube-nocookie.com/embed/6BmrqPzGUOw' in page.locator('iframe').get_attribute('src'))
 page.locator('.module summary').first.click();check('Fab Lab journey expands',page.locator('.module[open]').count()==1 and page.locator('.module[open] li').count()==5)
 page.locator('.module summary').first.click();check('Fab Lab journey collapses',page.locator('.module[open]').count()==0)
 page.set_viewport_size({'width':390,'height':844});page.locator('.menu-toggle').click()
 check('Mobile menu opens',page.locator('#mobile-menu').is_visible())
 page.keyboard.press('Escape');check('Mobile menu closes and restores toggle focus',not page.locator('#mobile-menu').is_visible() and page.locator('.menu-toggle').evaluate('(el)=>el===document.activeElement'))
 # Validate, without allowing a real network request.
 page.evaluate("window.fetch=async()=>{throw new Error('Unexpected request')}; void 0")
 page.locator('.form-submit').click()
 check('Empty contact form shows errors and focuses name',page.locator('#name-error').inner_text()!='' and page.locator('#name').evaluate('(el)=>el===document.activeElement'))
 fill_form(page);page.locator('#email').fill('not-an-email');page.locator('.form-submit').click()
 check('Invalid email is blocked',page.locator('#email-error').inner_text()!='')
 fill_form(page)
 page.evaluate("window.__requests=[]; window.fetch=async(u,o)=>{window.__requests.push(JSON.parse(o.body));return {ok:true,json:async()=>({success:true})}}; void 0")
 page.locator('.form-submit').click();page.wait_for_function("document.querySelector('#form-status').textContent.includes('submitted successfully')")
 check('Mocked success clears fields without claiming inbox delivery',page.locator('#message').input_value()=='' and 'inbox' not in page.locator('#form-status').inner_text())
 check('Submitted payload contains selected topic and real honeypot state',page.evaluate("__requests.length===1 && __requests[0].topic==='An internship or role' && __requests[0].botcheck===false"))
 fill_form(page);page.evaluate("window.fetch=async()=>({ok:false,json:async()=>({success:false})}); void 0");page.locator('.form-submit').click();page.wait_for_function("document.querySelector('#form-status').classList.contains('error')")
 check('Provider rejection preserves text and shows email fallback',page.locator('#message').input_value()!='' and page.locator('#form-status a').count()==1)
 page.evaluate("window.fetch=async()=>{throw new TypeError('Network failed')}; void 0");page.locator('.form-submit').click();page.wait_for_function("document.querySelector('#form-status').textContent.includes('Check your connection')")
 check('Network failure preserves message and re-enables submit',page.locator('#message').input_value()!='' and page.locator('.form-submit').is_enabled())
 fill_form(page);page.evaluate("window.__requestCount=0;window.fetch=()=>{window.__requestCount++;return new Promise(resolve=>window.__resolveRequest=()=>resolve({ok:true,json:async()=>({success:true})}))}; void 0")
 page.evaluate("const f=document.querySelector('#contact-form');f.dispatchEvent(new Event('submit',{cancelable:true}));f.dispatchEvent(new Event('submit',{cancelable:true}));")
 check('Duplicate submissions create only one request',page.evaluate('__requestCount===1'))
 page.evaluate('__resolveRequest()');page.wait_for_function("!document.querySelector('.form-submit').disabled")
 # Timeout is tested with a virtual clock; it never waits on a real provider.
 fill_form(page);page.clock.install()
 page.evaluate("window.fetch=(_,o)=>new Promise((resolve,reject)=>o.signal.addEventListener('abort',()=>reject(new DOMException('Timed out','AbortError')))); void 0")
 page.locator('.form-submit').click();page.clock.fast_forward(16000)
 page.wait_for_function("document.querySelector('#form-status').textContent.includes('timed out')")
 check('Request timeout preserves the draft and enables retry',page.locator('#message').input_value()!='' and page.locator('.form-submit').is_enabled())
 page.clock.resume()
 # Re-render for clean screenshots and viewport measurements.
 load(page)
 for width in [320,390,768,1024,1440]:
  page.set_viewport_size({'width':width,'height':900})
  check(f'Homepage at {width}px: no horizontal overflow',not page.evaluate('document.documentElement.scrollWidth>innerWidth'))
 page.evaluate("window.scrollTo(0,document.querySelector('#certificates').offsetTop-108)")
 page.wait_for_function("document.querySelector('[data-section=certificates]').getAttribute('aria-current')==='location'")
 check('Navigation highlights the section being read',page.locator('[data-section="certificates"]').get_attribute('aria-current')=='location')
 # Individual pages are tested from the generated HTML, not invented mock pages.
 for path in sorted((ROOT/'dist/projects').glob('*/index.html'))+sorted((ROOT/'dist/certificates').glob('*/index.html')):
  relative=path.relative_to(ROOT/'dist').as_posix();load(page,relative)
  page.set_viewport_size({'width':390,'height':844})
  check('Detail page renders: '+relative,page.locator('h1').count()==1 and not page.evaluate('document.documentElement.scrollWidth>innerWidth'))
 load(page,'privacy/index.html');check('Privacy page renders',page.locator('h1').inner_text()=='Privacy & contact')
 load(page,'404.html');check('404 page renders',page.locator('h1').inner_text()=='This page isn’t here.')
 nojs=b.new_context(java_script_enabled=False,viewport={'width':390,'height':844});np=nojs.new_page()
 if args.offline:load(np,js=False)
 else:np.goto(args.base_url,wait_until='networkidle')
 check('No-JS: all projects and documents remain visible',np.locator('.project-card').count()==6 and np.locator('.certificate-card:visible').count()==9)
 check('No-JS: disabled contact form does not expose a GET submission',not np.locator('#contact-form').is_visible())
 check('No uncaught JavaScript errors in tested pages',not errors)
 if args.screenshots:
  out=ROOT/'docs/previews';out.mkdir(exist_ok=True,parents=True)
  load(page);page.set_viewport_size({'width':1440,'height':1000});page.screenshot(path=str(out/'desktop.png'))
  page.evaluate("window.scrollTo(0,document.querySelector('#work').offsetTop-108)");page.wait_for_timeout(100);page.screenshot(path=str(out/'projects.png'))
  page.evaluate("window.scrollTo(0,document.querySelector('#certificates').offsetTop-108)");page.wait_for_timeout(100);page.screenshot(path=str(out/'certificates.png'))
  page.set_viewport_size({'width':390,'height':844});page.evaluate('window.scrollTo(0,0)');page.screenshot(path=str(out/'mobile.png'))
 b.close()
report={'mode':'offline Chromium DOM fixture' if args.offline else 'Chromium HTTP preview','checks':len(RESULTS),'passed':len(RESULTS),'failed':0,'results':RESULTS,'limitations':['No real messages submitted; provider responses were mocked.','No external video playback or credential verification performed.']+(['HTTP navigation and production CSP were not exercised by the offline browser fixture.']if args.offline else [])}
(ROOT/'docs/browser-test-results.json').write_text(json.dumps(report,indent=2))
print(f'{len(RESULTS)} browser checks passed.')
