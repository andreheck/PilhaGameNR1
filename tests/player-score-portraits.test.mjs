import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {playerScoreBand,playerScorePortrait} from '../data/continuous/player-explorers.js';

test('player score bands use the five approved thresholds',()=>{
 assert.deepEqual([0,29,30,49,50,69,70,90,91,100].map(playerScoreBand),['20','20','40','40','60','60','80','80','90+','90+']);
});

test('all three explorers resolve to their own five transparent score portraits',()=>{
 for(const id of ['EXPLORER-JOVEM-PROFISSIONAL','EXPLORER-ADVOGADO','EXPLORER-DIRETORA-ENSINO'])for(const score of [20,40,60,80,95]){const url=playerScorePortrait(id,score);assert.ok(url);assert.ok(fs.existsSync(new URL('../'+url.slice(1),import.meta.url)));}
});
