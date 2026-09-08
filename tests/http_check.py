"""Check that the preview server serves every built file correctly.
Run `npm run preview` first. No third-party URLs are requested.
"""
from pathlib import Path
import http.client,json,hashlib
from urllib.parse import quote
ROOT=Path(__file__).resolve().parents[1]
base=ROOT/'dist';results=[]
for file in sorted(base.rglob('*')):
 if not file.is_file():continue
 rel=file.relative_to(base).as_posix()
 if rel in ['_headers']:continue
 path='/'+rel
 if rel=='index.html':path='/'
 elif rel.endswith('/index.html'):path='/'+rel[:-len('index.html')]
 conn=http.client.HTTPConnection('127.0.0.1',4173,timeout=10)
 conn.request('GET',quote(path));response=conn.getresponse();data=response.read()
 assert response.status==200,(path,response.status)
 assert hashlib.sha256(data).digest()==hashlib.sha256(file.read_bytes()).digest(),path
 if file.suffix=='.pdf':assert response.getheader('Content-Type')=='application/pdf',path
 if file.suffix=='.js':assert 'javascript' in response.getheader('Content-Type'),path
 conn.close();results.append({'path':path,'status':200,'bytes':len(data),'matchesBuiltFile':True})
for method,path,expected in [('GET','/missing-portfolio-page',404),('GET','/projects/dermai',301),('POST','/',405),('HEAD','/',200)]:
 conn=http.client.HTTPConnection('127.0.0.1',4173,timeout=10);conn.request(method,path);r=conn.getresponse();body=r.read();assert r.status==expected,(method,path,r.status)
 if method=='HEAD':assert not body
 conn.close();results.append({'method':method,'path':path,'status':expected})
report={'checks':len(results),'passed':len(results),'failed':0,'method':'HTTP against the local Node preview server; built file bodies compared byte-for-byte','results':results}
(ROOT/'docs/http-test-results.json').write_text(json.dumps(report,indent=2))
print(f'{len(results)} local HTTP checks passed.')
