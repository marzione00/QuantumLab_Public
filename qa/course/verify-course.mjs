import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
import vm from 'node:vm';
const data=JSON.parse(await fs.readFile(new URL('./views.json',import.meta.url),'utf8'));
const root=new URL('../../',import.meta.url),dist=new URL('dist/',root);
const chapters=[1,2,3,4],expectedCounts=[10,32,14,25],pageCounts=[513,514,419,826];
assert.equal(data.views.length,81);assert.equal(data.coverViews.length,5);
let steps=0,svg=0,links=0,examples=0;
for(const c of chapters)assert.equal(data.views.filter(v=>v.chapter===c).length,expectedCounts[c-1]);
for(const v of data.views){
 assert.ok(v.html.includes(v.title),v.id+' titolo');
 assert.doesNotMatch(v.html,/(?:NaN|Infinity)/,v.id+' valori finiti');
 assert.doesNotMatch(v.html,/(?:href|src)="\//,v.id+' percorsi relativi');
 const pdf=v.chapter===1?'presentazione.pdf':'presentazione-'+v.chapter+'.pdf';
 assert.ok(v.html.includes('./'+pdf+'#page='),v.id+' slide');
 assert.ok(v.html.includes('./guida-corso.html#c'+v.chapter+'-'+v.id),v.id+' guida');
 for(const page of v.pages)assert.ok(Number.isInteger(page)&&page>0&&page<=pageCounts[v.chapter-1],v.id+' pagina valida');
 links++;
 if(v.chapter>=2){
  const n=[...v.demo.matchAll(/class="geo-step(?: selected)?"/g)].length;
  const count=[...v.demo.matchAll(/class="book-worked"/g)].length;
  assert.ok(n>=5,v.id+' svolgimento');steps+=n;
  assert.ok(count>=2,v.id+' esempi');examples+=count;
  assert.ok(v.demo.includes('geo-caption')&&v.demo.includes('geo-scope'),v.id+' interpretazione');
  assert.ok(v.demo.includes('book-theory')&&v.demo.includes('book-bridge'),v.id+' progressione');
 }
 svg+=(v.demo.match(/<svg\b/g)||[]).length;
}
assert.equal(examples,146);
assert.deepEqual(data.routing.old,data.views.filter(v=>v.chapter===1).map(v=>({chapter:1,demo:v.id})));
assert.deepEqual(data.routing.new,data.views.map(v=>({chapter:v.chapter,demo:v.id})));
for(const cover of data.coverViews)assert.doesNotMatch(cover.html,/To be done/);
const entries=[['index.html',0,0],...chapters.flatMap(c=>[['capitolo-'+c+'.html',c,0],['capitolo-'+c+'-autonomo.html',c,c]])];
for(const [name,chapter,scope] of entries){
 const html=await fs.readFile(new URL(name,dist),'utf8');
 assert.ok(html.includes('data-chapter="'+chapter+'" data-scope="'+scope+'"'));
 assert.match(html,/<html lang="it">/);
 assert.doesNotMatch(html,/<script\b[^>]*src\s*=|<link\b[^>]*rel="stylesheet"/i);
 new vm.Script(html.match(/<script>([\s\S]*?)<\/script>/)[1],{filename:name});
}
for(const [file,chosen] of [['guida-corso.html',chapters],...chapters.map(c=>['guida-capitolo-'+c+'.html',[c]])]){
 const html=await fs.readFile(new URL(file,dist),'utf8'),expected=data.views.filter(v=>chosen.includes(v.chapter));
 assert.equal((html.match(/class="guide-demo"/g)||[]).length,expected.length);
 for(const v of expected)assert.ok(html.includes('id="c'+v.chapter+'-'+v.id+'"'));
}
for(const file of ['Guida_corso.pdf',...chapters.flatMap(c=>[c===1?'presentazione.pdf':'presentazione-'+c+'.pdf','Guida_capitolo_'+c+'.pdf'])]){
 const bytes=await fs.readFile(new URL(file,dist));assert.equal(bytes.subarray(0,5).toString(),'%PDF-');
 assert.ok(bytes.equals(await fs.readFile(new URL('public/'+file,root))));
}
for(const name of ['.nojekyll','GUIDA_DOCENTE_CORSO.md','VERIFICHE.md','COLLAUDO.md','LICENZE_COMPONENTI.txt'])await fs.access(new URL(name,dist));
const info=JSON.parse(await fs.readFile(new URL('verifica-generazione.json',dist),'utf8'));
assert.equal(info.externalJavaScriptImports,0);assert.equal(info.externalCssResources,0);
const report={status:'PASS',chapters:4,demonstrations:81,workedExamples:examples,calculationSteps:steps,renderedSVG:svg,slideLinks:links,legacyRoutes:10,htmlEntrypoints:9,externalRuntimeResources:0,browserInteractionTested:false};
await fs.writeFile(new URL('./structure-results.json',import.meta.url),JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify(report));
