import assert from 'node:assert/strict';import fs from 'node:fs';import {configuration,httpsUrl,relativePath} from '../scripts/config.mjs';
const root=new URL('../',import.meta.url),raw=JSON.parse(fs.readFileSync(new URL('config/site.json',root))),data=JSON.parse(fs.readFileSync(new URL('content/catalogue.json',root)));let checks=0;
const ok=(v,m)=>{assert.ok(v,m);checks++;};const bad=fn=>{assert.throws(fn);checks++;};
const c=configuration(raw,data,{});ok(c.standalone&&c.connected,'independent linked app');ok(Object.keys(c.slides).length===7,'seven material links');ok(Object.values(c.slides).every(s=>s.href===c.course&&s.reviewRequired),'no unsupported PDF page links');
for(const url of ['https://example.org/my-repo/','https://example.org/','https://user.github.io/another-repo/']){const conf=configuration({...raw,siteUrl:url},data,{});ok(conf.siteUrl===url,'any repository path');}
const d=configuration({...raw,slideLinks:'direct'},data,{});ok(Object.values(d.slides).every(s=>s.href.endsWith('.pdf')),'optional canonical PDFs');
for(const url of ['javascript:alert(1)','http://example.org/','https://u:p@example.org/','https://example.org/?x=1','https://example.org/#fragment','https://example.org/"<tag>','/relative',' https://example.org/'])bad(()=>httpsUrl(url,'test'));
for(const p of ['../escape','/absolute','a/../escape','https://other.org','a\\b','a#id','a?x'])bad(()=>relativePath(p,'test'));
for(const [name,value] of [['schemaVersion',2],['slideLinks','unknown'],['license',{id:'MIT'}],['ambient',{defaultMode:'flashing',maxFramesPerSecond:20}],['ambient',{defaultMode:'animated',maxFramesPerSecond:1000}]])bad(()=>configuration({...raw,[name]:value},data,{}));
ok(configuration(raw,data,{SITE_URL:'https://example.org/new-name/',MAIN_SITE_URL:'https://main.example/'}).siteHome==='https://main.example/','environment overrides');
const report={status:'PASS',checks};fs.mkdirSync(new URL('qa/',root),{recursive:true});fs.writeFileSync(new URL('qa/config.json',root),JSON.stringify(report,null,2));console.log('Configuration',report);
