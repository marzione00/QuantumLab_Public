"""Independent numerical checks of the 60 worked exercises; no UI/model changes."""
from pathlib import Path
import json, math, re, hashlib
from fractions import Fraction as F
import numpy as np
from scipy.linalg import expm
ROOT=Path(__file__).resolve().parents[2]
results={};current=''
def begin(id): 
 global current
 current=id;results[id]=0
def check(actual,expected,atol=2e-11):
 np.testing.assert_allclose(actual,expected,atol=atol,rtol=2e-10,err_msg=current)
 results[current]+=1
def true(value):
 assert value,current
 results[current]+=1
H=np.array([[1,1],[1,-1]])/np.sqrt(2);X=np.array([[0,1],[1,0]]);Z=np.diag([1,-1]);I=np.eye(2)
Y=np.array([[0,-1j],[1j,0]]);zero=np.array([1,0]);one=np.array([0,1]);plus=H@zero;minus=H@one
C=np.eye(4)[[0,1,3,2]];HH=np.kron(H,H)
def phase(t):return np.diag([1,np.exp(1j*t)])
def prob(v):return np.abs(v)**2
def bloch(v):return [np.vdot(v,M@v).real for M in [X,Y,Z]]
def qpe(p,Q):return np.fft.fft(np.exp(2j*np.pi*p*np.arange(Q)))/Q
def grover(N,marked):
 O=np.eye(N);O[marked,marked]=-1
 return (2*np.ones((N,N))/N-np.eye(N))@O
def cf(p,q):
 a=[]
 while q:a.append(p//q);p,q=q,p%q
 return a
def order(a,N):
 y=1
 for r in range(1,N+1):
  y=y*a%N
  if y==1:return r
 raise AssertionError()
begin('G1.01');check(2+3*np.arange(3),[2,5,8]);check(2-np.arange(3),[2,1,0])
begin('G1.02');check(1+np.array([1.8,2.2])*5,[10,12]);check(1+np.array([1.8,2.2])*10,[19,23])
begin('G1.03');check(1+2*3-2*3,1)
begin('G1.04');check(1+2*3-1.9*3,1.3);check(np.array([-1,0,1])+np.array([-.1,0,.1])*3,[-1.3,0,1.3])
begin('G1.05');check(1+np.exp(1j*np.array([0,np.pi/2,np.pi])),[2,1+1j,0])
begin('G1.06');check(prob(2+np.exp(1j*np.array([0,np.pi/3,np.pi/2,np.pi]))),[9,7,5,1]);check((9-1)/(9+1),.8)
begin('G1.07');check(550e-9/20e-6,[.0275]);check(np.sinc(.5)**2,4/np.pi**2);check((20e-6)**2/550e-9,.0007272727272727273)
begin('G1.08');check(np.array([20e-6,.001,.008])**2/550e-9,[.0007272727272727273,1.8181818181818,116.363636363636]);check(np.clip((4+.08-np.array([3.92,4,4.08]))/.16,0,1),[1,.5,0])
begin('G1.09');check(prob([np.cos(np.pi/6),np.sin(np.pi/6)]),[.75,.25])
begin('G1.10');check(bloch(np.array([np.sqrt(3),1])/2),[np.sqrt(3)/2,0,.5]);check(bloch(np.array([np.sqrt(3),1j])/2),[0,np.sqrt(3)/2,.5])
begin('G1.11');check(prob(H@phase(np.pi/2)@H@zero),[.5,.5]);check(prob(H@phase(np.pi)@H@zero),[0,1]);check(np.diag(H@np.diag([.5,.5])@H),[.5,.5])
begin('G1.12');joint=np.array([[.4,.1],[.1,.4]]);check(joint.sum(0),[.5,.5]);check((joint*np.outer([1,-1],[1,-1])).sum(),.6);check(joint[0,0]/joint[0].sum(),.8)
begin('G1.13')
for gamma in [0,.5,1]:
 v=np.zeros(8);v[0]=1/np.sqrt(2);v[6]=gamma/np.sqrt(2);v[7]=np.sqrt(1-gamma**2)/np.sqrt(2)
 out=np.kron(HH,I)@v
 check(prob(out).reshape(4,2).sum(1),[(1+gamma)/4,(1-gamma)/4,(1-gamma)/4,(1+gamma)/4])
begin('G1.14');check(prob(plus),prob(minus));check(prob(H@plus),[1,0]);check(prob(H@minus),[0,1])
begin('G1.15');check((prob(H@plus)+prob(H@minus))/2,[.5,.5]);check(prob(H@plus),[1,0])
begin('G2.01');z=-1+1j*np.sqrt(3);check([abs(z),np.angle(z)],[2,2*np.pi/3]);check(1/z,(-1-1j*np.sqrt(3))/4)
begin('G2.02');check([(1+1j)+(1-1j),(1+1j)*(1-1j),(1+1j)**2],[2,2,2j])
begin('G2.03');v=np.array([1+1j,2]);check(np.linalg.norm(v),np.sqrt(6));check(np.linalg.norm(v/np.sqrt(6)),1)
begin('G2.04');u=np.array([1,1j])/np.sqrt(2);v=np.array([2,1]);p=u*np.vdot(u,v);check(p,[1-.5j,.5+1j]);check(np.vdot(u,v-p),0);check([np.vdot(p,p),np.vdot(v-p,v-p)],[2.5,2.5])
begin('G2.05');v=np.array([2,0]);p=plus*np.vdot(plus,v);check(p,[1,1]);check((v-p)/np.linalg.norm(v-p),minus);check(H@v,[np.sqrt(2)]*2)
begin('G2.06');A=np.array([[1,2],[2,4]]);check(A@[-2,1],[0,0]);check(A@[3,-1],A@[1,0]);true(np.linalg.matrix_rank(A)==1)
begin('G2.07');A=np.array([[0,-1],[1,0]]);B=np.array([[1,1],[0,1]]);check(A@B@[1,1],[-1,2]);check(B@A@[1,1],[0,1]);check(A@B-B@A,np.diag([-1,1]))
begin('G2.08');S=np.array([[1,1],[1,-1]]);A=np.diag([2,1]);check(np.linalg.solve(S,[3,1]),[2,1]);check(np.linalg.solve(S,A@S),np.array([[3,1],[1,3]])/2);check(S@[3.5,2.5],[6,1])
begin('G2.09');U=(I+1j*X)/np.sqrt(2);check(U.conj().T@U,I);check(U@U@zero,1j*one)
begin('G2.10');A=np.array([[2,1],[1,2]]);check(np.linalg.eigvalsh(A),[1,3]);check(A@A,[[5,4],[4,5]]);check(expm(-1j*np.pi*A/2),1j*X)
begin('G2.11');p=np.array([1,2,1])/4;x=np.arange(3);check([p@x,p@(x*x)],[1,1.5]);check(p[1:]/p[1:].sum(),[2/3,1/3]);check(np.array([9,22,9])@((x-1)**2)/40,.45)
begin('G2.12');v=np.array([np.sqrt(3),1j])/2;check(H@v,np.array([np.sqrt(3)+1j,np.sqrt(3)-1j])/(2*np.sqrt(2)));check(bloch(H@v),[.5,-np.sqrt(3)/2,0])
begin('G2.13');A=X+Z;lam,V=np.linalg.eigh(A);p=prob(V.conj().T@zero);check(p,[(2-np.sqrt(2))/4,(2+np.sqrt(2))/4]);check(p@lam,1);check(p@(lam*lam)-(p@lam)**2,1);check(sum(p[j]*prob(V[:,j]) for j in range(2)),[.75,.25])
begin('G2.14');v=np.kron(np.array([1,1j])/np.sqrt(2),np.array([np.sqrt(3),1])/2);check(np.kron(I,H)@v,np.array([np.sqrt(3)+1,np.sqrt(3)-1,1j*(np.sqrt(3)+1),1j*(np.sqrt(3)-1)])/4)
begin('G2.15');check(np.linalg.det(np.array([1,1,1j,1j]).reshape(2,2)/2),0);check(np.linalg.det(np.array([1,0,0,1]).reshape(2,2)/np.sqrt(2)),.5)
begin('G3.01');v=np.array([2,-1])/np.sqrt(5);check(Z@H@v,np.array([1,-3])/np.sqrt(10));check(H@Z@v,np.array([3,1])/np.sqrt(10))
begin('G3.02');T=np.eye(8)[[0,1,2,3,4,5,7,6]];check(T@T,np.eye(8));check(T@(np.eye(8)[4]+np.eye(8)[6]),np.eye(8)[4]+np.eye(8)[7])
begin('G3.03');v=np.array([np.sqrt(3),1])/2;check(X@v,[.5,np.sqrt(3)/2]);check(Z@v,[np.sqrt(3)/2,-.5]);check(H@v,np.array([np.sqrt(3)+1,np.sqrt(3)-1])/(2*np.sqrt(2)))
begin('G3.04');theta=2*np.arctan(.5);v=phase(np.pi/2)@expm(-1j*theta*Y/2)@zero;check(v,np.array([2,1j])/np.sqrt(5));check(bloch(v),[0,.8,.6])
begin('G3.05');U=phase(np.pi/3)@H;check(U.conj().T@U@zero,zero);check(prob(phase(-np.pi/3)@H@U@zero),[.75,.25])
begin('G3.06');v=H@phase(np.pi/3)@H@zero;check(v,np.array([3+1j*np.sqrt(3),1-1j*np.sqrt(3)])/4);check(400*.75*.25,75)
begin('G3.07');v=np.kron(zero,one);check(np.kron(H,I)@v,[0,1/np.sqrt(2),0,1/np.sqrt(2)]);check(np.kron(I,H)@v,[1/np.sqrt(2),-1/np.sqrt(2),0,0])
begin('G3.08');v=C@np.array([3,0,-1,2j])/np.sqrt(14);check(v,np.array([3,0,2j,-1])/np.sqrt(14));check(prob(v).reshape(2,2).sum(0),[13/14,1/14])
begin('G3.09');v=C@np.kron(H,I)@np.eye(4)[0];check(prob(HH@v),[.5,0,0,.5]);check(prob(np.kron(I,H)@v),[.25]*4)
begin('G3.10');v=T@np.kron(np.kron(plus,plus),zero);v=np.kron(np.eye(4),Z)@v;check(prob(np.kron(HH,I)@v).reshape(4,2).sum(1),[.625,.125,.125,.125]);check(prob(np.kron(HH,I)@T@v).reshape(4,2).sum(1),[.25]*4)
begin('G3.11');check(np.kron(I,H)@np.diag([1,1,1,-1])@np.kron(I,H),C)
begin('G3.12')
for f in [[0,0],[1,1],[0,1],[1,0]]:
 U=np.zeros((4,4))
 for x in range(2):
  for y in range(2):U[2*x+(y^f[x]),2*x+y]=1
 v=np.kron(H,I)@U@np.kron(plus,minus);check(prob(v).reshape(2,2).sum(1),[1,0] if f[0]==f[1] else [0,1])
begin('G3.13');Q=grover(4,[3]);v=np.ones(4)/2;check(prob(Q@v),[0,0,0,1]);check(Q@Q@v,[-.5,-.5,-.5,.5])
begin('G3.14');K=X+Z;U=expm(-1j*np.pi*K/(4*np.sqrt(2)));v=U@zero;check(v,[1/np.sqrt(2)-.5j,-.5j]);check(bloch(v),[.5,-1/np.sqrt(2),.5]);check(U.conj().T@v,zero)
begin('G3.15');v=np.kron(np.array([2,1j])/np.sqrt(5),zero);v=np.kron(I,H)@C@np.kron(H@phase(np.pi/2),I)@v;check(v,np.array([1,1,3,-3])/np.sqrt(20))
begin('G4.01');bits=lambda x:[x>>2&1,x>>1&1,x&1];f=[(bits(x)[0]*bits(x)[1])^bits(x)[2] for x in range(8)];HHH=np.kron(H,HH);v=HHH@((-1.)**np.array(f)/np.sqrt(8));check(v,[0,.5,0,.5,0,.5,0,-.5]);s=np.array([1,0,1]);check(prob(HHH@np.array([(-1)**(np.dot(bits(x),s)%2) for x in range(8)])/np.sqrt(8)),np.eye(8)[5])
begin('G4.02');check(HHH@((np.eye(8)[2]+np.eye(8)[7])/np.sqrt(2)),[.5,0,-.5,0,0,.5,0,-.5]);true(all(sum(a*b for a,b in zip(bits(y),[1,0,1]))%2==0 for y in [0,2,5,7]))
begin('G4.03');a=np.kron(zero,plus);b=np.kron(plus,zero);check([np.linalg.norm((a+b)/2)**2,np.linalg.norm((a-b)/2)**2],[.75,.25])
begin('G4.04');Q=grover(8,[5]);v=np.ones(8)/np.sqrt(8)
for expected in [25/32,121/128,169/512]:v=Q@v;check(prob(v)[5],expected);check(np.linalg.norm(v),1)
begin('G4.05');values=np.array([9,4,7,1,6,3,8,2]);t=4;trace=[]
for j,c in zip([1,1,1,2],[5,7,0,3]):
 marked=np.where(values<t)[0];v=np.linalg.matrix_power(grover(8,marked),j)@np.ones(8)/np.sqrt(8);trace.append(prob(v)[c]);t=min(t,values[c])
check(trace,[9/32,.5,1/32,121/128]);check(np.prod(trace),1089/262144);check(t,1)
begin('G4.06');F4=np.exp(2j*np.pi*np.outer(np.arange(4),np.arange(4))/4)/2;v=F4[:,1];check(v,np.array([1,1j,-1,-1j])/2);check(F4.conj().T@v,np.eye(4)[1]);SW=np.eye(4)[[0,2,1,3]];check(SW@np.kron(I,H)@np.diag([1,1,1,1j])@np.kron(H,I)@np.eye(4)[1],v)
begin('G4.07');check(prob(qpe(3/8,8)),np.eye(8)[3]);check(prob(H@phase(3*np.pi/4)@H@zero)[0],(2-np.sqrt(2))/4)
begin('G4.08');p=prob(qpe(1/3,8));check(p,3/(256*np.sin(np.pi*(1/3-np.arange(8)/8))**2));check(p.sum(),1);check(p[3],.6878376625896205)
begin('G4.09');Qg=grover(8,[1,5]);b=np.array([1,0,1,1,1,0,1,1])/np.sqrt(6);g=np.array([0,1,0,0,0,1,0,0])/np.sqrt(2);u=(b-1j*g)/np.sqrt(2);check(Qg@u,np.exp(1j*np.pi/3)*u)
v=np.ones(8)/np.sqrt(8);joint=np.array([np.linalg.matrix_power(Qg,x)@v for x in range(16)])/4;dist=prob(np.fft.fft(joint,axis=0)/4).sum(1);check(dist,(prob(qpe(1/6,16))+prob(qpe(5/6,16)))/2);check(8*np.sin(3*np.pi/16)**2,2.4692662705396407)
begin('G4.10');check(pow(3,-1,20),7)
for m,c in [(7,13),(5,15)]:check(pow(m,3,55),c);check(pow(c,7,55),m)
true(all(pow(pow(m,3,55),7,55)==m for m in range(55)))
begin('G4.11');perm=[(y+3)%5 if y<5 else y for y in range(8)];true(sorted(perm)==list(range(8)))
for y,r in enumerate(perm):
 v=int(y<5);q=int(y<5 and y>=2);check(q^(v and r<3),0);check(v^(r<5),0)
for y in range(16):check(((y<<1)&15)|(y>>3),2*y%15 if y<15 else 15)
begin('G4.12');U=np.eye(4)[[3,0,1,2]];V=np.exp(-2j*np.pi*np.outer(np.arange(4),np.arange(4))/4)/2;check(U@V,V@np.diag(np.exp(2j*np.pi*np.arange(4)/4)));check(V.conj().T@V,np.eye(4));check(V@np.ones(4)/2,[1,0,0,0]);check(order(2,21),6)
begin('G4.13');check(cf(85,512),[0,6,42,2]);check(cf(171,512),[0,2,1,170]);true(F(85,512)-F(1,6)==-F(1,1536));true(F(171,512)-F(1,3)==F(1,1536));check([pow(2,3,21),pow(2,6,21)],[8,1])
def shor(N,a,Q):
 state=np.zeros((Q,2**math.ceil(math.log2(N))),complex)
 for x in range(Q):state[x,pow(a,x,N)]=1/np.sqrt(Q)
 return np.fft.fft(state,axis=0)/np.sqrt(Q)
begin('G4.14');out=shor(15,2,256);p=prob(out).sum(1);expected=np.zeros(256);expected[[0,64,128,192]]=.25;check(p,expected);check(out[64,[1,2,4,8]]/np.sqrt(p[64]),np.array([1,-1j,-1,1j])/2);check([math.gcd(3,15),math.gcd(5,15)],[3,5])
begin('G4.15');out=shor(21,2,512);p=prob(out).sum(1);expected=(2*np.sin(86*np.pi/256)**2+4*np.sin(85*np.pi/256)**2)/(512**2*np.sin(np.pi/256)**2);check(p[85],expected);check(p[171],p[85]);check(p[[0,256]],[43692/262144]*2);check(p.sum(),1);true(np.all(p>0));check([order(5,21),pow(5,3,21)],[6,20]);check([math.gcd(7,21),math.gcd(9,21),math.gcd(19,21)],[7,3,1])
manifest=json.loads((ROOT/'guide-latex/esercizi/manifest.json').read_text())
true(set(results)=={x['id'] for x in manifest})
sources=[]
for ex in manifest:
 s=(ROOT/'guide-latex'/ex['source']).read_text()
 assert len(re.findall(r'\\ExFigure\{',s))>=2,ex['id']
 assert len(re.findall(r'\\ExStep\{',s))>=4,ex['id']
 assert all('\\ExRef{'+r['label']+'}' in s for r in ex['theory']),ex['id']
 sources.append({'id':ex['id'],'checks':results[ex['id']],'sha256':hashlib.sha256(s.encode()).hexdigest()})
report={'exercise_count':60,'checks':sum(results.values()),'method':'Independent NumPy/SciPy matrix evolution, FFT, modular arithmetic and exact fractions; tolerance 2e-11 absolute, 2e-10 relative. Source hash binds the checked edition.','exercises':sources}
(ROOT/'qa/course/guided-exercises-numerical-results.json').write_text(json.dumps(report,indent=2)+'\n')
print(json.dumps({'exercises':60,'checks':sum(results.values()),'status':'passed'}))
