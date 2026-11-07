"""Video → interactive cast → existing onboarding, using isolated browser storage."""
import sys,os,json,http.server,threading,functools,base64
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1];sys.path.insert(0,str(ROOT/'artifacts/qa-python'))
from playwright.sync_api import sync_playwright
OUT=ROOT/'artifacts/cinematic-qa';OUT.mkdir(parents=True,exist_ok=True);manifest=json.loads((ROOT/'data/continuous/intro-cast.json').read_text(encoding='utf-8'));report=[]
class Quiet(http.server.SimpleHTTPRequestHandler):
 def log_message(self,*a):pass
server=http.server.ThreadingHTTPServer(('127.0.0.1',8777),functools.partial(Quiet,directory=str(ROOT/'dist')));threading.Thread(target=server.serve_forever,daemon=True).start()
try:
 with sync_playwright() as p:
  b=p.chromium.launch(headless=True,executable_path=os.environ.get('CHROMIUM_PATH') or ('C:/Program Files/Google/Chrome/Application/chrome.exe' if os.name=='nt' else None))
  for width,height in [(1366,768),(390,844),(844,390),(320,640)]:
   ctx=b.new_context(viewport={'width':width,'height':height},has_touch=width<900);page=ctx.new_page();errors=[];page.on('pageerror',lambda e:errors.append(str(e)));page.goto('http://127.0.0.1:8777/');page.locator('.cinematic-start').wait_for()
   before=page.evaluate('JSON.stringify(localStorage)');page.wait_for_function('document.querySelector(".cinematic-film video").readyState>=2');page.wait_for_function('document.querySelector(".cinematic-film video").currentTime>.15');video=page.locator('video').evaluate('(v)=>({width:v.videoWidth,height:v.videoHeight,loop:v.loop,muted:v.muted,inline:v.playsInline})');assert video==dict(width=1280,height=720,loop=True,muted=True,inline=True);assert page.locator('.pi-root').count()==0
   box=page.locator('.cinematic-start').bounding_box();assert box['y']>=0 and box['y']+box['height']<=height;assert page.evaluate('document.documentElement.scrollWidth<=innerWidth+1');page.screenshot(path=str(OUT/('video-'+str(width)+'x'+str(height)+'.png')))
   page.locator('.cinematic-start').focus();page.keyboard.press('Enter');page.locator('.pi-invite').wait_for(state='visible');assert page.locator('.cinematic-intro').count()==0
   page.wait_for_function('document.querySelector(".pi-root").getIntroCastStatus()?.loaded===15')
   for sector in range(3):
    page.locator('.pi-tab[data-env="'+str(sector)+'"]').click();page.wait_for_timeout(250);first=page.locator('.pi-root').evaluate('(e)=>e.getIntroCastStatus()');page.wait_for_function('(a)=>{const n=document.querySelector(".pi-root").getIntroCastStatus();return n.drawn.some(p=>a.drawn.some(q=>p.id===q.id&&(p.x!==q.x||p.y!==q.y||p.frame!==q.frame)));}',arg=first,timeout=8000);page.screenshot(path=str(OUT/('sector-'+str(sector)+'-'+str(width)+'x'+str(height)+'.png')))
   cast=page.locator('.pi-root').evaluate('(e)=>e.getIntroCastStatus()');assert len(cast['drawn'])==15;assert page.evaluate('JSON.stringify(localStorage)')==before
   page.locator('.pi-skip').click();page.locator('.living-guide[open]').wait_for();assert page.locator('.pi-root').count()==0;assert not errors,errors;report.append({'viewport':[width,height],'video':video,'cast':cast,'errors':errors});ctx.close()
  # Failed media and reduced motion never block the explicit transition.
  ctx=b.new_context(viewport={'width':390,'height':844},reduced_motion='reduce');page=ctx.new_page();page.route('**/ao-trabalho-intro.mp4',lambda r:r.abort());page.goto('http://127.0.0.1:8777/');page.locator('.cinematic-start').wait_for();assert page.locator('video').evaluate('(v)=>v.paused');page.locator('.cinematic-start').click();page.locator('.pi-invite').wait_for(state='visible');ctx.close()
  # One compact contact sheet for inspection of every prepared model.
  ctx=b.new_context(viewport={'width':960,'height':660});page=ctx.new_page();page.goto('http://127.0.0.1:8777/');data=page.evaluate("""async(rows)=>{const c=document.createElement('canvas');c.width=960;c.height=660;const x=c.getContext('2d');x.fillStyle='#15283e';x.fillRect(0,0,960,660);for(let i=0;i<rows.length;i++){const m=rows[i],img=new Image();img.src=m.file;await img.decode();const a=i%5*192,b=Math.floor(i/5)*220;x.drawImage(img,256,0,128,192,a+32,b+5,128,192);x.fillStyle='#fff';x.font='12px system-ui';x.fillText(m.name,a+8,b+210);}return c.toDataURL('image/png');}""",manifest['models']);(OUT/'cast-contact.png').write_bytes(base64.b64decode(data.split(',')[1]));ctx.close();b.close()
finally:server.shutdown();(OUT/'report.json').write_text(json.dumps(report,ensure_ascii=False,indent=2),encoding='utf-8')
print(json.dumps({'viewports':len(report),'models':15,'fallbackAndReducedMotion':True}))
