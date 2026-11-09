"""Verify every Classica PDF: source contents, fonts, figures, links and bounds."""
from pathlib import Path
import argparse,json,re,subprocess,sys
import fitz
ROOT=Path(__file__).resolve().parents[2]
parser=argparse.ArgumentParser(description=__doc__)
parser.add_argument('--output-dir',type=Path,default=ROOT/'public')
parser.add_argument('--report-dir',type=Path,default=ROOT/'qa/course')
args=parser.parse_args();args.report_dir.mkdir(parents=True,exist_ok=True)
metrics=json.loads((ROOT/'qa/course/pdf-content-results.json').read_text())
ledger=json.loads((ROOT/'guide-latex/content-ledger.json').read_text())
def normal(s):
    return re.sub(r'\s+','',s).replace('’',"'").replace('−','-').replace('–','-').replace('\ufeff','')
def selection(kind,chapters):
    return [item for c in chapters for item in ledger[kind][slice(*ledger['chapter_ranges'][str(c)][kind])]]
reports=[];content=[]
for name,chapters in [('Guida_corso.pdf',[1,2,3,4])]+[(f'Guida_capitolo_{c}.pdf',[c]) for c in [1,2,3,4]]:
    path=args.output_dir/name
    # Crop repeated page furniture only. The full body occupies y=45..658 pt.
    raw=subprocess.check_output(['pdftotext','-raw','-x','0','-y','39','-W','500','-H','622',str(path),'-']).decode()
    text=normal(raw)
    formulas=selection('formulas',chapters);rows=selection('rows',chapters)
    missing_formulas=[s[:140] for s in formulas if normal(s) not in text]
    missing_rows=[r for r in rows if normal(''.join(r)) not in text]
    assert not missing_formulas,(name,'missing formulas',missing_formulas[:8])
    assert not missing_rows,(name,'missing rows',missing_rows[:8])
    d=fitz.open(path);expected={k:v for k,v in metrics.items() if int(k[1]) in chapters}
    visible='\n'.join(p.get_text() for p in d)
    assert '\x00' not in visible and '\ufffd' not in visible,name+' missing glyph'
    assert len([t for t in d.get_toc() if t[0]==2 and not t[1].startswith('Appendici')])==len(expected),(name,'section bookmarks')
    outside=[];figures=0;links=0;bad_links=[];font_refs=set();fonts=set()
    for i,page in enumerate(d):
        assert abs(page.rect.width-498.898)<.1 and abs(page.rect.height-708.661)<.1
        for block in page.get_text('blocks'):
            box=fitz.Rect(block[:4])
            if box.x0<-.5 or box.y0<-.5 or box.x1>page.rect.width+.5 or box.y1>page.rect.height+.5:outside.append({'page':i+1,'bounds':list(box)})
        # Included vector figure pages have one top-level PDF Form per placement.
        figures+=sum(1 for obj in page.get_xobjects() if obj[2]==0)
        for link in page.get_links():
            links+=1
            if link.get('kind')==fitz.LINK_GOTO and not 0<=link.get('page',-1)<len(d):bad_links.append((i+1,link))
        for font in page.get_fonts(full=True):font_refs.add(font[0]);fonts.add(font[3])
    assert not outside,(name,'outside page',outside[:8])
    assert not bad_links,(name,'invalid links',bad_links[:8])
    expected_figures=sum(v['figures'] for v in expected.values())
    assert figures==expected_figures,(name,'figures',figures,expected_figures)
    assert links>=len(expected)
    for ref in font_refs:
        base,ext,kind,data=d.extract_font(ref)
        assert data and kind!='Type3',(name,'font not embedded',base,kind)
    assert any('Iwona' in s for s in fonts) and any('Palladio' in s for s in fonts) and any('EURM' in s for s in fonts)
    log=(ROOT/'guide-latex/compilazione'/path.with_suffix('.log').name).read_text(errors='replace')
    assert not re.search(r'Missing character|Undefined control sequence|LaTeX Error|invalid in math mode',log),(name,'LaTeX error')
    overfull=[float(x) for x in re.findall(r'Overfull \\[hv]box \(([0-9.]+)pt',log)]
    assert not any(x>.5 for x in overfull),(name,'overfull boxes',overfull[:10])
    assert 'undefined references' not in log and 'Rerun to get cross-references right' not in log,(name,'unresolved references')
    report={'file':name,'pages':len(d),'figures':figures,'outsidePage':outside,'missingGlyphs':0,'demonstrations':len(expected),'links':links,'formulasVerified':len(formulas),'dataRowsVerified':len(rows),'embeddedFontCount':len(font_refs),'overfullBoxes':len(overfull),'format':'B5','theme':'ArsClassica 01 Classica'}
    reports.append(report)
    content.append({'file':name,'pages':len(d),'bookmarks':len(d.get_toc()),'links':links,'missing_glyphs':0,'data_rows_verified':sum(x.get('data_rows',0) for x in expected.values()),'expanded_equations_verified':sum(x.get('expanded_formulas',0) for x in expected.values()),'all_formulas_verified':len(formulas)})
    print(json.dumps(report,ensure_ascii=False),flush=True)
(args.report_dir/'pdf-layout-results.json').write_text(json.dumps(reports,ensure_ascii=False,indent=2)+'\n')
(args.report_dir/'pdf-results.json').write_text(json.dumps(content,ensure_ascii=False,indent=2)+'\n')
