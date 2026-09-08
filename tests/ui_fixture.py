from pathlib import Path
from bs4 import BeautifulSoup
import base64,json,mimetypes

def data_url(file):
 return 'data:'+(mimetypes.guess_type(str(file))[0] or 'application/octet-stream')+';base64,'+base64.b64encode(file.read_bytes()).decode()

def load(page,root,path='index.html',js=True):
 root=Path(root);soup=BeautifulSoup((root/'dist'/path).read_text(),'html.parser')
 for link in list(soup.find_all('link',rel='stylesheet')):
  style=soup.new_tag('style');style.string=(root/'dist'/link['href'].lstrip('/')).read_text();link.replace_with(style)
 for script in list(soup.find_all('script',src=True)):script.decompose()
 for tag in soup.find_all(['img','source']):
  for attr in ['src','srcset']:
   if tag.get(attr,'').startswith('/'):tag[attr]=data_url(root/'dist'/tag[attr].lstrip('/'))
  if tag.name=='img':tag['loading']='eager'
 cd=soup.find(id='certificate-data')
 if cd:
  values=json.loads(cd.string)
  for c in values:c['preview']=data_url(root/'dist'/c['preview'].lstrip('/'))
  cd.string=json.dumps(values)
 page.set_content(str(soup),wait_until='domcontentloaded')
 if js:
  form=(root/'src/form.mjs').read_text().replace('export const','const').replace('export function','function')
  ui=(root/'src/ui.js').read_text().replace("import { validateMessage } from './form.mjs';",'')
  page.add_script_tag(content='(()=>{'+form+'\n'+ui+'})()')
 page.evaluate("Promise.all([...document.images].map(i=>i.decode().catch(()=>{})))")
