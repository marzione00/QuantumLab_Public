"""Render one SVG with a fresh PyMuPDF document."""
import sys,fitz
with fitz.open(sys.argv[1]) as document:
 document[0].get_pixmap(matrix=fitz.Matrix(2,2),alpha=False).save(sys.argv[2])
