import assert from 'node:assert/strict';
import {writeFileSync} from 'node:fs';
import {pairDistribution,initialStates,probabilityH,markerDistribution,archivedRange,archiveAlternatives,diagnosticDistribution,retardation,configuredCircuit,amplitudes,decoheredPair,environmentCoherence,circuitOperation,qubitTrajectory} from '../src/lib/quantum-experiments.ts';
import {blochCoordinates,fromBlochAngles,parseAngle,toView,fromView,trackball,dragBloch,qubitName} from '../src/lib/bloch-interaction.ts';
import {circuit,operation} from '../src/lib/physics.ts';
let checks=0;
const close=(a,b)=>{assert.ok(Math.abs(a-b)<1e-10,`${a} differs from ${b}`);checks++;};
const distribution=(p,w)=>{p.forEach((v,i)=>close(v,w[i]));close(p.reduce((a,b)=>a+b,0),1);};
// Slide experiments: H -> D -> phase -> R, and reading before R.
for(const f of [0,180]){
 close(probabilityH(circuit(['H','P'],f,initialStates.H).at(-1)),.5);
 close(probabilityH(circuit(['H','P','H'],f,initialStates.H).at(-1)),f===0?1:0);
}
close(probabilityH(circuit(['H','P','I'],90,initialStates.C).at(-1)),.5);
close(probabilityH(circuit(['I','P','H'],90,initialStates.C).at(-1)),0);
for(const v of Object.values(initialStates))for(const gate of ['I','X','Y','Z','H','P'])close(Math.hypot(...operation(v,gate,37)),1);
// Concordant, discordant and independent preparations, in a fixed reading.
distribution(pairDistribution('coherent-even',0,0),[.5,0,0,.5]);
distribution(pairDistribution('coherent-odd',0,0),[0,.5,.5,0]);
distribution(pairDistribution('independent',0,0),[.25,.25,.25,.25]);
distribution(pairDistribution('independent',45,45),[1,0,0,0]);
distribution(pairDistribution('mixed-even',45,45),[.25,.25,.25,.25]);
distribution(pairDistribution('coherent-even',45,45),[.5,0,0,.5]);
distribution(pairDistribution('coherent-even',45,45,180),[0,.5,.5,0]);
for(const source of ['coherent-even','coherent-odd','mixed-even','mixed-odd'])for(const a of [0,23,45,90])for(const b of [0,31,45,90]){
 const p=pairDistribution(source,a,b,73);close(p.reduce((a,b)=>a+b,0),1);close(p[0]+p[1],.5);close(p[0]+p[2],.5);assert.ok(p.every(x=>x>=0&&x<=1));
}
// The antisymmetric odd state remains discordant in any identical linear basis.
for(const angle of [0,13,45,72,90])distribution(pairDistribution('coherent-odd',angle,angle,180),[0,.5,.5,0]);
// Marker geometry: 60 degrees means 50% fringe visibility, not 60%.
for(const [a,max,min] of [[0,1,0],[60,.75,.25],[90,.5,.5]]){
 const hi=markerDistribution(a,0),lo=markerDistribution(a,180);close(hi[0]+hi[1],max);close(lo[0]+lo[1],min);
 for(const f of [0,49,180,260])for(const read of [0,27,45,90]){
  const p=markerDistribution(a,f,false,read);close(p.reduce((a,b)=>a+b,0),1);
  const ref=markerDistribution(a,f,false,0);close(p[0]+p[1],ref[0]+ref[1]);
  const inv=markerDistribution(a,f,true,read),clean=markerDistribution(0,f);close(inv[0]+inv[1],clean[0]+clean[1]);
 }
}
distribution(markerDistribution(90,0,false,45),[.5,0,0,.5]);
distribution(markerDistribution(90,180,false,45),[0,.5,.5,0]);
// An H/V-only archive admits a circle of phases. R reveals its full range.
for(const z of [-1,-.6,0,.4,1])for(const gate of ['H','X','I']){
 const bounds=archivedRange(z,gate);let min=1,max=0;
 for(let phase=0;phase<=360;phase+=1){const v=archiveAlternatives(z,phase);close(probabilityH(v),(1+z)/2);const p=probabilityH(operation(v,gate,0));assert.ok(p>=bounds[0]-1e-10&&p<=bounds[1]+1e-10);min=Math.min(min,p);max=Math.max(max,p);}
 close(min,bounds[0]);close(max,bounds[1]);
}
// Separate interventions affect distinct causes; joint readouts are normalized.
for(const stable of [false,true])for(const undo of [false,true])for(const phase of [0,90,180]){
 const a=diagnosticDistribution('phase',phase,stable,undo),b=diagnosticDistribution('marker',phase,stable,undo);
 close(a.reduce((a,b)=>a+b,0),1);close(b.reduce((a,b)=>a+b,0),1);
 const expected=phase===0?1:phase===90?.5:0;
 close(a[0]+a[1],stable?expected:.5);close(b[0]+b[1],undo?expected:.5);close(a[1]+a[3],0);
}
// General retarders: independent Jones-vector calculation and per-block settings.
const d=n=>n*Math.PI/180;
const mul=(z,w)=>[z[0]*w[0]-z[1]*w[1],z[0]*w[1]+z[1]*w[0]];
const lin=(a,x,b,y)=>[a*x[0]+b*y[0],a*x[1]+b*y[1]];
function jonesRetarder(ab,phase,axis){
 const c=Math.cos(d(axis)),s=Math.sin(d(axis));
 const u=lin(c,ab[0],s,ab[1]),v=mul([Math.cos(d(phase)),Math.sin(d(phase))],lin(-s,ab[0],c,ab[1]));
 return [lin(c,u,-s,v),lin(s,u,c,v)];
}
function toBloch([a,b]){return [2*(a[0]*b[0]+a[1]*b[1]),2*(a[0]*b[1]-a[1]*b[0]),a[0]**2+a[1]**2-b[0]**2-b[1]**2];}
for(const v of Object.values(initialStates)){
 for(const phase of [0,37.5,90,123.456,180,360])for(const axis of [0,22.5,45,81.37,180]){
  const result=retardation(v,phase,axis),expected=toBloch(jonesRetarder(amplitudes(v),phase,axis));
  result.forEach((x,i)=>close(x,expected[i]));close(Math.hypot(...result),1);
 }
 retardation(v,180,22.5).forEach((x,i)=>close(x,operation(v,'H',0)[i]));
 retardation(v,37.5,0).forEach((x,i)=>close(x,operation(v,'P',37.5)[i]));
}
const blocks=[{gate:'P',phase:37.5,axis:21.8},{gate:'P',phase:123.456,axis:71},{gate:'P',phase:241.2,axis:10}];
for(const seq of [blocks,[...blocks].reverse()]){
 let ab=amplitudes(initialStates.D);seq.forEach(b=>ab=jonesRetarder(ab,b.phase,b.axis));
 configuredCircuit(seq,initialStates.D).at(-1).forEach((x,i)=>close(x,toBloch(ab)[i]));
}
const bypass=configuredCircuit(blocks,initialStates.D,false);bypass[2].forEach((x,i)=>close(x,bypass[3][i]));
const generic=configuredCircuit([{gate:'H',phase:0,axis:0},{gate:'P',phase:37.5,axis:0},{gate:'H',phase:0,axis:0}],initialStates.H);
close(probabilityH(generic.at(-1)),Math.cos(d(37.5)/2)**2);
// Environment: trace over the third system in a separate 8-amplitude calculation.
function tracedDistribution(strength,a,b){
 const rows=t=>[[Math.cos(d(t)),Math.sin(d(t))],[-Math.sin(d(t)),Math.cos(d(t))]];
 const A=rows(a),B=rows(b),c=Math.cos(d(strength*.9)),s=Math.sin(d(strength*.9));
 return [0,1,2,3].map(o=>{const u=A[o>>1][0]*B[o%2][0],v=A[o>>1][1]*B[o%2][1];return ((u+c*v)**2+(s*v)**2)/2;});
}
for(const strength of [0,25,50,76,100])for(const a of [0,19,45,81])for(const b of [0,45,68]){
 const p=decoheredPair(strength,a,b);distribution(p,tracedDistribution(strength,a,b));
 close(p[0]+p[1],.5);close(p[0]+p[2],.5);assert.ok(p.every(x=>x>=0&&x<=1));
}
for(const strength of [0,50,100])distribution(decoheredPair(strength,0),[.5,0,0,.5]);
distribution(decoheredPair(0,45),[.5,0,0,.5]);distribution(decoheredPair(100,45),[.25,.25,.25,.25]);
close(environmentCoherence(0),1);close(environmentCoherence(100),0);
// Free angles, all optical devices, and direct manipulation of the state.
for(const [raw,max,want] of [['0',360,0],['180',180,180],['37,5',360,37.5],['.25',180,.25],['360',360,360],['',360,null],['abc',360,null],['-1',360,null],['181',180,null],['3,4.5',360,null]])assert.equal(parseAngle(raw,max),want);
for(const phase of [0,90,180,360]){
 const run=configuredCircuit([{gate:'H',phase:0,axis:0},{gate:'P',phase,axis:180},{gate:'H',phase:0,axis:0}],initialStates.H);
 close(probabilityH(run[2]),.5);close(probabilityH(run[3]),(1+Math.cos(d(phase)))/2);
 if(phase===0)run[2].forEach((x,i)=>close(x,initialStates.D[i]));
}
for(const v of Object.values(initialStates))for(const axis of [0,22.5,37.8,90,180]){
 const q={gate:'Q',phase:0,axis},w={gate:'W',phase:0,axis};
 const twice=circuitOperation(circuitOperation(v,q),q),half=circuitOperation(v,w);
 twice.forEach((x,i)=>close(x,half[i]));
 const beta=d(axis),jonesRotated=[lin(Math.cos(beta),amplitudes(v)[0],-Math.sin(beta),amplitudes(v)[1]),lin(Math.sin(beta),amplitudes(v)[0],Math.cos(beta),amplitudes(v)[1])];
 circuitOperation(v,{gate:'O',phase:0,axis:0,angle:axis}).forEach((x,i)=>close(x,toBloch(jonesRotated)[i]));
}
circuitOperation(initialStates.D,{gate:'Q',phase:0,axis:0}).forEach((x,i)=>close(x,initialStates.C[i]));
circuitOperation(initialStates.H,{gate:'O',phase:0,axis:0,angle:45}).forEach((x,i)=>close(x,initialStates.D[i]));
const start=trackball(-.23,.39),end=trackball(.58,-.15);
for(const v of [...Object.values(initialStates),fromBlochAngles(74.6,283.2)]){
 const moved=dragBloch(v,start,end),returned=dragBloch(moved,end,start),angles=blochCoordinates(v);
 close(Math.hypot(...moved),1);returned.forEach((x,i)=>close(x,v[i]));
 fromView(toView(v)).forEach((x,i)=>close(x,v[i]));
 fromBlochAngles(angles.inclination,angles.phase).forEach((x,i)=>close(x,v[i]));
 const circuitAfter=configuredCircuit([{gate:'Q',phase:0,axis:13},{gate:'P',phase:71,axis:30},{gate:'O',phase:0,axis:0,angle:44}],moved);
 circuitAfter.forEach(s=>close(Math.hypot(...s),1));
}
// A point picked on the front surface follows the pointer; opposite edges stay finite.
toView(dragBloch(fromView(start),start,end)).forEach((x,i)=>close(x,end[i]));
toView(dragBloch(fromView([1,0,0]),[1,0,0],[-1,0,0])).forEach((x,i)=>close(x,[-1,0,0][i]));
// The introductory circuit exposes only basic qubit operations and signed phase changes.
for(const [raw,want] of [['-90',-90],['−37,5',-37.5],['+90',90],['-360',-360],['-360.1',null],['-',null]])assert.equal(parseAngle(raw,360,-360),want);
close(blochCoordinates(fromBlochAngles(63,-37.5)).phase,-37.5);
assert.equal(qubitName(initialStates.H),'Stato 0');assert.equal(qubitName(initialStates.V),'Stato 1');
for(const v of Object.values(initialStates))for(const gate of ['X','Y','Z']){
 const b={gate,phase:0,axis:0},once=circuitOperation(v,b),twice=circuitOperation(once,b);
 twice.forEach((x,i)=>close(x,v[i]));
 close(probabilityH(once),gate==='Z'?probabilityH(v):1-probabilityH(v));
}
for(const phase of [-360,-180,-90,-37.5,0,90,180,360])for(const gate of ['X','Y','Z','H','P']){
 const b={gate,phase,axis:0},v=fromBlochAngles(63,22),path=qubitTrajectory(v,b),expected=circuitOperation(v,b);
 path[0].forEach((x,i)=>close(x,v[i]));path.at(-1).forEach((x,i)=>close(x,expected[i]));
 path.forEach(s=>close(Math.hypot(...s),1));
}
for(const phase of [-275,-90,0,37.5,180]){
 const a={gate:'P',phase,axis:0},b={gate:'P',phase:-phase,axis:0};
 circuitOperation(circuitOperation(initialStates.D,a),b).forEach((x,i)=>close(x,initialStates.D[i]));
}
close(probabilityH(configuredCircuit([{gate:'X',phase:0,axis:0},{gate:'H',phase:0,axis:0},{gate:'I',phase:0,axis:0}],initialStates.D).at(-1)),1);
close(probabilityH(configuredCircuit([{gate:'I',phase:0,axis:0},{gate:'H',phase:0,axis:0},{gate:'X',phase:0,axis:0}],initialStates.D).at(-1)),0);
const result={result:'PASS',checks,coverage:['signed input and phase readouts','X Y Z examples and double application','geometric paths and inverse phase','angle input and zero-delay invariance','quarter/half-wave plates and optical rotation','drag geometry and full-circuit propagation','arbitrary retarders against Jones vectors','independent block settings and bypass','decoherence against partial trace','slide sequences and order','concordance and anticorrelation','local marginals','marker angle and inverse','conditional groups','archive ambiguity and exact extrema','two causes and interventions']};
writeFileSync('qa/quantum-results.json',JSON.stringify(result,null,2)+'\n');console.log(JSON.stringify(result));
