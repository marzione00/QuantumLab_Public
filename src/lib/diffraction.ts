/** Scalar paraxial Fresnel propagation of uniformly illuminated rectangular slits.
 * SI units internally; screen coordinates are returned in mm. The common
 * propagation phase cancels from all intensities. No loss of coherence is
 * introduced when the aperture changes. */
const STEP=1/1024, LIMIT=16, SIZE=LIMIT/STEP;
let table:{c:Float64Array;s:Float64Array}|undefined;
function lookup(){
 if(table)return table;
 const c=new Float64Array(SIZE+1),s=new Float64Array(SIZE+1);
 for(let j=1;j<=SIZE;j++){
  const a=(j-1)*STEP,b=j*STEP,m=(a+b)/2;
  c[j]=c[j-1]+STEP/6*(Math.cos(Math.PI*a*a/2)+4*Math.cos(Math.PI*m*m/2)+Math.cos(Math.PI*b*b/2));
  s[j]=s[j-1]+STEP/6*(Math.sin(Math.PI*a*a/2)+4*Math.sin(Math.PI*m*m/2)+Math.sin(Math.PI*b*b/2));
 }return table={c,s};
}
export function fresnel(x:number):[number,number]{
 const sign=x<0?-1:1,u=Math.abs(x),t=Math.PI*u*u/2;
 if(u>=LIMIT){
  const q=1/(Math.PI*Math.PI*u**4);
  const f=(1-3*q+105*q*q-10395*q**3)/(Math.PI*u);
  const g=(1-15*q+945*q*q-135135*q**3)/(Math.PI*Math.PI*u**3);
  return [sign*(.5+f*Math.sin(t)-g*Math.cos(t)),sign*(.5-f*Math.cos(t)-g*Math.sin(t))];
 }
 const T=lookup(),j=Math.floor(u/STEP),r=u/STEP-j,a=j*STEP,b=a+STEP;
 const h00=2*r**3-3*r*r+1,h10=r**3-2*r*r+r,h01=-2*r**3+3*r*r,h11=r**3-r*r;
 return [sign*(h00*T.c[j]+h10*STEP*Math.cos(Math.PI*a*a/2)+h01*T.c[j+1]+h11*STEP*Math.cos(Math.PI*b*b/2)),sign*(h00*T.s[j]+h10*STEP*Math.sin(Math.PI*a*a/2)+h01*T.s[j+1]+h11*STEP*Math.sin(Math.PI*b*b/2))];
}
export function slitAmplitude(y:number,center:number,width:number,wavelength:number,distance:number):[number,number]{
 const scale=Math.sqrt(2/(wavelength*distance));
 const lo=fresnel((center-width/2-y)*scale),hi=fresnel((center+width/2-y)*scale);
 return [(hi[0]-lo[0])/Math.SQRT2,(hi[1]-lo[1])/Math.SQRT2];
}
export type DiffractionOptions={slits:number;coherent:boolean;spacing:number;phase:number;aperture:number;wavelength:number;distance:number;visibility:number;span:number;resolution?:number;samplesPerFringe?:number};
export function fresnelScreen(o:DiffractionOptions){
 const width=o.aperture*1e-6,lambda=o.wavelength*1e-9,d=o.spacing*1e-6,phase=-o.phase*Math.PI/180;
 const resolution=o.resolution??0,extent=o.slits===2?d+width:width;
 if(width<=0||lambda<=0||o.distance<=0||o.span<=0||resolution<0||!Number.isFinite(resolution)||o.slits===2&&d<width)throw Error('Geometria delle aperture non valida');
 // Fresnel intensity has spatial bandwidth bounded by aperture extent/(λL).
 // Use at least 16 samples per shortest period when integrating a detector
 // response; its exact support is integrated, even when narrower than a cell.
 const fringeScale=lambda*o.distance/extent*1000;
 const samplesPerBin=Math.max(8,Math.ceil(Math.max(o.samplesPerFringe||8,resolution?16:8)*2*o.span/fringeScale/800));
 const n=800*samplesPerBin,sampleStep=2*o.span/n;
 const padding=resolution?Math.ceil(resolution/(2*sampleStep))+2:0;
 const field:number[]=[],ys:number[]=[],geometry:number[]=[];
 for(let j=-padding;j<n+padding;j++){
  const y=(-o.span+sampleStep*(j+.5))/1000;
  const a=slitAmplitude(y,o.slits===1?0:-d/2,width,lambda,o.distance);
  let value=a[0]**2+a[1]**2;
  if(o.slits===2){const b=slitAmplitude(y,d/2,width,lambda,o.distance),br=b[0]*Math.cos(phase)-b[1]*Math.sin(phase),bi=b[0]*Math.sin(phase)+b[1]*Math.cos(phase);value+=br*br+bi*bi+2*(o.coherent?o.visibility:0)*(a[0]*br+a[1]*bi);}
  field.push(Math.max(0,value));
 }
 // Integrate the piecewise cubic interpolant of the extended field. Prefix
 // integrals cover whole cells; the two end cells retain fractional weights.
 // No kernel truncation or local renormalization is made at the visible edge.
 const primitive=(j:number,t:number)=>{
  const a=field[j],b=(field[j+1]-field[j-1])/2;
  const c=field[j-1]-2.5*a+2*field[j+1]-.5*field[j+2];
  const d=(-field[j-1]+3*a-3*field[j+1]+field[j+2])/2;
  return t*(a+t*(b/2+t*(c/3+t*d/4)));
 };
 const prefix=new Float64Array(field.length);
 if(resolution)for(let j=1;j<field.length-2;j++)prefix[j+1]=prefix[j]+primitive(j,1);
 const integral=(x:number)=>{const j=Math.floor(x);return prefix[j]+primitive(j,x-j);};
 const centers=o.slits===1?[0]:[-d*500,d*500],widthMM=width*1000;
 const detected:number[]=[];
 for(let j=0;j<n;j++){
  const ymm=-o.span+sampleStep*(j+.5),ix=j+padding,half=resolution/(2*sampleStep);
  ys.push(ymm);
  detected.push(resolution?Math.max(0,(integral(ix+half)-integral(ix-half))/(2*half)):field[ix]);
  // The geometric top hats have an exact overlap with the same detector.
  geometry.push(centers.reduce((sum,center)=>sum+(resolution?Math.max(0,Math.min(ymm+resolution/2,center+widthMM/2)-Math.max(ymm-resolution/2,center-widthMM/2))/resolution:Math.abs(ymm-center)<widthMM/2?1:0),0));
 }
 const total=detected.reduce((a,b)=>a+b,0),probabilities=detected.map(v=>v/total);let sum=0;const cdf=probabilities.map(v=>sum+=v);cdf[n-1]=1;
 const capturedFraction=field.slice(padding,padding+n).reduce((a,b)=>a+b,0)*sampleStep/1000/(width*o.slits);
 return {ys,probabilities,cdf,samplesPerBin,fringeScale,sampleStep,requestedResolution:resolution,effectiveResolution:resolution,detectorIntegration:resolution?'cubic-exact-support':'point-samples',intensity:detected,geometry,fresnelNumber:width*width/(lambda*o.distance),totalFresnelNumber:extent*extent/(lambda*o.distance),firstMinimum:lambda*o.distance/width*1000,capturedFraction,detectedCapturedFraction:total*sampleStep/1000/(width*o.slits)};
}
