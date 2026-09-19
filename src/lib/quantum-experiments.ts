import {clamp,environmentProbabilities,operation,polarVector,rad,type Vector} from './physics.ts';
export type PairSource='independent'|'coherent-even'|'coherent-odd'|'mixed-even'|'mixed-odd';
type Complex=[number,number];
const add=(a:Complex,b:Complex):Complex=>[a[0]+b[0],a[1]+b[1]];
const scale=(a:Complex,s:number):Complex=>[a[0]*s,a[1]*s];
const abs2=(a:Complex)=>a[0]*a[0]+a[1]*a[1];
function purePair(source:PairSource,phase:number):Complex[]{
 const k=Math.SQRT1_2,f=rad(phase),b:Complex=[k*Math.cos(f),k*Math.sin(f)];
 if(source==='independent')return [[.5,0],[.5,0],[.5,0],[.5,0]];
 return source.endsWith('odd')?[[0,0],[k,0],b,[0,0]]:[[k,0],[0,0],[0,0],b];
}
function measuredPair(state:Complex[],a:number,b:number):number[]{
 const A=[[Math.cos(rad(a)),Math.sin(rad(a))],[-Math.sin(rad(a)),Math.cos(rad(a))]];
 const B=[[Math.cos(rad(b)),Math.sin(rad(b))],[-Math.sin(rad(b)),Math.cos(rad(b))]];
 return [0,1,2,3].map(o=>{let z:Complex=[0,0];for(let i=0;i<4;i++)z=add(z,scale(state[i],A[o>>1][i>>1]*B[o%2][i%2]));return clamp(abs2(z));});
}
export function pairDistribution(source:PairSource,a:number,b:number,phase=0):number[]{
 if(!source.startsWith('mixed'))return measuredPair(purePair(source,phase),a,b);
 const basis=source==='mixed-even'?[0,3]:[1,2];
 const p=basis.map(k=>measuredPair([0,1,2,3].map(i=>[i===k?1:0,0] as Complex),a,b));
 return p[0].map((v,i)=>(v+p[1][i])/2);
}
export const initialStates:Record<string,Vector>={H:[0,0,1],V:[0,0,-1],D:[1,0,0],A:[-1,0,0],C:[0,1,0]};
export function stateName(v:Vector){
 if(v[2]>.99999)return 'Orizzontale H';if(v[2]<-.99999)return 'Verticale V';
 if(v[0]>.99999)return 'Diagonale +45°';if(v[0]<-.99999)return 'Diagonale −45°';
 if(Math.abs(v[1])>.99999)return v[1]>0?'Circolare, verso positivo':'Circolare, verso negativo';
 if(Math.abs(v[1])<1e-7)return 'Polarizzazione lineare';return 'Polarizzazione ellittica';
}
export const probabilityH=(v:Vector)=>clamp((1+v[2])/2);
export type CircuitBlock={gate:string;phase:number;axis:number;angle?:number};
// The retarder is diag(1, exp(i*phase)) in its own orthogonal linear axes.
export function retardation(v:Vector,phase:number,axis=0):Vector{
 const n:Vector=[Math.sin(rad(2*axis)),0,Math.cos(rad(2*axis))],c=Math.cos(rad(phase)),s=Math.sin(rad(phase));
 const dot=n.reduce((sum,x,i)=>sum+x*v[i],0),cross:Vector=[-n[2]*v[1],n[2]*v[0]-n[0]*v[2],n[0]*v[1]];
 return v.map((x,i)=>c*x+s*cross[i]+(1-c)*dot*n[i]) as Vector;
}
export function circuitOperation(v:Vector,b:CircuitBlock):Vector{
 if(b.gate==='P')return retardation(v,b.phase,b.axis);
 if(b.gate==='Q')return retardation(v,90,b.axis);
 if(b.gate==='W')return retardation(v,180,b.axis);
 if(b.gate==='O'){
  const t=rad(2*(b.angle??0)),c=Math.cos(t),s=Math.sin(t);
  return [c*v[0]+s*v[2],v[1],-s*v[0]+c*v[2]];
 }
 return operation(v,b.gate,0);
}
export function configuredCircuit(blocks:CircuitBlock[],initial:Vector,last=true):Vector[]{
 const states:Vector[]=[initial];
 blocks.forEach((b,i)=>{const v=states.at(-1)!;states.push(i===2&&!last?v:circuitOperation(v,b));});
 return states;
}
export function qubitTrajectory(v:Vector,b:CircuitBlock):Vector[]{
 const axes:Record<string,Vector>={X:[1,0,0],Y:[0,1,0],Z:[0,0,1],H:[Math.SQRT1_2,0,Math.SQRT1_2]};
 if(b.gate==='P')return Array.from({length:49},(_,i)=>retardation(v,b.phase*i/48,b.axis));
 const n=axes[b.gate];if(!n)return [];
 const dot=n.reduce((sum,x,i)=>sum+x*v[i],0),cross:Vector=[n[1]*v[2]-n[2]*v[1],n[2]*v[0]-n[0]*v[2],n[0]*v[1]-n[1]*v[0]];
 return Array.from({length:49},(_,i)=>{const a=Math.PI*i/48,c=Math.cos(a),s=Math.sin(a);return v.map((x,k)=>c*x+s*cross[k]+(1-c)*dot*n[k]) as Vector;});
}
export const environmentCoherence=(interaction:number)=>Math.max(0,Math.cos(rad(clamp(interaction,0,100)*.9)));
// Dephasing of either member of (HH+VV)/sqrt(2), after tracing out E.
export function decoheredPair(interaction:number,a:number,b=a):number[]{
 const c=environmentCoherence(interaction),pure=pairDistribution('coherent-even',a,b),mixed=pairDistribution('mixed-even',a,b);
 return pure.map((p,i)=>c*p+(1-c)*mixed[i]);
}
export function amplitudes(v:Vector):Complex[]{const a=Math.sqrt(probabilityH(v));return a<1e-9?[[0,0],[1,0]]:[[a,0],[v[0]/(2*a),v[1]/(2*a)]];}
export function markerDistribution(angle:number,phase:number,inverse=false,analyzer=0){const q=environmentProbabilities(angle/.9,phase,inverse,analyzer).map(x=>x<1e-14?0:x);const total=q.reduce((a,b)=>a+b,0);return q.map(x=>{const p=x/total;return p>1-1e-14?1:p;});}
export function archiveAlternatives(z:number,phase:number){const radius=Math.sqrt(Math.max(0,1-z*z));return [radius*Math.cos(rad(phase)),radius*Math.sin(rad(phase)),z] as Vector;}
export function archivedRange(z:number,gate:string,phase=0){
 const center=operation([0,0,z],gate,phase)[2];
 const radius=Math.sqrt(Math.max(0,1-z*z))*Math.hypot(operation([1,0,0],gate,phase)[2],operation([0,1,0],gate,phase)[2]);
 return [clamp((1+center-radius)/2),clamp((1+center+radius)/2)];
}
export type Cause='phase'|'marker';
// D1/EH, D1/EV, D2/EH, D2/EV; the phase model has a uniform shot-to-shot phase.
export function diagnosticDistribution(cause:Cause,phase:number,stabilize:boolean,undo:boolean){
 if(cause==='marker')return markerDistribution(90,phase,undo,0);
 if(stabilize)return markerDistribution(0,phase,false,0);
 return [.5,0,.5,0];
}
export {polarVector};
