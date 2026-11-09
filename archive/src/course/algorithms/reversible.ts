/** Exact, deliberately unoptimized synthesis for the SMALL teaching registers.
 * A minterm truth-table XOR oracle is expanded into X/CX/CCX, then used in
 * compute/swap/uncompute. Its exponential compilation cost is NOT an estimate
 * of the scalable arithmetic circuits in Shor. No order or factors are inputs. */
export type ReversibleGate={kind:'X'|'CX'|'CCX';wires:number[];block:string};
export type CompiledPermutation={N:number;a:number;n:number;wires:number;gates:ReversibleGate[];mapping:number[];clean:boolean;counts:Record<string,number>};
const cache=new Map<string,CompiledPermutation>();
function modInverse(a:number,N:number){for(let b=1;b<N;b++)if(a*b%N===1)return b;throw Error('Moltiplicatore non invertibile');}
export function runReversible(gates:ReversibleGate[],bits:number[]){const out=[...bits];for(const g of gates){const [a,b,c]=g.wires;if(g.kind==='X')out[a]^=1;else if(g.kind==='CX')out[b]^=out[a];else out[c]^=out[a]&out[b];}return out;}
export function compileMultiplier(N:number,a:number):CompiledPermutation{
 const key=N+':'+a;if(cache.has(key))return cache.get(key)!;
 const n=Math.ceil(Math.log2(N)),D=2**n,wires=3*n,gates:ReversibleGate[]=[],data=Array.from({length:n},(_,j)=>1+j),work=data.map(j=>j+n),scratch=Array.from({length:n-1},(_,j)=>1+2*n+j),inv=modInverse(a,N);
 const add=(kind:ReversibleGate['kind'],wires:number[],block:string)=>gates.push({kind,wires,block});
 const multi=(controls:number[],target:number,block:string)=>{
  if(controls.length===1){add('CX',[controls[0],target],block);return;}
  if(controls.length===2){add('CCX',[...controls,target],block);return;}
  const chain:ReversibleGate[]=[];const gate=(w:number[])=>chain.push({kind:'CCX',wires:w,block});
  gate([controls[0],controls[1],scratch[0]]);for(let j=2;j<controls.length-1;j++)gate([scratch[j-2],controls[j],scratch[j-1]]);
  gates.push(...chain);add('CCX',[scratch[controls.length-3],controls.at(-1)!,target],block);gates.push(...[...chain].reverse());
 };
 const xor=(source:number[],target:number[],multiplier:number,block:string)=>{
  for(let x=0;x<D;x++){const value=x<N?multiplier*x%N:x,zero=source.filter((_,j)=>!((x>>(n-1-j))&1));if(value===0)continue;zero.forEach(w=>add('X',[w],block));for(let j=0;j<n;j++)if((value>>(n-1-j))&1)multi([0,...source],target[j],block);zero.forEach(w=>add('X',[w],block));}
 };
 if(a%N!==1){xor(data,work,a,'calcola P');for(let j=0;j<n;j++){add('CCX',[0,data[j],work[j]],'scambia');add('CCX',[0,work[j],data[j]],'scambia');add('CCX',[0,data[j],work[j]],'scambia');}xor(data,work,inv,'cancella con P inversa');}
 const mapping:number[]=[],counts:Record<string,number>={X:0,CX:0,CCX:0};gates.forEach(g=>counts[g.kind]++);let clean=true;
 for(let control=0;control<=1;control++)for(let x=0;x<D;x++){
  const bits=Array(wires).fill(0);bits[0]=control;data.forEach((q,j)=>bits[q]=(x>>(n-1-j))&1);const out=runReversible(gates,bits),y=data.reduce((v,q)=>2*v+out[q],0),expected=control&&x<N?a*x%N:x;
  if(y!==expected||out[0]!==control||[...work,...scratch].some(q=>out[q]!==0))throw Error('Rete modulare non reversibile o ausiliari sporchi');
  if(control)mapping.push(y);clean&&=[...work,...scratch].every(q=>out[q]===0);
 }
 const compiled={N,a,n,wires,gates,mapping,clean,counts};cache.set(key,compiled);return compiled;
}
