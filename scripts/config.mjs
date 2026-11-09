/** Pure, validated deployment configuration; never contacts a server. */
export function httpsUrl(value, name, {optional = false, directory = false} = {}) {
  if (optional && value === '') return '';
  if (typeof value !== 'string' || value.trim() !== value || /[\s<>"'\\]/.test(value)) throw Error(`${name}: URL non valido.`);
  let url; try { url = new URL(value); } catch { throw Error(`${name}: occorre un URL HTTPS assoluto.`); }
  if (url.protocol !== 'https:' || url.username || url.password || url.search || url.hash) throw Error(`${name}: usare HTTPS, senza credenziali, query o frammenti.`);
  if (directory && !url.pathname.endsWith('/')) url.pathname += '/';
  return url.href;
}
export function relativePath(value, name) {
  if (typeof value !== 'string' || !value || /[\s<>"'\\?#]/.test(value) || value.startsWith('/') || value.includes(':') || value.split('/').some(p=>p==='..'||p==='.')) throw Error(`${name}: percorso relativo non valido.`);
  return value;
}
export function configuration(raw, catalogue, env = {}) {
  if (raw.schemaVersion !== 1) throw Error('Versione della configurazione non supportata.');
  const siteUrl = httpsUrl(env.SITE_URL || raw.siteUrl, 'siteUrl', {optional:true,directory:true});
  const siteHome = httpsUrl(env.MAIN_SITE_URL || raw.mainSiteUrl, 'mainSiteUrl', {directory:true});
  const teaching = new URL(relativePath(raw.teachingPath,'teachingPath'), siteHome).href;
  const course = new URL(relativePath(raw.coursePath,'coursePath'), siteHome).href;
  const slideBase = httpsUrl(raw.slidesBaseUrl || siteHome,'slidesBaseUrl',{directory:true});
  if (!['course','direct'].includes(raw.slideLinks)) throw Error('slideLinks deve essere course oppure direct.');
  const mode = raw.ambient?.defaultMode;
  if (!['animated','static','off'].includes(mode)) throw Error('ambient.defaultMode non valido.');
  const fps = raw.ambient.maxFramesPerSecond;
  if (!Number.isInteger(fps) || fps < 5 || fps > 30) throw Error('ambient.maxFramesPerSecond deve essere un intero fra 5 e 30.');
  if (raw.license?.id !== 'CC-BY-SA-4.0' || raw.license.url !== 'https://creativecommons.org/licenses/by-sa/4.0/') throw Error('Licenza incoerente con LICENSE.');
  const slides = Object.fromEntries(catalogue.modules.map(m => [m.id, {
    href:raw.slideLinks === 'direct' ? new URL(relativePath(m.slide.file,'slide.file'), slideBase).href : course,
    reviewRequired:true,
    linkKind:raw.slideLinks === 'direct' ? 'pdf' : 'course'
  }]));
  return {connected:true,standalone:true,siteUrl,siteHome,teaching,course,slides,
    ambient:{defaultMode:mode,maxFramesPerSecond:fps},license:raw.license};
}
