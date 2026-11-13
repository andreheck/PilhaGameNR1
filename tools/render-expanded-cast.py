"""Bake selected supplied GLB clips locally; source paths stay outside the public build."""
import sys,os,json,hashlib,base64,http.server,threading,urllib.parse,subprocess
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1];sys.path.insert(0,str(ROOT/'artifacts/qa-python'))
from playwright.sync_api import sync_playwright
from PIL import Image
if not (ROOT/'artifacts/expanded-cast-source-map.json').exists():subprocess.run([sys.executable,str(ROOT/'tools/prepare-expanded-cast.py')],check=True)
SOURCE=json.loads((ROOT/'artifacts/expanded-cast-source-map.json').read_text(encoding='utf-8'));OUT=ROOT/'assets/expanded-cast';OUT.mkdir(parents=True,exist_ok=True)
class Handler(http.server.SimpleHTTPRequestHandler):
 def __init__(self,*a,**k):super().__init__(*a,directory=str(ROOT),**k)
 def log_message(self,*a):pass
 def do_GET(self):
  path=urllib.parse.urlparse(self.path).path
  if path.startswith('/config/'):
   key=path.split('/')[-1];row=SOURCE.get(key)
   if not row:self.send_error(404);return
   data=json.dumps({k:v for k,v in row.items() if k not in ['path','animations']}).encode();self.send_response(200);self.end_headers();self.wfile.write(data);return
  if path.startswith('/source/'):
   parts=path.split('/');row=SOURCE.get(parts[2]);name=urllib.parse.unquote(parts[-1]);source=Path(row['path']) if row else None
   target=source if name in ['model.glb','model.fbx'] else source.parent/name if source and name in (row.get('textures') or {}).values() else None
   if not target or not target.is_file():self.send_error(404);return
   self.send_response(200);self.send_header('Content-Length',str(target.stat().st_size));self.end_headers();self.wfile.write(target.read_bytes());return
  super().do_GET()
server=http.server.ThreadingHTTPServer(('127.0.0.1',8791),Handler);threading.Thread(target=server.serve_forever,daemon=True).start();manifest={'version':1,'scope':'Supplied cast roles; only confirmed employee IDs are bound','actors':[]}
manifestFile=ROOT/'data/continuous/expanded-cast.json'
if manifestFile.exists():manifest=json.loads(manifestFile.read_text(encoding='utf-8'))
try:
 with sync_playwright() as p:
  browser=p.chromium.launch(headless=True,executable_path=os.environ.get('CHROMIUM_PATH') or ('C:/Program Files/Google/Chrome/Application/chrome.exe' if os.name=='nt' else None),args=['--use-angle=swiftshader','--enable-unsafe-swiftshader','--disable-gpu-shader-disk-cache','--disk-cache-size=1'])
  for key,row in SOURCE.items():
   if '--missing-only' in sys.argv and any(a['id']==key for a in manifest['actors']):continue
   print('Rendering '+key,flush=True);ctx=browser.new_context();page=ctx.new_page();page.goto('http://127.0.0.1:8791/tools/render-expanded-cast.html?id='+key,wait_until='domcontentloaded');page.wait_for_function('expandedResult.done',timeout=300000);result=page.evaluate('expandedResult');assert not result.get('error'),result
   for e in result.pop('exports'):
    raw=base64.b64decode(e['data'].split(',')[1]);file=OUT/(key+'-'+e['key']+'.png');file.write_bytes(raw);im=Image.open(file).convert('RGBA');assert im.getbbox() is not None;assert im.getextrema()[0][1]>0,'Black texture export';meta=result['actions'][e['key']];assert im.size==(meta['frames']*128,768);distinct=len({im.crop((f*128,0,(f+1)*128,192)).tobytes() for f in range(meta['frames'])});assert meta['frames']==1 or distinct>1,'Static animation';meta.update(url='/assets/expanded-cast/'+file.name,sha256=hashlib.sha256(raw).hexdigest(),distinctFrames=distinct,bytes=len(raw))
   raw=base64.b64decode(result.pop('portrait').split(',')[1]);(OUT/(key+'-portrait.png')).write_bytes(raw);portraitFile=OUT/(key+'-portrait.png');portraitImage=Image.open(portraitFile).convert('RGBA');box=portraitImage.getbbox();portraitImage.crop((max(0,box[0]-15),max(0,box[1]-12),min(portraitImage.width,box[2]+15),min(portraitImage.height,box[3]+12))).save(portraitFile);result.update(name=row['name'],sector=row['sector'],source=Path(row['path']).name,sourceSha256=row['sourceSha256'],sourceBytes=Path(row['path']).stat().st_size,portrait='/assets/expanded-cast/'+key+'-portrait.png',binding='NPC-07' if key=='mariana' else 'NPC-16' if key=='beatriz' else None)
   manifest['actors']=[a for a in manifest['actors'] if a['id']!=key]+[result];manifestFile.write_text(json.dumps(manifest,ensure_ascii=False,indent=2)+'\n',encoding='utf-8');print(key+' '+str(len(result['actions']))+' clips',flush=True);ctx.close()
  browser.close()
finally:server.shutdown()
