"""Test the real entry/gallery with isolated, synthetic player state."""
import json, os, socket, subprocess, sys, time
from pathlib import Path
from playwright.sync_api import sync_playwright
ROOT=Path(__file__).resolve().parents[1]
OUT=ROOT/'artifacts'/'hero-neon'
OUT.mkdir(parents=True,exist_ok=True)
HEROES=['PILHA-H%02d'%i for i in range(1,7)]
report={'viewports':[],'checks':[],'errors':[]}
def check(condition,label):
    if not condition: raise AssertionError(label)
    report['checks'].append(label)
def capture(page,name):
    page.screenshot(path=str(OUT/(name+'.png')),full_page=False)
def ready_entry(page):
    page.goto('http://127.0.0.1:8765/',wait_until='domcontentloaded')
    for _ in range(50):
        if page.locator('.player-entry').is_visible(): break
        for selector in ['.pi-cta','.pi-skip','#welcome-skip','#welcome-close']:
            control=page.locator(selector)
            if control.is_visible():
                control.click()
                break
        page.wait_for_timeout(200)
    page.locator('.player-entry').wait_for(state='visible',timeout=15000)
def run_view(browser,width,height):
    tag='%sx%s'%(width,height)
    context=browser.new_context(viewport={'width':width,'height':height},reduced_motion='reduce')
    page=context.new_page(); errors=[]
    page.on('pageerror',lambda error:errors.append(str(error)))
    try:
        ready_entry(page)
        page.locator('.player-entry [data-entry="next"]').click()
        page.locator('.player-entry [data-entry="next"]').click()
        page.locator('.neon-entry-roster .neon-hero-card').first.wait_for()
        page.wait_for_timeout(300)
        check(page.locator('.neon-entry-roster .neon-hero-card').count()==6,tag+': six canonical entry cards')
        check(page.locator('.neon-entry-roster img').evaluate_all('(images)=>images.every(i=>i.complete&&i.naturalWidth>0)'),tag+': all entry portraits loaded')
        # Header intentionally spans the inner card margins. Test the viewport container.
        check(page.locator('.player-entry').evaluate('(e)=>e.scrollWidth<=e.clientWidth+2'),tag+': entry without horizontal overflow')
        capture(page,'entry-'+tag)
        snapshot='JSON.stringify(Object.fromEntries(Object.keys(localStorage).map(k=>[k,localStorage.getItem(k)])))'
        before=page.evaluate(snapshot)
        page.locator('[data-neon-preview="PILHA-H03"]').click()
        page.locator('#hero-team-dialog[open]').wait_for()
        page.locator('.ph-d[data-neon-version]').wait_for()
        page.wait_for_timeout(300)
        check(page.locator('#ph-d-name').inner_text()=='Cientista de Dados',tag+': matching profile from entry')
        check(page.locator('.ph-card').count()==6,tag+': six roster thumbnails')
        check(page.locator('.ph-d__fig img').evaluate('(i)=>i.complete&&i.naturalWidth>0'),tag+': selected portrait loaded')
        check(page.locator('.ph-root').evaluate('(e)=>e.scrollWidth<=e.clientWidth+2'),tag+': gallery without horizontal overflow')
        capture(page,'gallery-'+tag)
        for hero_id in HEROES:
            selector=('.ph-card[data-id="%s"]' if width>=900 else '.ph-detail [data-hero-preview="%s"]')%hero_id
            page.locator(selector).click();page.wait_for_timeout(100)
            d=page.locator('.ph-d[data-neon-version]');d.wait_for()
            check(d.get_attribute('data-hero-id')==hero_id,tag+': correct profile '+hero_id)
            check(page.locator('.ph-d__txt').evaluate('(e)=>e.scrollWidth<=e.clientWidth+2'),tag+': text fits '+hero_id)
        selector='.ph-card[data-id="PILHA-H03"]' if width>=900 else '.ph-detail [data-hero-preview="PILHA-H03"]'
        page.locator(selector).click();page.wait_for_timeout(100)
        check(before==page.evaluate(snapshot),tag+': preview does not mutate storage')
        page.locator('.ph-btn--pick').click()
        page.locator('.ph-card[data-id="PILHA-H03"]').click();page.wait_for_timeout(100)
        check(page.locator('.ph-btn--pick').is_disabled(),tag+': duplicate roles blocked')
        selector='.ph-card[data-id="PILHA-H02"]' if width>=900 else '.ph-detail [data-hero-preview="PILHA-H02"]'
        page.locator(selector).click();page.wait_for_timeout(100)
        page.locator('.ph-btn--pick').click()
        page.locator('[data-hero-save]').click()
        page.locator('#hero-team-dialog').wait_for(state='hidden')
        page.locator('.neon-entry-pair .neon-pair-portrait').first.wait_for()
        check(page.locator('.neon-entry-pair .neon-pair-portrait').count()==2,tag+': selected pair portraits')
        pair=page.evaluate('JSON.parse(localStorage.getItem("pilha-hero-teams-v1")).teams["01"]')
        check(pair['principal']=='PILHA-H03' and pair['support']=='PILHA-H02',tag+': canonical pair persisted')
        capture(page,'pair-'+tag)
        page.locator('.player-entry [data-entry="next"]').click()
        page.locator('.player-entry').wait_for(state='detached')
        check(not errors,tag+': no uncaught browser exceptions')
        report['viewports'].append({'width':width,'height':height,'ok':True})
    except Exception as exc:
        report['errors'].extend(errors)
        print('FAILED',tag,repr(exc),flush=True)
        capture(page,'FAILED-'+tag)
        (OUT/('FAILED-'+tag+'.html')).write_text(page.content(),encoding='utf-8')
        raise
    finally: context.close()
server=subprocess.Popen([sys.executable,'-m','http.server','8765','--bind','127.0.0.1'],cwd=ROOT,stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL)
try:
    for _ in range(40):
        try:
            with socket.create_connection(('127.0.0.1',8765),.2): break
        except OSError: time.sleep(.1)
    with sync_playwright() as p:
        opts={'headless':True,'args':['--no-sandbox','--disable-dev-shm-usage']}
        if os.environ.get('CHROMIUM_PATH'):opts['executable_path']=os.environ['CHROMIUM_PATH']
        browser=p.chromium.launch(**opts)
        for width,height in [(1366,900),(1024,768),(390,844)]:run_view(browser,width,height)
        browser.close()
except Exception as exc:
    report['errors'].append(str(exc));raise
finally:
    server.terminate()
    text=json.dumps(report,ensure_ascii=False,indent=2)
    (OUT/'report.json').write_text(text,encoding='utf-8');print(text,flush=True)
