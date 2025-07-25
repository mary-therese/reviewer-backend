import sys
import pdfplumber
import json
import re

def is_figure_caption(line):
    figure_patterns = [
        r'^Figure\s+\d+(\.\d+)?[:\-]?',
        r'^Image\s+\d+[:\-]?',
        r'^Chart\s+\d+[:\-]?',
        r'^Diagram\s+\d+[:\-]?',
        r'^Fig\.?\s+\d+.*',
    ]
    return any(re.match(pat, line.strip()) for pat in figure_patterns)

def extract_text_from_pdf(file_path):
    try:
        markdown = ""
        with pdfplumber.open(file_path) as pdf:
            for page in pdf.pages:
                text = page.extract_text()
                if text:
                    lines = text.split('\n')
                    cleaned_lines = []

                    #note: add this prompt for revieweing captions before ignoring --> "Ignore lines starting with [Caption] unless they include relevant definitions or explanations."
                    for line in lines:
                        line = line.strip()
                        if is_figure_caption(line):
                            cleaned_lines.append(f"[Caption] {line}")
                        else:
                            cleaned_lines.append(line)

                    cleaned_page = '\n'.join(cleaned_lines)
                    markdown += cleaned_page + "\n\n"

        markdown = markdown.strip()

        result = {
            "success": True,
            "markdown": markdown
        }
        print(json.dumps(result))

    except Exception as e:
        print(json.dumps({ "success": False, "error": str(e) }))

if __name__ == "__main__":
    file_path = sys.argv[1]
    extract_text_from_pdf(file_path)
