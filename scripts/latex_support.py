"""Semantic text/math and SVG-to-TikZ adapters for the approved ArsClassica book."""
from html.parser import HTMLParser
from html import escape
import re, math, unicodedata
import xml.etree.ElementTree as ET

SUB=dict(zip('₀₁₂₃₄₅₆₇₈₉₊₋₌₍₎ₐₑₕᵢⱼₖₗₘₙₒₚᵣₛₜᵤᵥₓᵧᵦ','0123456789+-=()aehijklmnoprstuvxyβ'))
SUB['ᵦ']='b'  # The source uses this Unicode approximation for the register bit b.
SUP=dict(zip('⁰¹²³⁴⁵⁶⁷⁸⁹⁺⁻⁼⁽⁾ᵀᴺᵏᶜⁿʲˣʸᵈᵐᵉʳᴿᵃᵇⁱ','0123456789+-=()TNkcnjxydmerRabi'))
SYMBOLS={
 'α':r'\alpha','β':r'\beta','γ':r'\gamma','δ':r'\delta','ε':r'\varepsilon','ζ':r'\zeta',
 'η':r'\eta','θ':r'\theta','λ':r'\lambda','μ':r'\mu','ν':r'\nu','π':r'\pi',
 'ρ':r'\rho','σ':r'\sigma','τ':r'\tau','φ':r'\varphi','χ':r'\chi','ψ':r'\psi','ω':r'\omega',
 'Δ':r'\Delta','Λ':r'\Lambda','Σ':r'\sum','Π':r'\Pi','∑':r'\sum','∏':r'\prod','Φ':r'\Phi','Ψ':r'\Psi','Ω':r'\Omega',
 '−':'-','·':r'\cdot','×':r'\times','≈':r'\approx','≠':r'\ne','≡':r'\equiv',
 '≤':r'\le','≥':r'\ge','±':r'\pm','∓':r'\mp','⊗':r'\otimes','⨂':r'\bigotimes','⊕':r'\oplus',
 '∈':r'\in','∉':r'\notin','∪':r'\cup','∩':r'\cap','∅':r'\varnothing','∞':r'\infty',
 '→':r'\to','←':r'\leftarrow','↔':r'\leftrightarrow','⇒':r'\Rightarrow','⇔':r'\Leftrightarrow',
 '↦':r'\mapsto','↗':r'\nearrow','↶':r'\curvearrowleft','↷':r'\curvearrowright',
 '⟨':r'\langle','⟩':r'\rangle','‖':r'\Vert','⌈':r'\lceil','⌉':r'\rceil',
 '…':r'\ldots','⋯':r'\cdots','ℓ':r'\ell','ℏ':r'\hbar','⊥':r'\perp',
 'ŵ':r'\widehat{w}','𝓏':'z','½':r'\tfrac12','¼':r'\tfrac14',
 '°':r'{}^{\circ}','†':r'{}^{\dagger}','′':r'{}^{\prime}',
}
OPERATORS={'sin','cos','tan','exp','log','ln','min','max','det','gcd','lim','arg','arccos','arcsin','arctan','sinh','cosh'}
WORDS={'per','una','uno','un','se','su','di','da','in','al','lo','la','le','il','gli','del','dei','con','fra','tra','non','sono','vale','dopo','prima'}
VOID={'input','img','br','hr','meta','link','area','source','wbr'}

class Node:
 def __init__(self,tag='',attrs=None):self.tag=tag;self.attrs=dict(attrs or []);self.children=[]
 def has(self,c):return c in self.attrs.get('class','').split()
 def find(self,c):return next(iter(self.all(c)),None)
 def all(self,c):
  out=[self] if self.has(c) else []
  for x in self.children:
   if isinstance(x,Node):out.extend(x.all(c))
  return out
 def text(self):
  if 'data-math-source' in self.attrs:return self.attrs['data-math-source']
  if self.tag=='svg':return ''
  if self.has('fraction'):
   p=[x.text() for x in self.children if isinstance(x,Node)]
   return '('+p[0]+')/('+p[1]+')' if len(p)==2 else ''.join(p)
  if self.has('matrix'):
   rows=[x for x in self.children if isinstance(x,Node) and x.has('matrix-row')]
   return '['+'; '.join(' | '.join(y.text() for y in x.children if isinstance(y,Node)) for x in rows)+']'
  return ''.join(x.text() if isinstance(x,Node) else x for x in self.children)+ ('\n' if self.tag in {'div','p','h1','h2','h3','h4','figcaption','br','li','tr','label','legend'} else '')
 def html(self):
  case={'viewbox':'viewBox','refx':'refX','refy':'refY','markerwidth':'markerWidth','markerheight':'markerHeight','patternunits':'patternUnits','gradientunits':'gradientUnits','gradienttransform':'gradientTransform','preserveaspectratio':'preserveAspectRatio'}
  tag={'radialgradient':'radialGradient','lineargradient':'linearGradient','foreignobject':'foreignObject','clippath':'clipPath'}.get(self.tag,self.tag)
  attrs=''.join(' '+case.get(k,k)+'="'+escape(v or '',quote=True)+'"' for k,v in self.attrs.items())
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
 def handle_data(self,s):self.stack[-1].children.append(s)

def clean(s):return re.sub(r'\n[ \t]*\n+','\n',s.replace('\u2011','-').replace('\u200b','')).strip()
def plain(s):
 s=unicodedata.normalize('NFC',s).replace('’',"'").replace('–','--').replace('—','---').replace('“','``').replace('”',"''")
 return ''.join({'&':r'\&','%':r'\%','$':r'\$','#':r'\#','_':r'\_','{':r'\{','}':r'\}','~':r'\textasciitilde{}','^':r'\textasciicircum{}','«':r'\guillemotleft{}','»':r'\guillemotright{}','\\':r'\textbackslash{}'}.get(c,c) for c in s)
def group_at(s,i):
 if i>=len(s):return '',i
 if s[i] in '([{':
  opener=s[i];closer={ '(':')','[':']','{':'}'}[opener];depth=1;j=i+1
  while j<len(s):
   if s[j]==opener:depth+=1
   elif s[j]==closer:
    depth-=1
    if not depth:return s[i+1:j],j+1
   j+=1
  return s[i:],len(s)
 m=re.match(r'\d+(?:[.,]\d+)?',s[i:])
 if m:return m[0],i+len(m[0])
 return s[i],i+1
def split_level(s,separator=','):
 out=[];start=0;depth=0
 for i,c in enumerate(s):
  if c in '([{':depth+=1
  elif c in ')]}':depth-=1
  elif c==separator and depth==0:out.append(s[start:i]);start=i+1
 out.append(s[start:]);return out
def mathtex(s):
 s=clean(s);out=[];i=0
 # Source labels consistently denote this subscript rather than a product.
 s=s.replace('ψfinale','ψ_{finale}').replace('ψiniziale','ψ_{iniziale}')
 s=s.replace('r𝓏','r_{z}')
 s=re.sub(r'(⟩|H)⊗(\d+|n|m)',r'\1^{⊗\2}',s)
 s=re.sub(r'(?<![A-Za-z^_])([abcqxrvpP])(\d+)',r'\1_{\2}',s)
 s=re.sub(r'\bA(ij|ji)\b',r'A_{\1}',s).replace('(A†)ij','(A†)_{ij}').replace('Σij','Σ_{ij}')
 s=s.replace('ΠG','Π_{G}')
 s=re.sub(r'([Σ∏])\s*([a-z])\s*=\s*0…([A-Za-z](?:[−-]\d+)?|\d+)',r'\1_{\2=0}^{\3}',s)
 s=re.sub(r'Σ([a-zω])∈([A-Z])',r'Σ_{\1∈\2}',s)
 s=re.sub(r'Σ([acx]),([bs])',r'Σ_{\1,\2}',s)
 s=re.sub(r'([Σ∏])([xsyjkqb])(?=[\s|(])',r'\1_{\2}',s)
 s=s.replace('Σrami','Σ_{rami}')
 s=re.sub(r'⊗j=0…n−1',r'⨂_{j=0}^{n−1}',s)
 s=re.sub(r'Σ\(([a-z])=0,?…[,]?([^)]*)\)',r'Σ_{\1=0}^{\2}',s)
 # In these coordinate pairs the comma separates components; it is not part
 # of the radicand's decimal expansion. ActualText keeps the original source.
 s=re.sub(r'√2,([12])(?=[·/])',r'√(2),\1',s)
 s=s.replace('^f(x)','^{f(x)}')
 s=re.sub(r'\^([A-Za-z])([₀-₉]+)',lambda m:'^{'+m[1]+m[2]+'}',s)
 while i<len(s):
  c=s[i]
  if s.startswith('[[',i):
   end=s.find(']]',i+2)
   if end>=0:
    rows=re.split(r'\]\s*,\s*\[',s[i+2:end]);cells=[split_level(r) for r in rows]
    # The three numeric rotation matrices use Italian decimal commas.
    # Four scalar-looking tokens in each of two rows denote two decimals.
    if len(cells)==2 and all(len(r)==4 and all(re.fullmatch(r'-?0',r[k].strip()) and re.fullmatch(r'\d+',r[k+1].strip()) for k in [0,2]) for r in cells):
     cells=[[r[0]+','+r[1],r[2]+','+r[3]] for r in cells]
    if 1<len(cells)<=8 and len({len(r) for r in cells})==1:
     out.append(r'\begin{pmatrix}'+'\\\\'.join('&'.join(mathtex(x) for x in r) for r in cells)+r'\end{pmatrix}');i=end+2;continue
  if c=='√':
   a,j=group_at(s,i+1);out.append(r'\sqrt{'+mathtex(a)+'}');i=j;continue
  if c in '^_':
   a,j=group_at(s,i+1)
   if c=='_' and i+1<len(s) and re.match('[A-Z]',s[i+1:]):
    m=re.match('[A-Z]+',s[i+1:]);a=m[0];j=i+1+len(a)
   out.append(c+'{'+mathtex(a)+'}');i=j;continue
  if c in SUB or c in SUP:
   mapping=SUB if c in SUB else SUP;j=i
   while j<len(s) and s[j] in mapping:j+=1
   out.append(('_' if mapping is SUB else '^')+'{'+mathtex(''.join(mapping[x] for x in s[i:j]))+'}');i=j;continue
  if c in SYMBOLS:out.append(SYMBOLS[c]+' ');i+=1;continue
  if c=='*':out.append(r'{}^{*}');i+=1;continue
  if c in {'̂','̄'}:
   if out:out[-1]=(r'\hat{' if c=='̂' else r'\bar{')+out[-1]+'}'
   i+=1;continue
  if re.match('[A-Za-zÀ-ÿ]',c):
   m=re.match(r"[A-Za-zÀ-ÿ]+(?:['’][A-Za-zÀ-ÿ]+)?",s[i:]);word=m[0];i+=len(word)
   if word=='exp':out.append(r'\allowbreak\exp ')
   elif word in OPERATORS:out.append('\\'+word+' ')
   elif word in {'Re','Im','Var','Tr','tr','diag','atan2','round','lcm','MCD'}:out.append(r'\operatorname{'+word+'}')
   elif word=='mod':out.append(r'\bmod ')
   elif word in WORDS or (len(word)>2 and word not in {'isk','isj','xyz','abc'}) or any(ord(c)>127 for c in word):out.append(r'\text{'+plain(word)+'}')
   else:out.append(word)
   continue
  if c=='\n':out.append(r'\quad ')
  elif c.isspace():out.append(r'\ ')
  elif c==',' and i and i+1<len(s) and s[i-1].isdigit() and s[i+1].isdigit():out.append('{,}')
  elif c in ',;':out.append(c+r'\allowbreak ')
  elif c in '{}':out.append('\\'+c)
  elif c=='&':out.append(r'\&')
  elif c=='%':out.append(r'\%')
  elif c=='#':out.append(r'\#')
  elif c=='$':out.append(r'\$')
  elif c=='\\':out.append(r'\backslash ')
  elif c=='’':out.append("'")
  elif c in '–—':out.append('-')
  elif c=='~':out.append(r'\sim ')
  elif ord(c)>127:raise ValueError('Unsupported mathematical character '+repr(c)+' in '+s[:160])
  else:out.append(c)
  i+=1
 return ''.join(out)

MATH_CHARS=set(SYMBOLS)|set(SUP)|set(SUB)|set('√=^_{}|<>̂̄*')
def inline(s):
 out=[]
 for item in re.split(r'(\[\[.*?\]\]|\s+)',clean(s)):
  if not item:continue
  if item.isspace():out.append(' ');continue
  if item.startswith(('index.html','http://','https://')):
   out.append(r'\nolinkurl{'+item+'}');continue
  # Ellipses, dash punctuation and typographic quotes remain prose.
  if '[[' in item or any(c in MATH_CHARS-{'·','×','…','–','—','↗'} for c in item) or re.fullmatch(r'(?:[A-HJ-Z]|[abcqxrvpP]\d+)[,.;:]?',item):
   suffix=''
   while item and item[-1] in '.,;:':suffix=item[-1]+suffix;item=item[:-1]
   if item:out.append(r'\('+mathtex(item)+r'\)')
   out.append(plain(suffix))
  else:
   p=[]
   for c in item:
    if c in SYMBOLS:p.append(r'\('+SYMBOLS[c]+r'\)')
    elif c=='·':p.append(r'\textperiodcentered{}')
    else:p.append(plain(c))
   out.append(''.join(p))
 return ''.join(out)

def actual_hex(s):return clean(s).encode('utf-16-be').hex().upper()
def math_chunks(s,limit=240):
 """Split at explicit lines or operators, preserving powers and complete numbers."""
 result=[]
 for line in clean(s).splitlines():
  if not line.strip():continue
  protected=set();i=0
  while i<len(line):
   if line[i]=='^' and i+1<len(line) and line[i+1]=='(':
    _,j=group_at(line,i+1);protected.update(range(i,j));i=j
   else:i+=1
  start=0;last=None
  for i,c in enumerate(line):
   if i not in protected and (c in ';=+−' or (c==',' and not (i and i+1<len(line) and line[i-1].isdigit() and line[i+1].isdigit()))):last=i+1
   if i-start>limit and last and last>start:
    result.append(line[start:last]);start=last;last=None
  if line[start:].strip():result.append(line[start:])
 return result

def rgb(value):
 if value in {'none','transparent'}:return 'none'
 if value.startswith('url('):return 'Ink!5'
 if value.startswith('#'):
  s=value[1:];s=''.join(c*2 for c in s) if len(s)==3 else s
  r,g,b=[int(s[i:i+2],16) for i in (0,2,4)]
 elif value.startswith('rgb'):
  r,g,b=map(float,re.findall(r'[\d.]+',value)[:3])
 else:return {'white':'white','black':'black','currentColor':'Ink'}.get(value,value)
 return '{rgb,255:red,'+str(r)+';green,'+str(g)+';blue,'+str(b)+'}'
def num(x):return f'{float(x):.5f}'.rstrip('0').rstrip('.') or '0'
def arc_points(x1,y1,rx,ry,phi,large,sweep,x2,y2):
 rx,ry=abs(rx),abs(ry)
 if not rx or not ry or (x1==x2 and y1==y2):return [(x2,y2)]
 p=math.radians(phi);co,si=math.cos(p),math.sin(p);dx,dy=(x1-x2)/2,(y1-y2)/2
 xp,yp=co*dx+si*dy,-si*dx+co*dy;scale=xp*xp/(rx*rx)+yp*yp/(ry*ry)
 if scale>1:rx*=math.sqrt(scale);ry*=math.sqrt(scale)
 term=max(0,(rx*rx*ry*ry-rx*rx*yp*yp-ry*ry*xp*xp)/(rx*rx*yp*yp+ry*ry*xp*xp))
 sign=-1 if bool(large)==bool(sweep) else 1;factor=sign*math.sqrt(term)
 cxp,cyp=factor*rx*yp/ry,-factor*ry*xp/rx
 cx,cy=co*cxp-si*cyp+(x1+x2)/2,si*cxp+co*cyp+(y1+y2)/2
 start=math.atan2((yp-cyp)/ry,(xp-cxp)/rx);end=math.atan2((-yp-cyp)/ry,(-xp-cxp)/rx);delta=end-start
 if sweep and delta<0:delta+=2*math.pi
 if not sweep and delta>0:delta-=2*math.pi
 count=max(8,int(abs(delta)*24));out=[]
 for k in range(1,count+1):
  a=start+delta*k/count;out.append((cx+co*rx*math.cos(a)-si*ry*math.sin(a),cy+si*rx*math.cos(a)+co*ry*math.sin(a)))
 return out

def svg_tikz(svg):
 root=ET.fromstring(svg);bounds=list(map(float,root.attrib['viewBox'].split()));lines=[]
 def xy(x,y):return '('+num(x)+','+num(y)+')'
 def opts(a,text=False):
  o=[];fill=a.get('fill','black');stroke=a.get('stroke','none')
  if text:o.append('text='+rgb(fill if fill!='none' else '#253137'))
  else:
   o.extend(['draw='+rgb(stroke),'fill='+rgb(fill)])
   if stroke!='none':o.append('line width='+num(float(a.get('stroke-width','1'))*.75)+'pt')
   if a.get('marker-end'):o.append('-{Stealth[length=5pt,width=4pt]}')
   if a.get('stroke-dasharray'):
    ds=re.findall(r'[\d.]+',a['stroke-dasharray'])
    if ds:o.append('dash pattern=on '+num(float(ds[0])*.75)+'pt off '+num(float(ds[-1])*.75)+'pt')
  for key in ['opacity','fill-opacity']:
   if key in a:o.append(('fill opacity' if key=='fill-opacity' else 'opacity')+'='+a[key])
  return ','.join(o)
 def path(d):
  tok=re.findall(r'[A-Za-z]|[-+]?(?:\d*\.\d+|\d+\.?\d*)(?:[eE][-+]?\d+)?',d);i=0;cmd=None;x=y=0;parts=[]
  while i<len(tok):
   if tok[i].isalpha():cmd=tok[i];i+=1
   if cmd=='Z':parts.append('--cycle');cmd=None;continue
   n={'M':2,'L':2,'H':1,'V':1,'A':7}.get(cmd)
   if n is None:raise ValueError('Unsupported SVG path command '+str(cmd))
   v=list(map(float,tok[i:i+n]));i+=n
   if cmd=='M':x,y=v;parts.append(xy(x,y));cmd='L'
   elif cmd=='L':x,y=v;parts.append('--'+xy(x,y))
   elif cmd=='H':x=v[0];parts.append('--'+xy(x,y))
   elif cmd=='V':y=v[0];parts.append('--'+xy(x,y))
   else:
    for xx,yy in arc_points(x,y,*v):parts.append('--'+xy(xx,yy))
    x,y=v[-2:]
  return ' '.join(parts)
 def walk(e,parent):
  tag=e.tag.rsplit('}',1)[-1]
  if tag in {'defs','marker','title','desc','pattern','radialGradient','linearGradient','foreignObject','stop'}:return
  a={**parent,**e.attrib}
  if 'style' in a:
   a.update(dict(x.split(':',1) for x in a['style'].split(';') if ':' in x))
  transform=e.attrib.get('transform','')
  if transform:
   options=[]
   for mode,args in re.findall(r'(translate|rotate)\(([^)]+)\)',transform):
    v=list(map(float,re.findall(r'[-\d.]+',args)))
    if mode=='translate':options.append('shift={'+xy(v[0],v[1] if len(v)>1 else 0)+'}')
    else:options.append('rotate='+num(-v[0]))
   lines.append(r'\begin{scope}['+','.join(options)+']')
  if tag in {'g','svg'}:
   for c in e:walk(c,{k:v for k,v in a.items() if k not in {'transform','id','style'}})
  elif tag=='text':
   text=''.join(e.itertext()).strip()
   if text:
    anchor={'start':'base west','middle':'base','end':'base east'}.get(a.get('text-anchor','start'),'base west')
    # At B5 width this keeps wide-diagram labels near 7 pt and paired
    # 400-unit component planes near 7.5 pt, while retaining larger labels.
    fs=max(float(a.get('font-size','16'))*.75,12,bounds[2]*.75*7/385)
    font=r'\sffamily\fontsize{'+num(fs)+'}{'+num(fs*1.2)+r'}\selectfont'+(r'\bfseries' if a.get('font-weight') in {'bold','600','700','800'} else '')
    lines.append(r'\node[inner sep=0pt,outer sep=0pt,anchor='+anchor+',font={'+font+'},'+opts(a,True)+'] at '+xy(a.get('x',0),a.get('y',0))+' {'+inline(text)+'};')
  elif tag=='circle':lines.append(r'\path['+opts(a)+'] '+xy(a.get('cx',0),a.get('cy',0))+' circle[radius='+num(a.get('r',0))+'];')
  elif tag=='ellipse':lines.append(r'\path['+opts(a)+'] '+xy(a.get('cx',0),a.get('cy',0))+' ellipse[x radius='+num(a.get('rx',0))+',y radius='+num(a.get('ry',0))+'];')
  elif tag=='rect':
   x,y,w,h=[float(a.get(k,0)) for k in ['x','y','width','height']]
   if w>0 and h>0:lines.append(r'\path['+opts(a)+((',rounded corners='+num(float(a['rx'])*.75)+'pt') if 'rx' in a else '')+'] '+xy(x,y)+' rectangle '+xy(x+w,y+h)+';')
  elif tag=='line':lines.append(r'\path['+opts(a)+'] '+xy(a.get('x1',0),a.get('y1',0))+'--'+xy(a.get('x2',0),a.get('y2',0))+';')
  elif tag=='path':lines.append(r'\path['+opts(a)+'] '+path(a['d'])+';')
  else:raise ValueError('Unsupported SVG element '+tag)
  if transform:lines.append(r'\end{scope}')
 lines.append(r'\begin{tikzpicture}[x=.75pt,y=-.75pt,line join=round,line cap=round]')
 lines.append(r'\path[use as bounding box] '+xy(bounds[0],bounds[1])+' rectangle '+xy(bounds[0]+bounds[2],bounds[1]+bounds[3])+';')
 walk(root,{})
 lines.append(r'\end{tikzpicture}')
 return '\n'.join(lines)+'\n'
