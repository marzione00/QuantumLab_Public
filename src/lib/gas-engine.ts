// Hard disks with elastic collisions. Events are predicted from the current
// microstate; reversing velocities never reads or replays a stored trajectory.
import {randomSource,TAU,type Particle,type Gas} from './physics.ts';
type Event={t:number;i:number;j:number;vi:number;vj:number;kind:number};
class MinHeap{
 a:Event[]=[];
 push(e:Event){let k=this.a.length;this.a.push(e);while(k){const p=(k-1)>>>1;if(this.a[p].t<=e.t)break;this.a[k]=this.a[p];k=p;}this.a[k]=e;}
 pop(){const first=this.a[0],last=this.a.pop()!;if(this.a.length){let k=0;while(2*k+1<this.a.length){let c=2*k+1;if(c+1<this.a.length&&this.a[c+1].t<this.a[c].t)c++;if(this.a[c].t>=last.t)break;this.a[k]=this.a[c];k=c;}this.a[k]=last;}return first;}
}
export class DiskGas{
 interactions:boolean;particles:Particle[];width=720;height=340;radius:number;time=0;collisions=0;
 private size:number;private cols:number;private rows:number;private cells:Set<number>[];private cx:Int32Array;private cy:Int32Array;private version:Int32Array;private last:Float64Array;private heap=new MinHeap();
 constructor(n=2000,seed=31415,confined=true,snapshot?:Gas,interactions=true){
  this.interactions=interactions;
  this.radius=snapshot?.radius??Math.min(5,300/n);this.size=Math.max(4,16*this.radius);this.cols=Math.ceil(this.width/this.size);this.rows=Math.ceil(this.height/this.size);this.cells=Array.from({length:this.cols*this.rows},()=>new Set());this.cx=new Int32Array(n);this.cy=new Int32Array(n);this.version=new Int32Array(n);this.last=new Float64Array(n);
  if(snapshot){this.particles=snapshot.particles.map(p=>({...p}));this.time=snapshot.time;this.last.fill(this.time);}else{
   const rng=randomSource(seed),r=this.radius;this.particles=[];
   // A random displacement within separated cells gives a reproducible,
   // non-overlapping preparation without a quadratic rejection loop.
   const width=confined?this.width/2:this.width,nx=Math.ceil(Math.sqrt(n*width/this.height)),ny=Math.ceil(n/nx),dx=(width-2*r)/nx,dy=(this.height-2*r)/ny;
   const slots=Array.from({length:nx*ny},(_,i)=>i);for(let i=slots.length-1;i;i--){const j=Math.floor(rng()*(i+1));[slots[i],slots[j]]=[slots[j],slots[i]];}
   for(let i=0;i<n;i++){const k=slots[i],a=TAU*rng(),v=65+40*rng();this.particles.push({x:r+((k%nx)+.5)*dx+(rng()-.5)*Math.max(0,dx-2.3*r)*.8,y:r+(Math.floor(k/nx)+.5)*dy+(rng()-.5)*Math.max(0,dy-2.3*r)*.8,vx:v*Math.cos(a),vy:v*Math.sin(a)});}
  }
  for(let i=0;i<n;i++){const p=this.particles[i];this.cx[i]=Math.min(this.cols-1,Math.floor(p.x/this.size));this.cy[i]=Math.min(this.rows-1,Math.floor(p.y/this.size));this.cells[this.cy[i]*this.cols+this.cx[i]].add(i);}this.rebuild();
 }
 private at(i:number){const p=this.particles[i],d=this.time-this.last[i];return [p.x+p.vx*d,p.y+p.vy*d];}
 private move(i:number){const p=this.particles[i],d=this.time-this.last[i];p.x+=p.vx*d;p.y+=p.vy*d;this.last[i]=this.time;}
 private add(dt:number,i:number,j:number,kind:number){if(Number.isFinite(dt)&&dt>=-1e-9)this.heap.push({t:this.time+Math.max(0,dt),i,j,kind,vi:this.version[i],vj:j<0?0:this.version[j]});}
 private schedule(i:number){const p=this.particles[i],[x,y]=this.at(i),r=this.radius;
  const candidates:[number,number][]=[
   [p.vx>0?(this.width-r-x)/p.vx:p.vx<0?(r-x)/p.vx:Infinity,1],
   [p.vy>0?(this.height-r-y)/p.vy:p.vy<0?(r-y)/p.vy:Infinity,2],
   [p.vx>0&&this.cx[i]<this.cols-1?((this.cx[i]+1)*this.size-x)/p.vx:p.vx<0&&this.cx[i]>0?(this.cx[i]*this.size-x)/p.vx:Infinity,3],
   [p.vy>0&&this.cy[i]<this.rows-1?((this.cy[i]+1)*this.size-y)/p.vy:p.vy<0&&this.cy[i]>0?(this.cy[i]*this.size-y)/p.vy:Infinity,4]
  ];let boundary=Infinity,kind=1;for(const [dt,k] of candidates)if(dt>=-1e-9&&dt<boundary){boundary=dt;kind=k;}this.add(boundary,i,-1,kind);
  for(let yy=Math.max(0,this.cy[i]-1);yy<=Math.min(this.rows-1,this.cy[i]+1);yy++)for(let xx=Math.max(0,this.cx[i]-1);xx<=Math.min(this.cols-1,this.cx[i]+1);xx++)for(const j of this.cells[yy*this.cols+xx]){
   if(j===i)continue;const q=this.particles[j],[qx,qy]=this.at(j),dx=x-qx,dy=y-qy,vx=p.vx-q.vx,vy=p.vy-q.vy,b=dx*vx+dy*vy;if(b>=-1e-10)continue;const a=vx*vx+vy*vy,c=dx*dx+dy*dy-4*r*r,disc=b*b-a*c;if(disc<0||a<1e-20)continue;const dt=c/(-b+Math.sqrt(disc));if(dt<=boundary+1e-10)this.add(dt,i,j,0);
  }
 }
 private rebuild(){this.heap=new MinHeap();if(!this.interactions)return;for(let i=0;i<this.particles.length;i++)this.schedule(i);}
 advance(target:number,budgetMs=Infinity){
  if(!this.interactions){const dt=target-this.time,r=this.radius;for(const p of this.particles){for(const [axis,vel,length] of [['x','vx',this.width-2*r],['y','vy',this.height-2*r]] as const){const u=((p[axis]-r+p[vel]*dt)%(2*length)+2*length)%(2*length);p[axis]=r+(u>length?2*length-u:u);if(u>length)p[vel]=-p[vel];}}this.time=target;this.last.fill(target);return true;}
  const start=performance.now();let count=0;
  while(this.heap.a.length){const e=this.heap.a[0];if(e.t>target)break;this.heap.pop();
   if(e.vi!==this.version[e.i]||(e.j>=0&&e.vj!==this.version[e.j])){if(++count%128===0&&performance.now()-start>budgetMs){this.sync();return false;}continue;}
   this.time=e.t;const i=e.i,p=this.particles[i];this.move(i);this.version[i]++;
   if(e.kind===0){const j=e.j,q=this.particles[j];this.move(j);this.version[j]++;const dx=p.x-q.x,dy=p.y-q.y,f=((p.vx-q.vx)*dx+(p.vy-q.vy)*dy)/(dx*dx+dy*dy);p.vx-=f*dx;p.vy-=f*dy;q.vx+=f*dx;q.vy+=f*dy;this.collisions++;this.schedule(i);this.schedule(j);}
   else if(e.kind<=2){if(e.kind===1)p.vx=-p.vx;else p.vy=-p.vy;this.schedule(i);}
   else{this.cells[this.cy[i]*this.cols+this.cx[i]].delete(i);if(e.kind===3)this.cx[i]+=p.vx>0?1:-1;else this.cy[i]+=p.vy>0?1:-1;this.cells[this.cy[i]*this.cols+this.cx[i]].add(i);this.schedule(i);}
   if(++count%128===0&&performance.now()-start>budgetMs){this.sync();return false;}
  }
  this.time=target;this.sync();if(this.heap.a.length>this.particles.length*60)this.rebuild();return true;
 }
 sync(){for(let i=0;i<this.particles.length;i++)this.move(i);}
 snapshot():Gas{this.sync();return {particles:this.particles.map(p=>({...p})),width:this.width,height:this.height,radius:this.radius,time:this.time};}
 reverse(angle=0){this.sync();for(const p of this.particles){p.vx=-p.vx;p.vy=-p.vy;}if(angle){const p=this.particles[0],a=angle*Math.PI/180,vx=p.vx;p.vx=vx*Math.cos(a)-p.vy*Math.sin(a);p.vy=vx*Math.sin(a)+p.vy*Math.cos(a);}this.version.fill(0);this.rebuild();}
 energy(){return this.particles.reduce((s,p)=>s+(p.vx*p.vx+p.vy*p.vy)/2,0);}
 statistics(){const bins=new Array(32).fill(0);let left=0;for(const p of this.particles){if(p.x<this.width/2)left++;bins[Math.max(0,Math.min(31,Math.floor(p.x/this.width*8)+8*Math.floor(p.y/this.height*4)))]++;}const n=this.particles.length,entropy=-bins.reduce((s,v)=>v?s+v/n*Math.log(v/n):s,0)/Math.log(32);return {left,entropy,bins};}
}
export function gasRms(a:Particle[],b:Particle[]){return Math.sqrt(a.reduce((s,p,i)=>s+(p.x-b[i].x)**2+(p.y-b[i].y)**2,0)/a.length);}
