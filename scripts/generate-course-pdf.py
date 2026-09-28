"""Generate the approved ArsClassica 01 guide from the laboratory source."""
from pathlib import Path
import argparse,shutil,subprocess,sys
ROOT=Path(__file__).resolve().parents[1]
parser=argparse.ArgumentParser(description=__doc__)
parser.add_argument('--output-dir',type=Path,default=ROOT/'public')
parser.add_argument('--chapters',type=int,nargs='+',choices=[1,2,3,4])
args=parser.parse_args()
subprocess.run([sys.executable,str(ROOT/'scripts/export-guide-latex.py')],cwd=ROOT,check=True)
command=[sys.executable,str(ROOT/'guide-latex/compila.py'),'--output-dir',str(args.output_dir)]
if args.chapters:command+=['--chapters',*map(str,args.chapters)]
subprocess.run(command,cwd=ROOT,check=True)
if not args.chapters or 1 in args.chapters:
    shutil.copy2(args.output_dir/'Guida_capitolo_1.pdf',args.output_dir/'Guida_studenti.pdf')
