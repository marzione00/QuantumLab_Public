/** Emit a simple external link; never installs or edits the parent site. */
import fs from 'node:fs';import {httpsUrl} from './config.mjs';
const input=process.argv[2];if(!input){console.error('Uso: npm run site:link -- https://UTENTE.github.io/NOME-REPOSITORY/ [file.html]');process.exit(1);}
const url=httpsUrl(input,'URL del laboratorio',{directory:true});
const html=`<!-- Quantum Lab: repository autonoma. Nessun iframe o asset copiato nel sito principale. -->\n<a class="button" href="${url}#indice">Apri Quantum Lab ↗</a>\n`;
if(process.argv[3])fs.writeFileSync(process.argv[3],html);else console.log(html);
