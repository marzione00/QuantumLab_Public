import fs from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {spawnSync} from 'node:child_process';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const output = path.join(root, 'dist');
// Elimina soltanto la cartella generata, per evitare risorse residue.
await fs.rm(output, {recursive: true, force: true});
const guides = spawnSync(process.execPath, [path.join(root, 'scripts/render-course.mjs')], {cwd:root,stdio:'inherit'});
if(guides.error)throw guides.error;
if(guides.status!==0)process.exit(guides.status??1);
const result = spawnSync(process.execPath, [path.join(root, 'scripts/export-offline.mjs'), output], {
  cwd: root, stdio: 'inherit'
});
if (result.error) throw result.error;
if (result.status !== 0) process.exit(result.status ?? 1);
await fs.writeFile(path.join(output, '.nojekyll'), '');
console.log('Sito pronto in dist/index.html — Corso completo: GitHub Pages e uso locale.');
