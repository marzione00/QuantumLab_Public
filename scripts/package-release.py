"""Assemble course, chapter, source and GitHub deliverables from one tree."""
import json,os,shutil,zipfile,hashlib
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1];OUT=ROOT/'release';OUT.mkdir(exist_ok=True)
PROJECT='quantum-e-post-quantum-computing';PREFIX='Quantum_computing_Corso'
for name in ['index.html','guida-corso.html','Guida_corso.pdf','presentazione.pdf','presentazione-2.pdf']:
 if not (ROOT/'dist'/name).is_file():raise RuntimeError('Generare prima il progetto: manca '+name)
def sources(include_dist):
 for directory,dirs,files in os.walk(ROOT):
  rel=Path(directory).relative_to(ROOT)
  dirs[:]=[d for d in dirs if d not in {'node_modules','.git','.venv','release','rendered','guide-preview','__pycache__'} and not (rel==Path('qa/course') and d=='pdf') and (include_dist or d!='dist')]
  for name in sorted(files):
   f=Path(directory)/name
   if f.is_symlink() or name.endswith(('.tsbuildinfo','.pyc')) or (rel==Path('qa/course') and name=='views.json'):continue
   yield f,Path(PROJECT)/rel/name
def archive(name,items):
 temporary=OUT/(name+'.tmp')
 with zipfile.ZipFile(temporary,'w',zipfile.ZIP_DEFLATED,compresslevel=9) as z:
  for source,target in sorted(items,key=lambda x:str(x[1])):
   info=zipfile.ZipInfo(str(target).replace(os.sep,'/'),date_time=(2026,9,19,0,0,0));info.compress_type=zipfile.ZIP_DEFLATED;info.external_attr=0o100644<<16;z.writestr(info,source.read_bytes())
 with zipfile.ZipFile(temporary) as z:
  if z.testzip():raise RuntimeError('ZIP non integro: '+name)
  count=len(z.namelist())
 temporary.replace(OUT/name)
 return {'file':name,'bytes':(OUT/name).stat().st_size,'entries':count,'sha256':hashlib.sha256((OUT/name).read_bytes()).hexdigest()}
def local_course():
 for p in (ROOT/'dist').rglob('*'):
  if p.is_file() and '-autonomo' not in p.name:yield p,p.relative_to(ROOT/'dist')
def local_chapter(c):
 mapping={f'capitolo-{c}-autonomo.html':'index.html',f'guida-capitolo-{c}.html':'guida-corso.html',f'Guida_capitolo_{c}.pdf':'Guida_corso.pdf'}
 for file in ['presentazione.pdf' if c==1 else 'presentazione-2.pdf','GUIDA_DOCENTE_CORSO.md','VERIFICHE.md','COLLAUDO.md','REVISIONE_COMPLETA.md','LEGGIMI.txt','LICENZE_COMPONENTI.txt','MODELLI.md','ISTRUZIONI_PER_NUOVI_MODULI.md','AGENTS.md']:mapping[file]=file
 for source,target in mapping.items():yield ROOT/'dist'/source,Path(target)
reports=[archive(PREFIX+'_GitHub.zip',sources(True)),archive(PREFIX+'_sorgenti.zip',sources(False)),archive(PREFIX+'_locale.zip',local_course())]
for c in [1,2]:reports.append(archive(f'Quantum_computing_Capitolo_{c:02d}_locale.zip',local_chapter(c)))
shutil.copy2(ROOT/'public/Guida_corso.pdf',OUT/'Quantum_computing_Guida_studenti.pdf')
(OUT/'MANIFEST.json').write_text(json.dumps(reports,ensure_ascii=False,indent=2)+'\n');print(json.dumps(reports,ensure_ascii=False,indent=2))
