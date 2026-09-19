import assert from 'node:assert/strict';
import {writeFileSync,mkdirSync} from 'node:fs';
import {ReversibleGas,GAS_DT} from '../src/lib/reversible-gas.ts';
import {GasExperiment} from '../src/lib/gas-experiment.ts';
const runs=[];let checks=0;
const exact=(g,s)=>{
 for(let i=0;i<g.n;i++){assert.equal(g.qx[i],s.qx[i]);assert.equal(g.qy[i],s.qy[i]);assert.equal(g.px[i],-s.px[i]);assert.equal(g.py[i],-s.py[i]);}
 checks++;
};
// Full default experiment: multiple encounters, expansion, zero-error return,
// and a return from finite-precision directions. Counts are measured, not set.
for(const [n,duration] of [[1000,8],[5000,12],[10000,4]]){
 const g=new ReversibleGas(n),initial=g.record(),points=g.sync().map(p=>({...p})),energy=g.statistics().energy,t=performance.now();let maxEnergyError=0;
 for(let k=0;k<duration/GAS_DT;k+=256){g.step(256);const e=Math.abs(g.statistics().energy/energy-1);maxEnergyError=Math.max(e,maxEnergyError);}
 assert.ok(maxEnergyError<.005,'energy accuracy');
 const turn=g.record(),leftAtTurn=g.statistics().left/n;
 if(n===5000){
  mkdirSync('qa/rendered',{recursive:true});writeFileSync('qa/rendered/loschmidt-states.json',JSON.stringify({initial:points,expanded:g.sync().map(p=>({...p}))}));
 }
 g.invert();g.step(duration/GAS_DT);exact(g,initial);g.sync();assert.equal(g.compare(points).rms,0);assert.equal(g.statistics().left,n);
 const outcome={n,duration,leftAtTurn,exactReturnRms:0,maxEnergyError};
 if(n===5000){
  const bad=ReversibleGas.from(turn),error=bad.invert({kind:'recording',degrees:5,fraction:1});
  const before=bad.statistics().energy;assert.ok(Math.abs(before/energy-1)<.005);
  bad.step(duration/GAS_DT);bad.sync();const result=bad.compare(points);
  assert.ok(result.rms>100);assert.ok(bad.statistics().left/n<.8);assert.ok(result.nearFraction<.01);
  Object.assign(outcome,{imperfectReturnLeft:bad.statistics().left/n,imperfectReturnRms:result.rms,imperfectNearInitial:result.nearFraction,angularRms:error.angularRms});
  const data=JSON.parse((await import('node:fs')).readFileSync('qa/rendered/loschmidt-states.json','utf8'));data.exact=g.sync();data.imperfect=bad.sync();writeFileSync('qa/rendered/loschmidt-states.json',JSON.stringify(data));checks++;
 }
 outcome.milliseconds=Math.round(performance.now()-t);runs.push(outcome);console.log(JSON.stringify(outcome));
}
// Zero imposed error, one-particle perturbation, and absence of coupling.
for(const interactions of [false,true]){
 const g=new ReversibleGas(128,831,interactions),s=g.record();g.step(4096);g.invert({kind:'rotation',degrees:0,fraction:1});g.step(4096);exact(g,s);
}
const free=new ReversibleGas(128,99,false),freeInitial=free.record();free.step(4096);free.invert({kind:'rotation',degrees:5,fraction:1/128});free.step(4096);
const changed=free.qx.reduce((n,x,i)=>n+(x!==freeInitial.qx[i]||free.qy[i]!==freeInitial.qy[i]?1:0),0);assert.equal(changed,1);checks++;
// Wall reflections remain reversible even at integer-grid wall coordinates.
const corner=new ReversibleGas(2,1,false),cornerRecord=corner.record();cornerRecord.qx=[0,720*2**24];cornerRecord.qy=[0,340*2**24];cornerRecord.px=[100*2**24,-100*2**24];cornerRecord.py=[100*2**24,-100*2**24];
const walls=ReversibleGas.from(cornerRecord);walls.step(5000);walls.invert();walls.step(5000);exact(walls,cornerRecord);
// The scheduling controller must really take 45 nominal seconds per phase,
// pause before reversal, keep the final frame, and reuse the same turn state.
const e=new GasExperiment(128,71,true,4);e.start();e.advance(44,45,Infinity);assert.equal(e.phase,'expansion');assert.ok(e.progress>.97&&e.progress<1);e.pause();const stopped=e.gas.steps;e.advance(30,45,Infinity);assert.equal(e.gas.steps,stopped);e.start();e.advance(1.01,45,Infinity);assert.equal(e.phase,'ready');assert.equal(e.running,false);const saved=JSON.stringify(e.turn);
e.compare({kind:'recording',degrees:0,fraction:1});e.advance(44,45,Infinity);assert.equal(e.phase,'return');e.advance(1.01,45,Infinity);assert.equal(e.phase,'complete');assert.equal(e.running,false);assert.equal(e.gas.compare(e.initial).rms,0);assert.equal(e.comparison.compare(e.initial).rms,0);
e.advance(60,45,Infinity);assert.equal(e.phase,'complete');e.resetComparison();assert.equal(e.phase,'ready');assert.equal(JSON.stringify(e.turn),saved);e.compare({kind:'rotation',degrees:5,fraction:.1});assert.equal(e.affected,13);checks++;
const result={status:'PASS',checks,runs,controller:'45 s per phase; pause before reversal; stable final state; reusable comparison',browser:'Interactive preview unavailable; numerical and state-machine checks only.'};
writeFileSync('qa/loschmidt-results.json',JSON.stringify(result,null,2)+'\n');console.log(JSON.stringify({status:result.status,checks}));
