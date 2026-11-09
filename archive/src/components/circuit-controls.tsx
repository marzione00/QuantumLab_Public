"use client";
import {useId,useRef,useState} from 'react';
import {Button} from '@/components/ui/button';
import {Input} from '@/components/ui/input';
import {Range,num} from './lab-common';
import {parseAngle} from '@/lib/bloch-interaction';

export function AngleControl({label,value,onChange,min=0,max=360,compact=false,disabled=false}:{label:string;value:number;onChange:(v:number)=>void;min?:number;max?:number;compact?:boolean;disabled?:boolean}){
 const id=useId(),[draft,setDraft]=useState<string|null>(null),[focused,setFocused]=useState(false),cancel=useRef(false);
 const shown=focused&&draft!==null?draft:String(Number(value.toFixed(6))),parsed=parseAngle(shown,max,min),incomplete=focused&&/^[+−-]?$/.test(shown.trim()),invalid=parsed===null&&!incomplete;
 const edit=(raw:string)=>{setDraft(raw);const next=parseAngle(raw,max,min);if(next!==null&&next!==value)onChange(next);};
 return <div className={'angle-control'+(compact?' angle-compact':'')}>
 <div className="angle-number"><label htmlFor={id}>{label}</label><div>{min<0&&<Button type="button" variant="outline" className="angle-sign" disabled={disabled} aria-label={"Cambia il segno: "+label} title="Cambia il segno" onClick={()=>{setDraft(null);onChange(-value);}}>±</Button>}<Input id={id} type="text" inputMode="decimal" value={shown} disabled={disabled} aria-invalid={invalid} aria-describedby={id+'hint'}
 onFocus={()=>{setFocused(true);setDraft(String(Number(value.toFixed(6))));}} onInput={e=>edit(e.currentTarget.value)} onChange={e=>edit(e.currentTarget.value)}
 onBlur={e=>{const next=parseAngle(e.currentTarget.value,max,min);if(!cancel.current&&next!==null)onChange(next);cancel.current=false;setFocused(false);setDraft(null);}}
 onKeyDown={e=>{if(e.key==='Enter'){e.preventDefault();e.currentTarget.blur();}if(e.key==='Escape'){cancel.current=true;e.currentTarget.blur();}}}/><span>°</span></div></div>
 {!compact&&<Range label={'Cursore · '+label} value={value} min={min} max={max} step={.1} unit="°" disabled={disabled} onChange={v=>{setDraft(null);onChange(v);}}/>}
 <span id={id+'hint'} className={compact&&!invalid?'sr-only':'angle-hint'}>{invalid?'Inserisci un numero da '+min+' a '+max+'. Valore applicato: '+num(value,2)+'°.':'Da '+min+'° a '+max+'°; virgola e punto sono ammessi per i decimali.'}</span>
 </div>;
}
