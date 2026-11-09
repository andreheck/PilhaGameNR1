"""Real pointer drag, keyboard placement, save/cancel and physical work poses."""
import os,sys,json,threading,functools,http.server
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1];sys.path.insert(0,str(ROOT/'artifacts/qa-python'))
from playwright.sync_api import sync_playwright
OUT=ROOT/'artifacts/furniture-editor';OUT.mkdir(parents=True,exist_ok=True);report=[]
class Quiet(http.server.SimpleHTTPRequestHandler):
 def log_message(self,*a):pass
server=http.server.ThreadingHTTPServer(('127.0.0.1',8788),functools.partial(Quiet,directory=str(ROOT/'dist')));threading.Thread(target=server.serve_forever,daemon=True).start()
try:
 with sync_playwright() as p:
  browser=p.chromium.launch(headless=True,executable_path=os.environ.get('CHROMIUM_PATH') or ('C:/Program Files/Google/Chrome/Application/chrome.exe' if os.name=='nt' else None))
  for width,height in [(1366,768),(390,844)]:
   ctx=browser.new_context(viewport={'width':width,'height':height});page=ctx.new_page();errors=[];page.on('pageerror',lambda e:errors.append(getattr(e,'stack',str(e))))
   def snap(name):page.screenshot(path=str(OUT/(name+'-'+str(width)+'.png')))
   def open_editor():page.locator('.living-more summary').click();page.locator('[data-company="layout"]').click();page.locator('.furniture-editor').wait_for()
   def resume():page.locator('.cinematic-resume').click();page.locator('.pm-root').wait_for()
   try:
    page.goto('http://127.0.0.1:8788/');page.evaluate("""async()=>{const M=await import('/simulation/company-continuous.js'),L=await import('/simulation/company-living.js');let s=L.ensureLiving(M.fresh());s.team={principal:'PILHA-H01',support:'PILHA-H02'};s.paused=true;s.events.nextWeek=999;s.lastWallMs=Date.now();s=M.purchase(s,M.quote(s,'escritorio','cadeira-producao',{targetId:'NPC-01'})).state;localStorage.setItem(M.KEY,JSON.stringify(s));}""");page.reload();resume();page.wait_for_function('PilhaLiving.getFurniture()?.loaded===38');before=page.evaluate('PilhaLiving.getState()');snap('floor-before-edit');open_editor()
    # Find a valid manual displacement from the actual rendered geometry.
    choice=page.evaluate("""async()=>{const {validatePlacement}=await import('/simulation/furniture-layout.js');const all=PilhaLiving.getEditableFurniture(),rooms=PilhaLiving.getFurnitureLayout();for(let i=0;i<all.length;i++){const r=all[i];if(r.sid!=='escritorio'||!r.name.includes('Planta'))continue;const items=rooms.find(c=>c.id===r.sid).items.map(b=>({...b,t:b.type,layoutHidden:b.hidden}));for(const [dx,dy] of [[.25,0],[-.25,0],[0,.25],[0,-.25],[.5,0],[0,.5]]){const proposed={...items.find(b=>b.layoutKey===r.key),x:r.x+dx,y:r.y+dy};if(validatePlacement(proposed,items,r.sid).ok)return {index:i,row:r,dx,dy};}}throw Error('No movable plant');}""")
    page.locator('[data-layout-select]').select_option(str(choice['index']));page.wait_for_timeout(500)
    # Derive the current isometric projection from three known world/screen pairs.
    drag=page.evaluate("""c=>{const a=PilhaLiving.getEditableFurniture().filter(r=>r.sid===c.row.sid),r=a.find(r=>r.key===c.row.key),p=a[0],q=a.find(t=>Math.abs(t.x-p.x)>.5),z=a.find(t=>Math.abs((q.x-p.x)*(t.y-p.y)-(q.y-p.y)*(t.x-p.x))>.2);const x=t=>t.x+t.w/2,y=t=>t.y+t.d/2,A=x(q)-x(p),B=y(q)-y(p),C=x(z)-x(p),D=y(z)-y(p),det=A*D-B*C,screenDx=q.screen[0]-p.screen[0],screenDz=z.screen[0]-p.screen[0],screenDy=q.screen[1]-p.screen[1],screenDyZ=z.screen[1]-p.screen[1],mx=(screenDx*D-screenDz*B)/det,my=(A*screenDz-C*screenDx)/det,nx=(screenDy*D-screenDyZ*B)/det,ny=(A*screenDyZ-C*screenDy)/det;return {x:r.bounds.x+r.bounds.w*.5,y:r.bounds.y+r.bounds.h*.45,dx:mx*c.dx+my*c.dy,dy:nx*c.dx+ny*c.dy};}""",choice)
    canvas=page.locator('.pm-canvas').bounding_box();page.mouse.move(canvas['x']+drag['x'],canvas['y']+drag['y']);page.mouse.down();page.mouse.move(canvas['x']+drag['x']+drag['dx'],canvas['y']+drag['y']+drag['dy'],steps=8);page.mouse.up();assert 'Posição ajustada' in page.locator('.layout-status').inner_text(),page.locator('.layout-status').inner_text();snap('dragged')
    page.locator('[data-layout-save]').click();page.locator('.furniture-editor').wait_for(state='detached');saved=page.evaluate('PilhaLiving.getState()');pose=saved['furnitureLayout']['rooms']['escritorio'][choice['row']['key']];assert abs(pose['x']-choice['row']['x']-choice['dx'])<.051 and abs(pose['y']-choice['row']['y']-choice['dy'])<.051
    assert all(saved[k]==before[k] for k in ['budget','receipts','staff','week','activeMs']);page.reload();resume();placed=page.evaluate('(key)=>PilhaLiving.getEditableFurniture().find(r=>r.key===key)',choice['row']['key']);assert abs(placed['x']-pose['x'])<.001 and abs(placed['y']-pose['y'])<.001
    open_editor();chair=page.evaluate("""()=>{const a=PilhaLiving.getEditableFurniture();const i=a.findIndex(r=>r.sid==='escritorio'&&r.canRotate);return {index:i,row:a[i]};}""");assert chair['index']>=0;page.locator('[data-layout-select]').select_option(str(chair['index']));page.wait_for_timeout(400);page.locator('[data-layout-rotate]').click();assert 'Posição ajustada' in page.locator('.layout-status').inner_text();snap('rotated');page.locator('[data-layout-save]').click();page.locator('.furniture-editor').wait_for(state='detached');assert page.evaluate('(key)=>PilhaLiving.getState().furnitureLayout.rooms.escritorio[key].turn',chair['row']['key'])==1;page.reload();resume();assert page.evaluate('(key)=>PilhaLiving.getEditableFurniture().find(r=>r.key===key).turn',chair['row']['key'])==1
    # Invalid placement is rejected; cancel restores the prior committed layout.
    prior=page.evaluate('PilhaLiving.getState().furnitureLayout');open_editor();page.locator('[data-layout-select]').select_option(str(chair['index']));page.wait_for_timeout(350)
    for _ in range(24):page.locator('[data-layout-dx="-0.25"]').click()
    assert page.locator('.layout-status').get_attribute('data-valid')=='false';page.locator('[data-layout-cancel]').click();page.locator('.furniture-editor').wait_for(state='detached');assert page.evaluate('PilhaLiving.getState().furnitureLayout')==prior
    activities=page.evaluate("""async()=>{const M=await import('/simulation/company-continuous.js');const seen={};for(let n=0;n<200;n++){let s=PilhaLiving.getState();s.activeMs=n*s.clockWeekMs/210;s.lastWallMs=Date.now();localStorage.setItem(M.KEY,JSON.stringify(s));await PilhaLiving.syncClock();for(const p of PilhaLiving.getEmployees())if(['sit-down','computer','stand-up','handling','moving-material'].includes(p.activity)&&!seen[p.activity])seen[p.activity]=p;if(Object.keys(seen).length===5)break;}return seen;}""");assert all(k in activities for k in ['sit-down','computer','stand-up','handling','moving-material']),activities.keys()
    # Capture an actual seated workstation, after its approach route has completed.
    sample=activities['computer'];page.evaluate("""async()=>{const M=await import('/simulation/company-continuous.js');for(let n=0;n<210;n++){let s=PilhaLiving.getState();s.activeMs=n*s.clockWeekMs/210;s.lastWallMs=Date.now();localStorage.setItem(M.KEY,JSON.stringify(s));await PilhaLiving.syncClock();if(PilhaLiving.getEmployees().some(p=>p.activity==='computer'))return;}}""");snap('working')
    if width==1366:
     open_editor();other=ctx.new_page();other.goto('http://127.0.0.1:8788/');other.evaluate("""async()=>{const M=await import('/simulation/company-continuous.js');const s=JSON.parse(localStorage.getItem(M.KEY));s.budget+=7;localStorage.setItem(M.KEY,JSON.stringify(s));}""");page.locator('.furniture-editor').wait_for(state='detached');assert not page.locator('[data-company=layout]').is_disabled();other.close()
    assert not errors,errors;report.append({'viewport':[width,height],'savedMove':pose,'rotation':1,'cancelAndCollision':True,'activities':list(activities),'errors':errors});ctx.close()
   except Exception:
    snap('FAILED');raise
  browser.close()
finally:server.shutdown();(OUT/'report.json').write_text(json.dumps(report,ensure_ascii=False,indent=2),encoding='utf-8')
print(json.dumps(report))
