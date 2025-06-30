import sys
import pdfplumber
import json

def extract_text_from_pdf(file_path):
    try:
        markdown = ""
        with pdfplumber.open(file_path) as pdf:
            for page in pdf.pages:
                text = page.extract_text()
                if text:
                    markdown += text + "\n\n"

        # Basic cleanup (you’ll improve this later)
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
