"""Export the full laboratory guide to the approved 01 Classica LaTeX layout.

The authoritative demonstration data are qa/course/views.json. Guided exercises
are maintained in guide-latex/esercizi/ and inserted without rewriting their sources. Source values and calculation
steps are preserved; long calculations and tables have bidirectional references.
SVG geometry is translated to native TikZ; labels use the book's font families.
"""
from pathlib import Path
from html import unescape
import json,re,hashlib,shutil
from latex_support import Node,Tree,clean,inline,mathtex,math_chunks,actual_hex,svg_tikz

ROOT=Path(__file__).resolve().parents[1]
OUT=ROOT/'guide-latex'
DATA=json.loads((ROOT/'qa/course/views.json').read_text())
EXERCISES=json.loads((OUT/'esercizi/manifest.json').read_text())
PALETTE=json.loads((ROOT/'src/course/matrix-palette.json').read_text())['print']
PALETTE.update({'text':'#253137','muted':'#61676B','green':'#783E4D','blue':'#4A6F93'})
ASSETS={};METRICS={};LEDGER={'sections':[],'examples':[],'steps':[],'formulas':[],'rows':[],'figures':[],'prose':[]}
for folder in ['capitoli','figure','tikz']:(OUT/folder).mkdir(parents=True,exist_ok=True)

def actual(source,body):return r'\BeginAccSupp{method=hex,unicode,ActualText='+actual_hex(source)+'}'+body+r'\EndAccSupp{}'
def para(s,kind=''):
 s=clean(s)
 if not s:return ''
 LEDGER['prose'].append(s)
 tex=inline(s)
 if kind=='small':return r'{\sffamily\small\color{Ink!70} '+tex+r'\par}'+'\n'
 if kind=='heading':return r'\BookHeading{'+tex+'}\n'
 return tex+r'\par'+'\n\n'
def anchor(key):return r'\phantomsection\label{'+key+'}\n'
def heading(s,key=None):return (anchor(key) if key else '')+para(s,'heading')
def prose(node):
 if node.tag in {'svg','button','input','select','nav','dialog'} or node.has('calculation-reference'):return ''
 if node.tag in {'p','h2','h3','h4','legend','label','summary'} or node.has('instrument-explanation'):
  return para(node.text(),'heading' if node.tag in {'h2','h3','h4','legend'} else '')
 return ''.join(prose(c) for c in node.children if isinstance(c,Node))

def equation_text(s):
 s=clean(s)
 if not s:return ''
 LEDGER['formulas'].append(s)
 if not any(c in s for c in '=≈≠≤≥') and len(re.findall(r'\b[A-Za-zÀ-ÿ]{3,}\b',s))>8:
  return r'\TextBlock{'+actual_hex(s)+'}{'+inline(s)+'}\n'
 return ''.join(r'\MathBlock{'+actual_hex(piece)+'}{'+mathtex(piece)+'}\n' for piece in math_chunks(s))
def math_node(n):
 if isinstance(n,str):return mathtex(n)
 if n.has('fraction'):
  p=[x for x in n.children if isinstance(x,Node)]
  if len(p)==2:return r'\frac{'+math_node(p[0])+'}{'+math_node(p[1])+'}'
 if n.has('matrix'):
  rows=[x for x in n.children if isinstance(x,Node) and x.has('matrix-row')]
  return r'\begin{pmatrix}'+'\\\\'.join('&'.join(math_node(c) for c in row.children if isinstance(c,Node)) for row in rows)+r'\end{pmatrix}'
 return ''.join(math_node(c) for c in n.children)
def formula(node):
 if 'data-math-source' in node.attrs:return equation_text(node.attrs['data-math-source'])
 if node.tag=='svg':return ''
 if node.has('matrix-wrap') or node.has('matrix'):
  source=clean(node.text());LEDGER['formulas'].append(source)
  return r'\MatrixBlock{'+actual_hex(source)+'}{'+math_node(node)+'}\n'
 out=[];buffer=[]
 def flush():
  if buffer:out.append(equation_text(''.join(buffer)));buffer.clear()
 for c in node.children:
  if isinstance(c,str):buffer.append(c)
  elif c.has('matrix-wrap') or c.has('matrix'):flush();out.append(formula(c))
  elif c.tag in {'div','p','h4'} or c.find('matrix-wrap'):flush();out.append(formula(c))
  elif c.tag=='br':buffer.append('\n')
  else:buffer.append(c.text())
 flush();return ''.join(out)

def print_colors(s):return re.sub(r'var\(--mq-([a-z-]+)\)',lambda m:PALETTE[m[1]],s)
def figures(node,seen=None):
 result=[];seen=set() if seen is None else seen
 def walk(n,component=''):
  if n.has('complex-planes'):component=clean(n.attrs.get('aria-label',''))
  if n.tag=='svg':yield n,component;return
  for c in n.children:
   if isinstance(c,Node):yield from walk(c,component)
 for n,component in walk(node):
  if 'viewbox' not in n.attrs:continue
  bounds=list(map(float,n.attrs['viewbox'].split()))
  if bounds[2]<280 or bounds[3]<120:continue
  svg=print_colors(n.html());digest=hashlib.sha256(svg.encode()).hexdigest();name='f'+digest[:16]
  if digest in seen:continue
  seen.add(digest)
  if name not in ASSETS:
   try:tikz=svg_tikz(svg)
   except Exception as e:raise RuntimeError('Figure '+name+' '+n.attrs.get('aria-label','')) from e
   (OUT/'tikz'/f'{name}.tex').write_text(tikz)
   ASSETS[name]={'name':name,'width':bounds[2],'height':bounds[3],'label':n.attrs.get('aria-label',''),'sha256':digest}
  result.append((name,bounds[2]/bounds[3],n.attrs.get('aria-label',''),component))
  LEDGER['figures'].append(name)
 return result
def figblock(items,context='',title=''):
 out=[];i=0
 if items and title:out.append(heading(title))
 while i<len(items):
  name,ratio,label,component=items[i]
  caption=' · '.join(dict.fromkeys(x for x in [context,component,label if not component else ''] if x))
  if component or re.fullmatch(r'c[01]+|Componente \d+',label):
   pair=[]
   while i<len(items) and len(pair)<2 and items[i][3]==component:
    n,rr,ll,_=items[i];pair.append((n,ll));i+=1
   cells=[]
   for n,ll in pair:
    cells.append(r'\begin{minipage}[t]{.485\linewidth}\centering'+r'\includegraphics[width=\linewidth,height=63mm,keepaspectratio]{figure/'+n+'.pdf}'+r'\par{\sffamily\footnotesize '+inline(ll)+r'\par}\end{minipage}')
   out.append(r'\begin{FigureBlock}'+r'\hfill'.join(cells)+r'\FigureCaption{'+inline(caption)+r'}\end{FigureBlock}'+'\n')
  else:
   out.append(r'\begin{FigureBlock}\centering\includegraphics[width=\linewidth,height=94mm,keepaspectratio]{figure/'+name+'.pdf}'+r'\FigureCaption{'+inline(caption)+r'}\end{FigureBlock}'+'\n');i+=1
 return ''.join(out)

def rows_of(n):
 if n.tag=='tr':return [[clean(c.text()) for c in n.children if isinstance(c,Node) and c.tag in {'td','th'}]]
 return [r for c in n.children if isinstance(c,Node) for r in rows_of(c)]
def table_rows(n):return len(rows_of(n))
def data_tables(node,context=''):
 out=[]
 for table in node.all('geo-data-table')+node.all('pair-grid')+node.all('book-table'):
  rows=rows_of(table)
  if not rows:continue
  LEDGER['rows'].extend(rows)
  caption=next((clean(c.text()) for c in table.children if isinstance(c,Node) and c.tag=='caption'),'')
  if caption:out.append(heading(caption))
  columns=max(map(len,rows));available=136-3.2*columns
  # Wide binary labels and control tuples need more space than numeric residues.
  # Keep the body font constant; distribute width from actual cell contents.
  weights=[max(3,min(22,max(len(cell) for row in (rows[1:] or rows) for j,cell in enumerate(row) if j==i))) for i in range(columns)]
  widths=[available*w/sum(weights) for w in weights]
  if columns==8 and rows[0][0]=='Tentativo':widths=[14,12,14,9,19.4,17,13,12]
  col=''.join(r'>{\RaggedRight\arraybackslash}p{'+f'{width:.3f}mm'+'}' for width in widths)
  def render(row,head=False):
   return ' & '.join(actual(cell,inline(cell)) for cell in row)+r' \\'+'\n'
  header=r'\rowcolor{Accent!7}'+render(rows[0])
  out.append(r'\begingroup\sffamily\fontsize{8.8}{11}\selectfont\setlength{\tabcolsep}{1.6mm}\renewcommand{\arraystretch}{1.28}'+'\n'+r'\begin{longtable}{'+col+'}\n'+r'\toprule'+header+r'\midrule\endfirsthead'+'\n')
  if context:out.append(r'\multicolumn{'+str(columns)+r'}{@{}p{\linewidth}@{}}{\footnotesize '+inline(context)+r' (segue)}\\'+'\n')
  out.append(r'\toprule'+header+r'\midrule\endhead\bottomrule\endfoot'+'\n')
  out.extend(render(row) for row in rows[1:]);out.append(r'\end{longtable}\endgroup'+'\n')
 for bars in node.all('geo-bars'):
  caption=next((x.text() for x in bars.children if isinstance(x,Node) and x.tag=='figcaption'),'Probabilità')
  out.append(heading(caption));out.append(r'\begin{FigureBlock}\begin{tikzpicture}[x=1mm,y=1mm]'+'\n')
  for i,bar in enumerate(bars.all('geo-bar')):
   y=-i*8;label=next((clean(x.text()) for x in bar.children if isinstance(x,Node) and x.tag=='span'),'');value=next((clean(x.text()) for x in bar.children if isinstance(x,Node) and x.tag=='strong'),'')
   track=bar.find('geo-track');fill=next((x for x in track.children if isinstance(x,Node) and x.tag=='div'),None) if track else None
   w=re.search(r'width:([\d.]+)%',fill.attrs.get('style','')) if fill else None;fraction=float(w[1])/100 if w else 0
   out.append(r'\node[anchor=east,font=\sffamily\small] at (19,'+str(y+2)+') {'+inline(label)+'};'+r'\fill[Ink!7] (21,'+str(y)+') rectangle (104,'+str(y+4)+');'+r'\fill[Accent!75] (21,'+str(y)+') rectangle ('+str(21+83*fraction)+','+str(y+4)+');'+r'\node[anchor=west,font=\sffamily\small] at (108,'+str(y+2)+') {'+inline(value)+'};\n')
   marker=next((x for x in track.children if isinstance(x,Node) and x.tag=='i'),None) if track else None
   if marker:
    p=re.search(r'left:([\d.]+)%',marker.attrs.get('style',''))
    if p:
     x=21+83*float(p[1])/100;out.append(r'\draw[Ink,line width=.8pt] ('+str(x)+','+str(y-1)+')--('+str(x)+','+str(y+5)+');\n')
  out.append(r'\end{tikzpicture}\end{FigureBlock}'+'\n')
 circuit=node.find('quantum-circuit')
 if circuit:out.extend([heading('La sequenza completa'),equation_text(circuit.text())])
 return ''.join(out)

class Appendices:
 def __init__(self,c):self.c=c;self.items=[]
 def add(self,kind,key,title,origin,body):
  ident=kind+key.removeprefix('c').replace('-','.',1);dest='appendix-'+ident
  self.items.append((kind,ident,dest,title,origin,body))
  return r'\par\hyperref['+dest+']{Appendice '+ident+' · '+inline(title)+r' (p.\,\pageref*{'+dest+r'})}\par'+'\n'
 def tex(self):
  if not self.items:return ''
  out=[r'\clearpage\section*{Appendici del capitolo '+str(self.c)+'}',r'\phantomsection\addcontentsline{toc}{section}{Appendici del capitolo '+str(self.c)+'}',para('Le espansioni e le tabelle seguenti conservano tutti i termini e tutte le righe delle configurazioni predefinite. Ogni codice identifica capitolo, sezione, esempio e passaggio o tabella. Il collegamento di ritorno conduce alla dimostrazione.')]
  for kind,caption in [('F','Espansioni complete dei calcoli'),('T','Registri, distribuzioni e dati completi'),('R','Reti elementari e verifiche delle porte')]:
   entries=[e for e in self.items if e[0]==kind]
   if not entries:continue
   out.append(heading(caption))
   for _,ident,dest,title,origin,body in entries:out.append(r'{\small\hyperref['+dest+']{'+ident+' · '+inline(re.sub(r'^\d+\.\d+ · esempio \d+ · ','',title))+r'}\par}'+'\n')
  for kind,ident,dest,title,origin,body in self.items:
   out.extend([r'\clearpage',heading(ident+' · '+title,dest),r'{\small\hyperref['+origin[0]+']{Torna a '+inline(origin[1])+r' (p.\,\pageref*{'+origin[0]+r'})}\par}',body])
  return '\n'.join(out)

def chapter(c):
 number=c['id'];appendices=Appendices(number);out=[r'\setcounter{chapter}{'+str(number-1)+'}',r'\chapter{'+inline(c['title'])+'}',anchor('chapter-'+str(number)),para(c['intro'])]
 out.append(r'\input{esercizi/indice-'+str(number)+'}')
 for v in [x for x in DATA['views'] if x['chapter']==number]:
  key=f"c{number}-{v['id']}";LEDGER['sections'].append(key)
  out.extend([r'\Needspace{.43\textheight}',r'\section{'+inline(v['title'])+'}',anchor(key),para('Riferimento alle slide: p. '+', '.join(map(str,v['pages']))+'.','small'),para('Laboratorio locale: index.html#capitolo-'+str(number)+'/'+v['id'],'small')])
  tree=Tree(v['demo']).root;theory=tree.find('geo-theory') or tree.find('lab-introduction') or tree.find('notebook-intro')
  if theory:out.append(prose(theory) or para(theory.text()))
  if number>=2:
   definition=theory.find('equation') if theory else None
   if definition:out.append(formula(definition))
   scope=tree.find('book-scope')
   if scope:out.append(prose(scope))
   experiment=tree.find('experiment-instructions')
   if experiment:
    out.append(heading('Attività nel laboratorio modificabile'))
    out.append(prose(experiment))
   fcount=scount=ecount=rcount=arows=expanded=0
   for example in tree.all('book-worked'):
    ecount+=1;examplekey=f'{key}-example-{ecount}';LEDGER['examples'].append(examplekey)
    context=f'{number}.{v["index"]+1:02d} · esempio {ecount}'
    head=next((x for x in example.children if isinstance(x,Node) and x.tag=='header'),None)
    out.append(r'\Needspace{.36\textheight}'+anchor(examplekey)+r'{\sffamily\small\color{Accent} ESEMPIO SVOLTO '+str(ecount)+r'\par}')
    if head:out.append(prose(head))
    seen=set()
    for group,caption in [('book-circuit','Circuito completo'),('book-geometry','Geometria e configurazione dell’esempio')]:
     node=example.find(group)
     if node:
      figs=figures(node,seen);fcount+=len(figs);out.append(figblock(figs,context,caption))
    for si,step in enumerate(example.all('geo-step'),1):
     scount+=1;sk=f'{examplekey}-step-{si}';LEDGER['steps'].append(sk)
     title=next((x.text() for x in step.children if isinstance(x,Node) and x.tag in {'h3','h4'}),'Passaggio')
     out.append(heading(title,sk));eq=step.find('equation')
     if eq:
      body=formula(eq)
      if len(clean(eq.text()))>750 and not eq.find('matrix'):
       expanded+=1;ak=f'c{number}-{v["index"]+1:02d}.{ecount}.{si}'
       out.append(para('L’espansione completa di questo passaggio è riportata nel rimando seguente; tutti i termini sono conservati nell’ordine del calcolo.'))
       out.append(appendices.add('F',ak,context+' · '+clean(title),(sk,context+' · '+clean(title)),body))
       lines=[line.strip() for line in eq.text().splitlines() if line.strip()]
       if len(lines)>1 and len(lines[-1])<300:out.append(equation_text(lines[-1]))
      else:out.append(body)
     out.extend(para(x.text()) for x in step.children if isinstance(x,Node) and x.tag=='p')
    final=example.find('book-static-final')
    if final:
     figs=figures(final,seen);fcount+=len(figs);out.append(figblock(figs,context,'Stato finale del programma'))
    cap=example.find('geo-caption')
    if cap:out.extend([heading('Interpretazione'),para(cap.text())])
    cost=example.find('book-cost')
    if cost:out.append(para(cost.text()))
    for di,detail in enumerate(example.all('book-data'),1):
     title=next((x.text() for x in detail.children if isinstance(x,Node) and x.tag=='summary'),'Dati');nr=table_rows(detail);rcount+=nr
     body=data_tables(detail,context+' · '+title if nr>25 else '')
     if nr>25:
      arows+=nr;kind='R' if any(w in title.lower() for w in ['rete','toffoli','cnot','porte elementari']) else 'T';dk=f'{examplekey}-data-{di}';out.append(heading(title,dk))
      out.append(appendices.add(kind,f'c{number}-{v["index"]+1:02d}.{ecount}.{di}',context+' · '+title,(dk,context+' · '+title),body))
     else:out.extend([heading(title),body])
   bridge=tree.find('book-bridge')
   if bridge:out.extend([r'\Needspace{7\baselineskip}',prose(bridge)])
   METRICS[key]={'figures':fcount,'calculation_steps':scount,'worked_examples':ecount,'intro_characters':len(theory.text()) if theory else 0,'notebook_explanations':0,'data_rows':rcount,'appendix_rows':arows,'expanded_formulas':expanded}
  else:
   controls=tree.find('geo-controls') or tree.find('notebook-controls') or tree.find('control-panel')
   if controls:out.extend([heading('Preparazione e significato dei comandi'),prose(controls)])
   visual=tree.find('geo-visual') or tree;figs=figures(visual);out.append(figblock(figs,'','Figure della configurazione iniziale'));out.append(data_tables(visual))
   steps=tree.all('geo-step')
   for step in steps:
    title=next((x.text() for x in step.children if isinstance(x,Node) and x.tag=='h3'),'Passaggio');out.append(heading(re.sub(r'^(\d{2})',r'\1 · ',title)));eq=step.find('equation')
    if eq:out.append(formula(eq))
    out.extend(para(x.text()) for x in step.children if isinstance(x,Node) and x.tag=='p')
   if not steps:
    for cls in ['notebook-apparatus','notebook-overview','figure-explanation','gas-reference','observation','lab-discussion','notebook-conclusion','model-details']:
     for node in tree.all(cls):out.append(prose(node) or para(node.text()))
   cap=tree.find('geo-caption')
   if cap:out.extend([heading('Interpretazione dei risultati'),para(cap.text())])
   scope=tree.find('geo-scope')
   if scope:out.extend([heading('Spazio rappresentato e condizioni'),*[para(x.text()) for x in scope.children if isinstance(x,Node) and x.tag=='p']])
   METRICS[key]={'figures':len(figs),'calculation_steps':len(steps),'intro_characters':len(theory.text()) if theory else 0,'notebook_explanations':len(tree.all('notebook-reading'))+len(tree.all('instrument-explanation'))}
  for exercise in EXERCISES:
   if exercise['chapter']==number and exercise['after_section']==v['index']+1:
    out.append(r'\input{'+exercise['source']+'}')
 out.append(appendices.tex());return '\n'.join(out)+'\n'


def export_exercises():
 # These sources are maintained by hand. Exporting demonstrations never rewrites them.
 ledger=[]
 for item in EXERCISES:
  source=OUT/item['source'];tex=source.read_text()
  assert tex.count(r'\ExerciseStart{')==1 and tex.count(r'\ExSolution')==1,item['id']
  assert tex.count(r'\ExFigure{')>=2 and tex.count(r'\ExStep{')>=4,item['id']
  assert all(int(r['section'].split('.')[1])<=item['after_section'] for r in item['theory'])
  ledger.append({**item,'sha256':hashlib.sha256(source.read_bytes()).hexdigest(),
   'steps':tex.count(r'\ExStep{'),'figures':tex.count(r'\ExFigure{'),
   'tasks':tex.count(r'\item '),'equation_blocks':tex.count(r'\ExEq{')})
 assert len(ledger)==60
 for c in range(1,5):
  items=[x for x in ledger if x['chapter']==c];assert len(items)==15
  lines=[r'\clearpage\phantomsection\label{exercise-index-'+str(c)+'}',
   r'\BookHeading{Percorso degli esercizi guidati}',
   'Quindici esercizi accompagnano lo studio del modulo. Ogni traccia segue le sezioni richieste e rinvia a uno svolgimento completo. Si suggerisce di formulare la previsione e tentare i passaggi prima di consultare la soluzione.',
   r'\begin{longtable}{@{}p{13mm}p{75mm}r@{}}\toprule Codice & Argomento & Pagina\\\midrule\endhead']
  for x in items:
   ident=x['id'];title=inline(x['title'])
   lines.append(r'\hyperref[ex-'+ident+']{'+ident+'} & '+title+r' & \pageref{ex-'+ident+r'}\\[3pt]')
  lines.extend([r'\bottomrule\end{longtable}',
   r'{\small I primi cinque esercizi offrono una guida esplicita; i successivi cinque consolidano il calcolo; gli ultimi cinque collegano più concetti. Tutti conservano uno svolgimento completo.}\par'])
  (OUT/'esercizi'/f'indice-{c}.tex').write_text('\n'.join(lines)+'\n')
 (OUT/'esercizi/ledger.json').write_text(json.dumps(ledger,ensure_ascii=False,indent=2)+'\n')

def make():
 export_exercises()
 ranges={}
 for c in DATA['chapters']:
  starts={k:len(v) for k,v in LEDGER.items()}
  (OUT/'capitoli'/f'capitolo-{c["id"]}.tex').write_text(chapter(c))
  ranges[str(c['id'])]={k:[starts[k],len(v)] for k,v in LEDGER.items()}
 (OUT/'figure-manifest.json').write_text(json.dumps(list(ASSETS.values()),ensure_ascii=False,indent=2)+'\n')
 (OUT/'content-ledger.json').write_text(json.dumps({**LEDGER,'chapter_ranges':ranges},ensure_ascii=False,indent=2)+'\n')
 (ROOT/'qa/course/pdf-content-results.json').write_text(json.dumps(METRICS,ensure_ascii=False,indent=2)+'\n')
 figures_tex=r'\input{preambolo-figure}'+'\n'+r'\begin{document}'+'\n'+'\n'.join(r'\input{tikz/'+n+'}' for n in ASSETS)+'\n'+r'\end{document}'+'\n'
 (OUT/'figure-tutte.tex').write_text(figures_tex)
 for c in [None,1,2,3,4]:
  name='Guida_corso' if c is None else f'Guida_capitolo_{c}'
  selection=[1,2,3,4] if c is None else [c]
  opening=r'\def\GuidaSelezione{'+('Guida completa · quattro moduli' if c is None else 'Capitolo '+str(c))+'}\n'
  body='\n'.join(r'\input{capitoli/capitolo-'+str(k)+'}' for k in selection)
  (OUT/(name+'.tex')).write_text(opening+r'\input{preambolo}'+'\n'+r'\begin{document}\input{frontespizio}\tableofcontents\cleardoublepage'+'\n'+body+'\n'+r'\end{document}'+'\n')
 print(json.dumps({'sections':len(LEDGER['sections']),'examples':len(LEDGER['examples']),'steps':len(LEDGER['steps']),'figure_placements':len(LEDGER['figures']),'unique_figures':len(ASSETS),'formulas':len(LEDGER['formulas']),'table_rows':len(LEDGER['rows'])},indent=2))
if __name__=='__main__':make()
