"""Compatibilità: genera le guide correnti del corso e la copia del capitolo 1."""
from pathlib import Path
import runpy
runpy.run_path(str(Path(__file__).with_name("generate-course-pdf.py")), run_name="__main__")
