/** PM-supplied equipment. Fictional effects apply only to the seated user. */
export const CHAIR_ITEMS=[
 ['cadeira-producao','Cadeira da Produção','cadeira_da_producao',900,{carga:4,recon:2},'Conforto e reconhecimento durante a pausa no posto.'],
 ['cadeira-pensamento','Cadeira do Pensamento','cadeira_do_pensamento',1100,{auton:4,lider:2},'Um momento individual para organizar ideias e decisões.'],
 ['cadeira-descompressao','Cadeira da Descompressão','cadeira_da_descompressao',1200,{carga:3,seg:3},'Uma pausa individual para desacelerar no próprio setor.']
].map(([id,name,asset,cost,individualEffects,description])=>({id,name,asset,cost,individualEffects,description,individual:true,category:'Equipamento individual',rest:false,factors:{},timing:{kind:'imediato',delay:0,ramp:0},icon:'/assets/individual-chairs/'+asset+'-icon.png',audience:'Um usuário designado por cadeira; bônus temporário somente enquanto estiver sentado. Não aumenta o índice coletivo do setor.',origin:'GLB fornecido pelo PM'}));
