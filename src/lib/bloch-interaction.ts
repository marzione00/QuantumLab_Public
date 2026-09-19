import {clamp,rad,type Vector} from './physics.ts';
export function blochCoordinates(v:Vector){
 const inclination=Math.acos(clamp(v[2],-1,1))*180/Math.PI;
 const raw=Math.atan2(v[1],v[0])*180/Math.PI;
 const phase=raw<=-180+1e-10?180:Math.abs(raw)<1e-10?0:raw;
 return {inclination,phase,hasPhase:Math.hypot(v[0],v[1])>1e-7};
}
export function fromBlochAngles(inclination:number,phase:number):Vector{
 const t=rad(inclination),p=rad(phase);return [Math.sin(t)*Math.cos(p),Math.sin(t)*Math.sin(p),Math.cos(t)];
}
export function parseAngle(text:string,max:number,min=0){
 if(!/^\s*[+−-]?(?:\d+(?:[.,]\d*)?|[.,]\d+)\s*$/.test(text))return null;
 const n=Number(text.trim().replace('−','-').replace(',','.'));return Number.isFinite(n)&&n>=min&&n<=max?n:null;
}
export function qubitName(v:Vector){
 if(v[2]>.99999)return 'Stato 0';if(v[2]<-.99999)return 'Stato 1';
 if(v[0]>.99999)return 'Stato +';if(v[0]<-.99999)return 'Stato −';
 if(v[1]>.99999)return 'Stato con fase +90°';if(v[1]<-.99999)return 'Stato con fase −90°';
 return 'Stato del qubit';
}
// Oblique camera: none of the X/Y/Z rotation planes is seen exactly edge-on.
const azimuthCos=Math.sqrt(3)/2,azimuthSin=.5;
export const toView=(v:Vector):Vector=>[azimuthCos*v[0]+azimuthSin*v[1],-.28*azimuthSin*v[0]+.28*azimuthCos*v[1]+.96*v[2],.96*azimuthSin*v[0]-.96*azimuthCos*v[1]+.28*v[2]];
export const fromView=(v:Vector):Vector=>[azimuthCos*v[0]-.28*azimuthSin*v[1]+.96*azimuthSin*v[2],azimuthSin*v[0]+.28*azimuthCos*v[1]-.96*azimuthCos*v[2],.96*v[1]+.28*v[2]];
export function rotateView(v:Vector,angle:number):Vector {
 const c=Math.cos(rad(angle)),s=Math.sin(rad(angle));
 return [c*v[0]-s*v[1],s*v[0]+c*v[1],v[2]];
}
// Direct point manipulation. Keep the depth branch of the grabbed point;
// camera controls expose the other hemisphere without changing the state.
export function dragBlochPoint(v:Vector,dx:number,dy:number,viewAngle=0):Vector {
 const u=toView(rotateView(v,viewAngle));
 let x=u[0]+dx,y=u[1]+dy;const length=Math.hypot(x,y);
 if(length>1){x/=length;y/=length;}
 const depth=(u[2]<0?-1:1)*Math.sqrt(Math.max(0,1-x*x-y*y));
 return rotateView(fromView([x,y,depth]),-viewAngle);
}
export function trackball(x:number,y:number):Vector{
 const r=Math.hypot(x,y);return r>1?[x/r,y/r,0]:[x,y,Math.sqrt(Math.max(0,1-r*r))];
}
export function dragBloch(v:Vector,from:Vector,to:Vector):Vector{
 const cross:Vector=[from[1]*to[2]-from[2]*to[1],from[2]*to[0]-from[0]*to[2],from[0]*to[1]-from[1]*to[0]];
 const cosine=clamp(from.reduce((s,x,i)=>s+x*to[i],0),-1,1),sine=Math.hypot(...cross);
 if(sine<1e-10&&cosine>0)return [...v];
 let n:Vector;
 if(sine<1e-10){const p:Vector=Math.abs(from[0])<.9?[1,0,0]:[0,1,0];const dot=from.reduce((s,x,i)=>s+x*p[i],0);const a=p.map((x,i)=>x-dot*from[i]) as Vector;const length=Math.hypot(...a);n=a.map(x=>x/length) as Vector;}
 else n=cross.map(x=>x/sine) as Vector;
 const u=toView(v),dot=n.reduce((s,x,i)=>s+x*u[i],0),nxu:Vector=[n[1]*u[2]-n[2]*u[1],n[2]*u[0]-n[0]*u[2],n[0]*u[1]-n[1]*u[0]];
 const result=fromView(u.map((x,i)=>cosine*x+sine*nxu[i]+(1-cosine)*dot*n[i]) as Vector),norm=Math.hypot(...result);
 return result.map(x=>x/norm) as Vector;
}
