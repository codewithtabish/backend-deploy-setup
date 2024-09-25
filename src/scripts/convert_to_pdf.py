import sys
from docx import Document
from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas

def draw_bordered_text(pdf, text, x, y, width):
    """Draw text with a border."""
    pdf.rect(x - 5, y + 5, width + 10, -20, stroke=1, fill=0)  # Draw border
    pdf.drawString(x, y, text)

def wrap_text(text, max_width, pdf):
    """Wrap text to fit within the given width."""
    words = text.split(' ')
    lines = []
    current_line = ""

    for word in words:
        test_line = f"{current_line} {word}".strip()
        text_width = pdf.stringWidth(test_line, "Helvetica", 12)
        
        if text_width < max_width:
            current_line = test_line
        else:
            if current_line:  # Only add non-empty lines
                lines.append(current_line)
            current_line = word

    if current_line:
        lines.append(current_line)
    
    return lines

def convert_docx_to_pdf(docx_path, pdf_path):
    document = Document(docx_path)
    pdf = canvas.Canvas(pdf_path, pagesize=letter)
    width, height = letter
    margin = 50
    y_position = height - margin
    line_height = 14  # Line height for spacing

    for para in document.paragraphs:
        text = para.text.strip()  # Remove leading/trailing whitespace
        if not text:  # Skip empty paragraphs
            y_position -= line_height  # Extra space for blank lines
            continue

        # Add extra spacing for task headings
        if "Task" in text or "End of examination" in text:
            y_position -= line_height * 2  # More space for tasks and end notes
            text = f"{text.upper()}"  # Make task headings uppercase for emphasis

        wrapped_lines = wrap_text(text, width - 2 * margin, pdf)
        
        for line in wrapped_lines:
            if y_position < margin + line_height:
                pdf.showPage()  # Start a new page
                y_position = height - margin  # Reset position

            draw_bordered_text(pdf, line, margin, y_position, width - 2 * margin)
            y_position -= line_height  # Move down for the next line

        y_position -= line_height  # Extra space between paragraphs

    pdf.save()

if __name__ == "__main__":
    if len(sys.argv) != 3:
        print("Usage: python convert_to_pdf.py <input.docx> <output.pdf>")
        sys.exit(1)

    docx_file = sys.argv[1]
    pdf_file = sys.argv[2]

    convert_docx_to_pdf(docx_file, pdf_file)
    print(f"Converted {docx_file} to {pdf_file}")
