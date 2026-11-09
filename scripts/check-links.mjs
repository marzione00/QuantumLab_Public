/** Optional live link audit; deliberately separate from the reproducible offline build. */
import fs from 'node:fs';import {configuration} from './config.mjs';
const root=new URL('../',import.meta.url);const cfg=configuration(JSON.parse(fs.readFileSync(new URL('config/site.json',root))),JSON.parse(fs.readFileSync(new URL('content/catalogue.json',root))),process.env);
const urls=[...new Set([cfg.siteHome,cfg.teaching,cfg.course,...Object.values(cfg.slides).map(s=>s.href)])];
let failures=0;const results=[];
for(const url of urls){try{let response=await fetch(url,{method:'HEAD',redirect:'follow',signal:AbortSignal.timeout(15000)});if(response.status===405){response=await fetch(url,{headers:{Range:'bytes=0-0'},signal:AbortSignal.timeout(15000)});response.body?.cancel();}const ok=response.ok;results.push({url,status:response.status,ok});if(!ok)failures++;console.log(response.status,url);}catch(e){failures++;results.push({url,ok:false,error:e.message});console.error('NON VERIFICATO',url,e.message);}}
fs.mkdirSync(new URL('qa/',root),{recursive:true});fs.writeFileSync(new URL('qa/external-links.json',root),JSON.stringify({checkedAt:new Date().toISOString(),failures,results},null,2));process.exitCode=failures?1:0;
