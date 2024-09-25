import sys
from docx2pdf import convert

def convert_docx_to_pdf(docx_path, pdf_path):
    """Convert a DOCX file to PDF."""
    convert(docx_path, pdf_path)

if __name__ == "__main__":
    if len(sys.argv) != 3:
        print("Usage: python convert_to_pdf.py <input.docx> <output.pdf>")
        sys.exit(1)

    docx_file = sys.argv[1]
    pdf_file = sys.argv[2]

    convert_docx_to_pdf(docx_file, pdf_file)
    print(f"Converted {docx_file} to {pdf_file}")
