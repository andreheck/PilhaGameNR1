"""Saved-entry navigation, settings and synthetic health orb in actual Chrome."""
import os,sys,json,threading,functools,http.server
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1];sys.path.insert(0,str(ROOT/'artifacts/qa-python'))
from playwright.sync_api import sync_playwright
OUT=ROOT/'artifacts/entry-settings-orb';OUT.mkdir(parents=True,exist_ok=True);report=[]
class Quiet(http.server.SimpleHTTPRequestHandler):
 def log_message(self,*a):pass
server=http.server.ThreadingHTTPServer(('127.0.0.1',8784),functools.partial(Quiet,directory=str(ROOT/'dist')));threading.Thread(target=server.serve_forever,daemon=True).start()
try:
 with sync_playwright() as p:
  browser=p.chromium.launch(headless=True,executable_path=os.environ.get('CHROMIUM_PATH') or ('C:/Program Files/Google/Chrome/Application/chrome.exe' if os.name=='nt' else None))
  for width,height in [(1366,768),(390,844),(844,390),(320,740)]:
   ctx=browser.new_context(viewport={'width':width,'height':height});page=ctx.new_page();errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
   def snap(name):page.screenshot(path=str(OUT/(name+'-'+str(width)+'.png')))
   def resume():page.locator('.cinematic-resume').click();page.locator('.pm-root').wait_for();assert page.locator('.continuous-gallery-dialog,.living-guide').count()==0
   def home():
    logo=page.locator('dialog[open] [data-game-home]').last if page.locator('dialog[open]').count() else page.locator('[data-game-home]:visible').first
    logo.click();page.locator('.cinematic-resume').wait_for()
   def settings():
    page.locator('.living-more summary').click();page.locator('[data-company="settings"]').click();page.locator('.game-settings[open]').wait_for()
   try:
    page.goto('http://127.0.0.1:8784/');page.locator('.cinematic-start').wait_for();assert not page.locator('.cinematic-resume').count()
    page.evaluate("""async()=>{const M=await import('/simulation/company-continuous.js'),L=await import('/simulation/company-living.js');const s=L.ensureLiving(M.fresh());s.team={principal:'PILHA-H01',support:'PILHA-H02'};s.paused=true;s.budget=4321;s.events.nextWeek=999;s.lastWallMs=Date.now();localStorage.setItem(M.KEY,JSON.stringify(s));}""");page.reload();page.locator('.cinematic-resume').wait_for();snap('returning');resume()
    saved=page.evaluate('PilhaLiving.getState()');assert saved['budget']==4321 and saved['paused'];assert len(page.evaluate('PilhaLiving.getEmployees()'))==16
    summary=page.evaluate('PilhaLiving.getCollectiveHealth()');assert summary['count']==16;assert page.locator('.collective-orb-mini b').inner_text()==str(summary['score']);assert page.locator('.collective-health-widget').is_visible()
    page.locator('.collective-health-widget').click();page.locator('.collective-health-dialog[open]').wait_for();assert 'nenhum dado de saúde real' in page.locator('.collective-health-dialog').inner_text();snap('health-details');home();assert page.evaluate('PilhaLiving.getState().budget')==4321;resume()
    settings();page.locator('[data-preference="sound"]').uncheck();page.locator('[data-preference="motion"]').select_option('reduced');page.locator('[data-preference="showOrb"]').uncheck();assert page.evaluate('PilhaLiving.audio().muted');assert not page.locator('.collective-health-widget').is_visible();snap('settings');page.locator('[data-preference="showOrb"]').check();page.locator('[data-settings-close]').click()
    path=page.locator('.collective-orb-mini path').first.get_attribute('d');page.wait_for_timeout(220);assert page.locator('.collective-orb-mini path').first.get_attribute('d')==path
    home();assert page.locator('video').evaluate('v=>v.paused');page.locator('[data-game-settings]').click();assert not page.locator('[data-preference="sound"]').is_checked();page.keyboard.press('Escape');resume();assert page.evaluate('PilhaLiving.getPreferences().motion')=='reduced'
    # Secondary exploration is available without forcing the original tutorial or hero choice.
    home();page.locator('.cinematic-start').click();page.locator('.pi-skip').click();page.locator('.pm-root').wait_for();assert not page.locator('.continuous-gallery-dialog,.living-guide').count()
    # Voluntary gallery remains accessible; home discards its unsaved draft.
    page.locator('.living-more summary').click();page.locator('[data-company="heroes"]').click();page.locator('.continuous-gallery-dialog[open]').wait_for();home();assert page.evaluate('PilhaLiving.getState().team')==saved['team'];resume()
    settings();page.locator('[data-preference="motion"]').select_option('full');page.locator('[data-settings-close]').click();page.locator('[data-company="pause"]').click();page.wait_for_function('PilhaLiving.getState().paused===false');a=page.locator('.collective-orb-mini path').first.get_attribute('d');page.wait_for_function('(a)=>document.querySelector(".collective-orb-mini path").getAttribute("d")!==a',arg=a,timeout=10000)
    # Different collective health drives color and deformation, no synthetic robot inclusion.
    page.evaluate("""async()=>{const M=await import('/simulation/company-continuous.js');const s=PilhaLiving.getState();Object.values(s.staff).forEach(a=>a.health=20);s.paused=true;s.lastWallMs=Date.now();localStorage.setItem(M.KEY,JSON.stringify(s));await PilhaLiving.syncClock();}""");assert page.evaluate('PilhaLiving.getCollectiveHealth().score')<45;snap('low-health-map');assert page.evaluate('document.documentElement.scrollWidth<=innerWidth+1')
    assert not errors,errors;report.append({'viewport':[width,height],'savedDuoSkipped':True,'homeFromModal':True,'preferencesPersisted':True,'orbAnimatedAndReduced':True,'errors':errors});ctx.close()
   except Exception:
    snap('FAILED');raise
  browser.close()
finally:server.shutdown();(OUT/'report.json').write_text(json.dumps(report,ensure_ascii=False,indent=2),encoding='utf-8')
print(json.dumps(report))
