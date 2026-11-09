/** Review-only monofile; production assets retain lazy loading. */
import fs from 'node:fs';import path from 'node:path';import {fileURLToPath} from 'node:url';import {createHash} from 'node:crypto';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..'),dist=path.join(root,'dist');
const output=process.argv[2]||path.join(root,'QuantumLab_anteprima.html');
const safe=s=>s.replace(/<\/script/gi,'<\\/script');
const scripts=[fs.readFileSync(path.join(dist,'site-config.js'),'utf8')+'\nglobalThis.QuantumLabConfig.inlineLicense='+JSON.stringify(fs.readFileSync(path.join(root,'vendor/LICENZE_COMPONENTI.txt'),'utf8'))+';',...['catalogue.js','models.js','legacy-runtime.js','ambient.js','app.js'].map(f=>fs.readFileSync(path.join(dist,'assets',f),'utf8'))].map(safe);
const hashes=scripts.map(s=>"'sha256-"+createHash('sha256').update(s).digest('base64')+"'").join(' ');
const policy=`default-src 'none'; script-src ${hashes}; style-src 'unsafe-inline'; img-src data: blob:; connect-src 'none'; font-src 'none'; object-src 'none'; base-uri 'none'; form-action 'none'`;
const css=['legacy.css','lab.css'].map(f=>fs.readFileSync(path.join(dist,'assets',f),'utf8')).join('\n');
fs.writeFileSync(output,`<!doctype html><html lang="it"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex"><meta http-equiv="Content-Security-Policy" content="${policy}"><title>Quantum Lab 5.1 · Anteprima</title><style id="ql-css">${css}</style></head><body><noscript>Quantum Lab richiede JavaScript per eseguire i calcoli locali.</noscript>${scripts.map(s=>'<script>'+s+'</script>').join('\n')}</body></html>`);
console.log(`Anteprima: ${output}`);
