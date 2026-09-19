import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
import vm from 'node:vm';
const data=JSON.parse(await fs.readFile(new URL('./views.json',import.meta.url),'utf8'));
const root=new URL('../../',import.meta.url),dist=new URL('dist/',root);
assert.equal(data.views.length,28);assert.equal(data.coverViews.length,3);
let steps=0,svg=0,links=0;
for(const v of data.views){
 assert.ok(v.html.includes(v.title),v.id+' titolo');
 assert.doesNotMatch(v.html,/(?:NaN|Infinity)/,v.id+' valori finiti');
 assert.doesNotMatch(v.html,/(?:href|src)="\//,v.id+' percorsi relativi');
 const pdf=v.chapter===1?'presentazione.pdf':'presentazione-2.pdf';
 assert.ok(v.html.includes('./'+pdf+'#page='),v.id+' slide');
 assert.ok(v.html.includes('./guida-corso.html#c'+v.chapter+'-'+v.id),v.id+' guida');
 links++;
 if(v.chapter===2){
  const n=[...v.demo.matchAll(/class="geo-step(?: selected)?"/g)].length;
  assert.ok(n>=5,v.id+' svolgimento');steps+=n;
  assert.ok(v.demo.includes('geo-caption')&&v.demo.includes('geo-scope'),v.id+' interpretazione');
 }
 svg+=(v.demo.match(/<svg\b/g)||[]).length;
}
assert.deepEqual(data.routing.old,data.views.filter(v=>v.chapter===1).map(v=>({chapter:1,demo:v.id})));
assert.deepEqual(data.routing.new,data.views.filter(v=>v.chapter===2).map(v=>({chapter:2,demo:v.id})));
assert.ok(data.coverViews[0].html.includes('To be done'));
for(const [name,chapter,scope] of [['index.html',0,0],['capitolo-1.html',1,0],['capitolo-2.html',2,0],['capitolo-1-autonomo.html',1,1],['capitolo-2-autonomo.html',2,2]]){
 const html=await fs.readFile(new URL(name,dist),'utf8');
 assert.ok(html.includes(`data-chapter="${chapter}" data-scope="${scope}"`));
 assert.match(html,/<html lang="it">/);
 assert.doesNotMatch(html,/<script\b[^>]*src\s*=|<link\b[^>]*rel="stylesheet"/i);
 new vm.Script(html.match(/<script>([\s\S]*?)<\/script>/)[1],{filename:name});
}
for(const [file,chapters] of [['guida-corso.html',[1,2]],['guida-capitolo-1.html',[1]],['guida-capitolo-2.html',[2]]]){
 const html=await fs.readFile(new URL(file,dist),'utf8'),expected=data.views.filter(v=>chapters.includes(v.chapter));
 assert.equal((html.match(/class="guide-demo"/g)||[]).length,expected.length);
 for(const v of expected)assert.ok(html.includes(`id="c${v.chapter}-${v.id}"`));
}
for(const file of ['presentazione.pdf','presentazione-2.pdf','Guida_corso.pdf','Guida_capitolo_1.pdf','Guida_capitolo_2.pdf']){
 const bytes=await fs.readFile(new URL(file,dist));assert.equal(bytes.subarray(0,5).toString(),'%PDF-');
 assert.ok(bytes.equals(await fs.readFile(new URL('public/'+file,root))));
}
for(const name of ['.nojekyll','GUIDA_DOCENTE_CORSO.md','VERIFICHE.md','COLLAUDO.md','LICENZE_COMPONENTI.txt'])await fs.access(new URL(name,dist));
const info=JSON.parse(await fs.readFile(new URL('verifica-generazione.json',dist),'utf8'));
assert.equal(info.externalJavaScriptImports,0);assert.equal(info.externalCssResources,0);
const report={status:'PASS',chapters:2,demonstrations:28,calculationSteps:steps,renderedSVG:svg,slideLinks:links,legacyRoutes:10,htmlEntrypoints:5,externalRuntimeResources:0,browserInteractionTested:false};
await fs.writeFile(new URL('./structure-results.json',import.meta.url),JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify(report));
