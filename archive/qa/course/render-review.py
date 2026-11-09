"""Render section openings and selected technical pages for human inspection."""
from pathlib import Path
import json
import fitz
from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parents[2]
OUT = ROOT / "guide-preview"
OUT.mkdir(exist_ok=True)
font = ImageFont.truetype(str(ROOT / "assets/fonts/DejaVuSans.ttf"), 14)
report = []
for chapter in range(1, 5):
    pdf = ROOT / "public" / f"Guida_capitolo_{chapter}.pdf"
    doc = fitz.open(pdf)
    openings = [page for level, title, page in doc.get_toc() if level == 2]
    focus = ["Fase relativa", "esperimento", "Confrontare", "Deutsch",
             "Grover", "Fourier", "Stima di fase", "RSA", "Shor", "Sommatore"]
    extra = []
    for level, title, page in doc.get_toc():
        if level == 2 and any(word.lower() in title.lower() for word in focus):
            extra.extend(range(page + 1, min(page + 4, len(doc) + 1)))
    pages = sorted(set(openings + extra))
    tiles = []
    for page in pages:
        pix = doc[page - 1].get_pixmap(matrix=fitz.Matrix(1.25, 1.25), alpha=False)
        target = OUT / f"modulo_{chapter}_pagina_{page:03d}.png"
        pix.save(target)
        im = Image.open(target).convert("RGB")
        im.thumbnail((290, 412))
        tile = Image.new("RGB", (304, 442), "#dce4e0")
        tile.paste(im, ((304 - im.width) // 2, 25))
        ImageDraw.Draw(tile).text((9, 6), f"Modulo {chapter} · pagina {page}", fill="#11271a", font=font)
        tiles.append(tile)
    sheets = []
    for offset in range(0, len(tiles), 12):
        subset = tiles[offset:offset + 12]
        sheet = Image.new("RGB", (4 * 304, ((len(subset) + 3) // 4) * 442), "white")
        for j, tile in enumerate(subset):
            sheet.paste(tile, ((j % 4) * 304, (j // 4) * 442))
        name = OUT / f"contatto_modulo_{chapter}_{offset // 12 + 1}.png"
        sheet.save(name)
        sheets.append(name.name)
    report.append({"chapter": chapter, "pdfPages": len(doc), "renderedPages": pages,
                   "contactSheets": sheets, "humanReviewRequired": True})
(OUT / "rendered-pages.json").write_text(json.dumps(report, ensure_ascii=False, indent=2) + "\n")
print(json.dumps(report, ensure_ascii=False))
