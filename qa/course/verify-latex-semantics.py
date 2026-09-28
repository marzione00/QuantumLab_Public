"""Regression cases for notation that was ambiguous in the HTML-to-TeX export."""
from pathlib import Path
import sys
sys.path.insert(0,str(Path(__file__).resolve().parents[2]/'scripts'))
from latex_support import mathtex,inline

# Each test expresses a mathematical reading, independently of page layout.
assert mathtex('(-1)^f(x)')=='(-1)^{f(x)}'
assert mathtex('z^x₀')=='z^{x_{0}}'
assert r'\sqrt{2},' in mathtex('(3/√2,1/√2)')
assert r'\sqrt{1{,}1094}' in mathtex('√1,1094')
rotation=mathtex('[[0,8,-0,6],[0,6,0,8]]')
assert rotation.count('&')==2 and rotation.count('\\\\')==1
assert r'0{,}8&-0{,}6' in rotation
square=mathtex('[[1,0,0,0],[0,1,0,0],[0,0,0,1],[0,0,1,0]]')
assert square.count('&')==12 and square.count('\\\\')==3
assert r'\begin{pmatrix}' in inline('A = [[1, 0], [i, 1]].')
assert mathtex('cₐᵦ')=='c_{ab}'
assert r'\text{è}' in mathtex('è definito')
assert mathtex('r𝓏')=='r_{z}'
assert r'\otimes 9' in mathtex('|0⟩⊗9|1⟩') and '^{\\otimes 9}' in mathtex('|0⟩⊗9|1⟩')
assert mathtex('b0²')=='b_{0}^{2}'
assert mathtex('α*β')==r'\alpha {}^{*}\beta '
assert mathtex('Σ j=0…8')==r'\sum _{j=0}^{8}'
assert mathtex('(-1)^b2^(-n)')=='(-1)^{b}2^{-n}'
assert mathtex('x_q2^(m−1−q)')==r'x_{q}2^{m- 1- q}'
assert mathtex('Σj=0…8')==r'\sum _{j=0}^{8}'
assert mathtex('Σx=0…511')==r'\sum _{x=0}^{511}'
assert mathtex('ΠG')==r'\Pi _{G}'
assert mathtex('Σx∈G')==r'\sum _{x\in G}'
assert mathtex('∏j e')==r'\prod _{j}\ e'
assert mathtex('x0')=='x_{0}'
print('23 controlli di interpretazione della notazione superati.')
