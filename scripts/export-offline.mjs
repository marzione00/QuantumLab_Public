// Generatore HTML autonomo per GitHub Pages e uso locale.
import fs from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {createRequire} from 'node:module';
import {createHash} from 'node:crypto';
import vm from 'node:vm';

const project=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const exists=async p=>fs.access(p).then(()=>true,()=>false);
const root=await exists(path.join(project,'src/app/page.tsx'))?path.join(project,'src'):project;
const output=path.resolve(process.argv[2]||path.join(project,'dist-offline'));
const require=createRequire(path.join(project,'package.json'));
let esbuild;
try{esbuild=await import(require.resolve('esbuild'));}
catch{esbuild=await import(path.join(project,'node_modules/.pnpm/esbuild@0.25.12/node_modules/esbuild/lib/main.js'));}
const tailwindPath=require.resolve('@tailwindcss/postcss');
const tailwind=(await import(tailwindPath)).default;
const postcss=createRequire(tailwindPath)('postcss');

const replacements={
 'components/ui/sidebar.tsx':[['document.cookie = `${SIDEBAR_COOKIE_NAME}=${openState}; path=/; max-age=${SIDEBAR_COOKIE_MAX_AGE}`','// La versione locale non utilizza cookie.']]
};
const bundle=await esbuild.build({
 absWorkingDir:root,
 stdin:{contents:"import React from 'react';import {createRoot} from 'react-dom/client';import Home from './app/page';createRoot(document.getElementById('root')!).render(<Home initialChapter={Number(document.body.dataset.chapter||0) as 0|1|2} scope={Number(document.body.dataset.scope||0) as 0|1|2}/>);",resolveDir:root,sourcefile:'offline-entry.tsx',loader:'tsx'},
 bundle:true,platform:'browser',format:'iife',jsx:'automatic',target:['es2020'],
 alias:{'@':root},define:{'process.env.NODE_ENV':'"production"'},
 minify:true,legalComments:'inline',write:false,metafile:true,
 plugins:[{name:'adattamenti-locali',setup(builder){
  builder.onLoad({filter:/[\\/](app[\\/]page|components[\\/]lab-notebook|components[\\/]ui[\\/]sidebar)\.tsx$/},async args=>{
   const rel=path.relative(root,args.path).split(path.sep).join('/');let contents=await fs.readFile(args.path,'utf8');
   for(const [before,after] of replacements[rel]||[]){if(!contents.includes(before))throw new Error('Adattamento assente: '+rel);contents=contents.replace(before,after);}
   return {contents,loader:'tsx',resolveDir:path.dirname(args.path)};
  });
 }}]
});
const js=bundle.outputFiles[0].text;new vm.Script(js,{filename:'quantum-lab-01.js'});
const cssPath=path.join(root,'app/globals.css');
const css=(await postcss([tailwind({base:root})]).process(await fs.readFile(cssPath,'utf8'),{from:cssPath})).css;
if(/@import\s|url\(/i.test(css))throw new Error('Risorse CSS esterne da incorporare.');
const imports=Object.values(bundle.metafile.outputs).flatMap(o=>o.imports);
if(imports.length)throw new Error('Import JavaScript esterni.');
if(!js.includes('presentazione-2.pdf'))throw new Error('PDF del capitolo 2 assente.');
const icon=await fs.readFile(path.join(project,'public/favicon.svg'));
const html=`<!doctype html>
<html lang="it"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="description" content="Quantum e post-quantum computing: due capitoli e 28 dimostrazioni interattive, con interpretazione geometrica e calcoli svolti.">
<title>Quantum e post-quantum computing — Laboratorio interattivo</title><link rel="icon" href="data:image/svg+xml;base64,${icon.toString('base64')}">
<style>${css.replace(/<\/style/gi,'<\\/style')}</style></head><body>
<noscript><p>Per usare i laboratori occorre abilitare JavaScript nel browser.</p></noscript><div id="root"></div>
<script>${js.replace(/<\/script/gi,'<\\/script')}</script></body></html>\n`;
await fs.mkdir(output,{recursive:true});
for(const [name,chapter,scope] of [['index.html',0,0],['capitolo-1.html',1,0],['capitolo-2.html',2,0],['capitolo-1-autonomo.html',1,1],['capitolo-2-autonomo.html',2,2]])await fs.writeFile(path.join(output,name),html.replace('<body>',`<body data-chapter="${chapter}" data-scope="${scope}">`));
await fs.copyFile(path.join(project,'public/presentazione.pdf'),path.join(output,'presentazione.pdf'));
const notices=[],packages=new Map(),localInputs=[];
for(const input of Object.keys(bundle.metafile.inputs)){
 if(input==='offline-entry.tsx')continue;
 const absolute=path.resolve(root,input);
 if(!input.includes('node_modules/')){localInputs.push(path.relative(root,absolute));continue;}
 let dir=path.dirname(absolute);
 while(path.dirname(dir)!==dir){
  if(await exists(path.join(dir,'package.json'))){
   const meta=JSON.parse(await fs.readFile(path.join(dir,'package.json'),'utf8'));
   if(!packages.has(meta.name)){
    const names=(await fs.readdir(dir)).filter(f=>/^(license|licence|copying|notice)(\.|$)/i.test(f)),texts=[];
    for(const f of names)if((await fs.stat(path.join(dir,f))).isFile())texts.push(await fs.readFile(path.join(dir,f),'utf8'));
    packages.set(meta.name,meta.version);notices.push(`${meta.name} ${meta.version}\n${'='.repeat(60)}\n${texts.join('\n\n')||'Licenza dichiarata: '+meta.license}`);
   }break;
  }dir=path.dirname(dir);
 }
}
await fs.writeFile(path.join(output,'LICENZE_COMPONENTI.txt'),notices.join('\n\n\n'));
for(const [source,target] of [['ISTRUZIONI_PER_NUOVI_MODULI.md','ISTRUZIONI_PER_NUOVI_MODULI.md'],['AGENTS.md','AGENTS.md'],['docs/LEGGIMI_LOCALE.txt','LEGGIMI.txt'],['docs/MODELLI.md','MODELLI.md'],['public/guida-studenti.html','guida-studenti.html'],['public/Guida_studenti.pdf','Guida_studenti.pdf'],['docs/GUIDA_DOCENTE.md','GUIDA_DOCENTE.md'],['public/presentazione-2.pdf','presentazione-2.pdf'],['public/guida-corso.html','guida-corso.html'],['public/guida-capitolo-1.html','guida-capitolo-1.html'],['public/guida-capitolo-2.html','guida-capitolo-2.html'],['public/Guida_corso.pdf','Guida_corso.pdf'],['public/Guida_capitolo_1.pdf','Guida_capitolo_1.pdf'],['public/Guida_capitolo_2.pdf','Guida_capitolo_2.pdf'],['docs/corso/GUIDA_DOCENTE.md','GUIDA_DOCENTE_CORSO.md'],['docs/corso/VERIFICHE.md','VERIFICHE.md'],['docs/corso/COLLAUDO.md','COLLAUDO.md'],['docs/corso/REVISIONE_COMPLETA.md','REVISIONE_COMPLETA.md']]){
 if(await exists(path.join(project,source)))await fs.copyFile(path.join(project,source),path.join(output,target));
}
const verification={bytes:Buffer.byteLength(html),sha256:createHash('sha256').update(html).digest('hex'),externalJavaScriptImports:imports.length,externalCssResources:0,bundledModules:Object.keys(bundle.metafile.inputs).length,packages:Object.fromEntries(packages),localInputs:localInputs.sort()};
await fs.writeFile(path.join(output,'verifica-generazione.json'),JSON.stringify(verification,null,2)+'\n');
console.log(JSON.stringify({output,htmlBytes:verification.bytes,modules:verification.bundledModules,externalResources:0}));
