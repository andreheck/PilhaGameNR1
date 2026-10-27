"""Measure approved immutable atlas alpha, not transparent frame height (Pillow)."""
from pathlib import Path
from PIL import Image
import hashlib,json,statistics
ROOT=Path(__file__).resolve().parents[1]
report=json.loads((ROOT/'assets/npc-sprites/rigged/report.json').read_text(encoding='utf-8'))
coverage={}
for atlas in report['atlases']:
    file=ROOT/'assets/npc-sprites/rigged'/atlas['file']
    assert hashlib.sha256(file.read_bytes()).hexdigest()==atlas['sha256']
    image=Image.open(file).convert('RGBA');heights=[]
    for direction in range(atlas['directions']):
        for frame in range(atlas['frames']):
            bounds=image.crop((frame*128,direction*192,(frame+1)*128,(direction+1)*192)).getchannel('A').getbbox()
            if bounds:heights.append((bounds[3]-bounds[1])/192)
    coverage.setdefault(atlas['id'],{})[atlas['action']]=round(statistics.median(heights),6)
result={'referenceHeight':1.7,'source':'Alpha bounds measured on approved immutable 128x192 atlas frames','coverage':coverage}
(ROOT/'data/continuous/npc-rigged-scale.json').write_text(json.dumps(result,indent=2)+'\n',encoding='utf-8')
