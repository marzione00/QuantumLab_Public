"use client";
import {createContext,useContext} from 'react';
export const LabReadingContext=createContext('');
type Reading={intro:string;title?:string;sections?:{title:string;paragraphs:string[]}[]};
const readings:Record<string,Reading>={
 moto:{
  intro:'Due particelle partono dallo stesso punto. Per prevedere dove si troveranno occorre conoscere anche la loro velocità. Il primo confronto segue due moti ben determinati; la raccolta sottostante mostra invece che cosa accade quando i dati della preparazione sono noti soltanto entro un intervallo.',
  title:'Quali dati servono per prevedere il moto?',
  sections:[
   {title:'Dalla velocità alla posizione',paragraphs:[
    'Il modello considera un moto lungo una retta, a velocità costante. Se una particella parte da 2 m e percorre 3 m ogni secondo, dopo 4 s avrà compiuto uno spostamento di 3 × 4 = 12 m. La posizione finale è dunque 2 + 12 = 14 m. Per una velocità negativa lo spostamento si sottrae alla posizione di partenza: il segno distingue i due versi del moto.',
    'Nel grafico inferiore del primo disegno il tempo cresce verso destra e la posizione si legge in verticale. Una retta più inclinata indica un cambiamento più rapido della posizione. Le rette di A e B iniziano nello stesso punto; se le velocità sono uguali, coincidono per tutta la durata dell’esperimento.'
   ]},
   {title:'Un intervallo di dati produce un intervallo di previsioni',paragraphs:[
    'Impostiamo per A una velocità di 3 m/s con incertezza di 0,5 m/s. Consideriamo così possibili tutte le velocità fra 2,5 e 3,5 m/s. Partendo da 0, dopo 4 s le posizioni estreme saranno 2,5 × 4 = 10 m e 3,5 × 4 = 14 m. La fascia colorata comprende le posizioni fra questi estremi. Con il passare del tempo si allarga, perché piccole differenze di velocità si accumulano nello spostamento.',
    'L’istogramma aggiunge molte preparazioni indipendenti. Il programma sceglie una posizione e una velocità entro gli intervalli indicati, senza favorire alcuna parte di ciascun intervallo. Conta poi quante particelle arrivano in ogni tratto della retta. Questo criterio di scelta è un’ipotesi ulteriore: conoscere soltanto gli estremi possibili non stabilisce quanto spesso compaia ciascun valore.',
    'Confronta una raccolta di 1.000 preparazioni con una di 20.000, lasciando fisse le incertezze. La forma delle barre diventa più regolare, ma l’intervallo delle posizioni possibili resta lo stesso. Un numero maggiore di simulazioni descrive meglio l’incertezza assegnata; per restringerla occorrono dati iniziali più precisi.'
   ]}
  ]
 },
 loschmidt:{
  intro:'Il gas viene preparato nella metà sinistra del recipiente e lasciato espandere. L’esperimento si ferma prima di invertire le velocità. Da quella stessa configurazione partono due ritorni: uno usa tutti i dati disponibili, l’altro introduce l’imprecisione scelta. Il confronto rende osservabile il ruolo dell’informazione necessaria a ricostruire il moto.'
 },
 onde:{
  intro:'Per simulare un’onda occorre descrivere un’oscillazione in ciascun punto. Le prime due curve rappresentano onde con lo stesso periodo; la terza ne mostra la somma. L’intensità misura l’energia che attraversa una data superficie in un dato tempo: qui è espressa rispetto a quella della sola onda A. Variando il ritardo fra i contributi osserveremo come cambia il segnale risultante.',
  title:'Dalle oscillazioni alla figura di interferenza',
  sections:[
   {title:'Sommare i contributi nello stesso punto',paragraphs:[
    'In ogni posizione, lo spostamento dell’onda A si somma a quello dell’onda B tenendo conto del segno. Se entrambe le onde si trovano a +1 rispetto all’equilibrio, lo spostamento risultante è +2. Se una è a +1 e l’altra a −1, la somma è 0. La stessa operazione viene ripetuta lungo tutto il profilo e costruisce la terza curva.',
    'L’ampiezza è il massimo scostamento dall’equilibrio. Il ritardo relativo stabilisce invece come si dispongono fra loro creste e valli. Con ritardo nullo, due onde uguali raggiungono insieme i massimi e i minimi. Con mezzo ciclo di differenza, a ogni cresta dell’una corrisponde una valle dell’altra: le oscillazioni si compensano in tutte le posizioni.'
   ]},
   {title:'Un quarto di ciclo nella costruzione geometrica',paragraphs:[
    'La costruzione con le frecce conserva sia l’ampiezza, rappresentata dalla lunghezza, sia la fase, rappresentata dall’orientazione. Si dispone l’inizio della seconda freccia sulla punta della prima; la freccia che va dall’origine alla punta finale rappresenta la somma. A un quarto di ciclo le due frecce sono perpendicolari. Con entrambe le ampiezze uguali a 1, il quadrato della lunghezza risultante vale 1 + 1 = 2: questa è l’intensità indicata dal simulatore.'
   ]},
   {title:'Un confronto che cambia una sola condizione',paragraphs:[
    'Mantenendo uguali le ampiezze, le intensità separate restano fisse anche quando cambia il ritardo. Il programma deve conservare la relazione fra i cicli per prevedere la sovrapposizione; registrare soltanto le due intensità esclude questa informazione.',
    'Con l’ampiezza B ridotta a 0,5 e mezzo ciclo di ritardo, i contributi opposti hanno lunghezze diverse: resta un’ampiezza di 1 − 0,5 = 0,5 e un’intensità di 0,5 × 0,5 = 0,25. La cancellazione completa richiede sia l’opposizione di fase sia l’uguaglianza delle ampiezze.'
   ]}
  ]
 },
 fenditure:{
  intro:'Ogni evento aggiunge un punto allo schermo. La figura complessiva nasce dall’accumulo di molti arrivi: le regioni più frequentate diventano riconoscibili e possono essere confrontate con la previsione. Cominciamo con una sola apertura, poi apriamo anche la seconda mantenendo fisse le altre condizioni.',
  title:'Come leggere la distribuzione degli arrivi',
  sections:[
   {title:'Il singolo punto e il profilo della raccolta',paragraphs:[
    'Il punto sullo schermo indica la posizione di una rivelazione. L’istogramma a destra divide lo schermo in piccoli intervalli e conta gli arrivi in ciascuno di essi. Una barra più lunga indica una parte maggiore della raccolta in quella regione. La linea blu mostra le probabilità previste per gli stessi intervalli.',
    'Con 100 arrivi possono comparire irregolarità marcate: alcuni intervalli ricevono più eventi di altri anche quando hanno probabilità simili. Proseguendo fino a 10.000 o 100.000 arrivi, il profilo delle frequenze tende a diventare più stabile. Il numero maggiore di eventi migliora la lettura della distribuzione; la forma prevista dipende dall’apparato.'
   ]},
   {title:'La larghezza del profilo e la distanza fra le frange',paragraphs:[
    'Anche una sola fenditura produce un profilo allargato. Questo effetto prende il nome di diffrazione. La parte centrale è più popolata e, allontanandosi dal centro, compaiono regioni in cui gli arrivi diventano poco probabili. Restringendo la fenditura, il profilo si allarga.',
    'Con due fenditure e una relazione di fase mantenuta, il profilo presenta un’alternanza di regioni favorite e sfavorite: le frange di interferenza. Il profilo più ampio della singola apertura ne limita l’estensione ed è chiamato inviluppo. Il controllo della larghezza modifica soprattutto questo profilo; il controllo della separazione modifica soprattutto la distanza fra le frange. Per distinguerli, varia un solo controllo alla volta.',
    'La fase relativa sposta le frange sullo schermo. Ridurre la coerenza ne attenua invece il contrasto, cioè la differenza fra le regioni più e meno popolate. Al valore 0 rimane la somma dei profili dei due cammini. La scelta «Somma dei profili» permette di confrontare direttamente questa previsione con quella che conserva l’interferenza.'
   ]},
   {title:'Che cosa viene confrontato',paragraphs:[
    'Le raccolte sono confrontate a parità di numero di arrivi registrati nella finestra dello schermo. Il laboratorio mostra quindi dove si distribuiscono gli eventi, senza rappresentare l’aumento o la diminuzione della quantità totale di luce trasmessa dalle aperture. Quando modifichi l’apparato, la raccolta corrente viene azzerata; puoi conservare prima il profilo per confrontarlo con il successivo.'
   ]}
  ]
 },
 polarizzazione:{
  intro:'Riprendiamo la luce polarizzata usata nella lezione. Il disegno del campo mostra come oscilla la luce; la sfera di Bloch rappresenta la preparazione del qubit; le uscite A e B registrano gli esiti della misura. Il laboratorio mette in relazione queste tre descrizioni, mantenendone distinto il significato.',
  title:'Dalla polarizzazione alla scelta della misura',
  sections:[
   {title:'Due componenti dello stesso campo',paragraphs:[
    'Guardiamo il fascio lungo la direzione di propagazione. Una polarizzazione H oscilla orizzontalmente, una polarizzazione V verticalmente. Nella diagonale a +45° il campo ha una componente orizzontale e una verticale di uguale ampiezza, che oscillano insieme. Sono componenti dello stesso campo elettrico.',
    '«Anima il campo» segue la punta del vettore lungo le posizioni raggiunte durante un’oscillazione. Per una polarizzazione lineare si ottiene un segmento. Se le due componenti acquistano uno sfasamento, la punta può percorrere un’ellisse; con ampiezze uguali e un quarto di ciclo di differenza percorre un cerchio. Le figure descrivono l’oscillazione del campo di un fascio classico, non il tragitto di un pacchetto di luce nello spazio.'
   ]},
   {title:'Misurare un pacchetto alla volta',paragraphs:[
    'Con l’analizzatore a 0°, l’uscita A corrisponde alla polarizzazione H e l’uscita B alla polarizzazione V. La preparazione H conduce sempre ad A nel modello ideale; la preparazione V conduce sempre a B. La diagonale a +45° assegna invece uguale probabilità ai due esiti.',
    'Ogni prova prepara un nuovo pacchetto e registra un solo esito. Su molte prove con la diagonale ci aspettiamo circa metà degli arrivi in A e metà in B. La scomposizione del campo non significa che ciascun pacchetto sia registrato per metà in ogni uscita. Il 50% descrive la probabilità dei singoli esiti e il comportamento di una raccolta numerosa.'
   ]},
   {title:'La stessa ripartizione può provenire da preparazioni diverse',paragraphs:[
    'Prepara prima +45° e poi −45°, lasciando l’analizzatore a 0°. Entrambe le preparazioni danno probabilità 50% e 50%. Sulla sfera occupano però due punti opposti dell’equatore. La stessa altezza rispetto all’asse H/V spiega l’uguaglianza delle probabilità in quella misura; la diversa posizione conserva la differenza fra gli stati.',
    'Ruota ora l’analizzatore a 45°. L’uscita A legge la diagonale +45° e B la diagonale perpendicolare −45°. La prima preparazione produce A con certezza, la seconda B con certezza. Cambiare la misura rende quindi osservabile una differenza che la precedente scelta non distingueva.',
    'La preparazione circolare offre un ulteriore confronto: tutte le orientazioni lineari dell’analizzatore danno 50% e 50%. Questo risultato non identifica lo stato con una scelta casuale fra H e V. La preparazione circolare conserva una relazione precisa fra le componenti; altre operazioni, prima della misura, possono renderla osservabile. Il laboratorio mostra qui soltanto analizzatori lineari.'
   ]}
  ]
 },

};
export function LabIntroduction(){const r=readings[useContext(LabReadingContext)];return r?<p className="lab-introduction">{r.intro}</p>:null;}
export function LabDiscussion(){const r=readings[useContext(LabReadingContext)];return r?.sections?<section className="lab-discussion"><h2>{r.title}</h2>{r.sections.map(s=><section className="reading-section" key={s.title}><h3>{s.title}</h3>{s.paragraphs.map((p,i)=><p key={i}>{p}</p>)}</section>)}</section>:null;}
