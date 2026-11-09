import {type Gas,randomSource,TAU} from './physics.ts';
export function reconstructArchive(original:Gas,method:string,cells=2,resolution=.1,seed=681):Gas{
 const out:Gas={...original,particles:original.particles.map(p=>({...p}))},rng=randomSource(seed);
 if(method==='full')return out;
 if(method==='rounded'){for(const p of out.particles){p.vx=Math.round(p.vx/resolution)*resolution;p.vy=Math.round(p.vy/resolution)*resolution;}return out;}
 if(method==='positions'){for(const p of out.particles){const a=TAU*rng(),v=65+40*rng();p.vx=v*Math.cos(a);p.vy=v*Math.sin(a);}return out;}
 const nx=cells===2?2:cells===8?4:8,ny=cells/nx,counts=new Array(cells).fill(0),W=out.width,H=out.height,r=out.radius;
 for(const p of original.particles)counts[Math.min(cells-1,Math.floor(p.x/W*nx)+nx*Math.floor(p.y/H*ny))]++;
 const cellSize=2.1*r,cols=Math.ceil(W/cellSize),placed=new Map<number,{x:number;y:number}[]>();let index=0;
 for(let c=0;c<cells;c++)for(let k=0;k<counts[c];k++){
  let x=0,y=0,ok=false;for(let trial=0;trial<10000&&!ok;trial++){
   x=(c%nx)*W/nx+r+rng()*(W/nx-2*r);y=Math.floor(c/nx)*H/ny+r+rng()*(H/ny-2*r);const ix=Math.floor(x/cellSize),iy=Math.floor(y/cellSize);ok=true;
   for(let dy=-1;dy<=1&&ok;dy++)for(let dx=-1;dx<=1&&ok;dx++){const bucket=placed.get((iy+dy)*cols+ix+dx);if(bucket?.some(p=>(p.x-x)**2+(p.y-y)**2<4.01*r*r))ok=false;}
  }
  if(!ok)throw new Error('Preparazione troppo densa per questa risoluzione.');const key=Math.floor(y/cellSize)*cols+Math.floor(x/cellSize),bucket=placed.get(key)||[];bucket.push({x,y});placed.set(key,bucket);const a=TAU*rng(),v=65+40*rng();out.particles[index++]={x,y,vx:v*Math.cos(a),vy:v*Math.sin(a)};
 }
 return out;
}
