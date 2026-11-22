import { collisionBox, figureEight, springChain } from '../scenes/scenes.js';
import { performance } from 'node:perf_hooks';
const run=(w,T=60,dt=.01)=>{w.captureBaseline(); let lowest=w.totalEnergy(),upsteps=0, previous=lowest;const start=performance.now();for(let j=0;j<Math.round(T/dt);j++){w.step(dt);const e=w.totalEnergy();if(e>previous+1e-9)upsteps++;lowest=Math.min(lowest,e);previous=e;}return {time_ms:performance.now()-start,energy_0:w.baseline.E,energy_60:w.totalEnergy(),drift:w.drift().dE,p_0:w.baseline.p.len(),p_60:w.momentum().len(),dp:w.momentum().sub(w.baseline.p).len(),upsteps,collisions:w.collisionCount};};
const result={};for(const e of [1,.8]) for(const walls of [false,true]) result[`billiards_e${e}_walls${walls}`]=run(collisionBox({n:20,e,walls,seed:7,spread:3}),60,.005);
result.gravity=run(figureEight(),60,.001);result.spring=run(springChain(),60,.004);
result.performance=[];
for(const n of [20,50,100,200,500])for(const phase of ['brute','hash']){const w=collisionBox({n,e:1,seed:7});w.broadPhase=phase;let ms=0,checks=0;for(let j=0;j<400;j++){const st=performance.now();w.step(1/240);ms+=performance.now()-st;checks+=w.stats.checks;}result.performance.push({n,phase,mean_physics_ms:ms/400,mean_checks:checks/400});}
console.log(JSON.stringify(result,null,2));
