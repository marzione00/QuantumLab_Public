"""Build the complete Classica guide and its four chapter editions.

Usage: python compila.py [--chapters 1 2 3 4] [--output-dir PATH]
Requires Python 3.10+, PyMuPDF and a full TeX Live / MiKTeX installation.
Demonstration chapters are exported before compilation; guided exercise sources are maintained by hand.
"""
from pathlib import Path
import argparse,hashlib,json,os,shutil,subprocess
import fitz

ROOT=Path(__file__).resolve().parent
BUILD=ROOT/'compilazione';BUILD.mkdir(exist_ok=True)
def environment():
 env=os.environ.copy();vendor=ROOT/'vendor'
 def prepend(variable,directories):
  env[variable]=os.pathsep.join(str(p)+'//' for p in directories)+os.pathsep+env.get(variable,'')
 prepend('TEXINPUTS',[ROOT,vendor/'classicthesis',vendor/'italian',vendor/'eulervm/tex',vendor/'iwona/tex'])
 for variable,folder in [('TFMFONTS','tfm'),('VFFONTS','vf'),('T1FONTS','type1'),('ENCFONTS','enc'),('TEXFONTMAPS','map')]:
  prepend(variable,[vendor/'eulervm/fonts'/folder,vendor/'iwona/fonts'/folder])
 return env
def compile_tex(name,passes=2,texfile=None):
 for iteration in range(passes):
  run=subprocess.run(['pdflatex','-interaction=nonstopmode','-halt-on-error','-file-line-error','-output-directory='+str(BUILD),str(texfile or name+'.tex')],cwd=ROOT,env=environment(),stdout=subprocess.PIPE,stderr=subprocess.STDOUT,text=True)
  (BUILD/(name+'.stdout')).write_text(run.stdout)
  if run.returncode:raise RuntimeError(name+' failed:\n'+run.stdout[-5500:])
 return BUILD/(name+'.pdf')
def figures(force=False):
 manifest=json.loads((ROOT/'figure-manifest.json').read_text())
 def sha(path):return hashlib.sha256(path.read_bytes()).hexdigest()
 state={'preamble':sha(ROOT/'preambolo-figure.tex')+sha(ROOT/'font-map.tex'),'figures':{f['name']:sha(ROOT/'tikz'/(f['name']+'.tex')) for f in manifest}}
 stamp=BUILD/'figure-state.json';previous=json.loads(stamp.read_text()) if stamp.is_file() else {}
 changed=[f for f in manifest if force or previous.get('preamble')!=state['preamble'] or previous.get('figures',{}).get(f['name'])!=state['figures'][f['name']] or not (ROOT/'figure'/(f['name']+'.pdf')).is_file()]
 if not changed:return
 subset=BUILD/'figure-modificate.tex'
 subset.write_text(r'\input{preambolo-figure}'+'\n'+r'\begin{document}'+'\n'+'\n'.join(r'\input{tikz/'+f['name']+'}' for f in changed)+'\n'+r'\end{document}'+'\n')
 pdf=compile_tex('figure-modificate',1,subset)
 with fitz.open(pdf) as document:
  if len(document)!=len(changed):raise RuntimeError('Figure page count does not match manifest')
  for i,item in enumerate(changed):
   with fitz.open() as single:
    single.insert_pdf(document,from_page=i,to_page=i);single.save(ROOT/'figure'/(item['name']+'.pdf'),deflate=True,garbage=4)
 stamp.write_text(json.dumps(state))
 print('Compiled '+str(len(changed))+' native TikZ figures; '+str(len(manifest))+' available.',flush=True)
def main():
 parser=argparse.ArgumentParser(description=__doc__);parser.add_argument('--chapters',type=int,nargs='+',choices=[1,2,3,4]);parser.add_argument('--output-dir',type=Path,default=ROOT/'pdf');parser.add_argument('--figures-only',action='store_true');parser.add_argument('--force-figures',action='store_true');parser.add_argument('--passes',type=int,default=3,choices=[1,2,3]);args=parser.parse_args()
 if not shutil.which('pdflatex'):raise SystemExit('Installare pdfLaTeX (TeX Live completo o MiKTeX).')
 figures(args.force_figures)
 if args.figures_only:return
 args.output_dir.mkdir(parents=True,exist_ok=True)
 names=([f'Guida_capitolo_{c}' for c in args.chapters] if args.chapters else ['Guida_corso']+[f'Guida_capitolo_{c}' for c in [1,2,3,4]])
 for name in names:
  pdf=compile_tex(name,args.passes);shutil.copy2(pdf,args.output_dir/(name+'.pdf'))
  with fitz.open(pdf) as d:print(name+': '+str(len(d))+' pagine.',flush=True)
if __name__=='__main__':main()
