import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import vm from 'node:vm';
import {createRequire} from 'node:module';
import {fileURLToPath} from 'node:url';
import {build} from 'esbuild';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dist = path.join(root, 'dist');
const html = await fs.readFile(path.join(dist, 'index.html'), 'utf8');
assert.match(html, /<title>Quantum e post-quantum computing Lab 01<\/title>/);
assert.match(html, /<html lang="it">/);
assert.doesNotMatch(html, /<script\b[^>]*\bsrc\s*=/i, 'Script esterni');
assert.doesNotMatch(html, /<link\b[^>]*rel="stylesheet"/i, 'CSS esterno');
const script = html.match(/<script>([\s\S]*?)<\/script>/)?.[1];
assert.ok(script, 'Bundle assente');
new vm.Script(script, {filename: 'index.html'});
const info = JSON.parse(await fs.readFile(path.join(dist, 'verifica-generazione.json'), 'utf8'));
assert.equal(info.externalJavaScriptImports, 0);
assert.equal(info.externalCssResources, 0);
const pdf = await fs.readFile(path.join(dist, 'presentazione.pdf'));
assert.equal(pdf.subarray(0, 5).toString(), '%PDF-');
assert.ok(pdf.equals(await fs.readFile(path.join(root, 'public/presentazione.pdf'))));
await fs.access(path.join(dist, '.nojekyll'));
for(const file of ['guida-studenti.html','Guida_studenti.pdf','GUIDA_DOCENTE.md'])await fs.access(path.join(dist,file));
const guide=await fs.readFile(path.join(dist,'guida-studenti.html'),'utf8');
assert.equal([...guide.matchAll(/class="lab" id=/g)].length,10);
assert.equal([...guide.matchAll(/href="\.\/index.html#/g)].length,10);

// Rendering dei dieci laboratori senza un browser: controlla contenuti e link
// effettivi, mentre i test dei modelli verificano le trasformazioni numeriche.
const rendered = path.join(root, 'qa/rendered');
await fs.mkdir(rendered, {recursive: true});
const entry = path.join(rendered, 'static-check.cjs');
await build({
  stdin: {contents: `import React from 'react';
    import {renderToStaticMarkup} from 'react-dom/server';
    import Home, {chapters} from './app/page';
    export const views = chapters.map((chapter,i) => ({id:chapter.id,
      title:chapter.title, html:renderToStaticMarkup(<Home initialLab={i}/>)}));`,
    resolveDir: path.join(root, 'src'), loader: 'tsx'},
  bundle: true, platform: 'node', format: 'cjs', jsx: 'automatic',
  alias: {'@': path.join(root, 'src')},
  external: ['react', 'react-dom', 'react-dom/server', 'react/jsx-runtime'],
  outfile: entry, logLevel: 'silent'
});
const require = createRequire(import.meta.url);
const {views} = require(entry);
assert.equal(views.length, 10);
let links = 0;
for (const view of views) {
  assert.ok(view.html.includes(view.title), `Titolo: ${view.id}`);
  assert.ok(view.html.includes('Quantum e'));
  assert.doesNotMatch(view.html, /(?:href|src)="\//, `Percorso assoluto: ${view.id}`);
  const pdfLinks = [...view.html.matchAll(/href="(\.\/presentazione\.pdf#page=\d+)"/g)];
  assert.ok(pdfLinks.length, `Link alle slide: ${view.id}`);
  for (const [, link] of pdfLinks) {
    for (const base of ['https://example.github.io/quantum-e-post-quantum-computing-lab-01/',
                        'https://example.github.io/', 'file:///corso/dist/index.html']) {
      const resolved = new URL(link, base);
      const directory = new URL('.', base);
      assert.equal(resolved.pathname, directory.pathname + 'presentazione.pdf');
      assert.match(resolved.hash, /^#page=[1-9]\d*$/);
    }
    links++;
  }
}
const report = {status: 'PASS', laboratories: views.length, pdfLinks: links,
  locations: ['GitHub Pages project', 'GitHub Pages root', 'file locale'],
  externalRuntimeResources: 0,
  browserInteractionTested: false};
await fs.writeFile(path.join(root, 'qa/static-results.json'), JSON.stringify(report, null, 2) + '\n');
console.log(JSON.stringify(report));
