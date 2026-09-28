import { algorithmTheory } from './theories';

export type Environment = {
  id: string; title: string; short: string; part: number;
  intro: string; theory: string[]; definition: string; space: string; bridge: string;
  examples: string[]; slideChapter: number; advanced?: boolean;
};
type Row = [keyof typeof algorithmTheory, string, number, string[], number, boolean?];
const make = (rows: Row[]): Environment[] => rows.map(([id, title, part, examples, slideChapter, advanced]) => ({
  id, title, short: title, part, examples, slideChapter, advanced, ...algorithmTheory[id],
}));

export const partsThree=['Trasformazioni e preparazioni','Registri e costruzioni','Programmi completi'];
export const chapterThree=make([
  ['programma','Leggere un circuito',0,['H su (2,−1)/√5','H e Z su (1,i)/√2'],1],
  ['reversibilita','Conservare l’informazione',0,['AND con ingresso 11','AND con ingresso 10'],2],
  ['porte','Operazioni su un qubit',0,['Sequenza X, Y, Z su |+⟩','Rᵧ(60°) e Rz(90°)'],3],
  ['preparazione','Preparare uno stato assegnato',0,['Preparare (2,i)/√5','Preparare (1,−1)/√2'],4],
  ['inversa','Comporre e invertire un programma',0,['H, P(60°), P(−60°), H','Rᵧ(90°), Z, Z, Rᵧ(−90°)'],5],
  ['interferometro','Rendere osservabile una fase',0,['Fase di 90°','Fase di 180°'],6],
  ['registro','Operare su un registro',1,['CNOT su (3,0,−1,2i)/√14','Porta H locale prima della CNOT'],7],
  ['bell','Costruire e misurare entanglement',1,['Bell misurato in Z,Z','Bell misurato in X,X'],8],
  ['ausiliari','Calcolare, marcare e ripristinare',1,['Marcatura con ripristino','Informazione residua senza ripristino'],9],
  ['sintesi','Costruire una porta composta',1,['Decomposizione su |10⟩','Decomposizione su una sovrapposizione'],10],
  ['deutsch','Deutsch e il ritorno di fase',2,['Funzione costante f=1','Funzione bilanciata f(x)=x','Funzione costante f=0','Funzione bilanciata f(x)=1⊕x'],11],
  ['grover-primo','Una ricerca fra quattro alternative',2,['Soluzione 11','Soluzione 01'],12],
  ['evoluzione','Simulare un’evoluzione',2,['Due passi a t=0,5','Otto passi a t=0,5'],13],
  ['programma-completo','Verificare un programma completo',2,['Programma con S','Variante con S†'],14]
]);
export const partsFour=['Oracoli e ricerca','Fourier e stime','Aritmetica e costruzioni','Applicazioni complete'];
export const chapterFour=make([
  ['deutsch-jozsa','Deutsch–Jozsa',0,['Costante su tre bit','Bilanciata non affine su tre bit'],2],
  ['bernstein-vazirani','Bernstein–Vazirani',0,['Stringa 101','Stringa 011 con termine affine'],3],
  ['simon','Simon e le equazioni binarie',0,['Segreto 101: equazioni indipendenti','Segreto 110: equazioni ripetute'],4],
  ['swap','SWAP test',0,['Stati uguali','Stati |0⟩ e |+⟩','Stati ortogonali |0⟩ e |1⟩'],5],
  ['grover','Grover: iterazioni e sovrarotazione',0,['N=8, una soluzione, due iterazioni','N=8, due soluzioni, due iterazioni'],6],
  ['ricerca-ignota','Ricerca con numero ignoto di soluzioni',0,['Otto elementi, una soluzione','Otto elementi, nessuna soluzione'],8,true],
  ['amplificazione','Amplificare una preparazione assegnata',0,['Probabilità buona iniziale 1/10','Probabilità buona iniziale 1/4'],9,true],
  ['minimo','Ricercare un minimo',0,['Lista 9,4,7,1,6,3,8,2','Lista con due minimi uguali'],10,true],
  ['fourier','Sommare le fasi di Fourier',1,['Stato |1⟩ su quattro elementi','Sovrapposizione periodica su otto elementi'],11],
  ['qft','Costruire il circuito QFT',1,['QFT di |01⟩','QFT di |011⟩'],12],
  ['hadamard-test','Hadamard test',1,['Parte reale per P(90°)','Parte immaginaria per P(−90°)'],13],
  ['qpe-esatta','Stima di fase esatta',1,['Autofase 3/8','Sovrapposizione di autofasi 1/8 e 5/8'],14],
  ['qpe-approssimata','Stima di fase a precisione finita',1,['Autofase 1/3 con tre bit','Due autostati con fasi 1/3 e 2/3'],15],
  ['conteggio','Conteggio quantistico',1,['Due soluzioni fra otto','Una soluzione fra otto'],16,true],
  ['stima-ampiezze','Stimare una probabilità',1,['Probabilità 1/4','Probabilità 1/10'],17,true],
  ['aritmetica','Euclide, inversi e potenze modulari',2,['Inverso di 7 modulo 40','Inverso di 5 modulo 12'],18],
  ['rsa','RSA e recupero della chiave dai fattori',2,['N=55, e=3, messaggio 7','N=55, e=3, messaggio 5'],19],
  ['ordine-fattori','Dall’ordine ai fattori',2,['N=15, a=2','N=21, a=5: tentativo non utile'],20],
  ['somma','Sommare conservando i riporti',2,['Somma 3+2 su tre bit','Somma 5+5 su tre bit, con trabocco'],21],
  ['moltiplicazione','Moltiplicare ed esponenziare modulo N',2,['2·7 modulo 15','5·8 modulo 21'],22],
  ['autostati','Autostati della moltiplicazione modulare',2,['Orbita di 2 modulo 15','Orbita di 2 modulo 21'],23],
  ['frazioni-continue','Ricostruire un denominatore',2,['85/512 per N=21','171/512: denominatore parziale'],24],
  ['shor-15','Shor completo: fattorizzare 15',3,['Base a=2','Base a=7'],25],
  ['shor-21','Shor completo: fattorizzare 21',3,['Base a=2','Base a=5'],26],
  ['logaritmo','Logaritmo discreto',3,['Gruppo modulo 5, ordine 4','Gruppo modulo 7, ordine 6'],29]
]);
