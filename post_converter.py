from docx import Document
import os
import html
import re

def docx_to_html(docx_path):
    doc = Document(docx_path)
    html_path = os.path.splitext(docx_path)[0] + '.html'
    html_content = []

    for para in doc.paragraphs:
        para_content = []
        for run in para.runs:
            # If an image is detected in a run
            if '<pic:pic' in run._r.xml:
                para_content.append('<img src="your_image_file.jpg" />')
            else:
                para_content.append(html.escape(run.text))

        html_content.append(f'<p>' + ''.join(para_content) + '</p>')

    with open(html_path, 'w', encoding='utf-8') as f:
        f.write('\n'.join(html_content))

# Call the function
docx_to_html(r"D:\The Life Factory.docx")
