/** Uses the actual preserved React runtime; no substitute model or mock React implementation. */
import vm from 'node:vm';import fs from 'node:fs';
const context={console,setTimeout,clearTimeout,performance};vm.createContext(context);vm.runInContext(fs.readFileSync(new URL('../vendor/legacy-runtime.js',import.meta.url),'utf8'),context);
export default context.QuantumLegacy.React;
