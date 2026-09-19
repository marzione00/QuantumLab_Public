"use client";
import {useRef,useState} from 'react';
import {Button} from '@/components/ui/button';
import {Undo2,RotateCcw,Play,Pause} from 'lucide-react';
import {LabLayout,FigureCaption,Choice,Range,Segments,SmallStat,useFrame,C,num} from './lab-common';
import {ParticleCanvas,CurvePlot,ExportSeries} from './lab-tools';
import {GasExperiment} from '@/lib/gas-experiment';
import {GAS_DT,type Inversion} from '@/lib/reversible-gas';

export function LabGasLarge(){
 const [n,setN]=useState(5000),[seconds,setSeconds]=useState(45),[physicalTime,setPhysicalTime]=useState(12);
 const [interaction,setInteraction]=useState('interacting'),[kind,setKind]=useState<'recording'|'rotation'>('recording');
 const [degrees,setDegrees]=useState(5),[fraction,setFraction]=useState('1'),[view,setView]=useState('particles');
 const [,redraw]=useState(0),seed=useRef(31415),experiment=useRef<GasExperiment|null>(null);
 if(!experiment.current)experiment.current=new GasExperiment(n,seed.current,true,physicalTime);
 const ex=experiment.current,refresh=()=>redraw(x=>x+1);
 const reset=(count=n,interacting=interaction==='interacting',time=physicalTime)=>{
  experiment.current=new GasExperiment(count,seed.current,interacting,time);refresh();
 };
 const changeInversion=()=>{if(ex.phase==='return'||ex.phase==='complete'){ex.resetComparison();refresh();}};
 const options:Inversion={kind,degrees,fraction:fraction==='one'?1/n:+fraction};
 useFrame(ex.running,dt=>{ex.advance(dt,seconds);refresh();});
 const s=ex.gas.statistics(),other=ex.comparison?.statistics(),recovery=ex.gas.compare(ex.initial),bad=ex.comparison?.compare(ex.initial);
 const returning=ex.phase==='return'||ex.phase==='complete',atStart=ex.phase==='prepared';
 const title=atStart?'Preparazione iniziale':ex.phase==='expansion'?'Espansione del gas':ex.phase==='ready'?'Il gas è pronto per l’inversione':ex.phase==='return'?'Due evoluzioni dopo l’inversione':'Confronto al termine del ritorno';
 const recorded=ex.history.filter(r=>r.comparison!==null),turnTime=ex.turn?ex.turn.steps*GAS_DT:undefined;
 const startComparison=()=>{ex.compare(options);refresh();};
 const metric=(v:number)=>num(v*100,1)+'%';
 const resultText=ex.phase==='complete'?
  <>{recovery.rms===0?'L’inversione accurata ha ricostruito tutte le posizioni iniziali.':'Lo scarto del riferimento va verificato prima di interpretare il confronto.'} Nell’altra evoluzione, il {metric((other?.left||0)/n)} delle particelle si trova nella metà sinistra e il {metric(bad?.nearFraction||0)} dista al massimo 2 unità dalla propria posizione iniziale. {bad&&bad.rms<.001?'Con questa impostazione i due ritorni coincidono entro la risoluzione mostrata.':'La distribuzione spaziale e le posizioni delle singole particelle misurano aspetti diversi della ricostruzione.'}</>:
  ex.phase==='ready'?<>L’espansione è sospesa a t = {num(turnTime||0,2)}. Il {metric(s.left/n)} delle particelle occupa la metà sinistra. I due ritorni partiranno da queste stesse posizioni: cambierà soltanto la precisione con cui vengono invertite le velocità.</>:
  returning?<>Il riferimento conserva tutte le direzioni delle velocità; il confronto usa {ex.inversion?.kind==='recording'?'direzioni registrate con precisione limitata':'un’inversione perturbata'}. Il tempo trascorso dal cambio di verso è {num(ex.returnSteps*GAS_DT,2)} su {num(turnTime||0,2)} unità. Il ritorno si valuta al termine di questo intervallo.</>:
  <>All’inizio tutte le particelle si trovano nella metà sinistra. Durante l’espansione il loro numero in questa regione cambia. {interaction==='interacting'?'Gli incontri fra particelle modificano le velocità.':'Le particelle non interagiscono fra loro; il verso del moto cambia nei rimbalzi sulle pareti.'} La descrizione microscopica conserva posizioni e velocità di ciascuna particella.</>;
 return <LabLayout wide controls={<>
  <div className="control-group"><h3>Preparazione e tempi</h3>
   <Choice label="Numero di particelle" value={String(n)} options={[["1000","1.000"],["5000","5.000"],["10000","10.000"]]} onChange={v=>{setN(+v);reset(+v);}}/>
   <Range label="Durata minima di ciascuna fase" value={seconds} min={30} max={120} step={15} unit=" s" onChange={setSeconds}/>
   <Range label="Tempo simulato prima dell’inversione" value={physicalTime} min={4} max={12} step={2} unit=" u.t." onChange={v=>{setPhysicalTime(v);reset(n,interaction==='interacting',v);}}/>
   <Choice label="Interazione fra particelle" value={interaction} options={[["interacting","Repulsione a breve distanza"],["free","Nessuna: sole riflessioni alle pareti"]]} onChange={v=>{setInteraction(v);reset(n,v==='interacting');}}/>
  </div>
  <p className="control-tip">La repulsione agisce entro 3,8 u.l., con la stessa distanza per tutte le popolazioni. Aumentare il numero di particelle nello stesso recipiente aumenta la densità e può modificare la frequenza degli incontri.</p><div className="control-group"><h3>Precisione dell’inversione</h3>
   <Choice label="Origine dell’imprecisione" value={kind} options={[["recording","Registrazione incompleta delle direzioni"],["rotation","Errore nell’inversione delle velocità"]]} onChange={v=>{setKind(v as typeof kind);changeInversion();}}/>
   <Range label={kind==='recording'?'Passo della registrazione angolare':'Massima deviazione angolare'} value={degrees} min={0} max={10} step={.1} unit="°" onChange={v=>{setDegrees(v);changeInversion();}}/>
   <Choice label="Velocità interessate" value={fraction} options={[["one","Una sola particella"],["0.01","1% delle particelle"],["0.1","10% delle particelle"],["1","Tutte le particelle"]]} onChange={v=>{setFraction(v);changeInversion();}}/>
   <p className="control-tip">Con 0° i due ritorni coincidono. Un passo di registrazione di 1° conserva soltanto il grado più vicino alla direzione misurata. I moduli delle velocità rimangono invariati entro la precisione numerica.</p>
  </div>
  <div className="control-group"><h3>Lettura del confronto</h3>
   <Segments label="Rappresentazione del gas" value={view} options={[["particles","Particelle"],["density","Densità"],["velocities","Velocità"]]} onChange={setView}/>
   
   <p className="control-tip">L’espansione si arresta prima dell’inversione. Dopo il confronto, la stessa configurazione può essere riutilizzata con un errore diverso. I risultati restano visibili fino a una nuova azione.</p>
  </div>
 </>} observation={resultText} model={<>
  <p>Le particelle si respingono quando si avvicinano e rimbalzano sulle pareti senza perdere energia. Gli incontri hanno una durata finita: sono descritti da una forza di repulsione, non dall’urto istantaneo fra palline rigide. Il disegno ingrandisce i punti per renderli visibili. Il recipiente è largo 720 e alto 340 unità di lunghezza; queste unità sono indicate con u.l.</p>
  <p>Il calcolo conserva posizioni e velocità su una griglia numerica. Ogni passo può essere invertito sulla stessa griglia: questo permette al riferimento di recuperare le posizioni iniziali, con velocità di verso opposto. Il tempo simulato avanza con un passo fisso, indipendente dalla rapidità dell’animazione. La reversibilità del procedimento è distinta dalla sua approssimazione delle equazioni fisiche continue.</p>
  <p>Al momento dell’inversione viene conservata una sola configurazione. I due ritorni sono ricalcolati applicando le forze, senza riprodurre una registrazione delle traiettorie. Nell’inversione incompleta si arrotondano le direzioni prima di cambiarne il verso; nell’inversione perturbata si devia la direzione dopo il cambio di verso. L’imprecisione viene applicata una sola volta. Le formule e le scelte numeriche sono documentate nel file MODELLI incluso nel pacchetto locale.</p>
  <p>Il risultato riguarda questo sistema isolato nel modello, con tutte le forze e tutte le particelle sotto controllo. Un ritorno imperfetto mostra l’effetto dell’informazione perduta o del controllo incompleto entro questa dinamica reversibile. <a href="https://arxiv.org/abs/1704.07715" target="_blank" rel="noreferrer">Riferimento sul metodo numerico reversibile: Rein e Tamayo, JANUS (2017).</a></p>
 </>}>
  <div className="figure-heading"><span>LOSCHMIDT · REVERSIBILITÀ E INFORMAZIONE</span><span className="figure-tag">{n.toLocaleString('it-IT')} particelle</span></div>
  <div className="gas-timeline" aria-label="Svolgimento dell’esperimento">
   {['Preparazione','Espansione','Inversione','Ritorno'].map((label,i)=><span key={label} className={i===(atStart?0:ex.phase==='expansion'?1:ex.phase==='ready'?2:3)?'current':''}><b>{String(i+1).padStart(2,'0')}</b>{label}</span>)}
  </div>
  <div className="gas-reference"><ParticleCanvas particles={ex.initial} radius={ex.gas.radius} label="Configurazione iniziale"/>
   <div><h2>{title}</h2><p>{atStart?<>Le {n.toLocaleString('it-IT')} particelle occupano la metà sinistra del recipiente. L’espansione durerà almeno {seconds} secondi e si fermerà prima dell’inversione.</>:returning?<>Blu: inversione accurata. Ambra: {ex.inversion?.kind==='recording'?'direzioni registrate con precisione limitata':'velocità invertite con una perturbazione'}. Le due evoluzioni ripartono dalla stessa configurazione.</>:ex.phase==='ready'?<>La distribuzione raggiunta viene conservata. È ora possibile scegliere la precisione delle velocità e avviare il confronto.</>:<>Il gas si distribuisce nel recipiente. La configurazione iniziale resta visibile come riferimento per il ritorno.</>}</p>
    <div className="gas-progress" role="progressbar" aria-label={returning?'Avanzamento del ritorno':'Avanzamento dell’espansione'} aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(ex.progress*100)}><i style={{width:100*ex.progress+'%'}}/></div>
    <span className="gas-clock">{returning?'Ritorno':'Espansione'}: {num((returning?ex.returnSteps:ex.gas.steps)*GAS_DT,2)} / {num(returning?turnTime||0:physicalTime,2)} u.t. · {seconds} s per fase, salvo tempi di calcolo maggiori</span>
   </div>
  </div>
  <div className="experiment-actions gas-actions">
   {(atStart||ex.phase==='expansion'||ex.phase==='return')&&<Button onClick={()=>{ex.start();refresh();}}>{ex.running?<Pause/>:<Play/>}{ex.running?'Pausa':atStart?'Avvia l’espansione':'Riprendi'}</Button>}
   {ex.phase==='expansion'&&<Button variant="outline" disabled={ex.gas.steps<256} onClick={()=>{ex.prepareReturn();refresh();}}>Prepara l’inversione da questo istante</Button>}
   {(ex.phase==='ready'||ex.phase==='complete')&&<Button onClick={startComparison}><Undo2/>{ex.phase==='complete'?'Ripeti i ritorni dalla stessa configurazione':'Avvia i due ritorni'}</Button>}
   <Button variant="outline" onClick={()=>reset()}><RotateCcw/> Riparti dalla preparazione</Button>
   <Button variant="ghost" onClick={()=>{seed.current++;reset();}}>Un’altra preparazione</Button>
  </div>
  <div className={'gas-canvases loschmidt-canvases '+(ex.comparison?'dual':'')}>
   <div><ParticleCanvas particles={ex.gas.particles} radius={ex.gas.radius} label={returning?'Inversione accurata':'Espansione dalla preparazione iniziale'} heat={view==='density'} arrows={view==='velocities'}/>
    <div className="return-metrics"><SmallStat label="Nella regione iniziale" value={metric(s.left/n)}/>{returning&&<SmallStat label="Vicine alla propria posizione iniziale" value={metric(recovery.nearFraction)} detail="Distanza massima: 2 unità di lunghezza"/>}</div></div>
   {ex.comparison&&<div><ParticleCanvas particles={ex.comparison.particles} radius={ex.gas.radius} label={ex.inversion?.kind==='recording'?'Inversione da dati arrotondati':'Inversione perturbata'} color={C.green} heat={view==='density'} arrows={view==='velocities'}/>
    <div className="return-metrics comparison"><SmallStat label="Nella regione iniziale" value={metric((other?.left||0)/n)}/><SmallStat label="Vicine alla propria posizione iniziale" value={metric(bad?.nearFraction||0)} detail="Distanza massima: 2 unità di lunghezza"/></div></div>}
  </div>
  <FigureCaption title="Due criteri per valutare il ritorno"><p>La prima percentuale conta quante particelle occupano la metà sinistra, dove il gas era stato preparato. La seconda confronta ogni particella con la propria posizione iniziale e conta quelle che distano al massimo 2 unità di lunghezza dal punto di partenza. Per confronto, la larghezza del recipiente è 720 unità. I due criteri distinguono il ritorno nella regione iniziale dal recupero delle posizioni individuali.</p><p>Il confronto conclusivo va letto quando il tempo di ritorno uguaglia quello di espansione. Durante il tragitto le particelle stanno ancora ripercorrendo il moto: una distanza dalla posizione iniziale non è, da sola, un errore. Il recipiente con particelle verdi fornisce il riferimento; quello con particelle corallo mostra il risultato dell’imprecisione scelta.</p><p>Il tratteggio verticale divide il recipiente per il conteggio e non è una parete. Invertire una velocità significa mantenere quanto rapidamente la particella si muove e cambiarne il verso. Le posizioni nel momento dell’inversione restano identiche nei due ritorni.</p></FigureCaption>
  {ex.inversion&&<div className="gas-comparison-note"><strong>{ex.affected.toLocaleString('it-IT')} velocità interessate.</strong> {ex.inversion.kind==='recording'?'Passo di registrazione':'Deviazione massima'}: {num(ex.inversion.degrees,1)}°. L’imprecisione è applicata soltanto all’inizio del ritorno.</div>}
  <CurvePlot title="Quanta parte del gas ritorna nella regione iniziale?" xLabel="Tempo simulato (unità del modello)" yLabel="Particelle nella metà sinistra" xMax={2*(turnTime||physicalTime)} selected={turnTime} selectedLabel="Inversione delle velocità" curves={[{name:'Evoluzione e inversione accurata',color:C.blue,values:ex.history.map(r=>r.left),xValues:ex.history.map(r=>r.time)},...(recorded.length?[{name:'Inversione imperfetta',color:C.green,values:recorded.map(r=>r.comparison!),xValues:recorded.map(r=>r.time)}]:[])]}>
   <p>Il valore iniziale è 100%: tutte le particelle sono nella metà sinistra. Una distribuzione uniforme dà circa 50%. Al termine dell’inversione accurata, il ritorno al 100% segnala il recupero della ripartizione iniziale. Il confronto delle singole posizioni, riportato sotto i recipienti, verifica anche la ricostruzione microscopica.</p>
  </CurvePlot>
  <section className="analysis-block gas-measurement-notes"><h3>Precisione e qualità del ritorno</h3><p>La sola distribuzione spaziale non determina come debbano essere invertite le velocità. Due stati con gli stessi conteggi possono evolvere in modi diversi. Qui la perdita d’informazione è circoscritta alle direzioni registrate: le posizioni al momento dell’inversione e i moduli delle velocità sono conservati.</p><p>Negli incontri fra particelle, una differenza inizialmente piccola può modificare anche gli incontri successivi. La ricostruzione va quindi confrontata a parità di tempo di espansione. Disattivando l’interazione si può verificare quanto dell’amplificazione dipenda dagli incontri, mantenendo invariate le riflessioni alle pareti.</p>
   <h3>Un dato arrotondato non conserva tutte le direzioni</h3><p>Supponiamo che una velocità abbia direzione 12° rispetto a un asse di riferimento. Registrando soltanto multipli di 5°, l’archivio conserva 10°. Molte direzioni vicine possono produrre lo stesso valore arrotondato. Cambiare il verso della direzione registrata non recupera quale di quelle direzioni fosse presente prima del salvataggio. Questa è la perdita d’informazione rappresentata nel primo tipo di confronto.</p><p>L’errore d’inversione descrive invece un intervento imperfetto: la direzione completa è disponibile, ma la velocità viene invertita con una piccola deviazione. Le due procedure hanno un’origine diversa e possono entrambe compromettere il ritorno. L’effetto dipende dall’errore, dal numero di particelle interessate, dalla durata e dagli incontri successivi; un errore molto piccolo può produrre differenze ancora poco visibili.</p><p>Il comando «Ripeti i ritorni dalla stessa configurazione» consente di confrontare errori diversi mantenendo fissa l’espansione precedente. Il valore 0° fornisce il controllo: entrambi i calcoli usano allora l’inversione accurata.</p>
   <details className="numerical-detail"><summary>Approfondimento: scarti numerici ed energia</summary><p>Lo scarto quadratico medio riassume le distanze delle particelle dalle proprie posizioni iniziali. Si elevano le distanze al quadrato, se ne calcola la media e si prende la radice quadrata. Le distanze grandi pesano maggiormente. Il valore 0 indica che tutte le posizioni coincidono; con tutte le distanze uguali a 3 unità, anche questo scarto vale 3 unità.</p><p>Scarto attuale: riferimento <strong>{num(recovery.rms,2)} u.l.</strong>{bad&&<>, confronto <strong>{num(bad.rms,2)} u.l.</strong></>}. Va interpretato come errore di ritorno soltanto al termine della ricostruzione. {ex.inversion&&<>Lo scarto delle direzioni, riassunto con lo stesso procedimento, vale {num(ex.angularRms,3)}° subito dopo l’inversione.</>}</p><p>Nel modello fisico isolato l’energia totale resta costante. I valori sotto mostrano quanto il calcolo numerico si discosta dall’energia iniziale. Un ritorno reversibile e una buona conservazione dell’energia controllano due proprietà diverse del procedimento.</p><div className="stats-strip"><SmallStat label="Variazione dell’energia totale · riferimento" value={num(100*(s.energy/ex.energy-1),4)+'%'}/>{other&&<SmallStat label="Variazione dell’energia totale · confronto" value={num(100*(other.energy/ex.energy-1),4)+'%'}/>}</div></details>
   <ExportSeries filename="gas-loschmidt.csv" rows={[["N","interazione","tipo_errore","ampiezza_gradi","frazione_interessata","tempo","frazione_sinistra_riferimento","frazione_sinistra_confronto","scarto_posizioni_riferimento","scarto_posizioni_confronto","variazione_relativa_energia"],...ex.history.map(r=>[n,interaction,ex.inversion?.kind||'',ex.inversion?.degrees||0,ex.inversion?.fraction||0,r.time,r.left,r.comparison??'',r.error,r.comparisonError??'',r.energyChange])]}/>
   <p className="analysis-note">Nella vista «Densità», una regione più luminosa contiene più particelle. La scala è identica nei due recipienti e raggiunge il colore più intenso al doppio del conteggio che avrebbe una distribuzione uniforme. Nella vista «Velocità» i segmenti partono dai punti e indicano il verso del moto; per leggibilità sono mostrati soltanto per alcune particelle. Tutte partecipano comunque al calcolo.</p>
  </section>
 </LabLayout>;
}
