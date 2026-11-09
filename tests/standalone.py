"""Verify exact hash-based CSP of the generated standalone preview."""
from pathlib import Path
import sys,re,hashlib,base64
p=Path(sys.argv[1]) if len(sys.argv)>1 else Path(__file__).resolve().parents[1]/'QuantumLab_anteprima.html'
s=p.read_text();scripts=re.findall(r'<script>([\s\S]*?)</script>',s)
assert scripts, 'No scripts found'
for script in scripts:
 h=base64.b64encode(hashlib.sha256(script.encode()).digest()).decode()
 assert "'sha256-"+h+"'" in s, 'CSP hash mismatch'
assert "connect-src 'none'" in s
print(f'PASS: {len(scripts)} script hashes, network connections disabled by CSP.')
