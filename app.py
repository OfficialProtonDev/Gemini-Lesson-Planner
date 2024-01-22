from flask import Flask, request, jsonify, render_template
from generate_lesson_plan import generate_plan
import io
import PIL.Image

app = Flask(__name__)

@app.route('/')  # This route will serve the index.html file
def index():
    return render_template('index.html')

@app.route('/plan-lesson', methods=['POST'])
def receive_lesson_data():
    lesson_data = request.form

    print(lesson_data)

    text = lesson_data.get("textDescription-1")
    videos = lesson_data.getlist("youtubeLinks-")
    documents = request.files.getlist("documentFiles")
    images = request.files.getlist("imageFiles")
    lesson_length = lesson_data.get("lessonLength-1")
    student_year = lesson_data.get("studentYear-1")

    print("Lesson Description:", text)
    print("Video Links:", videos)
    print("Lesson Length:", lesson_length)
    print("Documents:", documents)
    print("Images:", images)
    print("Student Age: ", student_year)

    documents_text = []
    processed_images = []

    for document in documents:
        document_filename = document.filename
        document_content = document.read()

        if document_filename.endswith(('.doc', '.docx')):
            from docx import Document
            document = Document(io.BytesIO(document_content))
            text = '\n'.join([paragraph.text for paragraph in document.paragraphs])
        elif document_filename.endswith('.pdf'):
            from PyPDF2 import PdfReader
            pdf_reader = PdfReader(io.BytesIO(document_content))
            text = '\n'.join(page.extract_text() for page in pdf_reader.pages)
        else:
            text = "Unsupported file, ignore this."

        documents_text.append(document_filename + ": " + text)

    for image in images:
        processed_images.append(PIL.Image.open(image))

    plan = generate_plan(text, videos, lesson_length, processed_images, documents_text, student_year)

    # Return the plan as JSON
    return jsonify({'plan': plan.text})  # Modified line

if __name__ == '__main__':
    app.run(debug=True)  # Set debug=False for production