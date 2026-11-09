import assert from 'node:assert/strict';import fs from 'node:fs';import path from 'node:path';import vm from 'node:vm';import {spawnSync} from 'node:child_process';import {createHash} from 'node:crypto';
const root=new URL('../',import.meta.url),dist=new URL('dist/',root);let checks=0;const ok=(v,m)=>{assert.ok(v,m);checks++;};
const read=p=>fs.readFileSync(new URL(p,root),'utf8');const sha=b=>createHash('sha256').update(b).digest('hex');
const html=read('dist/index.html');
ok(!html.includes('{{'),'all template tokens resolved');ok(html.includes('Content-Security-Policy'),'CSP delivered');ok(html.includes("connect-src 'none'"),'no remote simulation');ok(!html.includes('integration-config'),'old integration removed');
for(const name of ['app.js','models.js','ambient.js']){new vm.Script(read('src/'+name),{filename:name});checks++;}
for(const match of html.matchAll(/(?:src|href)="(\.\/[^"#]+)"/g))ok(fs.existsSync(new URL(match[1],dist)),'asset exists '+match[1]);
const manifest=JSON.parse(read('dist/manifest-sha256.json'));for(const [f,h]of Object.entries(manifest)){const buffer=fs.readFileSync(new URL(f,dist));ok(sha(buffer)===h,'SHA256 '+f);ok(!/\.(pdf|woff2?|ttf|otf|zip)$/i.test(f),'no fonts/slides/archives '+f);}
ok(read('LICENSE').includes('CC-BY-SA-4.0'),'explicit original material license');ok(read('THIRD_PARTY_NOTICES.md').includes('React'),'third-party notice');ok(sha(fs.readFileSync(new URL('vendor/LICENZE_COMPONENTI.txt',root)))===sha(fs.readFileSync(new URL('dist/LICENZE_COMPONENTI.txt',root))),'third-party licenses identical');
const wf=read('.github/workflows/pages.yml');ok(wf.includes('needs: verify-build'),'deploy gated by tests');ok(wf.includes('persist-credentials: false'),'read-only checkout credentials');ok(wf.includes('path: dist'),'only public distribution uploaded');ok(!wf.includes('pull_request_target'),'no privileged PR build');ok(!fs.existsSync(new URL('integration/install.mjs',root)),'no installer into main site');
// Rebuild in a different deployment path, then restore exactly the original environment.
const before=read('dist/manifest-sha256.json');let p=spawnSync(process.execPath,['scripts/build.mjs'],{cwd:root,env:{...process.env,SITE_URL:'https://example.org/a-different-repository/'},encoding:'utf8'});ok(p.status===0,'alternate base build');
const alternate=read('dist/index.html');ok(alternate.includes('https://example.org/a-different-repository/'),'correct canonical');ok(alternate.includes('index,follow'),'production indexing');ok(!alternate.includes('src="/assets'),'no absolute root assets');
p=spawnSync(process.execPath,['scripts/build.mjs'],{cwd:root,encoding:'utf8'});ok(p.status===0,'restore build');ok(read('dist/manifest-sha256.json')===before,'byte-reproducible build');
const report={status:'PASS',checks,assets:Object.keys(manifest).length,productionPathTested:'/a-different-repository/'};fs.writeFileSync(new URL('qa/distribution.json',root),JSON.stringify(report,null,2));console.log('Distribution',report);
