"use client";
import {Button} from '@/components/ui/button';
import {num} from './lab-common';
import {AngleControl} from './circuit-controls';
import {BlochPoint,SourcePreparation} from './bloch-point';
import {descriptions,gateSymbol,blockSettings,axisFor} from './circuit-operations';
import {blochCoordinates,fromBlochAngles,qubitName} from '@/lib/bloch-interaction';
import {probabilityH,qubitTrajectory,type CircuitBlock} from '@/lib/quantum-experiments';
import {type Vector} from '@/lib/physics';
export {AngleControl,gateSymbol};
function StateValues({v,onChange}:{v:Vector;onChange?:(v:Vector)=>void}){const a=blochCoordinates(v),p=probabilityH(v);return <><p className="circuit-state-name">{qubitName(v)}</p><span className="circuit-state-prob">0: {num(p*100)}% · 1: {num((1-p)*100)}%</span>{onChange?<AngleControl compact label="Fase" value={a.hasPhase?a.phase:0} min={-360} disabled={!a.hasPhase} onChange={phase=>onChange(fromBlochAngles(a.inclination,phase))}/>:<span className="circuit-state-phase">{a.hasPhase?'Fase relativa: '+num(a.phase)+'°':'Fase relativa non definita'}</span>}</>;}
export function CircuitOverview({blocks,states,last,selected,onSelect,onUpdate,onSource}:{blocks:CircuitBlock[];states:Vector[];last:boolean;selected:number;onSelect:(n:number)=>void;onUpdate:(i:number,b:Partial<CircuitBlock>)=>void;onSource:(v:Vector)=>void}){
 const p=probabilityH(states.at(-1)!);
 return <><header className="circuit-heading"><div><span className="circuit-eyebrow">DALLO STATO INIZIALE ALLA MISURA</span><h2>Il circuito completo</h2></div><p>Trascina il punto della prima sfera per cambiare la preparazione. Seleziona un blocco per scegliere l’operazione; le caselle modificano direttamente i suoi angoli.</p></header>
 <div className="circuit-scroll" tabIndex={0} aria-label="Circuito completo; scorrimento orizzontale sugli schermi piccoli"><ol className="circuit-track">
 <li className="circuit-cell"><div className="circuit-node source-node"><span className="circuit-step">Ingresso</span><strong>Preparazione</strong><span>Trascina il punto qui sotto</span><span>Un nuovo qubit per prova</span></div><BlochPoint v={states[0]} onChange={onSource} compact label="Preparazione iniziale: sfera modificabile"/><StateValues v={states[0]} onChange={onSource}/></li>
 {blocks.map((b,i)=>{const skipped=i===2&&!last;return <li key={i} className={'circuit-cell'+(selected===i+1?' selected':'')+(skipped?' bypassed':'')}><div className="circuit-node"><Button variant="ghost" className="circuit-block-button" onClick={()=>onSelect(i+1)} aria-pressed={selected===i+1}><span className="circuit-step">Blocco {i+1}{skipped?' · escluso':''}</span><strong><b>{gateSymbol(b.gate)}</b>{descriptions[b.gate].short}</strong><span className="circuit-edit-label">Scegli / esamina</span></Button><div className="circuit-inline-settings">
 {b.gate==='P'&&<AngleControl compact label="Angolo" min={-360} value={b.phase} disabled={skipped} onChange={phase=>onUpdate(i,{phase})}/>}
 </div><span className="circuit-applied" aria-live="polite">{skipped?'Escluso: nessuna trasformazione':'Applicato: '+blockSettings(b)}</span></div><BlochPoint v={states[i+1]} axis={skipped?undefined:axisFor(b)} path={skipped?undefined:qubitTrajectory(states[i],b)} compact label={'Stato dopo il blocco '+(i+1)}/><StateValues v={states[i+1]}/></li>;})}
 <li className="circuit-cell"><div className="circuit-node measure-node"><span className="circuit-step">Misura finale</span><strong>Leggi 0 oppure 1</strong><span>Un solo esito per prova</span></div><div className="circuit-readout" aria-live="polite"><span>Previsione aggiornata</span><strong>0: {num(p*100,2)}%</strong><div><i style={{width:p*100+'%'}}/></div><strong>1: {num((1-p)*100,2)}%</strong><p>I conteggi si raccolgono con i pulsanti delle prove.</p></div></li>
 </ol></div><p className="circuit-caption">Ogni blocco trasforma lo stato ricevuto da quello precedente. Le sfere mostrano gli stati intermedi calcolati: l’unica misura eseguita è quella finale. La retta corallo indica l’asse della trasformazione; la curva con freccia ne mostra il percorso, dal cerchio vuoto al punto blu. Le fasi dello stato sono riportate fra −180° e +180°; l’angolo scelto in F è invece la variazione da applicare. Un segno negativo indica il verso opposto.</p>
 <details className="source-editor"><summary>Ingrandisci la sfera e regola lo stato iniziale</summary><SourcePreparation v={states[0]} onChange={onSource}/></details></>;
}
