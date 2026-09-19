"""Accessible, typeset companions generated from the same lesson state as the site.
Math indices are semantic ReportLab sub/sup markup; matrices remain tables.
Run render-course.mjs first. No browser or network is needed.
"""
from pathlib import Path
from html.parser import HTMLParser
from html import escape,unescape
import json,re,hashlib,subprocess,sys
import xml.etree.ElementTree as ET
import fitz
from reportlab.platypus import BaseDocTemplate,PageTemplate,Frame,Paragraph,Spacer,PageBreak,Image,KeepTogether,Table,TableStyle
from reportlab.lib.styles import getSampleStyleSheet,ParagraphStyle
from reportlab.lib import colors
from reportlab.graphics.shapes import Drawing,Rect,String,Line
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
ROOT=Path(__file__).resolve().parents[1];PUBLIC=ROOT/'public';TMP=ROOT/'qa/course/pdf';TMP.mkdir(parents=True,exist_ok=True)
PALETTE=json.loads((ROOT/'src/course/matrix-palette.json').read_text())['print']
def print_colors(s):
 return re.sub(r'var\(--mq-([a-z-]+)\)',lambda m: PALETTE[m[1]],s)
DATA=json.loads((ROOT/'qa/course/views.json').read_text())
for name,file in [('STIX','STIXGeneral.ttf'),('STIXBold','STIXGeneralBol.ttf'),('STIXItalic','STIXGeneralItalic.ttf'),('Sans','DejaVuSans.ttf'),('SansBold','DejaVuSans-Bold.ttf')]:pdfmetrics.registerFont(TTFont(name,str(ROOT/'assets/fonts'/file)))
pdfmetrics.registerFontFamily('STIX',normal='STIX',bold='STIXBold',italic='STIXItalic',boldItalic='STIXBold')
INK=colors.HexColor(PALETTE['text']);PURPLE=colors.HexColor(PALETTE['green']);BLUE=colors.HexColor(PALETTE['blue']);TEAL=colors.HexColor(PALETTE['green'])
styles=getSampleStyleSheet()
for name,args in {
 'BodyCourse':dict(fontName='STIX',fontSize=11.5,leading=17,spaceAfter=9),
 'LeadCourse':dict(fontName='STIX',fontSize=13,leading=19,spaceAfter=13),
 'HeadingCourse':dict(fontName='STIX',fontSize=26,leading=31,textColor=PURPLE,spaceAfter=17,keepWithNext=True),
 'SubCourse':dict(fontName='SansBold',fontSize=12.5,leading=17,spaceBefore=14,spaceAfter=9,keepWithNext=True),
 'MathCourse':dict(fontName='STIX',fontSize=11.5,leading=19,spaceAfter=9,backColor=colors.HexColor('#f0f6f1'),borderPadding=9,splitLongWords=True),
 'SmallCourse':dict(fontName='Sans',fontSize=9,leading=13,textColor=colors.HexColor('#53617a'),spaceAfter=9),
 'IndexCourse':dict(fontName='STIX',fontSize=11.5,leading=17,spaceAfter=6),
 'CellCourse':dict(fontName='STIX',fontSize=11,leading=17,spaceAfter=0),
}.items():styles.add(ParagraphStyle(name=name,textColor=args.pop('textColor',INK),**args))
SUB=dict(zip('₀₁₂₃₄₅₆₇₈₉₊₋₌₍₎ₐₑₕᵢⱼₖₗₘₙₒₚᵣₛₜᵤᵥₓᵧ','0123456789+-=()aehijklmnoprstuvxy'))
SUP=dict(zip('⁰¹²³⁴⁵⁶⁷⁸⁹⁺⁻⁼⁽⁾ᵀᴺᵏᶜ','0123456789+-=()TNkc'))
VOID={'input','img','br','hr','meta','link','area','source','wbr'}
class Node:
 def __init__(self,tag='',attrs=None):self.tag=tag;self.attrs=dict(attrs or []);self.children=[]
 def has(self,c):return c in self.attrs.get('class','').split()
 def text(self):
  if self.tag=='svg':return ''
  if self.has('fraction'):
   parts=[x.text() for x in self.children if isinstance(x,Node)];return '('+parts[0]+')/('+parts[1]+')' if len(parts)==2 else ''.join(parts)
  if self.has('matrix'):
   rows=[x for x in self.children if isinstance(x,Node) and x.has('matrix-row')]
   return '\n['+';\n '.join(' | '.join(y.text() for y in x.children if isinstance(y,Node)) for x in rows)+']\n'
  return ''.join(x.text() if isinstance(x,Node) else x for x in self.children)+ ('\n' if self.tag in {'div','p','h1','h2','h3','h4','figcaption','br','li','tr','label','legend'} else '')
 def find(self,c):return next(iter(self.all(c)),None)
 def all(self,c):
  out=[self] if self.has(c) else []
  for x in self.children:
   if isinstance(x,Node):out.extend(x.all(c))
  return out
 def html(self):
  case={'viewbox':'viewBox','refx':'refX','refy':'refY','markerwidth':'markerWidth','markerheight':'markerHeight','patternunits':'patternUnits','patterntransform':'patternTransform','gradientunits':'gradientUnits','gradienttransform':'gradientTransform','preserveaspectratio':'preserveAspectRatio','clippathunits':'clipPathUnits'}
  attrs=''.join(' '+case.get(k,k)+'="'+escape(v or '',quote=True)+'"' for k,v in self.attrs.items())
  tag={'lineargradient':'linearGradient','radialgradient':'radialGradient','clippath':'clipPath','foreignobject':'foreignObject','textpath':'textPath'}.get(self.tag,self.tag)
  return '<'+tag+attrs+'>'+''.join(x.html() if isinstance(x,Node) else escape(x) for x in self.children)+('</'+tag+'>' if self.tag not in VOID else '')
class Tree(HTMLParser):
 def __init__(self,s):super().__init__(convert_charrefs=True);self.root=Node();self.stack=[self.root];self.feed(s)
 def handle_starttag(self,tag,attrs):
  n=Node(tag,attrs);self.stack[-1].children.append(n)
  if tag not in VOID:self.stack.append(n)
 def handle_startendtag(self,tag,attrs):self.stack[-1].children.append(Node(tag,attrs))
 def handle_endtag(self,tag):
  for i in range(len(self.stack)-1,0,-1):
   if self.stack[i].tag==tag:self.stack=self.stack[:i];break
 def handle_data(self,data):self.stack[-1].children.append(data)
def clean(s):return re.sub(r'\n[ \t]*\n+', '\n',s.replace('\u2011','-')).strip()
def markup(text):
 text=clean(text);out=[];i=0
 while i<len(text):
  c=text[i];mapping=SUB if c in SUB else SUP if c in SUP else None
  if mapping:
   tag='sub' if mapping is SUB else 'super';run=''
   while i<len(text) and text[i] in mapping:run+=mapping[text[i]];i+=1
   out.append('<'+tag+'>'+escape(run)+'</'+tag+'>');continue
  if c=='\n':out.append('<br/>')
  elif ord(c) not in pdfmetrics.getFont('STIX').face.charToGlyph and not c.isspace():
   if ord(c) not in pdfmetrics.getFont('Sans').face.charToGlyph:raise ValueError('Unsupported glyph '+repr(c))
   out.append('<font name="Sans">'+escape(c)+'</font>')
  else:out.append(escape(c))
  i+=1
 return ''.join(out)
def para(text,style='BodyCourse'):return Paragraph(markup(text),styles[style])
def matrix(node):
 mat=node.find('matrix');label=''.join(x.text() if isinstance(x,Node) else x for x in node.children if not(isinstance(x,Node) and x.has('matrix'))).strip()
 rows=[[para(c.text(),'CellCourse') for c in row.children if isinstance(c,Node)] for row in mat.children if isinstance(row,Node) and row.has('matrix-row')]
 if not rows:return []
 widths=[max(45,min(105,455/len(rows[0])))]*len(rows[0]);tab=Table(rows,colWidths=widths,hAlign='LEFT');tab.setStyle(TableStyle([('LINEBEFORE',(0,0),(0,-1),1,BLUE),('LINEAFTER',(-1,0),(-1,-1),1,BLUE),('VALIGN',(0,0),(-1,-1),'MIDDLE'),('LEFTPADDING',(0,0),(-1,-1),10),('RIGHTPADDING',(0,0),(-1,-1),10),('TOPPADDING',(0,0),(-1,-1),4),('BOTTOMPADDING',(0,0),(-1,-1),4)]))
 return [KeepTogether(([para(label,'MathCourse')] if label else [])+[tab,Spacer(1,10)])]
def formula(node):
 if node.has('matrix-wrap'):return matrix(node)
 if node.tag=='svg':return []
 out=[];buffer=[]
 def flush():
  if clean(''.join(buffer)):out.append(para(''.join(buffer),'MathCourse'))
  buffer.clear()
 for child in node.children:
  if isinstance(child,str):buffer.append(child)
  elif child.has('matrix-wrap'):flush();out.extend(matrix(child))
  elif child.tag in {'div','p','h4'} or child.find('matrix-wrap'):
   flush();out.extend(formula(child))
  elif child.tag=='br':buffer.append('\n')
  else:buffer.append(child.text())
 flush();return out
FIGCACHE={}
def figures(node,key):
 html=print_colors(node.html());out=[];seen=set()
 for i,svg in enumerate(re.findall(r'<svg\b[\s\S]*?</svg>',html)):
  vb=re.search(r'viewBox="([^"]+)"',svg)
  if not vb:continue
  bounds=[float(x) for x in vb.group(1).split()]
  if bounds[2]<280 or bounds[3]<120:continue
  label=re.search(r'aria-label="([^"]+)"',svg);label=unescape(label.group(1)) if label else ''
  digest=hashlib.sha256(svg.encode()).hexdigest()
  if digest in seen:continue
  seen.add(digest)
  if digest in FIGCACHE:out.append(FIGCACHE[digest]);continue
  svg=svg.replace('<svg ',f'<svg xmlns="http://www.w3.org/2000/svg" width="{bounds[2]}" height="{bounds[3]}" ',1)
  svg=re.sub(r'\s(?:tabindex|aria-[\w-]+|role)="[^"]*"','',svg)
  svg=re.sub(r'<foreignObject\b[\s\S]*?</foreignObject>','',svg)
  # Pattern paint is unsupported by the SVG renderer; preserve the white plotting surface.
  pattern_ids=re.findall(r'<pattern[^>]*id="([^"]+)"',svg)
  for ident in pattern_ids:svg=svg.replace('fill="url(#'+ident+')"','fill="white"')
  ET.register_namespace('', 'http://www.w3.org/2000/svg');element=ET.fromstring(svg)
  caption=element.attrib.get('aria-label','')
  for n in element.iter():
   if n.tag.endswith('}text'):
    n.attrib['font-family']='sans-serif';n.attrib.setdefault('font-size','16');n.attrib.setdefault('fill',PALETTE['text'])
    # SVG fallback fonts contain all mathematical subscripts/superscripts used here.
  def group_long(parent):
   for child in list(parent):group_long(child)
   children=list(parent)
   while len(children)>20:
    for child in children:parent.remove(child)
    for start in range(0,len(children),20):ET.SubElement(parent,'{http://www.w3.org/2000/svg}g').extend(children[start:start+20])
    children=list(parent)
  group_long(element)
  for parent in element.iter():
   for child in list(parent):
    if child.tag.endswith('}pattern') or (child.tag.endswith('}rect') and any(child.attrib.get(dim)=='0' for dim in ('width','height'))):parent.remove(child)
  svg=ET.tostring(element,encoding='unicode')
  source=TMP/f'{digest[:18]}.svg';source.write_text(svg);dest=TMP/f'{digest[:18]}.png'
  # Separate renderer lifetime avoids retaining native SVG resources across the book.
  rendered=subprocess.run([sys.executable,str(ROOT/'scripts/render-svg.py'),str(source),str(dest)],capture_output=True,text=True)
  if rendered.returncode:raise RuntimeError(f'Figura {key}-{i}: '+rendered.stderr[-1600:])
  result=(dest,bounds[2]/bounds[3],label);FIGCACHE[digest]=result;out.append(result)
 return out
def prose(node):
 if node.tag in {'svg','button','input','select','nav','dialog'} or node.has('calculation-reference'):return []
 if node.tag in {'p','h2','h3','h4','legend','label','summary'} or node.has('instrument-explanation'):
  text=clean(node.text())
  return [para(text,'SubCourse' if node.tag in {'h2','h3','h4','legend'} else 'BodyCourse')] if text else []
 out=[]
 for c in node.children:
  if isinstance(c,Node):out.extend(prose(c))
 return out
def data_tables(node):
 out=[]
 for table in node.all('geo-data-table')+node.all('pair-grid'):
  def rows(n):
   if n.tag=='tr':return [[para(c.text(),'CellCourse') for c in n.children if isinstance(c,Node) and c.tag in {'td','th'}]]
   return [row for c in n.children if isinstance(c,Node) for row in rows(c)]
  data=rows(table)
  if not data:continue
  caption=next((c.text() for c in table.children if isinstance(c,Node) and c.tag=='caption'),'')
  if caption:out.append(para(caption,'SubCourse'))
  tab=Table(data,colWidths=[499/max(map(len,data))]*max(map(len,data)),repeatRows=1);tab.setStyle(TableStyle([('BACKGROUND',(0,0),(-1,0),colors.HexColor('#edf2fb')),('LINEBELOW',(0,0),(-1,-1),.4,colors.HexColor('#ccd5e5')),('VALIGN',(0,0),(-1,-1),'TOP'),('TOPPADDING',(0,0),(-1,-1),7),('BOTTOMPADDING',(0,0),(-1,-1),7)]));out.extend([tab,Spacer(1,10)])
 for bars in node.all('geo-bars'):
  caption=next((x.text() for x in bars.children if isinstance(x,Node) and x.tag=='figcaption'),'Probabilità')
  rows=bars.all('geo-bar');drawing=Drawing(490,35*len(rows)+15)
  for i,bar in enumerate(rows):
   y=35*(len(rows)-i)-5;label=next((x.text().strip() for x in bar.children if isinstance(x,Node) and x.tag=='span'),'');value=next((x.text().strip() for x in bar.children if isinstance(x,Node) and x.tag=='strong'),'')
   track=bar.find('geo-track');fill=next((x for x in track.children if isinstance(x,Node) and x.tag=='div'),None);style=print_colors(fill.attrs.get('style','')) if fill else '';w=re.search(r'width:([\d.]+)%',style);col=re.search(r'background:(#[a-fA-F0-9]+)',style);fraction=float(w.group(1))/100 if w else 0
   drawing.add(String(0,y+3,label,fontName='Sans',fontSize=10,fillColor=INK));drawing.add(Rect(72,y,290,15,fillColor=colors.HexColor('#e9eef7'),strokeColor=None));drawing.add(Rect(72,y,290*fraction,15,fillColor=colors.HexColor(col.group(1)) if col else TEAL,strokeColor=None));drawing.add(String(380,y+3,value,fontName='Sans',fontSize=10,fillColor=INK))
   marker=next((x for x in track.children if isinstance(x,Node) and x.tag=='i'),None)
   if marker:
    position=re.search(r'left:([\d.]+)%',marker.attrs.get('style',''))
    if position:
     mx=72+290*float(position.group(1))/100;drawing.add(Line(mx,y-3,mx,y+18,strokeColor=INK,strokeWidth=1.5))
  out.append(KeepTogether([para(caption,'SubCourse'),drawing,Spacer(1,10)]))
 circuit=node.find('quantum-circuit')
 if circuit:out.extend([para('La sequenza completa','SubCourse'),para(circuit.text(),'MathCourse')])
 return out
class CourseDoc(BaseDocTemplate):
 def afterFlowable(self,flowable):
  if hasattr(flowable,'bookmark'):self.canv.bookmarkPage(flowable.bookmark);self.canv.addOutlineEntry(flowable.outline_title,flowable.bookmark,flowable.level,False)
def footer(canvas,doc):
 w,h=doc.pagesize;canvas.saveState();canvas.setStrokeColor(colors.HexColor('#ccd4e5'));canvas.line(48,43,w-48,43);canvas.setFillColor(colors.HexColor('#53617a'));canvas.setFont('Sans',8);canvas.drawString(48,29,'Quantum e post-quantum computing · Laboratorio interattivo');canvas.drawRightString(w-48,29,str(doc.page));canvas.restoreState()
def heading(text,key,level=0):
 p=para(text,'HeadingCourse');p.bookmark=key;p.level=level;p.outline_title=text.replace('\n',' · ');return p
METRICS={}
def make(chapters,name):
 selected=[v for v in DATA['views'] if v['chapter'] in chapters];story=[Spacer(1,55),para('QUANTUM E POST-QUANTUM COMPUTING','SmallCourse'),heading('Geometria, simulazione e calcolo','cover'),para('Guida alle dimostrazioni interattive','LeadCourse'),Spacer(1,25)]
 for c in DATA['chapters']:
  if c['id'] in chapters:story.extend([para(f"Capitolo {c['id']} · {c['title']}",'SubCourse'),para(c['intro'])])
 story.extend([Spacer(1,25),para('Marzio De Corato · Danilo Bruschi\nUniversità degli Studi di Milano','SmallCourse'),para('Le figure e i calcoli conservano le configurazioni iniziali del laboratorio. Ogni scheda descrive ciò che i comandi modificano, il significato dei risultati e le condizioni del modello. Nel secondo capitolo i passaggi matematici accompagnano le costruzioni geometriche. Per osservare l’evoluzione temporale e cambiare i parametri si utilizza il laboratorio interattivo.'),para('Gli indici e gli esponenti distinguono componenti e potenze. Le matrici sono impaginate per righe e colonne. Le identità simboliche sono esatte; i numeri ottenuti dai calcoli sono arrotondati e vengono indicati con ≈.'),PageBreak(),heading('Indice delle dimostrazioni','index')])
 for v in selected:
  key=f"c{v['chapter']}-{v['id']}";story.append(Paragraph(f'<a href="#{key}" color="#2454d7">{v["chapter"]}.{v["index"]+1:02d} · {escape(v["title"])}</a>',styles['IndexCourse']))
 for c in DATA['chapters']:
  if c['id'] not in chapters:continue
  story.extend([PageBreak(),heading(f"Capitolo {c['id']}\n{c['title']}",f"chapter-{c['id']}"),para(c['intro'],'LeadCourse')])
  for v in [x for x in selected if x['chapter']==c['id']]:
   key=f"c{v['chapter']}-{v['id']}";story.extend([PageBreak(),heading(f"{v['chapter']}.{v['index']+1:02d} · {v['title']}",key,1),para(v['intro'],'LeadCourse'),para('Riferimento alle slide: p. '+', '.join(str(x) for x in v['pages'])+'.','SmallCourse')])
   live='https://quantum-lab-dal-moto-al-qubit.saren605078.chatgpt.site/#capitolo-'+str(c['id'])+'/'+v['id'];story.append(Paragraph(f'<a href="{live}" color="#2454d7">Apri la dimostrazione online</a>',styles['SmallCourse']))
   tree=Tree(v['demo']).root;theory=tree.find('geo-theory') or tree.find('lab-introduction') or tree.find('notebook-intro')
   if theory:story.extend(prose(theory) or [para(theory.text())])
   controls=tree.find('geo-controls') or tree.find('notebook-controls') or tree.find('control-panel')
   if controls:
    story.append(para('Preparazione e significato dei comandi','SubCourse'));story.extend(prose(controls))
   visual=tree.find('geo-visual') or tree;imgs=figures(visual,key)
   if '<svg' in visual.html() and not imgs:raise ValueError('Missing figure in '+key)
   if imgs:
    story.append(para('Figure della configurazione iniziale','SubCourse'))
    for j,(path,ratio,label) in enumerate(imgs):
     width=min(485,330*ratio);height=width/ratio
     story.append(KeepTogether([para(label,'SmallCourse'),Image(str(path),width=width,height=height),Spacer(1,12)]))
   story.extend(data_tables(visual))
   steps=tree.all('geo-step')
   if steps:
    for step in steps:
     title=next((x.text() for x in step.children if isinstance(x,Node) and x.tag=='h3'),'Passaggio');title=re.sub(r'^(\d{2})',r'\1 · ',title);eq=step.find('equation');story.append(para(title,'SubCourse'))
     if eq:story.extend(formula(eq))
     for child in step.children:
      if isinstance(child,Node) and child.tag=='p':story.append(para(child.text()))
   else:
    # Collect the prose of both legacy and notebook lessons, with each block once.
    body=tree.find('notebook-apparatus')
    if body:story.extend(prose(body))
    overview=tree.find('notebook-overview')
    if overview:story.extend(prose(overview))
    for cls in ['figure-explanation','gas-reference','observation','lab-discussion','notebook-conclusion','model-details']:
     for node in tree.all(cls):story.extend(prose(node) or [para(node.text())])
   caption=tree.find('geo-caption')
   if caption:story.extend([para('Interpretazione dei risultati','SubCourse'),para(caption.text())])
   scope=tree.find('geo-scope')
   if scope:story.extend([para('Spazio rappresentato e condizioni','SubCourse'),*[para(x.text()) for x in scope.children if isinstance(x,Node) and x.tag=='p']])
   METRICS[key]={'figures':len(imgs),'calculation_steps':len(steps),'intro_characters':len(theory.text()) if theory else 0,'notebook_explanations':len(tree.all('notebook-reading'))+len(tree.all('instrument-explanation'))}
 if chapters==[1,2]:story.extend([PageBreak(),heading('Capitoli successivi','future'),para('To be done. I prossimi moduli saranno aggiunti all’indice del corso.')])
 target=PUBLIC/name;doc=CourseDoc(str(target),pagesize=(595.276,841.89),leftMargin=48,rightMargin=48,topMargin=48,bottomMargin=58,title='Quantum e post-quantum computing · Guida alle dimostrazioni',author='Marzio De Corato · Danilo Bruschi',pageCompression=1);doc.addPageTemplates(PageTemplate(id='normal',frames=[Frame(48,58,499.276,735.89,id='body',leftPadding=0,rightPadding=0,topPadding=0,bottomPadding=0)],onPage=footer));doc.build(story)
 with fitz.open(target) as check:
  text=''.join(p.get_text() for p in check)
  if '\x00' in text or '\ufffd' in text:raise ValueError('Unrendered glyphs in '+name)
  report={'file':name,'pages':len(check),'bookmarks':len(check.get_toc()),'links':sum(len(p.get_links()) for p in check),'missing_glyphs':0}
 print(json.dumps(report,ensure_ascii=False));return report
reports=[make([1,2],'Guida_corso.pdf'),make([1],'Guida_capitolo_1.pdf'),make([2],'Guida_capitolo_2.pdf')]
(ROOT/'qa/course/pdf-results.json').write_text(json.dumps(reports,ensure_ascii=False,indent=2)+'\n');(ROOT/'qa/course/pdf-content-results.json').write_text(json.dumps(METRICS,ensure_ascii=False,indent=2)+'\n')

import shutil
shutil.copyfile(PUBLIC/'Guida_capitolo_1.pdf', PUBLIC/'Guida_studenti.pdf')
