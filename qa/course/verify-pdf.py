"""Check generated guides: glyphs, content, figure coverage, links and page bounds."""
import json
from pathlib import Path
import fitz

ROOT=Path(__file__).resolve().parents[2]
metrics=json.loads((ROOT/'qa/course/pdf-content-results.json').read_text())
reports=[]
for name,chapters in [('Guida_corso.pdf',[1,2]),('Guida_capitolo_1.pdf',[1]),('Guida_capitolo_2.pdf',[2])]:
    d=fitz.open(ROOT/'public'/name)
    expected={k:v for k,v in metrics.items() if int(k[1]) in chapters}
    text='\n'.join(p.get_text() for p in d)
    assert '\x00' not in text and '\ufffd' not in text, name+' missing glyph'
    assert 'To be done' in text or len(chapters)==1
    assert len([t for t in d.get_toc() if t[0]==2])==len(expected), name+' chapter bookmarks'
    assert sum(len(p.get_links()) for p in d)>=2*len(expected), name+' navigation links'
    outside=[]
    for i,p in enumerate(d):
        for block in p.get_text('blocks'):
            box=fitz.Rect(block[:4])
            if box.x0<-.5 or box.y0<-.5 or box.x1>p.rect.width+.5 or box.y1>p.rect.height+.5:
                outside.append({'page':i+1,'bounds':list(box)})
    assert not outside, (name,outside)
    images=sum(len(p.get_image_info()) for p in d)
    assert images>=sum(v['figures'] for v in expected.values()), name+' figure coverage'
    for key in ['c1-calcolo','c1-coppie','c1-ambiente','c1-informazione','c1-sintesi']:
        if key in expected: assert expected[key]['notebook_explanations']>=4, key+' missing explanations'
    if 2 in chapters:
        assert sum(v['calculation_steps'] for k,v in expected.items() if k.startswith('c2-'))>=130
        assert '13/15' in text and '26/25' in text, name+' reference experiment'
    reports.append({'file':name,'pages':len(d),'figures':images,'outsidePage':outside,'missingGlyphs':0,'demonstrations':len(expected),'links':sum(len(p.get_links()) for p in d)})
(ROOT/'qa/course/pdf-layout-results.json').write_text(json.dumps(reports,ensure_ascii=False,indent=2)+'\n')
print(json.dumps(reports,ensure_ascii=False))
