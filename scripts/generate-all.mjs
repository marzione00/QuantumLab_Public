import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {spawnSync} from 'node:child_process';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const python=['python3','python'].find(name=>spawnSync(name,['--version'],{stdio:'ignore'}).status===0);
if(!python)throw new Error('Per il PDF e gli ZIP occorre Python 3.10 o successivo. Il solo laboratorio si genera con pnpm run build.');
for(const [command,args] of [[process.execPath,['scripts/render-course.mjs']],[python,['scripts/generate-course-pdf.py']],[python,['qa/course/verify-pdf.py']],[process.execPath,['scripts/build.mjs']],[process.execPath,['qa/course/verify-theme.mjs']],[python,['scripts/package-release.py']]]){
 const result=spawnSync(command,args,{cwd:root,stdio:'inherit'});
 if(result.error)throw result.error;if(result.status!==0)process.exit(result.status??1);
}
