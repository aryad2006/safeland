#!/usr/bin/env python3
"""Convert SafeLand .docx to .odt via odfpy (simplified)."""

import os
import re
from odf.opendocument import OpenDocumentText
from odf.text import P, H, List, ListItem
from odf.style import Style, TextProperties, ParagraphProperties
from odf.table import Table, TableRow, TableCell, TableColumn

OUTPUT_DIR = os.path.expanduser("~/docs-safeland")
DOCS_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "docs")
B2G_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "B2G")

FILES = {
    "docs": [
        ("CDC-COMPLET-V3.md", "CDC-Complet-SafeLand-V3"),
        ("LIVRE-BLANC-V2.md", "Livre-Blanc-SafeLand-V2"),
        ("LIVRE-MARKETING.md", "Livre-Marketing-SafeLand"),
        ("GUIDE-UTILISATEURS.md", "Guide-Utilisateurs-SafeLand"),
        ("AUDIT-TECHNIQUE-COMPLET.md", "Audit-Technique-SafeLand"),
    ],
    "B2G": [
        ("00-INDEX-DOSSIER-B2G.md", "B2G-00-Index-Dossier"),
        ("01-NOTE-CADRAGE-ANCFCC.md", "B2G-01-Note-Cadrage-ANCFCC"),
        ("02-DOSSIER-ADD.md", "B2G-02-Dossier-ADD"),
        ("03-CONVENTION-PPP.md", "B2G-03-Convention-PPP"),
        ("04-DECLARATION-CNDP.md", "B2G-04-Declaration-CNDP"),
        ("05-QUALIFICATION-MTNRA.md", "B2G-05-Qualification-MTNRA"),
        ("06-NOTE-DGSSI.md", "B2G-06-Note-DGSSI"),
        ("07-PROPOSITION-PILOTE.md", "B2G-07-Proposition-Pilote"),
        ("08-MARCHES-PUBLICS.md", "B2G-08-Marches-Publics"),
        ("09-MODELE-ECONOMIQUE.md", "B2G-09-Modele-Economique"),
    ],
}


def clean_md(text):
    """Strip markdown formatting."""
    text = re.sub(r"\*\*(.*?)\*\*", r"\1", text)
    text = re.sub(r"\*(.*?)\*", r"\1", text)
    text = re.sub(r"`(.*?)`", r"\1", text)
    return text.strip()


def md_to_odt(md_path, output_name):
    """Convert markdown to ODT."""
    doc = OpenDocumentText()

    with open(md_path, "r", encoding="utf-8") as f:
        lines = f.readlines()

    in_code = False
    in_table = False
    table_rows = []

    for line in lines:
        line = line.rstrip("\n")

        # Code blocks
        if line.startswith("```"):
            in_code = not in_code
            continue
        if in_code:
            p = P(text=line)
            doc.text.addElement(p)
            continue

        # Table
        if "|" in line and line.strip().startswith("|"):
            stripped = line.strip()
            if re.match(r"^\|[\s\-:|]+\|$", stripped):
                continue
            cells = [clean_md(c.strip()) for c in stripped.split("|")[1:-1]]
            if not in_table:
                in_table = True
                table_rows = []
            table_rows.append(cells)
            continue
        elif in_table:
            if table_rows:
                num_cols = max(len(r) for r in table_rows)
                table = Table()
                for _ in range(num_cols):
                    table.addElement(TableColumn())
                for row in table_rows:
                    tr = TableRow()
                    for ci in range(num_cols):
                        tc = TableCell()
                        cell_text = row[ci] if ci < len(row) else ""
                        tc.addElement(P(text=cell_text))
                        tr.addElement(tc)
                    table.addElement(tr)
                doc.text.addElement(table)
            table_rows = []
            in_table = False

        # Empty
        if not line.strip():
            continue

        # Headings
        if line.startswith("# "):
            h = H(outlinelevel=1, text=clean_md(line[2:]))
            doc.text.addElement(h)
            continue
        if line.startswith("## "):
            h = H(outlinelevel=2, text=clean_md(line[3:]))
            doc.text.addElement(h)
            continue
        if line.startswith("### "):
            h = H(outlinelevel=3, text=clean_md(line[4:]))
            doc.text.addElement(h)
            continue
        if line.startswith("#### "):
            h = H(outlinelevel=4, text=clean_md(line[5:]))
            doc.text.addElement(h)
            continue

        # HR
        if line.strip() == "---":
            doc.text.addElement(P(text="_" * 60))
            continue

        # Bullets
        if line.startswith("- ") or line.startswith("* "):
            p = P(text="  - " + clean_md(line[2:]))
            doc.text.addElement(p)
            continue

        # Numbered
        m = re.match(r"^(\d+)\.\s+(.+)", line)
        if m:
            p = P(text=f"  {m.group(1)}. " + clean_md(m.group(2)))
            doc.text.addElement(p)
            continue

        # Blockquote
        if line.startswith("> "):
            p = P(text="    " + clean_md(line[2:]))
            doc.text.addElement(p)
            continue

        # Regular text
        text = clean_md(line)
        if text:
            p = P(text=text)
            doc.text.addElement(p)

    # Remaining table
    if in_table and table_rows:
        num_cols = max(len(r) for r in table_rows)
        table = Table()
        for _ in range(num_cols):
            table.addElement(TableColumn())
        for row in table_rows:
            tr = TableRow()
            for ci in range(num_cols):
                tc = TableCell()
                cell_text = row[ci] if ci < len(row) else ""
                tc.addElement(P(text=cell_text))
                tr.addElement(tc)
            table.addElement(tr)
        doc.text.addElement(table)

    odt_path = os.path.join(OUTPUT_DIR, f"{output_name}.odt")
    doc.save(odt_path)
    print(f"  [OK] {odt_path}")


def main():
    os.makedirs(OUTPUT_DIR, exist_ok=True)

    print("=== Converting to ODT ===")
    for section, files in FILES.items():
        base = DOCS_DIR if section == "docs" else B2G_DIR
        for filename, output_name in files:
            md_path = os.path.join(base, filename)
            if os.path.exists(md_path):
                md_to_odt(md_path, output_name)
            else:
                print(f"  [SKIP] {md_path}")

    print(f"\nDone! ODT files saved to {OUTPUT_DIR}")


if __name__ == "__main__":
    main()
