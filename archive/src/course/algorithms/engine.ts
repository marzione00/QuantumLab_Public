import {compileMultiplier} from './reversible';
import * as M from '../math/core';
export type Gate={name:string;target:number;controls?:number[];angle?:number};
export type Snapshot={label:string;state:M.V;work:string[]};
export const binary=(x:number,n:number)=>x.toString(2).padStart(n,'0');
export function basis(n:number,x=0):M.V{return Array.from({length:2**n},(_,j)=>M.z(j===x?1:0));}
export function gateMatrix(name:string,angle=0):M.Mat{
 if(name==='H')return M.H;if(name==='X')return M.X;if(name==='Y')return M.Y;if(name==='Z')return M.Z;
 if(name==='S')return M.phaseGate(90);if(name==='T')return M.phaseGate(45);if(name==='P')return M.phaseGate(angle);
 return M.axisGate(name==='Ry'?'Uy':name==='Rx'?'Ux':'Uz',angle);
}
export function applyGate(state:M.V,n:number,g:Gate):Snapshot{
 const mask=1<<(n-1-g.target),controls=(g.controls||[]).map(q=>1<<(n-1-q)),u=gateMatrix(g.name,g.angle),out=state.map(x=>[...x] as M.Z),work:string[]=[];
 for(let a=0;a<state.length;a++)if(!(a&mask)&&controls.every(c=>!!(a&c))){const b=a|mask,v=[state[a],state[b]],w=M.mv(u,v);out[a]=w[0];out[b]=w[1];if(v.some(x=>M.abs2(x)>1e-16))for(let j=0;j<2;j++)work.push(`c(${binary(j?b:a,n)}) = ${M.rowTerms(u,v)[j]} ≈ ${M.cz(w[j])}`);}
 return{label:(g.controls?.length?'C·':'')+g.name+(g.angle!==undefined?'('+g.angle+'°)':''),state:out,work};
}
export function runCircuit(n:number,initial:M.V,gates:Gate[]):Snapshot[]{const states=[{label:'Preparazione',state:initial,work:[`‖ψ‖² = ${initial.map(v=>M.f(M.abs2(v))).join(' + ')} = ${M.f(M.norm2(initial))}`]}];for(const g of gates)states.push(applyGate(states.at(-1)!.state,n,g));return states;}
export function probabilities(v:M.V){return v.map(M.abs2);}
export function marginal(v:M.V,n:number,qubit:number){const mask=1<<(n-1-qubit);return v.reduce((p,z,j)=>{p[j&mask?1:0]+=M.abs2(z);return p;},[0,0]);}
export function reducedBloch(v:M.V,n:number,q:number):M.R3{const mask=1<<(n-1-q);let off=M.z(),z=0;for(let j=0;j<v.length;j++)if(!(j&mask)){off=M.add(off,M.mul(M.conj(v[j]),v[j|mask]));z+=M.abs2(v[j])-M.abs2(v[j|mask]);}return[2*off[0],2*off[1],z];}
export const parity=(x:number)=>{let p=0;while(x){p^=x&1;x>>>=1;}return p;};
export function hadamards(v:M.V,n:number){let out=v;for(let q=0;q<n;q++)out=applyGate(out,n,{name:'H',target:q}).state;return out;}
export function phaseOracle(values:number[]){return hadamards(values.map(x=>M.z((x?-1:1)/Math.sqrt(values.length))),Math.log2(values.length));}
export function qft(v:M.V,inverse=false):M.V{const N=v.length;return Array.from({length:N},(_,y)=>M.scale(v.reduce((s,x,j)=>M.add(s,M.mul(x,M.cis((inverse?-1:1)*2*Math.PI*j*y/N))),M.z()),1/Math.sqrt(N)));}
export function fft(v:M.V,inverse=false):M.V{const N=v.length;if(N===1)return [[...v[0]]];if(N&(N-1))return qft(v,inverse);const a=fft(v.filter((_,j)=>!(j&1)),inverse),b=fft(v.filter((_,j)=>j&1),inverse),out:Array<M.Z>=Array(N);for(let j=0;j<N/2;j++){const t=M.mul(M.cis((inverse?-1:1)*2*Math.PI*j/N),b[j]);out[j]=M.scale(M.add(a[j],t),Math.SQRT1_2);out[j+N/2]=M.scale(M.sub(a[j],t),Math.SQRT1_2);}return out;}
export function qftGates(n:number){const gates:Gate[]=[];for(let j=0;j<n;j++){gates.push({name:'H',target:j});for(let k=j+1;k<n;k++)gates.push({name:'P',target:j,controls:[k],angle:180/2**(k-j)});}return gates;}
export function reverseBits(v:M.V,n:number){return v.map((_,j)=>v[parseInt(binary(j,n).split('').reverse().join(''),2)]);}
export function grover(N:number,marked:number[],k:number,initial?:M.V){const a=initial||Array.from({length:N},()=>M.z(1/Math.sqrt(N)));let v=a;const stages:Snapshot[]=[{label:'Preparazione A|0⟩',state:v,work:[M.cv(v)]}];for(let j=0;j<k;j++){v=v.map((z,x)=>M.scale(z,marked.includes(x)?-1:1));stages.push({label:`Oracolo ${j+1}`,state:v,work:[`O|x⟩ = (−1)^[x∈G]|x⟩; G={${marked.join(',')}}`]});const c=M.dot(a,v),out=M.vsub(M.vscale(a,M.scale(c,2)),v);stages.push({label:`Riflessione ${j+1}`,state:out,work:[`⟨a|v⟩ = ${M.dotTerms(a,v)} ≈ ${M.cz(c)}`,...out.map((z,x)=>`c(${x}) = 2·(${M.cz(a[x])})·(${M.cz(c)}) − (${M.cz(v[x])}) ≈ ${M.cz(z)}`)]});v=out;}return stages;}
export function gcd(a:number,b:number){while(b){[a,b]=[b,a%b];}return Math.abs(a);}
export function euclid(a:number,b:number){const rows:number[][]=[];let r0=a,r1=b,s0=1,s1=0,t0=0,t1=1;while(r1){const q=Math.floor(r0/r1);rows.push([r0,r1,q,r0-q*r1,s0-q*s1,t0-q*t1]);[r0,r1]=[r1,r0-q*r1];[s0,s1]=[s1,s0-q*s1];[t0,t1]=[t1,t0-q*t1];}return{gcd:r0,s:s0,t:t0,rows};}
export function inverse(a:number,N:number){const e=euclid(a,N);return e.gcd===1?((e.s%N)+N)%N:null;}
export function power(a:number,e:number,N:number){let r=1,b=((a%N)+N)%N;const rows:number[][]=[];while(e){const bit=e%2,product=r*b;rows.push([e,bit,r,b,product,bit?product%N:r]);if(bit)r=product%N;b=b*b%N;e=Math.floor(e/2);}return{value:r,rows};}
export const powmod=(a:number,e:number,N:number)=>power(a,e,N).value;
export function continuedFraction(c:number,Q:number){let a=c,b=Q,p0=0,p1=1,q0=1,q1=0;const rows:{a:number;b:number;quotient:number;remainder:number;p:number;q:number}[]=[];while(b){const quotient=Math.floor(a/b),remainder=a%b,p=quotient*p1+p0,q=quotient*q1+q0;rows.push({a,b,quotient,remainder,p,q});[p0,p1,q0,q1]=[p1,p,q1,q];[a,b]=[b,remainder];}return rows;}
export function orbit(N:number,a:number){const out=[1];let x=a%N;while(x!==1&&out.length<=N){out.push(x);x=x*a%N;}return out;}
export function qpe(phi:number,m:number){const Q=2**m,prepared=Array.from({length:Q},(_,x)=>M.scale(M.cis(2*Math.PI*x*phi),1/Math.sqrt(Q))),state=fft(prepared,true);return{prepared,state,p:probabilities(state)};}
export function shor(N:number,a:number,m:number){
 if(gcd(a,N)!==1)throw Error('La base deve essere coprima con N');
 const Q=2**m,n=Math.ceil(Math.log2(N)),D=2**n,constants=Array.from({length:m},(_,j)=>powmod(a,2**j,N));
 // The circuit is compiled only from N,a,m. Neither order nor factors enter here.
 const networks=constants.map(c=>compileMultiplier(N,c));let values=Array(Q).fill(1);const stages:number[][]=[values.slice()];
 for(let j=0;j<m;j++){values=values.map((y,x)=>(x>>j)&1?networks[j].mapping[y]:y);stages.push(values.slice());}
 const transformed:M.V[]=Array.from({length:D},(_,y)=>fft(values.map(t=>M.z(t===y?1/Math.sqrt(Q):0)),true));
 const p=Array.from({length:Q},(_,c)=>transformed.reduce((s,v)=>s+M.abs2(v[c]),0));
 return{N,a,m,n,Q,D,constants,networks,values,stages,transformed,p};
}
export function recover(c:number,Q:number,N:number,a:number){const rows=continuedFraction(c,Q).filter(r=>r.q>0&&r.q<N);const candidates=rows.map(row=>{const R=row.q,period=powmod(a,R,N)===1,t=R%2===0?powmod(a,R/2,N):null,factors=period&&t!==null?[gcd(t-1,N),gcd(t+1,N)]:[];return{...row,period,t,factors: factors.filter(x=>x>1&&x<N&&N%x===0)};});return candidates;}
export type ClassicalGate={kind:'X'|'CX'|'CCX';targets:number[];label:string};
export function ripple(a:number,b:number,n:number){
 // Registers A[n],B[n],carry[n+1],sum[n]. c0=0. Compute history, copy
 // sums with three CNOTs per bit, reverse every carry gate to clean history.
 const size=4*n+1,bits=Array(size).fill(0),C=2*n,S=3*n+1,gates:ClassicalGate[]=[],records:{gate:ClassicalGate;bits:number[]}[]=[];
 for(let i=0;i<n;i++){bits[i]=(a>>i)&1;bits[n+i]=(b>>i)&1;}
 const apply=(g:ClassicalGate)=>{const [x,y,z]=g.targets;if(g.kind==='X')bits[x]^=1;else if(g.kind==='CX')bits[y]^=bits[x];else bits[z]^=bits[x]&bits[y];records.push({gate:g,bits:bits.slice()});};
 for(let i=0;i<n;i++){for(const pair of [[i,n+i],[i,C+i],[n+i,C+i]]){const gate:ClassicalGate={kind:'CCX',targets:[...pair,C+i+1],label:`c${i+1} ^= ${pair.map(x=>x<n?'a'+x:x<2*n?'b'+(x-n):'c'+(x-C)).join('·')}`};gates.push(gate);apply(gate);}}
 const carryOut=bits[C+n];for(let i=0;i<n;i++)for(const x of [i,n+i,C+i])apply({kind:'CX',targets:[x,S+i],label:`s${i} ^= ${x<n?'a'+x:x<2*n?'b'+(x-n):'c'+(x-C)}`});
 for(const g of [...gates].reverse())apply({...g,label:'Ripristino: '+g.label});
 return{n,a,b,records,sum:bits.slice(S,S+n).reduce((s,b,i)=>s+b*2**i,0),carryOut,clean:bits.slice(C,C+n+1).every(x=>!x),bits};
}
export function modularMultiply(a:number,x:number,N:number){let acc=0;const rows=[];for(let j=0;j<Math.ceil(Math.log2(N));j++){const constant=(a*2**j)%N,bit=(x>>j)&1,sum=acc+bit*constant,next=sum>=N?sum-N:sum;rows.push({j,bit,constant,acc,sum,subtract:sum>=N,next});acc=next;}return{value:acc,rows};}
export function gf2Eliminate(rows:number[],n:number){const out=[...rows],steps:string[]=[];let r=0;const pivots:number[]=[];for(let q=n-1;q>=0;q--){const p=out.findIndex((v,i)=>i>=r&&!!(v&(1<<q)));if(p<0)continue;if(p!==r){[out[p],out[r]]=[out[r],out[p]];steps.push(`Scambia riga ${p+1} e ${r+1}.`);}for(let j=0;j<out.length;j++)if(j!==r&&(out[j]&(1<<q))){const before=out[j];out[j]^=out[r];steps.push(`${binary(before,n)} ⊕ ${binary(out[r],n)} = ${binary(out[j],n)}`);}pivots.push(q);r++;}return{rows:out,steps,rank:r,solutions:Array.from({length:2**n},(_,s)=>s).filter(s=>rows.every(y=>!parity(y&s)))};}
