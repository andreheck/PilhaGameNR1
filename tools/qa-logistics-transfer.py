"""Isolated desktop/tablet logistics and portable-save controls; no real saves."""
import os,sys,json,http.server,threading,functools
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1];sys.path.insert(0,str(ROOT/'artifacts/qa-python'))
from playwright.sync_api import sync_playwright
OUT=ROOT/'artifacts/logistics-transfer';OUT.mkdir(exist_ok=True);report=[]
class Quiet(http.server.SimpleHTTPRequestHandler):
 def log_message(self,*a):pass
server=http.server.ThreadingHTTPServer(('127.0.0.1',8798),functools.partial(Quiet,directory=str(ROOT/'dist')));threading.Thread(target=server.serve_forever,daemon=True).start()
try:
 with sync_playwright() as p:
  b=p.chromium.launch(headless=True,executable_path=os.environ.get('CHROMIUM_PATH') or ('C:/Program Files/Google/Chrome/Application/chrome.exe' if os.name=='nt' else None),args=['--disable-gpu-shader-disk-cache','--disk-cache-size=1'])
  for width,height in [(1440,900),(1024,768)]:
   c=b.new_context(viewport={'width':width,'height':height});page=c.new_page();errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
   def snap(name):page.screenshot(path=str(OUT/(name+'-'+str(width)+'.png')))
   try:
    page.goto('http://127.0.0.1:8798/');page.evaluate("""async()=>{const M=await import('/simulation/company-continuous.js'),L=await import('/simulation/company-living.js');let s=L.ensureLiving(M.fresh());s.team={principal:'PILHA-H01',support:'PILHA-H02'};s.paused=true;s.events.nextWeek=999;s.lastWallMs=Date.now();localStorage.setItem(M.KEY,JSON.stringify(s));}""");page.reload();page.locator('.cinematic-resume').click();page.locator('.pm-root').wait_for();page.wait_for_function('(()=>{const f=PilhaLiving.getFurniture();return f&&f.loaded===f.assets;})()');before=page.evaluate('PilhaLiving.getState()');annex=page.evaluate('PilhaLiving.getLogisticsSpace()');assert len(annex['items'])==6;assert sum(i['fixedScene'] for i in annex['items'])==1;assert not page.evaluate('PilhaLiving.getEditableFurniture().some(i=>i.key==="logistics:approved-diorama")');page.locator('.living-more summary').click();page.locator('[data-company=logistics]').click();page.wait_for_timeout(700);snap('warehouse')
    actor=page.evaluate("""async()=>{const M=await import('/simulation/company-continuous.js');for(let i=0;i<220;i++){const s=PilhaLiving.getState();s.activeMs=i*s.clockWeekMs/225;s.lastWallMs=Date.now();localStorage.setItem(M.KEY,JSON.stringify(s));await PilhaLiving.syncClock();const p=PilhaLiving.getEmployees().find(p=>p.sector==='producao'&&p.x>12&&p.carrying==='box');if(p)return p;}return null;}""");assert actor,'existing worker should reach cargo apron carrying material';snap('worker-carrying');assert len(page.evaluate('PilhaLiving.getEmployees()'))==16
    page.locator('.living-more summary').click();page.locator('[data-company=settings]').click();page.locator('[data-settings-backup]').click();page.locator('[data-backup-export]').wait_for();
    with page.expect_download() as dl:page.locator('[data-backup-export]').click()
    assert dl.value.suggested_filename.endswith('.json');file=page.evaluate("async()=>{const B=await import('/simulation/save-transfer.js');return B.exportBackup(localStorage);}");backup=json.loads(file);week=json.loads(backup['storage']['pilha-company-continuous-v2'])['week'];page.locator('[data-backup-file]').set_input_files({'name':'backup.json','mimeType':'application/json','buffer':file.encode()});page.locator('[data-backup-confirm]:not([hidden])').wait_for();snap('import-preview');page.locator('[data-backup-confirm]').click();page.locator('.cinematic-resume').wait_for();page.locator('.cinematic-resume').click();page.locator('.pm-root').wait_for();after=page.evaluate('PilhaLiving.getState()');assert after['paused'] and after['week']==week;assert all(before[k]==after[k] for k in ['budget','receipts','team','staff']);assert not errors,errors;report.append({'viewport':[width,height],'annex':True,'carryingWorker':actor['id'],'backupUIRoundTrip':True,'errors':errors});c.close()
   except Exception:snap('FAILED');raise
  b.close()
finally:server.shutdown();(OUT/'report.json').write_text(json.dumps(report,indent=2))
print(json.dumps(report))
