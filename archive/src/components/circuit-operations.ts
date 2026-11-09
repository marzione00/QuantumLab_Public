import {type CircuitBlock} from '@/lib/quantum-experiments';
export const descriptions:Record<string,{name:string;short:string;symbol:string;text:string}>={
 I:{name:'I · Lascia invariato',short:'Lascia invariato',symbol:'I',text:'Lo stato attraversa questo passaggio senza cambiare. I permette di esaminare una sola operazione, lasciando libere le altre posizioni del circuito.'},
 X:{name:'X · Scambia 0 e 1',short:'Scambia 0 e 1',symbol:'X',text:'X porta lo stato 0 nello stato 1 e lo stato 1 nello stato 0. Per uno stato generico scambia le due ampiezze e quindi le probabilità dei due esiti. Sulla sfera il punto compie mezzo giro attorno all’asse che passa per + e −. Gli stati su questo asse rimangono nella stessa posizione.'},
 Y:{name:'Y · Scambia e cambia la fase',short:'Scambia e cambia fase',symbol:'Y',text:'Y scambia le probabilità di 0 e 1 e modifica anche la relazione di fase. Porta 0 in 1 e 1 in 0; porta inoltre + in − e − in +. Sulla sfera è un mezzo giro attorno all’asse y, che passa per i due stati dell’equatore con fase +90° e −90°. Una misura immediata in 0/1 dà le stesse probabilità di X; un’operazione successiva può distinguerle.'},
 Z:{name:'Z · Cambia la fase',short:'Cambia la fase',symbol:'Z',text:'Z conserva le probabilità di 0 e 1 e aggiunge mezzo giro alla fase relativa. Gli stati 0 e 1 rimangono nella stessa posizione, mentre + e − si scambiano. Sulla sfera il punto compie mezzo giro attorno all’asse verticale. Una successiva ricombinazione può rendere visibile questa differenza negli esiti.'},
 H:{name:'R · Ricombina le ampiezze',short:'Ricombina',symbol:'R',text:'R porta 0 nello stato + e 1 nello stato −. Applicata a + dà 0; applicata a − dà 1. In questo modo rende distinguibili due stati che, misurati direttamente in 0/1, darebbero entrambi 50/50. È la ricombinazione già incontrata nella lezione.'},
 P:{name:'F · Regola la fase',short:'Regola la fase',symbol:'F',text:'F fa avanzare o arretrare il punto lungo il suo parallelo sulla sfera. L’angolo indica di quanto cambia la fase relativa, mentre le probabilità di 0 e 1 rimangono costanti. A +180° e −180° si ottiene lo stesso effetto di Z; due variazioni di segno opposto si annullano.'}
};
export const options:[string,string][]=Object.entries(descriptions).map(([key,d])=>[key,d.symbol+' · '+d.short]);
export const gateSymbol=(g:string)=>descriptions[g].symbol;
const angle=(n:number)=>n.toLocaleString('it-IT',{maximumFractionDigits:3});
export function blockSettings(b:CircuitBlock){
 if(b.gate==='P')return 'Variazione di fase '+(b.phase>0?'+':'')+angle(b.phase)+'°';
 if(['X','Y','Z'].includes(b.gate))return 'Mezzo giro attorno a '+b.gate.toLowerCase();
 return b.gate==='I'?'Stato invariato':'0 ↔ + · 1 ↔ −';
}
export function chooseGate(b:CircuitBlock,gate:string):CircuitBlock{
 return {...b,gate,axis:0};
}
export function axisFor(b:CircuitBlock):[number,number,number]|undefined{
 if(b.gate==='X')return [1,0,0];if(b.gate==='Y')return [0,1,0];
 if(b.gate==='Z'||b.gate==='P')return [0,0,1];
 if(b.gate==='H')return [Math.SQRT1_2,0,Math.SQRT1_2];
}
