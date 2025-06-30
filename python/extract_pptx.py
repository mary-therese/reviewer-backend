import sys
import json
from pptx import Presentation

def extract_text_from_pptx(file_path):
    try:
        prs = Presentation(file_path)
        markdown = ""

        for slide in prs.slides:
            slide_text = []

            for shape in slide.shapes:
                if hasattr(shape, "text") and shape.text.strip():
                    slide_text.append(shape.text.strip())

            if slide_text:
                markdown += "\n\n" + "\n".join(slide_text)

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
    extract_text_from_pptx(file_path)
