// Integer kick-drift-kick dynamics. No trajectory history is used to return.
// Positions and momenta live on an integer lattice; deterministic forces are
// rounded symmetrically. Every step is exactly undone by velocity reversal.
import {randomSource, TAU, type Particle} from './physics.ts';
export const GAS_SCALE = 2 ** 24;
export const GAS_DT = 1 / 1024;
const WIDTH = 720, HEIGHT = 340, BARRIER = 24000;
const nearest = (x:number) => x < 0 ? -Math.round(-x) : Math.round(x);
const modulo = (x:number, length:number) => ((x % length) + length) % length;
export type GasRecord = {n:number; seed:number; interactions:boolean; steps:number; qx:number[]; qy:number[]; px:number[]; py:number[]};
export type Inversion = {kind:'exact'|'rotation'|'recording'; degrees:number; fraction:number; seed?:number};

export class ReversibleGas {
 readonly n:number; readonly seed:number; readonly interactions:boolean;
 readonly width=WIDTH; readonly height=HEIGHT; readonly dt=GAS_DT;
 readonly range:number; readonly radius:number;
 steps=0; particles:Particle[];
 qx:Float64Array; qy:Float64Array; px:Float64Array; py:Float64Array;
 private x:Float64Array; private y:Float64Array; private kx:Float64Array; private ky:Float64Array;
 private head:Int32Array; private next:Int32Array; private cols:number; private rows:number;
 private potential=0;
 constructor(n=5000,seed=31415,interactions=true,record?:GasRecord){
  this.n=n;this.seed=seed;this.interactions=interactions;
  this.range=3.8;this.radius=this.range*.27;
  this.cols=Math.ceil(WIDTH/this.range);this.rows=Math.ceil(HEIGHT/this.range);
  this.qx=new Float64Array(n);this.qy=new Float64Array(n);this.px=new Float64Array(n);this.py=new Float64Array(n);
  this.x=new Float64Array(n);this.y=new Float64Array(n);this.kx=new Float64Array(n);this.ky=new Float64Array(n);
  this.head=new Int32Array(this.cols*this.rows);this.next=new Int32Array(n);
  this.particles=Array.from({length:n},()=>({x:0,y:0,vx:0,vy:0}));
  if(record){
   if(record.n!==n||record.interactions!==interactions)throw new Error('Incompatible gas record');
   this.qx.set(record.qx);this.qy.set(record.qy);this.px.set(record.px);this.py.set(record.py);this.steps=record.steps;
  }else{
   const rng=randomSource(seed),nx=Math.ceil(Math.sqrt(n*(WIDTH/2)/HEIGHT)),ny=Math.ceil(n/nx),dx=(WIDTH/2-4)/nx,dy=(HEIGHT-4)/ny;
   for(let i=0;i<n;i++){
    this.qx[i]=nearest((2+(i%nx+.5)*dx+(rng()-.5)*dx*.12)*GAS_SCALE);
    this.qy[i]=nearest((2+(Math.floor(i/nx)+.5)*dy+(rng()-.5)*dy*.12)*GAS_SCALE);
    const angle=TAU*rng(),speed=65+40*rng();
    this.px[i]=nearest(speed*Math.cos(angle)*GAS_SCALE);this.py[i]=nearest(speed*Math.sin(angle)*GAS_SCALE);
   }
  }
  this.forces();this.sync();
 }
 private forces(){
  const S=GAS_SCALE,LX=WIDTH*S,LY=HEIGHT*S,n=this.n,range=this.range;
  this.kx.fill(0);this.ky.fill(0);this.potential=0;this.head.fill(-1);
  for(let i=n-1;i>=0;i--){
   this.x[i]=(this.qx[i]<=LX?this.qx[i]:2*LX-this.qx[i])/S;
   this.y[i]=(this.qy[i]<=LY?this.qy[i]:2*LY-this.qy[i])/S;
   const cx=Math.min(this.cols-1,Math.floor(this.x[i]/range)),cy=Math.min(this.rows-1,Math.floor(this.y[i]/range)),cell=cy*this.cols+cx;
   this.next[i]=this.head[cell];this.head[cell]=i;
  }
  if(!this.interactions)return;
  const rr=range*range,factor=8*BARRIER/rr;
  // Particle index and neighbour traversal order are deterministic. Equal
  // coordinates therefore reproduce exactly the same rounded force impulse.
  for(let i=0;i<n;i++){
   const xi=this.x[i],yi=this.y[i],cx=Math.min(this.cols-1,Math.floor(xi/range)),cy=Math.min(this.rows-1,Math.floor(yi/range));
   for(let yy=Math.max(0,cy-1);yy<=Math.min(this.rows-1,cy+1);yy++)for(let xx=Math.max(0,cx-1);xx<=Math.min(this.cols-1,cx+1);xx++){
    for(let j=this.head[yy*this.cols+xx];j>=0;j=this.next[j]){
     if(j<=i)continue;const dx=xi-this.x[j],dy=yi-this.y[j],r2=dx*dx+dy*dy;
     if(r2>=rr)continue;
     const u=1-r2/rr,f=factor*u*u*u,fx=f*dx,fy=f*dy;
     this.kx[i]+=fx;this.ky[i]+=fy;this.kx[j]-=fx;this.ky[j]-=fy;this.potential+=BARRIER*u*u*u*u;
    }
   }
  }
  const half=GAS_DT*S/2;
  for(let i=0;i<n;i++){
   this.kx[i]=nearest(this.kx[i]*half)*(this.qx[i]<=LX?1:-1);
   this.ky[i]=nearest(this.ky[i]*half)*(this.qy[i]<=LY?1:-1);
  }
 }
 step(count=1){
  const LX=2*WIDTH*GAS_SCALE,LY=2*HEIGHT*GAS_SCALE;
  for(let s=0;s<count;s++){
   for(let i=0;i<this.n;i++){
    this.px[i]+=this.kx[i];this.py[i]+=this.ky[i];
    this.qx[i]=modulo(this.qx[i]+nearest(this.px[i]*GAS_DT),LX);
    this.qy[i]=modulo(this.qy[i]+nearest(this.py[i]*GAS_DT),LY);
   }
   this.forces();
   for(let i=0;i<this.n;i++){this.px[i]+=this.kx[i];this.py[i]+=this.ky[i];}
   this.steps++;
  }
 }
 sync(){
  const LX=WIDTH*GAS_SCALE,LY=HEIGHT*GAS_SCALE;
  for(let i=0;i<this.n;i++){const p=this.particles[i];p.x=this.x[i];p.y=this.y[i];p.vx=this.px[i]/GAS_SCALE*(this.qx[i]<=LX?1:-1);p.vy=this.py[i]/GAS_SCALE*(this.qy[i]<=LY?1:-1);}
  return this.particles;
 }
 record():GasRecord{return {n:this.n,seed:this.seed,interactions:this.interactions,steps:this.steps,qx:Array.from(this.qx),qy:Array.from(this.qy),px:Array.from(this.px),py:Array.from(this.py)};}
 static from(record:GasRecord){return new ReversibleGas(record.n,record.seed,record.interactions,record);}
 invert(options:Inversion={kind:'exact',degrees:0,fraction:0}){
  for(let i=0;i<this.n;i++){this.px[i]=-this.px[i];this.py[i]=-this.py[i];}
  const count=options.kind==='exact'?0:Math.min(this.n,Math.max(0,Math.round(this.n*options.fraction)));
  const indices=Array.from({length:this.n},(_,i)=>i),rng=randomSource(options.seed??9173);
  for(let i=indices.length-1;i>0;i--){const j=Math.floor(rng()*(i+1));[indices[i],indices[j]]=[indices[j],indices[i]];}
  let sum=0;
  for(let k=0;k<count;k++){
   const i=indices[k],sx=this.qx[i]<=WIDTH*GAS_SCALE?1:-1,sy=this.qy[i]<=HEIGHT*GAS_SCALE?1:-1;
   const vx=this.px[i]*sx,vy=this.py[i]*sy,angle=Math.atan2(vy,vx),speed=Math.hypot(vx,vy),delta=options.degrees*Math.PI/180;
   if(delta===0)continue;
   const originalAngle=Math.atan2(-vy,-vx);
   const changed=options.kind==='recording'?nearest(originalAngle/delta)*delta+Math.PI:angle+(2*rng()-1)*delta;
   let error=changed-angle;error=Math.atan2(Math.sin(error),Math.cos(error));sum+=error*error;
   this.px[i]=nearest(speed*Math.cos(changed))*sx;this.py[i]=nearest(speed*Math.sin(changed))*sy;
  }
  this.sync();return {affected:count,angularRms:count?Math.sqrt(sum/count)*180/Math.PI:0};
 }
 statistics(){
  let left=0,kinetic=0;const bins=new Array(32).fill(0);
  for(let i=0;i<this.n;i++){
   if(this.x[i]<WIDTH/2)left++;
   bins[Math.min(7,Math.floor(this.x[i]/WIDTH*8))+8*Math.min(3,Math.floor(this.y[i]/HEIGHT*4))]++;
   kinetic+=(this.px[i]/GAS_SCALE)**2+(this.py[i]/GAS_SCALE)**2;
  }
  const entropy=-bins.reduce((s,n)=>n?s+n/this.n*Math.log(n/this.n):s,0)/Math.log(32);
  return {left,bins,entropy,energy:kinetic/2+this.potential};
 }
 compare(reference:Particle[]){
  let squared=0,near=0;for(let i=0;i<this.n;i++){const d=(this.x[i]-reference[i].x)**2+(this.y[i]-reference[i].y)**2;squared+=d;if(d<=4)near++;}
  return {rms:Math.sqrt(squared/this.n),nearFraction:near/this.n};
 }
}
