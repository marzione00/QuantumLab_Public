"use client";
import {useContext} from 'react';
import {LabReadingContext} from './lab-reading';

const common:Record<string,string>={
 'Prove al secondo':'Regola soltanto la rapidità della raccolta sullo schermo. Le probabilità di ciascuna prova restano le stesse.',
 'Arrivi al secondo':'Determina quanti eventi vengono aggiunti ogni secondo di animazione. A parità di configurazione, la distribuzione prevista non cambia.',
 'Analizzatore 1':'L’analizzatore separa due polarizzazioni perpendicolari. A 0° legge orizzontale e verticale; a 45° legge le due diagonali. A indica l’uscita lungo l’orientazione scelta, B quella perpendicolare.',
 'Analizzatore 2':'Questa orientazione riguarda la misura sul secondo pacchetto della coppia. Può essere diversa da quella del primo analizzatore.',
 'Fase relativa':'Indica di quanto un contributo è avanti nel ciclo rispetto all’altro. Un giro di 360° è un ciclo completo; 90° è un quarto di ciclo e 180° è mezzo ciclo.',
 'Numero di particelle':'Ogni punto è una particella simulata. Cambiare il numero prepara un nuovo esperimento; il moto precedente viene azzerato.',
};
const specific:Record<string,Record<string,string>>={
 moto:{
  'Posizione iniziale':'È il punto da cui partono sia A sia B. Il valore 0 è l’origine scelta per misurare le distanze, non un bordo del tavolo.',
  'Velocità A':'Indica lo spostamento di A in un secondo. Un valore positivo porta verso destra; un valore negativo verso sinistra; con 0 la particella resta ferma.',
  'Velocità B':'B parte dallo stesso punto di A, ma può avere una velocità diversa. I due moti vengono calcolati separatamente.',
  'Incertezza sulla velocità A':'Specifica quanto la velocità può differire dal valore centrale, in entrambi i versi. Per 3 m/s con incertezza 0,5 m/s consideriamo tutte le velocità da 2,5 a 3,5 m/s.',
  'Particelle indipendenti':'Sono ripetizioni della preparazione di A. Ogni particella riceve una propria posizione e una propria velocità iniziali negli intervalli scelti.',
  'Incertezza iniziale sulla posizione':'Agisce soltanto sulla raccolta rappresentata nell’istogramma. Con valore 1 m, le posizioni iniziali si estendono da un metro prima a un metro dopo il punto centrale.',
 },
 loschmidt:{
  'Durata minima di ciascuna fase':'È il tempo di visione, misurato con un orologio reale. Espansione e ritorno hanno la stessa durata impostata; il calcolo può richiedere più tempo su un dispositivo lento.',
  'Tempo simulato prima dell’inversione':'Stabilisce quanto evolve fisicamente il gas prima del cambio di verso. Le unità di tempo, indicate con u.t., appartengono al modello e non sono secondi reali.',
  'Interazione fra particelle':'Nella prima opzione, particelle vicine si respingono e modificano le rispettive velocità. Nella seconda si attraversano senza influenzarsi; rimangono i rimbalzi sulle pareti.',
  'Origine dell’imprecisione':'La registrazione incompleta conserva una direzione arrotondata. L’errore d’inversione parte invece dalla direzione nota e la altera nel momento in cui si cambia il verso del moto.',
  'Passo della registrazione angolare':'Con un passo di 5°, il programma conserva soltanto direzioni multiple di 5°: per esempio 12° diventa 10°. L’inversione usa questo dato arrotondato. Il valore 0 mantiene la direzione completa.',
  'Massima deviazione angolare':'Dopo il cambio di verso, la direzione viene ruotata di un piccolo angolo scelto entro il limite indicato, in un senso oppure nell’altro. Con 0° non si introduce alcuna deviazione.',
  'Velocità interessate':'Sceglie a quante particelle applicare l’imprecisione. Tutte le altre velocità vengono invertite accuratamente.',
  'Rappresentazione del gas':'«Particelle» mostra i punti; «Densità» raggruppa i conteggi in regioni; «Velocità» aggiunge segmenti dal punto verso la direzione del moto. Cambia il disegno, mentre l’evoluzione resta la stessa.',
 },
 onde:{
  'Ritardo relativo':'Le due onde hanno lo stesso periodo, cioè impiegano lo stesso tempo a compiere un’oscillazione. Qui si regola lo spostamento di un ciclo rispetto all’altro: 90° corrisponde a un quarto di periodo, 180° a mezzo periodo.',
  'Confronti':'Questi tre casi permettono di seguire il passaggio dal rinforzo alla cancellazione. Mantieni inizialmente uguali le ampiezze delle due onde.',
  'Ampiezza dell’onda B':'L’ampiezza è il massimo scostamento dall’equilibrio. L’onda A ha ampiezza 1: con B = 1 i contributi sono uguali, con B = 0 rimane soltanto A.',
 },
 fenditure:{
  'Aperture':'Con una fenditura si osserva l’allargamento del profilo prodotto da una singola apertura. Con due fenditure si può studiare anche il confronto fra i due contributi.',
  'Combinazione':'«Con interferenza» conserva la relazione di fase fra i contributi. «Somma dei profili» somma le probabilità dei due cammini, come nel caso in cui siano distinguibili. Con una sola apertura questa scelta non ha effetto.',
  'Larghezza delle fenditure':'È l’ampiezza fisica di ciascuna apertura. Un micrometro (μm) è un millesimo di millimetro. Restringere l’apertura allarga il profilo sullo schermo.',
  'Separazione delle fenditure':'È la distanza fra i centri delle due aperture. Interviene sulla distanza fra le frange chiare e scure; non modifica la larghezza di ciascuna apertura.',
  'Lunghezza d’onda':'È la distanza fra due creste successive dell’onda. Un nanometro (nm) è un milionesimo di millimetro; per la luce visibile, lunghezze d’onda diverse corrispondono a colori diversi.',
  'Distanza dello schermo':'Allontanare lo schermo dilata la figura. Nel disegno l’apparato rimane schematico: le distanze fisiche sono quelle impostate nei controlli.',
  'Coerenza dei due contributi':'La coerenza indica quanto viene mantenuta la relazione di fase. Con 1 il modello conserva tutta l’interferenza; con 0 rimane la somma dei profili. I valori intermedi riducono la differenza fra zone chiare e scure.',
 },
 polarizzazione:{
  'Preparazioni note':'H indica la polarizzazione orizzontale, V quella verticale. +45° e −45° sono le due diagonali. La diagonale +45° ha componenti concordi, quella −45° componenti opposte. Ai poli H e V è presente una sola componente. I pulsanti selezionano lo stato completo corrispondente.',
  'Orientazione prima dello sfasamento':'Prima di aggiungere una fase, questo è l’angolo della polarizzazione lineare nel piano del campo. Regola il peso delle componenti orizzontale e verticale. Se poi introduci una fase, la punta del campo può descrivere un’ellisse e non ha più un’unica direzione fissa.',
  'Orientazione dell’analizzatore':'A 0° le uscite A e B corrispondono rispettivamente a H e V. A 45° corrispondono alle diagonali +45° e −45°. Ruotare l’analizzatore cambia la domanda posta alla stessa preparazione.',
 },

};
export function ControlNote({label}:{label:string}){
 const lab=useContext(LabReadingContext),text=specific[lab]?.[label]??common[label];
 return text?<p className="control-explanation">{text}</p>:null;
}
