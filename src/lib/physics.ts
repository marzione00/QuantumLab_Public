// Ideal models used by the laboratories. Units of the gas are arbitrary.
export const TAU = 2 * Math.PI;
export const rad = (d: number) => d * Math.PI / 180;
export const clamp = (x: number, a = 0, b = 1) => Math.max(a, Math.min(b, x));
export function randomSource(seed = 271828) {
  let s = seed >>> 0;
  return () => { s += 0x6D2B79F5; let t = Math.imul(s ^ (s >>> 15), 1 | s); t ^= t + Math.imul(t ^ (t >>> 7), 61 | t); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
}
export function sample(p: number[], rng: () => number) {
  let u = rng(); for (let i = 0; i < p.length; i++) { u -= p[i]; if (u <= 0) return i; } return p.length - 1;
}
export const polarProbability = (a: number, b: number) => clamp(Math.cos(rad(a-b)) ** 2);
export type Vector = [number, number, number];
export const polarVector = (a: number): Vector => [Math.sin(2*rad(a)), 0, Math.cos(2*rad(a))];
export function operation(v: Vector, gate: string, phase: number): Vector {
  if(gate==='I')return [...v];
  if(gate==='X')return [v[0],-v[1],-v[2]];
  if(gate==='Y')return [-v[0],v[1],-v[2]];
  if(gate==='Z')return [-v[0],-v[1],v[2]];
  if (gate === 'H') return [v[2], -v[1], v[0]];
  const p = rad(phase); return [v[0]*Math.cos(p)-v[1]*Math.sin(p), v[0]*Math.sin(p)+v[1]*Math.cos(p), v[2]];
}
export function circuit(gates: string[], phase: number,initial:Vector=[0,0,1]): Vector[] {
  const states: Vector[] = [[...initial]]; gates.forEach(g => states.push(operation(states[states.length-1],g,phase))); return states;
}
export function pairProbabilities(kind: string, a: number, b: number, phase=0) {
  if (kind === 'entangled') { const q = clamp(.5*(Math.cos(rad(a))**2*Math.cos(rad(b))**2+Math.sin(rad(a))**2*Math.sin(rad(b))**2+.5*Math.sin(2*rad(a))*Math.sin(2*rad(b))*Math.cos(rad(phase))),0,.5); return [q,.5-q,.5-q,q]; }
  const ca=Math.cos(rad(a))**2, cb=Math.cos(rad(b))**2;
  const q=.5*(ca*cb+(1-ca)*(1-cb)); return [q,.5-q,.5-q,q];
}
type Complex = [number,number];
const cadd = (a:Complex,b:Complex):Complex => [a[0]+b[0],a[1]+b[1]];
const cscale = (a:Complex,s:number):Complex => [s*a[0],s*a[1]];
export function environmentProbabilities(coupling:number, phase:number, undo=false, analyzer=0) {
  // Basis: path A/env0, A/env1, path B/env0, B/env1.
  const t=rad(coupling*.9), c=Math.cos(t), s=Math.sin(t), f=rad(phase), k=Math.SQRT1_2;
  let state:Complex[]=[[k,0],[0,0],[k*c*Math.cos(f),k*c*Math.sin(f)],[k*s*Math.cos(f),k*s*Math.sin(f)]];
  if (undo) { const b0=state[2],b1=state[3]; state[2]=cadd(cscale(b0,c),cscale(b1,s)); state[3]=cadd(cscale(b0,-s),cscale(b1,c)); }
  state=[cscale(cadd(state[0],state[2]),k),cscale(cadd(state[1],state[3]),k),cscale(cadd(state[0],cscale(state[2],-1)),k),cscale(cadd(state[1],cscale(state[3],-1)),k)];
  const ca=Math.cos(rad(analyzer)),sa=Math.sin(rad(analyzer));
  state=[cadd(cscale(state[0],ca),cscale(state[1],sa)),cadd(cscale(state[0],-sa),cscale(state[1],ca)),cadd(cscale(state[2],ca),cscale(state[3],sa)),cadd(cscale(state[2],-sa),cscale(state[3],ca))];
  return state.map(z=>z[0]**2+z[1]**2);
}
export function screenDistribution(slits:number, coherent:boolean, spacing:number, phase:number, aperture=40, wavelength=550, distance=1, visibility=1) {
  const n=6400, ys:number[]=[], weights:number[]=[];
  for(let i=0;i<n;i++) { const y=-22+44*(i+.5)/n; const q=Math.PI*aperture*y/(wavelength*distance); const env=Math.abs(q)<1e-12?1:(Math.sin(q)/q)**2;
    const interference=slits===1?1:coherent?2+2*visibility*Math.cos(TAU*spacing*y/(wavelength*distance)+rad(phase)):2;
    ys.push(y); weights.push(Math.max(0,env*interference)); }
  const total=weights.reduce((a,b)=>a+b,0), probabilities=weights.map(v=>v/total); let sum=0;
  const cdf=probabilities.map(p=>sum+=p); cdf[n-1]=1; return {ys,probabilities,cdf};
}
export function screenSample(cdf:number[], rng:()=>number) { const u=rng();let lo=0,hi=cdf.length-1;while(lo<hi){const m=(lo+hi)>>>1;if(cdf[m]<u)lo=m+1;else hi=m;}return lo; }
export type Particle={x:number;y:number;vx:number;vy:number};
export type Gas={particles:Particle[];time:number;width:number;height:number;radius:number};
export function createGas(n=48, seed=31415, confined=true):Gas {
  const rng=randomSource(seed), width=720,height=340,radius=5,particles:Particle[]=[];
  for(let i=0;i<n;i++) { let x=0,y=0,ok=false;
    for(let k=0;k<10000&&!ok;k++){x=radius+3+rng()*((confined?width/2:width)-2*radius-6);y=radius+3+rng()*(height-2*radius-6);ok=particles.every(p=>(x-p.x)**2+(y-p.y)**2>(2*radius+1)**2);}
    if(!ok)throw new Error('Packing failed'); const a=TAU*rng(),v=65+40*rng();particles.push({x,y,vx:v*Math.cos(a),vy:v*Math.sin(a)});
  } return {particles,time:0,width,height,radius};
}
export const cloneGas=(g:Gas):Gas=>({...g,particles:g.particles.map(p=>({...p}))});
export function advanceGas(g:Gas,dt:number) {
  // Event-driven elastic collisions: the state advances from positions and
  // velocities only. No trajectory playback or restoration is used.
  let remaining=dt, iterations=0; const ps=g.particles,r=g.radius,eps=1e-10;
  while(remaining>eps) {
    if(++iterations>20000)throw new Error('Collision limit reached');
    let next=remaining+eps, ia=-1,ib=-1,wall=0;
    for(let i=0;i<ps.length;i++){const p=ps[i];
      const tx=p.vx>eps?(g.width-r-p.x)/p.vx:p.vx< -eps?(r-p.x)/p.vx:Infinity;
      const ty=p.vy>eps?(g.height-r-p.y)/p.vy:p.vy< -eps?(r-p.y)/p.vy:Infinity;
      if(tx>=-eps&&tx<next){next=Math.max(0,tx);ia=i;ib=-1;wall=1;}
      if(ty>=-eps&&ty<next){next=Math.max(0,ty);ia=i;ib=-1;wall=2;}
      for(let j=0;j<i;j++){const q=ps[j],dx=p.x-q.x,dy=p.y-q.y,dvx=p.vx-q.vx,dvy=p.vy-q.vy,b=dx*dvx+dy*dvy;
        if(b>=-eps)continue;const a=dvx*dvx+dvy*dvy,c=dx*dx+dy*dy-4*r*r,disc=b*b-a*c;
        if(disc<0||a<eps)continue;const t=(-b-Math.sqrt(disc))/a;
        if(t>=-1e-8&&t<next){next=Math.max(0,t);ia=i;ib=j;wall=0;}
      }
    }
    const step=Math.min(remaining,next);for(const p of ps){p.x+=p.vx*step;p.y+=p.vy*step;}remaining-=step;
    if(ia<0||next>step+eps)break;
    const p=ps[ia];if(ib<0){if(wall===1)p.vx=-p.vx;else p.vy=-p.vy;}
    else {const q=ps[ib],dx=p.x-q.x,dy=p.y-q.y;const f=((p.vx-q.vx)*dx+(p.vy-q.vy)*dy)/(dx*dx+dy*dy);p.vx-=f*dx;p.vy-=f*dy;q.vx+=f*dx;q.vy+=f*dy;}
  }g.time+=dt;
}
export function invertGas(g:Gas,errorDegrees=0){for(const p of g.particles){p.vx=-p.vx;p.vy=-p.vy;}if(errorDegrees){const p=g.particles[0],a=rad(errorDegrees),x=p.vx;p.vx=x*Math.cos(a)-p.vy*Math.sin(a);p.vy=x*Math.sin(a)+p.vy*Math.cos(a);}}
export function randomizeDirections(g:Gas,seed=2026){const rng=randomSource(seed);g.particles.forEach(p=>{const v=Math.hypot(p.vx,p.vy),a=TAU*rng();p.vx=v*Math.cos(a);p.vy=v*Math.sin(a);});}
export const gasLeft=(g:Gas)=>g.particles.filter(p=>p.x<g.width/2).length;
export const positionError=(g:Gas,initial:Gas)=>Math.sqrt(g.particles.reduce((s,p,i)=>s+(p.x-initial.particles[i].x)**2+(p.y-initial.particles[i].y)**2,0)/g.particles.length);
export function coarseReconstruction(original:Gas,seed=8128):Gas {
  const g=createGas(original.particles.length,seed,false), rng=randomSource(seed+1),left=gasLeft(original),placed:Particle[]=[];
  g.particles.forEach((p,i)=>{let ok=false;for(let k=0;k<10000&&!ok;k++){p.x=g.radius+3+rng()*(g.width/2-2*g.radius-6)+(i<left?0:g.width/2);p.y=g.radius+3+rng()*(g.height-2*g.radius-6);ok=placed.every(q=>(p.x-q.x)**2+(p.y-q.y)**2>(2*g.radius+1)**2);}if(!ok)throw new Error('Packing failed');placed.push(p);});g.time=original.time;return g;
}
