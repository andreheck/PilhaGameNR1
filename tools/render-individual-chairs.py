"""Bake the three PM-supplied animated GLBs locally; no generated replacements."""
import sys,json,base64,hashlib,zipfile,threading,http.server,functools,os
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1];sys.path.insert(0,str(ROOT/'artifacts/qa-python'))
from playwright.sync_api import sync_playwright
SOURCE=ROOT/'tools/chair-sources';OUT=ROOT/'assets/individual-chairs';OUT.mkdir(exist_ok=True)
class Quiet(http.server.SimpleHTTPRequestHandler):
 def log_message(self,*a):pass
server=http.server.ThreadingHTTPServer(('127.0.0.1',8781),functools.partial(Quiet,directory=str(ROOT)));threading.Thread(target=server.serve_forever,daemon=True).start();rows=[]
try:
 with sync_playwright() as p:
  browser=p.chromium.launch(headless=True,executable_path=os.environ.get('CHROMIUM_PATH') or ('C:/Program Files/Google/Chrome/Application/chrome.exe' if os.name=='nt' else None),args=['--use-angle=swiftshader','--enable-unsafe-swiftshader'])
  for model in sorted(SOURCE.glob('*.glb')):
   print('Rendering '+model.stem,flush=True);ctx=browser.new_context();page=ctx.new_page();page.goto('http://127.0.0.1:8781/tools/render-individual-chairs.html?id='+model.stem);page.wait_for_function('chairResult.done',timeout=90000);row=page.evaluate('chairResult');assert not row.get('error'),row
   raw=base64.b64decode(row.pop('data').split(',')[1]);(OUT/(model.stem+'.png')).write_bytes(raw);row['url']='/assets/individual-chairs/'+model.stem+'.png';row['sha256']=hashlib.sha256(raw).hexdigest();row['sourceSha256']=hashlib.sha256(model.read_bytes()).hexdigest();rows.append(row);ctx.close()
  browser.close()
 with zipfile.ZipFile(SOURCE/'cadeiras-individuais-pilha.zip') as z:
  for row in rows:
   icon=next((n for n in z.namelist() if n.endswith('/'+row['id']+'_icone.png')),None)
   raw=z.read(icon) if icon else (Path('C:/Users/CRM7/Downloads')/(row['id']+'_icone.png')).read_bytes()
   (OUT/(row['id']+'-icon.png')).write_bytes(raw);row['icon']='/assets/individual-chairs/'+row['id']+'-icon.png';row['iconSha256']=hashlib.sha256(raw).hexdigest()
finally:server.shutdown();(OUT/'catalog.json').write_text(json.dumps({'source':'PM-supplied individual GLBs and cadeiras-individuais-pilha.zip','assets':rows},ensure_ascii=False,indent=2),encoding='utf-8')
print(json.dumps([{'id':r['id'],'scale':r['scale'],'seats':r['seats'],'clip':r['clip']} for r in rows]))
