"""CI-only social activity checks with a paused, isolated fictional fixture."""
import functools,http.server,importlib.util,json,os,threading
from pathlib import Path
from playwright.sync_api import sync_playwright
ROOT=Path(__file__).resolve().parents[1]
spec=importlib.util.spec_from_file_location('social_a11y',ROOT/'tools/qa-accessibility.py')
audit=importlib.util.module_from_spec(spec);spec.loader.exec_module(audit)
OUT=ROOT/'artifacts/social';OUT.mkdir(parents=True,exist_ok=True);audit.OUT=OUT
report={'screens':[],'checks':[],'errors':[]};audit.REPORT=report
fixture=json.loads((ROOT/'tests/fixtures/fin-28c1de8-save.json').read_text(encoding='utf-8'))['state'];fixture['paused']=True;fixture['events']['current']=None
def check(ok,text):
    if not ok:raise AssertionError(text)
    report['checks'].append(text)
def run(browser,width,height,port):
    tag=f'{width}x{height}';ctx=browser.new_context(viewport={'width':width,'height':height},reduced_motion='reduce')
    ctx.add_init_script('if(!localStorage.getItem("pilha-company-continuous-v2"))localStorage.setItem("pilha-company-continuous-v2",JSON.stringify('+json.dumps(fixture)+'));')
    page=ctx.new_page();page.on('pageerror',lambda e:report['errors'].append(str(e)));page.on('console',lambda m:report['errors'].append(m.text) if m.type=='error' else None)
    def seek(ms):
        page.evaluate('''async(ms)=>{const M=await import('/simulation/company-continuous.js');const s=PilhaLiving.getState();s.activeMs=ms;s.paused=true;localStorage.setItem(M.KEY,JSON.stringify(s));await PilhaLiving.syncClock();}''',ms)
    try:
        page.goto(f'http://127.0.0.1:{port}/?hud=v2');page.locator('.pi-skip').click();page.locator('.living-guide[open]').wait_for()
        for _ in range(3):page.locator('[data-guide=next]').click()
        page.locator('.continuous-gallery-dialog[open] .ph-back').click();page.wait_for_function('PilhaLiving.getFurniture()?.loaded===25&&PilhaLiving.getRiggedNPCs()?.loaded===5')
        for b in page.locator('.pm-toast__x').all():
            if b.is_visible():b.click()
        initial=page.evaluate('PilhaLiving.getState()')
        for sid in ['escritorio','producao','atendimento']:
            event=page.evaluate('''async(sid)=>{const {NPC_MOTION:C}=await import('/simulation/npc-motion.js');const s=PilhaLiving.getState(),rows=PilhaLiving.getRoutines().filter(r=>r.sid===sid),e=rows[0].agenda.find(e=>e.kind==='meeting');return {at:e.start-(s.week-1)*120000+Math.max(...rows.map(r=>C.meetingTravelMs/(C.walkRate*r.speed)))+500,manager:e.managerId,ids:rows.map(r=>r.id)};}''',sid)
            seek(event['at']);actors=page.evaluate('PilhaLiving.getEmployees().filter(p=>p.activity==="meeting")')
            check({a['id'] for a in actors}==set(event['ids']),tag+': whole '+sid+' cohort attends once with actual manager')
            check(event['manager'] in {a['id'] for a in actors},tag+': manager present for '+sid)
            check(all(a['sector']=='restauracao' and not a['moving'] and a['talking'] for a in actors),tag+': '+sid+' meeting holds in patio')
            check(len({(a['x'],a['y']) for a in actors})==len(actors),tag+': distinct '+sid+' meeting positions')
            page.locator('.pm-tab[data-i="3"]').click();page.locator('.pm-root.has-panel').wait_for();audit.scan(page,'reuniao-'+sid,(width,height));page.locator('[data-z=home]').click()
        seek(0)
        chat=page.evaluate('''()=>{const s=PilhaLiving.getState(),base=(s.week-1)*120000,rows=PilhaLiving.getRoutines();for(let t=base;t<base+119000;t+=100)for(const row of rows){const p=row.sampleAt(t),q=row.sampleAt(t+600);if(p.stage==='conversation'&&q.stage==='conversation'&&p.partnerId===q.partnerId)return {at:t-base,id:row.id,partner:p.partnerId};}throw Error('No reciprocal conversation in a week');}''')
        seek(chat['at']);actors=page.evaluate('PilhaLiving.getEmployees()');pair=[a for a in actors if a['id'] in [chat['id'],chat['partner']]]
        check(len(pair)==2 and all(a['activity']=='conversation' and a['talking'] and not a['moving'] for a in pair),tag+': two real co-workers stop and converse')
        check(len({(a['x'],a['y']) for a in pair})==2,tag+': conversation partners occupy distinct positions')
        page.wait_for_timeout(600);after=page.evaluate('PilhaLiving.getEmployees()');check(all(next(b for b in after if b['id']==a['id'])['x']==a['x'] and next(b for b in after if b['id']==a['id'])['y']==a['y'] for a in pair),tag+': paused conversation does not slide')
        page.evaluate('(id)=>PilhaLiving.getEmployees().find(p=>p.id===id)',chat['id'])
        # Focus via the existing sector control; portraits remain NPCs, not heroes.
        sid=next(a['sector'] for a in pair);index={'escritorio':0,'producao':1,'atendimento':2}[sid];page.locator(f'.pm-tab[data-i="{index}"]').click();audit.scan(page,'conversa',(width,height));page.locator('[data-z=home]').click()
        page.locator('.hud-v2-menu-button').click();page.locator('[data-company=zones]').click();page.locator('.world-access-dialog[open]').wait_for()
        check(page.locator('.world-team-agenda li').count()==3,tag+': accessible weekly agenda lists all three departments');audit.scan(page,'agenda',(width,height));page.keyboard.press('Escape')
        final=page.evaluate('PilhaLiving.getState()');check(final['budget']==initial['budget'] and final['receipts']==initial['receipts'] and final['staff']==initial['staff'],tag+': viewing activities never pays, purchases or permanently changes health')
        before=page.evaluate('PilhaLiving.getEmployees().map(p=>[p.id,p.x,p.y])');page.locator('[data-company=pause]').click();page.wait_for_function('!PilhaLiving.getState().paused');page.wait_for_timeout(700)
        check(before!=page.evaluate('PilhaLiving.getEmployees().map(p=>[p.id,p.x,p.y])'),tag+': unpause resumes general circulation')
    except Exception:
        page.screenshot(path=str(OUT/f'FAILED-{tag}.png'));raise
    finally:ctx.close()
if __name__=='__main__':
    server=http.server.ThreadingHTTPServer(('127.0.0.1',0),functools.partial(http.server.SimpleHTTPRequestHandler,directory=str(ROOT/'dist')))
    threading.Thread(target=server.serve_forever,daemon=True).start()
    try:
        with sync_playwright() as p:
            options={'headless':True,'args':['--no-sandbox']}
            if os.environ.get('CHROMIUM_PATH'):options['executable_path']=os.environ['CHROMIUM_PATH']
            browser=p.chromium.launch(**options)
            try:
                for size in [(1440,900),(390,844),(320,640)]:run(browser,*size,server.server_port)
            finally:browser.close()
    except Exception as e:report['errors'].append(str(e))
    finally:
        server.shutdown();(OUT/'report.json').write_text(json.dumps(report,ensure_ascii=False,indent=2),encoding='utf-8');print(json.dumps(report,ensure_ascii=False))
    if report['errors'] or len(report['screens'])!=15:raise SystemExit(1)
