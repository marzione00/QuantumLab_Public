/** Optional maintenance rebuild: requires the archived React/esbuild dependencies, never downloaded automatically. */
import fs from 'node:fs';import path from 'node:path';import {fileURLToPath} from 'node:url';import {createRequire} from 'node:module';import {createHash} from 'node:crypto';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..'),archive=path.join(root,'archive');
if(!process.argv.includes('--accept')){console.error('Ricompilazione facoltativa: installare le dipendenze di archive/package.json, poi usare --accept. Dopo la modifica rieseguire controlli numerici e browser. La build ordinaria non richiede questa operazione.');process.exitCode=2;}else{
 try{
  const require=createRequire(path.join(archive,'package.json'));const {build}=require('esbuild');
  const entry=`import React from 'react';import {createRoot} from 'react-dom/client';import {RenderLesson,lists,partsByChapter} from './src/course/registry';import {AssetsContext} from './src/course/shared';globalThis.QuantumLegacy={React,createRoot,RenderLesson,AssetsContext,lists,parts:partsByChapter};`;
  const out=await build({stdin:{contents:entry,resolveDir:archive,loader:'tsx'},bundle:true,minify:true,write:false,platform:'browser',format:'iife',jsx:'automatic',target:['es2022'],tsconfig:path.join(archive,'tsconfig.json'),legalComments:'inline'});
  const js=out.outputFiles[0].contents,hash=createHash('sha256').update(js).digest('hex'),originFile=path.join(root,'vendor/origin.json'),origin=JSON.parse(fs.readFileSync(originFile));
  fs.writeFileSync(path.join(root,'vendor/legacy-runtime.js'),js);origin.adaptedRuntimeSha256=hash;origin.runtimeAdaptation='Recompiled from the archived TS/TSX sources through the explicit registry-only entrypoint. Re-run all numerical and browser checks.';fs.writeFileSync(originFile,JSON.stringify(origin,null,2)+'\n');
  console.log('Runtime ricompilato. CSS preservato. Eseguire npm run check, npm run test:legacy e npm run test:browser prima di distribuire.');
 }catch(e){console.error('Ricompilazione non eseguita: '+e.message);process.exitCode=1;}
}
