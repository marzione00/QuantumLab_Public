"use client";
import {useEffect,useState} from 'react';
import {ArrowLeft,ArrowRight,BookOpen,Menu,Orbit,Maximize2} from 'lucide-react';
import {Button} from '@/components/ui/button';
import {SidebarProvider,Sidebar,SidebarHeader,SidebarContent,SidebarFooter,SidebarMenu,SidebarMenuItem,SidebarMenuButton,useSidebar} from '@/components/ui/sidebar';
import {LabPolar,LabMotion,LabWaves} from '@/components/labs';
import {LabCircuitGuided as LabCircuit} from '@/components/lab-circuit-guided';
import {LabPairsGuided as LabPairs} from '@/components/lab-pairs-guided';
import {LabEnvironmentGuided as LabEnvironment} from '@/components/lab-environment-guided';
import {LabMemoryGuided as LabArchive} from '@/components/lab-memory-guided';
import {LabDiagnosis as LabSynthesis} from '@/components/lab-diagnosis';
import {LabGasLarge as LabGas} from '@/components/lab-gas';
import {LabSlitsLarge as LabSlits} from '@/components/lab-slits';
import {LearningBridge} from '@/components/learning-bridge';
import {LabReadingContext} from '@/components/lab-reading';
export const chapterOne=[
 {id:'moto',short:'Il moto',section:'La simulazione classica',title:'Dati iniziali e previsione del moto',question:'Due particelle partono dalla stessa posizione. Arriveranno nello stesso punto?',page:9},
 {id:'loschmidt',short:'Il gas e Loschmidt',section:'La simulazione statistica',title:'Reversibilità e inversione di Loschmidt',question:'Lasciamo espandere il gas. Poi invertiamo tutte le velocità.',page:39},
 {id:'onde',short:'Onde e interferenza',section:'Onde e interferenza',title:'Sovrapposizione e fase relativa',question:'Come cambia la sovrapposizione se ritardiamo una delle due onde?',page:71},
 {id:'fenditure',short:'Un arrivo alla volta',section:'L’interferenza di particelle singole',title:'Dai singoli arrivi alla distribuzione',question:'Quale distribuzione emerge dai singoli arrivi sullo schermo?',page:98},
 {id:'polarizzazione',short:'Polarizzazione e qubit',section:'Stati a due alternative',title:'Polarizzazione, misura e sfera di Bloch',question:'Le due diagonali danno gli stessi conteggi. Quale misura le distingue?',page:140},
 {id:'calcolo',short:'Il calcolo quantistico',section:'Il calcolo quantistico',title:'Operazioni su un qubit',question:'Come può una variazione di fase modificare gli esiti di un circuito?',page:177},
 {id:'coppie',short:'Due qubit',section:'Due qubit e stati congiunti',title:'Statistiche locali e correlazioni',question:'Le statistiche dei singoli qubit bastano a descrivere due qubit insieme?',page:184},
 {id:'ambiente',short:'Il ruolo dell’ambiente',section:'Ambiente e decoerenza',title:'Una coppia entangled incontra l’ambiente',question:'Quali correlazioni cambiano quando la coppia perde coerenza?',page:205},
 {id:'informazione',short:'Salvare una simulazione',section:'Informazione e irreversibilità',title:'Quali dati servono per continuare?',question:'Salviamo le probabilità 0/1: quali operazioni possiamo ancora prevedere?',page:220},
 {id:'sintesi',short:'Distinguere le cause',section:'Sintesi: il progetto di simulazione',title:'Stessi conteggi, cause differenti',question:'Quale intervento distingue una fase instabile da una traccia dei cammini?',page:228}
];

export const chapterOneComponents=[LabMotion,LabGas,LabWaves,LabSlits,LabPolar,LabCircuit,LabPairs,LabEnvironment,LabArchive,LabSynthesis];
export function ChapterOneDemo({index}:{index:number}){const Demo=chapterOneComponents[index];return <LabReadingContext.Provider value={chapterOne[index].id}><Demo/><LearningBridge chapter={index}/></LabReadingContext.Provider>;}
