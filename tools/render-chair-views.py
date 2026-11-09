"""Bake the three PM-supplied animated GLBs locally; no generated replacements."""
import sys,json,base64,hashlib,zipfile,threading,http.server,functools,os
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1];sys.path.insert(0,str(ROOT/'artifacts/qa-python'))
from playwright.sync_api import sync_playwright
SOURCE=ROOT/'tools/chair-sources';OUT=ROOT/'assets/individual-chairs';OUT.mkdir(exist_ok=True)
class Quiet(http.server.SimpleHTTPRequestHandler):
 def log_message(self,*a):pass
server=http.server.ThreadingHTTPServer(('127.0.0.1',8787),functools.partial(Quiet,directory=str(ROOT)));threading.Thread(target=server.serve_forever,daemon=True).start();rows=[]
try:
 with sync_playwright() as p:
  browser=p.chromium.launch(headless=True,executable_path=os.environ.get('CHROMIUM_PATH') or ('C:/Program Files/Google/Chrome/Application/chrome.exe' if os.name=='nt' else None),args=['--use-angle=swiftshader','--enable-unsafe-swiftshader'])
  for model in sorted(SOURCE.glob('*.glb')):
   print('Rendering '+model.stem,flush=True);ctx=browser.new_context();page=ctx.new_page();page.goto('http://127.0.0.1:8787/tools/render-chair-views.html?views=4&id='+model.stem);page.wait_for_function('chairResult.done',timeout=90000);row=page.evaluate('chairResult');assert not row.get('error'),row
   raw=base64.b64decode(row.pop('data').split(',')[1]);(OUT/(model.stem+'-views.png')).write_bytes(raw);row['url']='/assets/individual-chairs/'+model.stem+'-views.png';row['sha256']=hashlib.sha256(raw).hexdigest();row['sourceSha256']=hashlib.sha256(model.read_bytes()).hexdigest();rows.append(row);ctx.close()
  browser.close()
finally:server.shutdown();(OUT/'views.json').write_text(json.dumps({'source':'PM-supplied individual GLBs and cadeiras-individuais-pilha.zip','assets':rows},ensure_ascii=False,indent=2),encoding='utf-8')
print(json.dumps([{'id':r['id'],'scale':r['scale'],'seats':r['seats'],'clip':r['clip']} for r in rows]))

source=ROOT/'data/continuous/furniture-visuals.json';catalog=json.loads(source.read_text(encoding='utf-8'))
for row in rows:
 asset=next(a for a in catalog['assets'] if a['id']=='chair-'+row['id']);asset.update(url=row['url'],rotationViews=4,bounds=[0,0,row['frameWidth'],row['frameHeight']],anchor=row['projection']['anchor'],projection=row['projection']);asset['animation'].update(frameWidth=row['frameWidth'],frameHeight=row['frameHeight'])
source.write_text(json.dumps(catalog,ensure_ascii=False,indent=2)+'\n',encoding='utf-8');(ROOT/'data/continuous/furniture-visuals.js').write_text('export const FURNITURE_VISUALS=Object.freeze('+json.dumps(catalog,ensure_ascii=False,separators=(',',':'))+');\n',encoding='utf-8')
