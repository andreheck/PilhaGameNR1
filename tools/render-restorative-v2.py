import sys,json,base64,hashlib,zipfile,threading,http.server,functools,os
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1];sys.path.insert(0,str(ROOT/'artifacts/qa-python'))
from playwright.sync_api import sync_playwright
SOURCE=ROOT/'tools/restorative-sources/patio-sala-v2.zip';WORK=ROOT/'artifacts/restorative-v2';OUT=ROOT/'assets/restorative-v2';WORK.mkdir(exist_ok=True);OUT.mkdir(exist_ok=True)
with zipfile.ZipFile(SOURCE) as z:
 for i in z.infolist():
  if i.is_dir():continue
  target=WORK/i.filename
  if not target.resolve().is_relative_to(WORK.resolve()):raise ValueError('Unsafe path')
  target.parent.mkdir(parents=True,exist_ok=True);target.write_bytes(z.read(i))
class Quiet(http.server.SimpleHTTPRequestHandler):
 def log_message(self,*a):pass
server=http.server.ThreadingHTTPServer(('127.0.0.1',8778),functools.partial(Quiet,directory=str(ROOT)));threading.Thread(target=server.serve_forever,daemon=True).start();rows=[]
try:
 with sync_playwright() as p:
  browser=p.chromium.launch(headless=True,executable_path=os.environ.get('CHROMIUM_PATH') or ('C:/Program Files/Google/Chrome/Application/chrome.exe' if os.name=='nt' else None),args=['--use-angle=swiftshader','--enable-unsafe-swiftshader'])
  for model in sorted((WORK/'glb').glob('*.glb')):
   print('Rendering '+model.stem,flush=True);ctx=browser.new_context();page=ctx.new_page();page.goto('http://127.0.0.1:8778/tools/render-restorative-v2.html?id='+model.stem);page.wait_for_function('restResult.done',timeout=90000);row=page.evaluate('restResult');assert not row.get('error'),row;image=base64.b64decode(row.pop('data').split(',')[1]);(OUT/(model.stem+'.png')).write_bytes(image);row['url']='/assets/restorative-v2/'+model.stem+'.png';row['sha256']=hashlib.sha256(image).hexdigest();row['sourceSha256']=hashlib.sha256(model.read_bytes()).hexdigest();rows.append(row);ctx.close()
  browser.close()
finally:server.shutdown();(OUT/'catalog.json').write_text(json.dumps({'source':'pilha-itens-patio-sala-restaurativa-v2.zip','sourceSha256':hashlib.sha256(SOURCE.read_bytes()).hexdigest(),'unit':'meter','assets':rows},ensure_ascii=False,indent=2),encoding='utf-8')
print(json.dumps([{'id':r['id'],'scale':r['scale'],'seats':len(r['seats']),'clip':r['clip']} for r in rows]))
