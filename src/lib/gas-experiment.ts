import {ReversibleGas, GAS_DT, type GasRecord, type Inversion} from './reversible-gas.ts';
import type {Particle} from './physics.ts';
export type GasPhase='prepared'|'expansion'|'ready'|'return'|'complete';
export type GasObservation={time:number;left:number;comparison:number|null;error:number;comparisonError:number|null;energyChange:number};
export class GasExperiment{
 gas:ReversibleGas; comparison:ReversibleGas|null=null;
 readonly initial:Particle[]; readonly energy:number; readonly targetSteps:number;
 phase:GasPhase='prepared'; running=false; turn:GasRecord|null=null;
 history:GasObservation[]=[]; private forwardHistory:GasObservation[]=[];
 private credit=0; private lastSample=0; returnSteps=0;
 inversion:Inversion|null=null; angularRms=0; affected=0;
 constructor(n=5000,seed=31415,interactions=true,physicalTime=12){
  this.gas=new ReversibleGas(n,seed,interactions);this.initial=this.gas.sync().map(p=>({...p}));
  this.energy=this.gas.statistics().energy;this.targetSteps=Math.round(physicalTime/GAS_DT);this.sample();
 }
 private sample(){
  const a=this.gas.statistics(),b=this.comparison?.statistics();
  this.history.push({time:this.gas.steps*GAS_DT,left:a.left/this.gas.n,comparison:b?b.left/this.gas.n:null,error:this.gas.compare(this.initial).rms,comparisonError:this.comparison?.compare(this.initial).rms??null,energyChange:a.energy/this.energy-1});
  this.lastSample=this.gas.steps;
 }
 start(){if(this.phase==='prepared')this.phase='expansion';if(this.phase==='expansion'||this.phase==='return')this.running=!this.running;}
 pause(){this.running=false;}
 prepareReturn(){
  if(this.phase!=='expansion'||this.gas.steps===0)return;
  this.running=false;this.phase='ready';this.turn=this.gas.record();this.gas.sync();
  if(this.lastSample!==this.gas.steps)this.sample();this.forwardHistory=this.history.map(x=>({...x}));this.credit=0;
 }
 compare(options:Inversion){
  if(!this.turn)return;
  this.gas=ReversibleGas.from(this.turn);this.comparison=ReversibleGas.from(this.turn);
  this.gas.invert();const error=this.comparison.invert(options);
  this.inversion={...options};this.angularRms=error.angularRms;this.affected=error.affected;
  this.history=this.forwardHistory.map(x=>({...x}));this.returnSteps=0;this.phase='return';this.running=true;this.credit=0;this.sample();
 }
 resetComparison(){
  if(!this.turn)return;
  this.gas=ReversibleGas.from(this.turn);this.comparison=null;this.history=this.forwardHistory.map(x=>({...x}));
  this.phase='ready';this.running=false;this.returnSteps=0;this.credit=0;this.inversion=null;
 }
 // Animation speed changes scheduling, never the integration timestep.
 advance(elapsedSeconds:number,phaseSeconds=45,budgetMs=12){
  if(!this.running)return 0;
  const returning=this.phase==='return',limit=returning?this.turn!.steps:this.targetSteps;
  this.credit+=elapsedSeconds*limit/phaseSeconds;
  const deadline=performance.now()+budgetMs;let count=0;
  while(this.credit>=1&&performance.now()<deadline){
   this.gas.step();this.comparison?.step();if(returning)this.returnSteps++;
   this.credit--;count++;
   const progress=returning?this.returnSteps:this.gas.steps;
   if(this.gas.steps-this.lastSample>=64||progress>=limit)this.sample();
   if(progress>=limit){
    this.gas.sync();this.comparison?.sync();this.running=false;
    if(returning)this.phase='complete';else this.prepareReturn();break;
   }
  }
  this.gas.sync();this.comparison?.sync();return count;
 }
 get progress(){return this.phase==='return'||this.phase==='complete'?this.returnSteps/(this.turn?.steps||1):this.gas.steps/this.targetSteps;}
}
