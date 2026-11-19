"""Find the supplied masters locally. Never copy them into the public game."""
import json,hashlib
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
home=Path.home();game=home/'Desktop/KONWERSA/PLANO B/PilhA+/Pilha Game'
rows=[
 ('heck','Heck · Mentor','escritorio','Meshy_AI_Rigged_Stylized_Man_20261018_animated_mixamo_All_animation.glb'),
 ('mariana','Mariana','atendimento','Meshy_AI_Woman_Braids_Rigged_20261025_animated_mixamo_All_animation.glb'),
 ('ensino','Diretora de Ensino','atendimento','Meshy_AI_woman_character_rigged_20261018_animated_mixamo_All_animation.glb'),
 ('gestora','Gestora','escritorio','Meshy_AI_business_woman_rigged_20261013_animated_mixamo_All_animation.glb'),
 ('logistica-2','Operador logístico','producao','Meshy_AI_Logistics_Worker_V2_Rigged_20261013_animated_mixamo_All_animation.glb'),
 ('administrativo','Profissional administrativo','escritorio','Meshy_AI_base_employee_smart_rigged_20261013_animated_mixamo_All_animation.glb'),
 ('garoto','Jovem profissional','atendimento','Meshy_AI_boy_hoodie_textured_rigged_20261027_animated_mixamo_All_animation.glb'),
 ('diretor','Diretor','escritorio','Meshy_AI_Stylized_Director_Rigged_20261014_animated_mixamo_All_animation.glb'),
 ('yoga','Malik · Professor de yoga','restauracao','Meshy_AI_Malik_20261109_animated_mixamo_All_animation.glb'),
 ('advogado','Advogado','escritorio','Meshy_AI_Textured_Man_in_Blue_Suit_20261109_animated_mixamo_All_animation.glb')]
result={}
for key,name,sector,filename in rows:
 matches=list(game.rglob(filename))+list((home/'Downloads').glob(filename))
 if not matches:raise FileNotFoundError(filename)
 source=matches[0];result[key]=dict(path=str(source),name=name,sector=sector,sourceSha256=hashlib.file_digest(source.open('rb'),'sha256').hexdigest())
target=ROOT/'artifacts/expanded-cast-source-map.json';target.parent.mkdir(exist_ok=True);target.write_text(json.dumps(result,ensure_ascii=False,indent=2),encoding='utf-8')
print('Located all 10 supplied masters; no public source copies.')
