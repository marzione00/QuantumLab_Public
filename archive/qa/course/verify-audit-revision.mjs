// Regressions for the September 2026 audit. Both bundles are compiled from the
// current sources in memory: a previous dist/ or generated guide cannot pass them.
// jsdom exercises React and SVG DOM, not browser layout, Canvas, touch or file://.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {build} from 'esbuild';
import {JSDOM, VirtualConsole} from 'jsdom';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const buildOptions = {bundle:true, write:false, logLevel:'silent', tsconfig:path.join(root, 'tsconfig.json')};
const [models, application] = await Promise.all([
  build({...buildOptions, platform:'node', format:'esm', stdin:{resolveDir:root, loader:'ts', contents:`
    export * as M from './src/course/math/core';
    export {bookTwo, bookExample} from './src/course/book/chapter-two';
    export {exampleThree, exampleFour} from './src/course/algorithms/examples';
  `}}),
  build({...buildOptions, platform:'browser', format:'iife', stdin:{resolveDir:root, loader:'tsx', contents:`
    import React from 'react';
    import {createRoot} from 'react-dom/client';
    import App from './src/course/app';
    createRoot(document.getElementById('root')).render(<App/>);
  `}}),
]);
const {M, bookTwo, bookExample, exampleThree, exampleFour} = await import(
  'data:text/javascript;base64,' + Buffer.from(models.outputFiles[0].text).toString('base64')
);
let checks = 0;
const results = [];
const check = (condition, message) => { assert.ok(condition, message); checks++; };
const equal = (actual, expected, message) => { assert.deepEqual(actual, expected, message); checks++; };
const near = (actual, expected, tolerance=1e-10) => check(
  Math.abs(actual-expected) <= tolerance,
  `${actual} differs from ${expected} (tolerance ${tolerance})`
);
const group = async (name, run) => {
  const before = checks;
  try { await run(); results.push({name, status:'PASS', checks:checks-before}); }
  catch (error) { results.push({name, status:'FAIL', checks:checks-before, error:error.message}); }
};
const textOf = example => [example.lead, ...example.steps.flatMap(s=>[s.title,s.formula,s.text]), example.conclusion].join('\n');
const numberIT = text => Number(text.replaceAll('−','-').replaceAll('.','').replace(',','.'));
const probabilities = state => state.map(([re,im])=>re*re+im*im);
const finiteNumbers = value => typeof value==='number'?Number.isFinite(value):
  value&&typeof value==='object'?Object.values(value).every(finiteNumbers):true;
const marginalFirst = state => probabilities(state).reduce((out,p,i)=>{
  out[i < state.length/2 ? 0 : 1] += p;
  return out;
}, [0,0]);

await group('Born: exact zero, ordinary probability and a positive probability below 1e-16', () => {
  const basis = [[[1,0],[0,0]], [[0,0],[1,0]]];
  equal(M.born([[1,0],[0,0]], basis)[1].post, null, 'An exactly null branch has no conditioned state');
  for (const degrees of [1e-7, 60]) {
    const angle = degrees*Math.PI/360;
    const state = [[Math.cos(angle),0], [Math.sin(angle),0]];
    const expected = Math.sin(angle)**2;
    const branch = M.born(state,basis)[1];
    near(branch.probability/expected,1,1e-12);
    check(branch.post !== null, 'A positive representable probability must retain its conditioned state');
    near(branch.post[0][0],0); near(branch.post[1][0],1);
    const sequential = M.sequential(state,basis,basis);
    near(sequential[1][1]/expected,1,1e-12);
    equal(sequential[1][0],0);
  }
});

await group('Module 2: explicit data, distinct examples and specific conclusions', () => {
  const signatures = new Map();
  for (const section of bookTwo) for (let variant=0; variant<(section.id==='fase'?3:2); variant++) {
    const example = bookExample(section.mode,variant);
    const label = `${section.id}/${variant+1}`;
    const signature = JSON.stringify(example);
    check(!signatures.has(signature), `${label} duplicates ${signatures.get(signature)}`);
    signatures.set(signature,label);
    check(example.lead.trim().length>0, `${label} must declare its preparation or data`);
    check(!/Il risultato segue dai dati iniziali e dalle operazioni dichiarate/.test(example.conclusion), `${label} has the generic placeholder conclusion`);
    check(example.conclusion.trim().length>0, `${label} has no conclusion`);
    check(finiteNumbers(example)&&!/NaN|Infinity|undefined/.test(signature), `${label} contains a non-finite or absent result`);
  }
  equal(signatures.size,65);
  for(const [mode,inputs] of [
    ['matrici',['A','v']],['nucleo',['A','v']],['composizione',['A','B','v']],
    ['aggiunto',['A','u','v']],['funzioni-matrice',['A','v']],['tensore',['a','b']],
  ])for(const variant of [0,1]) {
    const example=bookExample(mode,variant);
    for(const input of inputs)check(new RegExp(`${input}\\s*=`).test(example.lead),`${mode}/${variant+1} declares ${input} before its calculations`);
  }
});

await group('Module 2: the matrix-function figure contains the actual result', () => {
  for (const [variant,expected] of [[0,[14,13]],[1,[26,22]]]) {
    const example = bookExample('funzioni-matrice',variant);
    const diagrams = [example.diagram,...(example.extraFigures||[])];
    const vectors = diagrams.flatMap(d=>d.vectors||[]);
    check(vectors.some(({v})=>v.length===2 && v.every((x,i)=>Math.abs(x-expected[i])<1e-10)), `A²v=${expected} is absent from the figures`);
  }
});

await group('Module 2: equal Z marginals can conceal different joint distributions', () => {
  const examples = [0,1].map(k=>bookExample('composti',k));
  const joint = examples.map(e=>e.diagram.kind==='grid'?e.diagram.values:probabilities(e.state||e.diagram.state));
  joint.forEach(p=>equal(p.length,4,'The joint Z distribution uses the order 00,01,10,11'));
  const marginals = joint.map(p=>[p[0]+p[1],p[2]+p[3],p[0]+p[2],p[1]+p[3]]);
  marginals[0].forEach((p,i)=>near(p,marginals[1][i]));
  check(joint[0].some((p,i)=>Math.abs(p-joint[1][i])>.1), 'The two joint distributions must differ');
});

await group('Module 2: binomial classes and concrete samples stay distinct', () => {
  const expectedCases=[[1/8,3/8,3/8,1/8],[81/256,108/256,54/256,12/256,1/256]];
  for(const variant of [0,1]) {
    const example=bookExample('frequenze',variant);
    const expected=expectedCases[variant];
    const diagrams=[example.diagram,...(example.extraFigures||[])];
    check(diagrams.some(diagram=>diagram.values?.length===expected.length&&diagram.values.every((p,i)=>Math.abs(p-expected[i])<1e-10)), 'Theoretical count distribution has n+1 classes with binomial weights');
    check(example.steps.some(step=>/sequenza|osservat|campion|raccolta/i.test(step.title)&&/[01]/.test(step.formula)), 'A concrete collection of trials must precede its observed frequency');
    check(/teoric/.test(textOf(example))&&/frequenza/.test(textOf(example)), 'Observed frequency and theoretical probability are explicitly distinguished');
  }
});

await group('Module 2: the aligned Born example exposes the certain and impossible outcomes', () => {
  const example=bookExample('born',1);
  const diagrams=[example.diagram,...(example.extraFigures||[])];
  check(diagrams.some(diagram=>diagram.values?.length===2&&Math.abs(diagram.values[0]-1)<1e-10&&Math.abs(diagram.values[1])<1e-10), 'The aligned example must draw P(+)=1, P(-)=0');
  check(/impossibile|ramo nullo|probabilità nulla/.test(textOf(example)), 'The null branch must not be normalized');
});

await group('Unknown-M search: one table schema, independently known successful trial', () => {
  for (const variant of [0,1]) {
    const table = exampleFour('ricerca-ignota',variant).table;
    check(table && table.rows.length>0, 'The search must expose its attempts');
    for (const row of table.rows) equal(row.length,table.headers.length,'All rows use the header schema');
    const column = expression => {
      const index = table.headers.findIndex(header=>expression.test(header));
      check(index>=0, `Missing table column ${expression}`);
      return index;
    };
    const outcome = column(/esito|candidato|^x$/i);
    const success = column(/verifica|soglia/i);
    const useful = column(/^P|probabilità/i);
    const cumulative = column(/cumulato/i);
    if (!variant) {
      const row = table.rows.find(row=>row[success]==='trovato');
      check(row, 'Preset with one marked item must display the successful attempt');
      equal(row[outcome],'5');
      near(numberIT(row[useful]),25/32,1e-8);
      equal(row[cumulative],'3');
    } else check(table.rows.every(row=>row[success]!=='trovato'), 'No-marked-item preset cannot succeed');
  }
});

await group('Shor: impossible c=63 is explicitly counterfactual, possible c=64 succeeds', () => {
  const impossible = exampleFour('shor-15',0,{outcome:63});
  const possible = exampleFour('shor-15',0,{outcome:64});
  check(impossible.diagram.values[63]<1e-24, 'Reference support for a=2 mod 15 consists of multiples of 64');
  check(/controfattuale|non (?:è |può essere )?(?:un )?esito|impossibile/i.test(impossible.conclusion), 'The conclusion must retain the impossible-branch caveat');
  check(!/^Fattori verificati:/.test(impossible.conclusion), 'Counterfactual post-processing is not an observed success');
  near(possible.diagram.values[64],1/4);
  check(/3/.test(possible.conclusion) && /5/.test(possible.conclusion), 'A supported successful branch still reports factors 3 and 5');
});

await group('Exact QPE: c=0 reports why no conditioned target exists', () => {
  const example = exampleFour('qpe-esatta',0,{outcome:0});
  check(example.diagram.values[0]<1e-24, 'phi=3/8 with three bits has support only at c=3');
  near(example.diagram.values[3],1);
  check(/impossibile|probabilità nulla|peso nullo|controfattuale/i.test(textOf(example)), 'A zero-probability selected outcome needs an explicit explanation');
  check(!example.steps.some(s=>/^Condizionare il bersaglio$/.test(s.title)), 'A null selected branch cannot be normalized');
});

await group('Discrete logarithm: Fourier constraints and derived candidates', () => {
  for (const [variant,prime,g,h,r,expected] of [[0,5,2,3,4,3],[1,7,3,2,6,2]]) {
    const example = exampleFour('logaritmo',variant);
    const rows = example.table.rows;
    const candidates = rows.map(row=>({u:Number(row[0]),v:Number(row[1]),candidates:row[3].split(',').map(Number)}));
    equal(rows.length,r);
    for (let j=0;j<r*r;j++) {
      const u=Math.floor(j/r),v=j%r;
      near(example.diagram.values[j],(expected*u+v)%r===0?1/r:0);
    }
    for (const row of candidates) equal(row.candidates,Array.from({length:r},(_,d)=>d).filter(d=>(d*row.u+row.v)%r===0));
    const chosen = candidates.filter(row=>row.u===2||row.u===3);
    const intersection = chosen.reduce((all,row)=>all.filter(d=>row.candidates.includes(d)),Array.from({length:r},(_,d)=>d));
    equal(intersection,[expected]);
    equal(g**intersection[0]%prime,h);
    const recovery = example.steps.filter(s=>/selezion|interse|ricav|risolv|candidati/i.test(s.title));
    check(recovery.length>=2, 'The worked derivation must link selected outcomes to candidate recovery');
    const selected=example.steps.find(step=>/selezion/i.test(step.title));
    for(const {u,v} of chosen)check(selected?.formula.includes(`(${u},${v})`),'The recovery uses the pairs explicitly selected in the worked example');
    check(!/La soluzione d=/.test(example.lead), 'The problem statement must not disclose a verification constant as its answer');
    check(new RegExp(`d\\s*=\\s*${expected}`).test(example.conclusion), 'The conclusion must identify the recovered candidate');
    const dual=example.extraFigures.find(diagram=>diagram.kind==='grid'&&/^u\b/.test(diagram.xLabel)&&/^v\b/.test(diagram.yLabel));
    check(dual,'The Fourier grid labels its horizontal coordinate u and vertical coordinate v');
    equal(dual.points.length,r);
    for(const point of dual.points){equal((expected*point.x+point.y)%r,0,'Each plotted (u,v) satisfies du+v=0');near(point.value,1/r);}
  }
});

const errors=[];
const virtualConsole=new VirtualConsole();
virtualConsole.on('jsdomError',error=>errors.push(error.message));
const css=fs.readFileSync(path.join(root,'src/course/book/book.css'),'utf8');
const dom=new JSDOM(`<!doctype html><html><head><style>${css}</style></head><body><div id="root"></div></body></html>`,{
  url:'https://audit.invalid/', runScripts:'outside-only', pretendToBeVisual:true, virtualConsole,
});
const w=dom.window;
const downloads=[];
const exportedBlobs=[];
w.URL.createObjectURL=blob=>{exportedBlobs.push(blob);return 'blob:audit-export';};
w.URL.revokeObjectURL=()=>{};
w.HTMLAnchorElement.prototype.click=function(){downloads.push({name:this.download,href:this.href});};
w.scrollTo=()=>{};
w.HTMLElement.prototype.scrollIntoView=()=>{};
w.addEventListener('error',event=>errors.push(event.message));
w.eval(application.outputFiles[0].text);
const tick=()=>new Promise(resolve=>setTimeout(resolve,35));
const current=()=>w.document.querySelector('.book-worked');
const buttons=()=>[...current().querySelectorAll('.book-step-controls button')];
const stateLabel=()=>current().querySelector('.book-step-controls span').textContent;
const assertCursor=()=>{
  const active=Number(current().getAttribute('data-active-snapshot'));
  const count=Number(current().getAttribute('data-snapshot-count'));
  check(Number.isInteger(active)&&Number.isInteger(count)&&count>0&&active>=0&&active<count,'Stored selection stays within the current snapshot sequence');
  equal(buttons()[0].disabled,active===0);
  equal(buttons()[1].disabled,active===count-1);
  return active;
};
const route=async(chapter,id)=>{w.location.hash=`#capitolo-${chapter}/${id}`;await tick();await tick();check(current(),`Route ${chapter}/${id} did not render`);};
const select=async value=>{const el=w.document.querySelector('.book-interactive-controls select');el.value=String(value);el.dispatchEvent(new w.Event('change',{bubbles:true}));await tick();};
const setInput=async(element,value)=>{
  check(element,'Input exists');
  Object.getOwnPropertyDescriptor(w.HTMLInputElement.prototype,'value').set.call(element,String(value));
  element.dispatchEvent(new w.Event('input',{bubbles:true}));
  element.dispatchEvent(new w.Event('change',{bubbles:true}));
  await tick();await tick();
};
const setIterations=value=>setInput(w.document.querySelector('input[aria-label="Numero di iterazioni"]'),value);
const advance=async count=>{for(let i=0;i<count;i++){buttons()[1].click();await tick();}};
const reset=async()=>{w.document.querySelector('.book-interactive-controls button').click();await tick();await tick();};
const visible=element=>{
  for(let node=element;node instanceof w.Element;node=node.parentElement) {
    if(node.hidden || node.getAttribute('aria-hidden')==='true')return false;
    const style=w.getComputedStyle(node);
    if(style.display==='none'||style.visibility==='hidden')return false;
    if(node.tagName==='DETAILS'&&!node.open&&!node.querySelector('summary')?.contains(element))return false;
  }
  return true;
};
const valuesOf=figure=>[...figure.querySelectorAll('rect title')].map(title=>numberIT(title.textContent.slice(title.textContent.lastIndexOf(':')+1).trim()));
await tick();await tick();

try {
  await group('React: internal resets and changing 17→1→17 snapshots keep controls coherent', async()=>{
    await route(4,'grover');
    const initial=stateLabel();
    await setIterations(8);await advance(16);
    equal(assertCursor(),16);
    check(buttons()[1].disabled && !buttons()[0].disabled,'Last snapshot disables only the forward button');
    await setIterations(0);
    equal(assertCursor(),0);
    equal(Number(current().getAttribute('data-snapshot-count')),1);
    equal(stateLabel(),initial);
    check(buttons().every(button=>button.disabled),'A one-snapshot example disables both state controls');
    await setIterations(8);
    equal(assertCursor(),0);
    equal(stateLabel(),initial);
    check(buttons()[0].disabled && !buttons()[1].disabled,'Increasing the sequence must not restore an obsolete index');
    for (const position of [0,2,16]) {
      await setIterations(8);await advance(position);await reset();
      equal(assertCursor(),0);
      equal(stateLabel(),initial,'Reset restores the preparation from initial, intermediate or final state');
      check(buttons()[0].disabled&&!buttons()[1].disabled,'Reset controls agree with the first snapshot');
      equal(w.document.querySelector('input[aria-label="Numero di iterazioni"]').value,'2');
    }
  });

  await group('React: shortening an evolution from 17 to 5 snapshots preserves a valid selected gate', async()=>{
    await route(3,'evoluzione');await select(1);await advance(16);await select(0);
    const gates=[...current().querySelectorAll('.book-circuit [role="button"]')];
    equal(gates.length,4);
    const selected=gates.map((gate,i)=>gate.querySelector('rect[stroke-width="3"]')?i+1:null).filter(x=>x!==null);
    check(selected.length<=1,'At most one gate may be selected');
    const active=selected[0]||0;
    equal(assertCursor(),active);
    equal(buttons()[0].disabled,active===0);
    equal(buttons()[1].disabled,active===4);
    if(active===0)check(/Preparazione/.test(stateLabel()),'No selected gate corresponds to the preparation');
    else check(/^R[xyz]/.test(stateLabel()),'A selected rotation must have a rotation snapshot');
    await reset();check(/Preparazione/.test(stateLabel()));
    equal(current().querySelectorAll('.book-circuit rect[stroke-width="3"]').length,0);
  });

  await group('React and screen CSS: all Deutsch, SWAP and Hadamard-test output marginals are visible', async()=>{
    for(const [chapter,id,count] of [[3,'deutsch',4],[4,'swap',3],[4,'hadamard-test',2]]) {
      await route(chapter,id);
      for(let variant=0;variant<count;variant++) {
        await select(variant);
        const example=chapter===3?exampleThree(id,variant):exampleFour(id,variant);
        const expected=marginalFirst(example.state);
        const figures=[...current().querySelectorAll('figure.book-bars')].filter(figure=>figure.querySelector('figcaption')?.textContent.includes(example.diagram.title)&&visible(figure));
        check(figures.length>0, `${id}/${variant}: the operational output is hidden by screen CSS`);
        const actual=valuesOf(figures[0]);equal(actual.length,2);
        actual.forEach((p,i)=>near(p,expected[i],1e-9));
      }
    }
  });

  await group('React: unknown-M success retains the same columns in the table and CSV', async()=>{
    await route(4,'ricerca-ignota');
    const details=current().querySelector('.book-data');
    details.open=true;
    const table=details.querySelector('table');
    check(visible(table),'The opened data table is visible');
    const rendered=[...table.querySelectorAll('tr')].map(row=>[...row.children].map(cell=>cell.textContent));
    const expected=exampleFour('ricerca-ignota',0).table;
    equal(rendered,[expected.headers,...expected.rows]);
    details.querySelector('button').click();await tick();
    check(downloads.at(-1)?.name.endsWith('.csv'),'The selected table is exported as CSV');
    const csv=await new Promise((resolve,reject)=>{
      const reader=new w.FileReader();reader.onload=()=>resolve(reader.result);reader.onerror=reject;reader.readAsText(exportedBlobs.at(-1));
    });
    const rows=String(csv).replace(/^\uFEFF/,'').trim().split('\n').map(row=>row.split(';').map(cell=>cell.replace(/^"|"$/g,'').replaceAll('""','"')));
    equal(rows,rendered,'CSV preserves the labels and values displayed in the table');
  });

  await group('React: circuit labels retain signed angles visually and accessibly', async()=>{
    await route(3,'inversa');
    const gates=[...current().querySelectorAll('.book-circuit [role="button"]')];
    for(const [index,angle] of [[1,'60'],[2,'-60']]) {
      const normalize=text=>text.replaceAll('−','-').replace(/\s/g,'');
      check(normalize(gates[index].getAttribute('aria-label')).includes(angle+'°'),'ARIA name must contain the signed phase angle');
      check(normalize(gates[index].textContent).includes(angle+'°'),'Visible gate must contain the signed phase angle');
    }
    gates[1].dispatchEvent(new w.KeyboardEvent('keydown',{key:' ',bubbles:true}));await tick();
    check(/60/.test(stateLabel()),'Keyboard gate selection still updates the snapshot');
    equal(current().querySelectorAll('.book-circuit rect[stroke-width="3"]').length,1);
  });

  await group('React: Grover current vector follows oracle signs and the diffusion', async()=>{
    await route(3,'grover-primo');
    const vector=()=>{
      const label=[...current().querySelectorAll('.book-geometry svg text')].find(node=>/^corrente\b/i.test(node.textContent.trim()));
      check(label,'The Grover figure must expose a current vector');
      const line=label.parentElement.querySelector('line');
      check(line,'The current vector has a line');
      return [Number(line.getAttribute('x2'))-Number(line.getAttribute('x1')),Number(line.getAttribute('y1'))-Number(line.getAttribute('y2'))];
    };
    const start=vector();
    const collective=()=>{
      const element=current().querySelector('[data-collective-bad][data-collective-good]');
      check(element,'Collective real amplitudes are available with the current figure');
      return [Number(element.getAttribute('data-collective-bad')),Number(element.getAttribute('data-collective-good'))];
    };
    collective().forEach((value,index)=>near(value,[Math.sqrt(3)/2,1/2][index]));
    check(start[0]>0&&start[1]>0,'The initial real amplitudes are positive');
    near(start[0]/start[1],Math.sqrt(3),1e-9);
    await advance(1);const oracle=vector();
    collective().forEach((value,index)=>near(value,[Math.sqrt(3)/2,-1/2][index]));
    near(oracle[0],start[0]);near(oracle[1],-start[1]);
    await advance(1);const reflected=vector();
    collective().forEach((value,index)=>near(value,[0,1][index]));
    near(reflected[0],0,1e-8);near(reflected[1],2*start[1],1e-8);
    const bars=[...current().querySelectorAll('.book-geometry .book-bars')].find(figure=>valuesOf(figure).length===4);
    check(bars,'The figure also exposes the current probabilities');
    valuesOf(bars).forEach((p,j)=>near(p,j===3?1:0));
    await route(4,'grover');await setIterations(4);await advance(8);
    const overshot=vector(),angle=9*Math.asin(1/Math.sqrt(8));
    collective().forEach((value,index)=>near(value,[Math.cos(angle),Math.sin(angle)][index]));
    check(overshot[0]<0&&overshot[1]<0,'Past the optimum, the vector keeps both negative amplitudes');
  });

  await group('React: a tiny positive Born branch is never called impossible', async()=>{
    await route(2,'born');
    const exploration=w.document.querySelector('.book-exploration');
    exploration.open=true;
    const labeledControl=labelText=>{
      const label=[...exploration.querySelectorAll('label')].find(label=>label.textContent===labelText);
      return label&&w.document.getElementById(label.htmlFor);
    };
    const field=labeledControl('Inclinazione θ sulla sfera');
    check(field,'The preparation angle field exists');
    field.focus();await tick();
    await setInput(field,1e-7);
    field.blur();await tick();
    near(Number(field.value)/1e-7,1,1e-9);
    check(!labeledControl('Fase relativa φ').disabled,'A small nonzero transverse amplitude still has a relative phase');
    const outcome=labeledControl('Esito del quale esaminare lo stato condizionato');
    check(outcome,'The conditioned-outcome selector exists');
    outcome.value='1';outcome.dispatchEvent(new w.Event('change',{bubbles:true}));await tick();
    check(!/impossibile|Probabilità zero: stato condizionato/.test(exploration.textContent),'A rounded tiny value is not physical impossibility');
    check(/Stato dopo l’esito selezionato/.test(exploration.textContent),'The conditioned state remains available');
  });
  await group('No React or jsdom runtime errors',()=>equal(errors,[]));
} finally { dom.window.close(); }

const report={
  status:results.every(result=>result.status==='PASS')?'PASS':'FAIL',checks,results,
  sourceBundles:'Both numerical model and full application compiled in memory from current sources',
  interactionScope:'React events, semantic content and SVG DOM in jsdom; book screen CSS checks display/visibility only. No browser layout, Canvas drawing, pointer/touch geometry, mobile, print or file:// validation.',
  browserInteractionTested:false,
};
console.log(JSON.stringify(report,null,2));
if(report.status!=='PASS')process.exitCode=1;
