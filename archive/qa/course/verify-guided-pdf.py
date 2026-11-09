"""Check every guided exercise in the full PDF and in its independent chapter."""
from pathlib import Path
import json,re,hashlib
import fitz
ROOT=Path(__file__).resolve().parents[2];G=ROOT/'guide-latex'
ledger=json.loads((G/'esercizi/ledger.json').read_text())
numerics=json.loads((ROOT/'qa/course/guided-exercises-numerical-results.json').read_text())
hashes={x['id']:x['sha256'] for x in numerics['exercises']}
report=[]
for name,chapters in [('Guida_corso',[1,2,3,4])]+[(f'Guida_capitolo_{c}',[c]) for c in range(1,5)]:
 d=fitz.open(ROOT/'public'/f'{name}.pdf');names=d.resolve_names()
 aux=(G/'compilazione'/f'{name}.aux').read_text()
 labels={m[1]:int(m[2]) for m in re.finditer(r'\\newlabel\{([^}]+)\}\{\{[^}]*\}\{(\d+)\}',aux)}
 entries=[]
 for e in [x for x in ledger if x['chapter'] in chapters]:
  id=e['id'];source=G/e['source'];sha=hashlib.sha256(source.read_bytes()).hexdigest()
  assert sha==e['sha256']==hashes[id],(id,'source version mismatch')
  start,solution,end=[labels[prefix+id] for prefix in ['ex-','sol-','end-']]
  assert solution==start+1 and solution<=end,(id,start,solution,end)
  for ref in e['theory']:assert labels[ref['label']]<start,(id,ref)
  for prefix in ['ex-','sol-']:
   assert prefix+id in names,(name,prefix+id)
   assert names[prefix+id]['page']==labels[prefix+id]-1,(name,id,'page numbering')
  destinations=[names.get(f'exstep.{id}.{k}') for k in range(1,e['steps']+1)]
  assert all(x is not None and solution-1<=x['page']<end for x in destinations),(name,id,'solution steps')
  text='\n'.join(d[p].get_text() for p in range(start-1,end))
  for title in ['Problema, dati e obiettivo','Richiami alla teoria','Percorso guidato','Svolgimento','Interpretazione e controlli','Confronto nel laboratorio']:
   assert title in text,(name,id,'missing heading',title)
  assert text.count(id)>=4,(name,id,'missing captions/links')
  entries.append({'id':id,'start':start,'solution':solution,'end':end,'pages':end-start+1,'steps':e['steps'],'figures':e['figures']})
 log=(G/'compilazione'/f'{name}.log').read_text()
 assert not re.search(r'undefined references|Rerun to get cross|destination with the same identifier|Overfull',log),name
 report.append({'file':name+'.pdf','pages':len(d),'exercises':entries,'exercise_pages':len({p for e in entries for p in range(e['start'],e['end']+1)})})
 print(name,len(entries),'exercises',report[-1]['exercise_pages'],'exercise pages')
(ROOT/'qa/course/guided-exercises-pdf-results.json').write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n')
