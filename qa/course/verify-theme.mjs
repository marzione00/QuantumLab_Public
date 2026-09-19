// Theme/export checks. These are not interactive browser tests.
import fs from 'node:fs';import path from 'node:path';import assert from 'node:assert/strict';import {build} from 'esbuild';import {createRequire} from 'node:module';
const root=path.resolve(path.dirname(new URL(import.meta.url).pathname),'../..'),src=path.join(root,'src');
const palette=JSON.parse(fs.readFileSync(path.join(src,'course/matrix-palette.json'),'utf8'));
const css=fs.readFileSync(path.join(root,'dist/index.html'),'utf8').match(/<style>([\s\S]*?)<\/style>/)[1];
let checks=0;for(const token of new Set([...css.matchAll(/var\(--mq-([a-z-]+)\)/g)].map(m=>m[1]))){assert.ok(palette.screen[token]&&palette.print[token],token);checks++;}
for(const mode of ['screen','print'])for(const [name,color] of Object.entries(palette[mode])){assert.match(color,/^#[0-9a-f]{6}$/);assert.ok([...css.matchAll(new RegExp('--mq-'+name+':\\s*(#[0-9a-f]+)','g'))].some(m=>(m[1].length===4?'#'+m[1].slice(1).split('').map(x=>x+x).join(''):m[1])===color),mode+' '+name);checks++;}
const views=JSON.parse(fs.readFileSync(path.join(root,'qa/course/views.json'),'utf8'));
for(const view of views.views){assert.doesNotMatch(view.demo,/matrix-rain/);for(const token of view.demo.matchAll(/var\(--mq-([a-z-]+)\)/g)){assert.ok(palette.screen[token[1]],view.id+' '+token[1]);checks++;}}
for(const cover of views.coverViews){assert.match(cover.html,/class="matrix-rain" aria-hidden="true"/);checks++;}
assert.match(css,/@media print/);assert.match(css,/prefers-reduced-motion/);checks+=2;
for(const name of ['index.html','capitolo-1.html','capitolo-2.html','guida-corso.html','guida-capitolo-1.html','guida-capitolo-2.html']){const html=fs.readFileSync(path.join(root,'dist',name),'utf8');assert.match(html,/--mq-bg:\s*#070e0b/);assert.match(html,/--mq-bg:\s*#fff(?:fff)?[;\s]/);checks+=2;}
const target=path.join(root,'qa/course/theme-runtime.cjs');await build({entryPoints:[path.join(src,'lib/theme.ts')],bundle:true,platform:'node',format:'cjs',outfile:target,logLevel:'silent'});const {canvasColor,rgb}=createRequire(import.meta.url)(target);
for(const mode of ['screen','print']){globalThis.getComputedStyle=()=>({getPropertyValue:key=>palette[mode][key.replace('--mq-','')]||''});for(const [name,hex] of Object.entries(palette[mode])){assert.equal(canvasColor('var(--mq-'+name+')',{}),hex);assert.deepEqual(rgb(hex),[1,3,5].map(i=>parseInt(hex.slice(i,i+2),16)));checks+=2;}}
fs.unlinkSync(target);delete globalThis.getComputedStyle;
for(const name of ['ISTRUZIONI_PER_NUOVI_MODULI.md','AGENTS.md'])assert.equal(fs.readFileSync(path.join(root,'dist',name),'utf8'),fs.readFileSync(path.join(root,name),'utf8'));checks+=2;
const report={status:'PASS',checks,demonstrations:views.views.length,coverOnlyDecoration:true,screenAndPrintPalette:true,canvasTokenResolution:true,instructionsCopied:true,browserInteractionTested:false};fs.writeFileSync(path.join(root,'qa/course/theme-results.json'),JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify(report));
