import React from 'react';

// Native MathML remains available in standalone HTML, without a CDN or script.
// The original formula is retained for the LaTeX exporter and copy operations.
const sub=Object.fromEntries([... '₀₁₂₃₄₅₆₇₈₉₊₋₌₍₎ₐₑₕᵢⱼₖₗₘₙₒₚᵣₛₜᵤᵥₓᵧᵦ'].map((x,i)=>[x,[...'0123456789+-=()aehijklmnoprstuvxyb'][i]]));
const sup=Object.fromEntries([...'⁰¹²³⁴⁵⁶⁷⁸⁹⁺⁻⁼⁽⁾ᵀᴺᵏᶜⁿʲˣʸᵈᵐᵉʳᴿᵃᵇⁱ'].map((x,i)=>[x,[...'0123456789+-=()TNkcnjxydmerRabi'][i]]));
const esc=(s:string)=>s.replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
const node=(tag:string,s:string)=>`<${tag}>${s}</${tag}>`;
const row=(s:string[])=>node('mrow',s.join(''));

export function mathMarkup(source:string):string {
 let s=source.replace(/\^f\(x\)/g,'^{f(x)}').replace(/(⟩|H)⊗(\d+|n|m)/g,'$1^{⊗$2}')
  .replace(/Σrami/g,'Σ_{rami}').replace(/Σ([xsjyqb])(?=[| (])/g,'Σ_{$1}');
 let i=0;
 const group=(close='',show=true):string=>{
  const out:string[]=[],breaks:number[]=[];let segmentStart=i;
  while(i<s.length){
   if(close&&s[i]===close){i++;break;}
   if(s[i]===' '){i++;continue;}
   if(s[i]==='/'&&out.length){i++;const a=out.pop()!;out.push(node('mfrac',a+atom()));continue;}
   if(show&&i-segmentStart>76&&/[+−=≈]/.test(s[i])){breaks.push(out.length);segmentStart=i;}
   out.push(atom());
  }
  if(breaks.length){const points=[0,...breaks,out.length];return '<mtable columnalign="left" rowspacing="0.8em">'+points.slice(0,-1).map((start,j)=>node('mtr',node('mtd',row(out.slice(start,points[j+1]))))).join('')+'</mtable>';}
  return row(out);
 };
 const argument=():string=>{
  while(s[i]===' ')i++;
  if('([{'.includes(s[i]||'\0')){const c=s[i++],end=c==='('?')':c==='['?']':'}';return group(end,false);}
  return base();
 };
 const base=():string=>{
  if(i>=s.length)return node('mrow','');
  const c=s[i++];
  if(c==='√')return node('msqrt',argument());
  if(c==='|'&&s.indexOf('⟩',i)>=0){const end=s.indexOf('⟩',i),body=s.slice(i,end);if(!/[=;\n]/.test(body)){i=end+1;return row([node('mo','|'),mathMarkup(body),node('mo','⟩')]);}}
  if('([{'.includes(c)){const end=c==='('?')':c==='['?']':'}',r=group(end);return row([node('mo',esc(c)),r,node('mo',esc(end))]);}
  if(/[0-9]/.test(c)){const m=s.slice(i-1).match(/^\d+(?:[.,]\d+)?(?:[eE][+−-]?\d+)?/)![0];i+=m.length-1;return node('mn',esc(m));}
  if(/[A-Za-zÀ-ÿ]/.test(c)){const m=s.slice(i-1).match(/^[A-Za-zÀ-ÿ]+/)![0];i+=m.length-1;return node(m.length>2?'mtext':'mi',esc(m));}
  return node(/[α-ωΑ-Ωℏℓ]/.test(c)?'mi':'mo',esc(c));
 };
 const atom=():string=>{
  let a=base();
  while(i<s.length){
   const c=s[i];
   if(c==='^'||c==='_'){i++;a=node(c==='^'?'msup':'msub',a+argument());}
   else if(sub[c]||sup[c]){const map=sub[c]?sub:sup;let t='';while(map[s[i]])t+=map[s[i++]];a=node(map===sub?'msub':'msup',a+mathMarkup(t));}
   else if(c==='°'||c==='†'||c==='′'){i++;a=node('msup',a+node('mo',c));}
   else break;
  }
  return a;
 };
 return group();
}

export function formulaLines(s:string):string[]{
 const lines:string[]=[];
 for(const line of s.split('\n')){
  let start=0,depth=0;
  for(let j=0;j<line.length;j++){
   if('([{'.includes(line[j]))depth++;
   if(')]}'.includes(line[j]))depth--;
   if(depth===0&&(line[j]===';'||(j-start>88&&/[=≈]/.test(line[j])))){
    const cut=line[j]===';'?j+1:j;
    if(cut>start)lines.push(line.slice(start,cut));start=cut;
   }
  }
  if(line.slice(start).trim())lines.push(line.slice(start));
 }
 return lines;
}

export function MathDisplay({source}:{source:string}){
 return <div className="equation mathematical" data-math-source={source}>{formulaLines(source).map((line,j)=><div className="math-line" key={j} tabIndex={0} aria-label={line} dangerouslySetInnerHTML={{__html:`<math xmlns="http://www.w3.org/1998/Math/MathML" display="block"><semantics>${mathMarkup(line)}<annotation encoding="text/plain">${esc(line)}</annotation></semantics></math>`}}/>)}</div>;
}
