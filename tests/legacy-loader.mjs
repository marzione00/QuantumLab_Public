/** Optional audit loader: transpiles untouched archived TS using TypeScript. */
import fs from 'node:fs';import path from 'node:path';import {createRequire} from 'node:module';import {fileURLToPath,pathToFileURL} from 'node:url';
const require=createRequire(import.meta.url);let ts;
try{ts=require('typescript');}catch{const globalPath=path.resolve(path.dirname(process.execPath),'../lib/node_modules/typescript/lib/typescript.js');if(!fs.existsSync(globalPath))throw Error('Per i test storici installare TypeScript; non serve alla build ordinaria.');ts=require(globalPath);}
export async function resolve(spec,ctx,next){
 if(spec==='react')return {url:new URL('./legacy-react.mjs',import.meta.url).href,shortCircuit:true};
 try{return await next(spec,ctx);}catch(e){if(spec.startsWith('.')&&ctx.parentURL){for(const end of ['.ts','.tsx','.json','/index.ts','/index.tsx']){const url=new URL(spec+end,ctx.parentURL);if(fs.existsSync(fileURLToPath(url)))return {url:url.href,shortCircuit:true};}}throw e;}
}
export async function load(url,ctx,next){
 if(/\.tsx?$/.test(url)){const input=fs.readFileSync(fileURLToPath(url),'utf8');return {format:'module',source:ts.transpileModule(input,{compilerOptions:{target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.ESNext,jsx:ts.JsxEmit.React,esModuleInterop:true}}).outputText,shortCircuit:true};}
 if(url.endsWith('.json'))return {format:'module',source:'export default '+fs.readFileSync(fileURLToPath(url),'utf8')+';',shortCircuit:true};
 return next(url,ctx);
}
