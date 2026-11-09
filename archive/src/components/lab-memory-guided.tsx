"use client";
import {useState} from 'react';
import {Button} from '@/components/ui/button';
import {Choice,Results,TrialButtons,Bloch,C,num,useTrials} from './lab-common';
import {Notebook,Preset,Explain,Reading,SlideLink,ProbabilityMeter} from './lab-notebook';
import {SourcePreparation,BlochPoint} from './bloch-point';
import {AngleControl} from './circuit-controls';
import {options,descriptions,gateSymbol} from './circuit-operations';
import {initialStates,archiveAlternatives,archivedRange,probabilityH} from '@/lib/quantum-experiments';
import {blochCoordinates,qubitName,toView} from '@/lib/bloch-interaction';
import {operation,type Vector} from '@/lib/physics';
type Archive={kind:'full';vector:Vector}|{kind:'probabilities';pH:number};
const serialize=(a:Archive)=>JSON.stringify({schema:'quantum-lab-qubit-v1',...a},null,2);

function CompatibleStates({z,phase}:{z:number;phase:number}) {
 const v=archiveAlternatives(z,phase),project=(p:Vector)=>{const u=toView(p);return [200+120*u[0],165-120*u[1]];};
 return <div className="archive-family"><svg viewBox="0 0 400 325" role="img" aria-label="Gli stati compatibili con le probabilità salvate formano un parallelo sulla sfera"><defs><radialGradient id="sphere-light"><stop stopColor="var(--mq-panel)"/><stop offset="1" stopColor="var(--mq-surface)"/></radialGradient><marker id="arrow-red" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="4" markerHeight="4" orient="auto"><path d="M0 0L10 5L0 10Z" fill={C.red}/></marker></defs><Bloch v={v} cx={200} cy={165} r={120}/><path d={Array.from({length:121},(_,i)=>(i?'L':'M')+project(archiveAlternatives(z,i*3)).join(' ')).join(' ')} stroke={C.green} strokeWidth="3" strokeDasharray="5 3" fill="none"/><circle cx={project(v)[0]} cy={project(v)[1]} r="6" fill={C.red} stroke="var(--mq-on-accent)" strokeWidth="2"/></svg><p>Il parallelo corallo raccoglie tutte le preparazioni pure compatibili con le probabilità salvate. Il punto blu è la ricostruzione che stai esaminando. Ai poli il parallelo si riduce a un punto, poiché uno dei due esiti è certo.</p></div>;
}
export function LabMemoryGuided(){
 const [source,setSource]=useState<Vector>([...initialStates.D]),[kind,setKind]=useState('probabilities');
 const [archive,setArchive]=useState<Archive|null>(null),[reference,setReference]=useState<Vector|null>(null);
 const [closed,setClosed]=useState(false),[loaded,setLoaded]=useState(false),[candidate,setCandidate]=useState(0);
 const [gate,setGate]=useState('H'),[phase,setPhase]=useState(0),[notice,setNotice]=useState('');
 const z=archive?(archive.kind==='full'?archive.vector[2]:2*archive.pH-1):0;
 const restored=archive?.kind==='full'?archive.vector:archiveAlternatives(z,candidate);
 const after=operation(restored,gate,phase),p=probabilityH(after);
 const bounds=archive?.kind==='probabilities'?archivedRange(z,gate,phase):[p,p];
 const signature='Archivio '+JSON.stringify(archive)+' · fase ricostruita '+candidate+'° · operazione '+gateSymbol(gate)+(gate==='P'?' '+phase+'°':'')+' · misura 0/1';
 const trials=useTrials([p,1-p],signature+' · ricaricato '+loaded);
 function prepare(v:Vector){setSource([...v]);setClosed(false);setLoaded(false);setNotice(archive?'Nuova preparazione di lavoro. L’archivio conserva ancora i dati del salvataggio precedente.':'');}
 function save(){setArchive(kind==='full'?{kind:'full',vector:[...source]}:{kind:'probabilities',pH:probabilityH(source)});setReference([...source]);setClosed(false);setLoaded(false);setCandidate(0);setNotice('Dati registrati. Chiudi lo stato di lavoro, poi ricarica l’archivio.');}
 function preset(k:string,v=initialStates.D){setSource([...v]);setKind(k);setArchive(null);setReference(null);setClosed(false);setLoaded(false);setGate('H');setPhase(0);setCandidate(0);setNotice('');}
 function download(){if(!archive)return;const url=URL.createObjectURL(new Blob([serialize(archive)],{type:'application/json'})),a=document.createElement('a');a.href=url;a.download='archivio-qubit.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);}
 async function importFile(file:File|undefined){if(!file)return;try{
  const a=JSON.parse(await file.text());let value:Archive;
  if(a.schema!=='quantum-lab-qubit-v1')throw Error();
  if(a.kind==='full'&&Array.isArray(a.vector)&&a.vector.length===3&&a.vector.every((x:unknown)=>typeof x==='number'&&Number.isFinite(x))&&Math.abs(Math.hypot(...a.vector)-1)<1e-6)value={kind:'full',vector:a.vector};
  else if(a.kind==='probabilities'&&typeof a.pH==='number'&&Number.isFinite(a.pH)&&a.pH>=0&&a.pH<=1)value={kind:'probabilities',pH:a.pH};else throw Error();
  setArchive(value);setReference(null);setLoaded(false);setClosed(true);setCandidate(0);setNotice('File importato. Ricarica l’archivio per continuare il calcolo; il riferimento originario non è disponibile.');
 }catch{setNotice('Il file non contiene un archivio valido di questo laboratorio.');}}
 return <Notebook
 intro={<>Per continuare il calcolo dopo un’interruzione occorre registrare informazioni sufficienti sulle operazioni ancora da eseguire. Confronteremo un archivio che conserva il punto sulla sfera con uno che conserva soltanto le probabilità 0/1. La geometria mostrerà quali preparazioni diventano indistinguibili nel secondo archivio.</>}
 experiments={<><Preset onClick={()=>preset('probabilities')}>Diagonale · sole probabilità</Preset><Preset onClick={()=>preset('full')}>Diagonale · stato completo</Preset><Preset onClick={()=>preset('probabilities',initialStates.H)}>Il caso 0 certo</Preset><Preset onClick={()=>preset('probabilities',[Math.sqrt(.75),0,.5])}>Probabilità 75% / 25%</Preset><SlideLink page={222}>Archivi nelle slide</SlideLink></>}
 controls={<><Choice label="Contenuto del prossimo archivio" value={kind} onChange={setKind} options={[["probabilities","Sole probabilità 0/1"],["full","Stato completo sulla sfera"]]}/><Explain>Il primo archivio conserva la probabilità di 0; quella di 1 si ottiene per differenza dal totale. Il secondo conserva le tre coordinate del punto, che includono anche la fase. Sono dati già noti al programma che ha preparato la simulazione.</Explain>
 <div className="notebook-actions vertical"><Button onClick={save} disabled={closed}>1. Registra lo stato di lavoro</Button><Button variant="outline" disabled={!archive||closed} onClick={()=>{setClosed(true);setLoaded(false);setNotice('Stato di lavoro chiuso. La continuazione userà soltanto i dati dell’archivio.');}}>2. Chiudi lo stato di lavoro</Button><Button variant="outline" disabled={!archive||!closed} onClick={()=>{setLoaded(true);setNotice(archive?.kind==='full'?'Punto ricostruito dai dati salvati.':'Probabilità ricaricate: la fase resta da scegliere fra le alternative compatibili.');}}>3. Ricarica l’archivio</Button></div>
 <Explain>Il riferimento originale resta separato, per verificare le previsioni dopo la ricarica. La ricostruzione non vi accede. «Prepara un nuovo stato» riapre una sessione di lavoro lasciando disponibile l’archivio esistente.</Explain><Button variant="outline" onClick={()=>prepare(source)}>Prepara un nuovo stato</Button>
 <Choice label="Operazione dopo la ricarica" value={gate} onChange={setGate} options={options}/><Explain>{descriptions[gate].text}</Explain>
 {gate==='P'&&<AngleControl label="Fase aggiunta da F" value={phase} min={-360} onChange={setPhase}/>}
 {loaded&&archive?.kind==='probabilities'&&<><AngleControl label="Fase di una ricostruzione compatibile" value={candidate} min={-180} max={180} disabled={Math.abs(z)>1-1e-10} onChange={setCandidate}/><Explain>Il cursore sceglie una delle fasi ammesse dall’archivio. Le probabilità salvate rimangono identiche. Il risultato dell’operazione successiva può invece variare, come mostra il confronto con il riferimento.</Explain></>}
 </>}
 result={!loaded?<p>La sequenza di registrazione, chiusura e ricarica permette di verificare se i dati conservati bastano per prevedere l’operazione scelta.</p>:<><p>{archive?.kind==='full'?'Lo stato completo determina una distribuzione delle probabilità degli esiti per l’operazione scelta.':bounds[1]-bounds[0]<1e-8?'Tutte le preparazioni compatibili con l’archivio danno le stesse probabilità per questa misura.':'Le preparazioni ammesse dall’archivio danno probabilità differenti dopo l’operazione scelta.'} La probabilità finale di 0 {bounds[1]-bounds[0]<1e-8?<>vale <strong>{num(bounds[0]*100,1)}%</strong>.</>:<>può variare da <strong>{num(bounds[0]*100,1)}%</strong> a <strong>{num(bounds[1]*100,1)}%</strong>.</>}</p><p>La sufficienza dell’archivio dipende dal calcolo da continuare. Se una trasformazione rende osservabile la fase, conservarne soltanto le probabilità iniziali lascia aperte previsioni diverse.</p></>}
 model={<><p>Si salva uno stato puro noto al simulatore classico. L’archivio ridotto contiene la probabilità teorica esatta di 0, così da separare la perdita della fase dall’imprecisione statistica di una stima. Le ricostruzioni sono i punti della sfera con quella stessa probabilità; gli estremi delle previsioni sono calcolati sull’intero parallelo.</p><p>Il file ridotto non include fase o nome della preparazione. Il riferimento usato per il controllo resta esterno alla procedura di ricostruzione. Su un qubit fisico sconosciuto, una singola misura non rende disponibile l’intero stato. La registrazione qui esaminata riguarda dati già presenti nel programma.</p></>}
 >
 <Reading title={closed?'Continuazione dai dati registrati':'Lo stato che il programma sta usando'}><p>{closed?'Il riquadro dell’archivio mostra tutte le informazioni disponibili per ricostruire lo stato.':<>Il punto iniziale prepara <strong>{qubitName(source)}</strong>: 0 con probabilità {num(probabilityH(source)*100,1)}%, 1 con probabilità {num((1-probabilityH(source))*100,1)}%. Muovi il punto per scegliere anche probabilità intermedie.</>}</p>{notice&&<p className="experiment-status" role="status">{notice}</p>}</Reading>
 <ol className="archive-steps" aria-label="Stato della sessione"><li data-active={!archive}>1 · Registrazione</li><li data-active={!!archive&&!closed}>2 · Chiusura</li><li data-active={closed&&!loaded}>3 · Ricarica</li><li data-active={loaded}>Calcolo successivo</li></ol>
 {!closed&&<div className="archive-source"><SourcePreparation v={source} onChange={prepare}/></div>}
 <section className="archive-ledger"><h3>Il contenuto effettivo del file</h3><pre>{archive?serialize(archive):'Nessun archivio creato.'}</pre><div className="notebook-actions"><Button variant="outline" disabled={!archive} onClick={download}>Esporta l’archivio JSON</Button><label className="archive-import">Importa un archivio<input type="file" accept=".json,application/json" onChange={e=>{void importFile(e.target.files?.[0]);e.target.value='';}}/></label></div><p>La chiave <code>pH</code> indica la probabilità di H, cioè 0; <code>vector</code> contiene le coordinate del punto. Il contenuto visualizzato coincide con il file esportato. I risultati delle prove hanno un’esportazione separata.</p></section>
 {loaded&&archive&&<>
 {archive.kind==='probabilities'&&<><Reading title="Le preparazioni che l’archivio non distingue"><p>Una stessa probabilità 0/1 corrisponde a una stessa altezza sulla sfera. La fase stabilisce la posizione sul parallelo. Il cursore esamina una scelta possibile fra i dati mancanti.</p></Reading><CompatibleStates z={z} phase={candidate}/></>}
 <div className="qubit-transformation"><section><h3>Stato ricaricato</h3><BlochPoint v={restored}/><strong>{qubitName(restored)}</strong><span>{blochCoordinates(restored).hasPhase?'Fase '+num(blochCoordinates(restored).phase,1)+'°':'Fase non definita al polo'}</span></section><div className="qubit-transform-arrow">→</div><section><h3>Dopo {gateSymbol(gate)}</h3><BlochPoint v={after}/><strong>{qubitName(after)}</strong><span>0: {num(p*100,1)}% · 1: {num((1-p)*100,1)}%</span></section></div>
 <div className="prediction-pair"><ProbabilityMeter label="0 per la ricostruzione scelta" p={p}/>{reference&&<ProbabilityMeter label="0 dal riferimento originale" p={probabilityH(operation(reference,gate,phase))}/>}</div>{reference&&<p className="diagram-key">Il secondo valore usa il riferimento conservato per il controllo. L’archivio ridotto e la procedura che lo ricarica non contengono quel riferimento.</p>}
 <TrialButtons {...trials}/><Results probabilities={[p,1-p]} counts={trials.counts} labels={['0','1']} signature={signature}/>
 </>}
 </Notebook>;
}
