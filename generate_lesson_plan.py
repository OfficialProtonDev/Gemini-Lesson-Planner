import google.generativeai as genai
from youtube_transcript_api import YouTubeTranscriptApi, _errors
from urllib.parse import urlparse, parse_qs
from urllib import request, parse
import json

with open("key.txt", "r") as file:
    key = file.read()
    print(key)

genai.configure(api_key=key)

system_prompt = "You are an advanced lesson-planning AI, you are designed to plan efficient and engaging lesson plans for teachers in new zealand using a wide range of inputs. Use markdown formatting."

def generate_plan(text, videos, lesson_length, images, documents, student_year):
    video_info = []
    document_info = []

    if images != []:
        model_type = 'gemini-pro-vision'
    else:
        model_type = 'gemini-pro'

    main_model = genai.GenerativeModel(model_type)
    preprocessing_model = genai.GenerativeModel('gemini-pro')

    for video in videos:
        text_list = []
        vid_id = extract_video_id(video)
        captions_data = extract_video_captions(vid_id)

        video_info.append(extract_video_title(vid_id) + ": ")

        if captions_data != None:
            # Extract all the text
            for item in captions_data:
                for i in item:
                    text_list.append(i['text'])

            # Join the text together
            captions = " ".join(text_list)
            summarized_captions = preprocessing_model.generate_content(f"Summarize all important information from the following video captions so that it can be fed into a new prompt for creating a detailed lesson plan based on this video and other inputs. Captions to summarize: {captions}")
            video_info.append(summarized_captions.text)

    for document in documents:
        summarized_document = preprocessing_model.generate_content(f"Summarize all important information from the following document so that it can be fed into a new prompt for creating a detailed lesson plan based on this document and other inputs. Document to summarize: {document}")
        document_info.append(summarized_document.text)

    print(text)

    if images != []:
        prompt_content = [
            system_prompt + f" Generate a {lesson_length} lesson (with time blocks) based on the subject/s or information presented in the following: YouTube video/s summary: {video_info}, Document/s summary: {document_info}, and in the attached images. This is the teachers notes/lesson description: {text}. This lesson should strictly follow the subjects mentioned, but it should be tailored toward {student_year} students.",
        ]

        for image in images:
            prompt_content.append(image)

        response = main_model.generate_content(prompt_content)

    else:
        response = main_model.generate_content(system_prompt + f" Generate a {lesson_length} lesson (with time blocks) based on the subject/s or information presented in the following: YouTube video/s summary: {video_info}, and document/s summary: {document_info}. This is the teachers notes/lesson description: {text}. This lesson should strictly follow the subjects mentioned, but it should be tailored toward {student_year} students.")

    return response

def extract_video_title(video_id):
    params = {"format": "json", "url": "https://www.youtube.com/watch?v=%s" % video_id}
    url = "https://www.youtube.com/oembed"
    query_string = parse.urlencode(params)
    url = url + "?" + query_string

    with request.urlopen(url) as response:
        response_text = response.read()
        data = json.loads(response_text.decode())
        print(data)
        
        if data['title']:
            return data['title']
    
    return "Unknown Video Name"

def extract_video_captions(video_id):
  try:
    transcript = YouTubeTranscriptApi.get_transcript(video_id)
    return transcript
  except _errors.TranscriptsDisabled as e:
    print(f"Transcripts are disabled for video {video_id}. Returning None.")
    return None


def extract_video_id(youtube_url):
    parsed_url = urlparse(youtube_url)
    query_params = parse_qs(parsed_url.query)
    video_id = query_params.get("v")[0]
    print(video_id)
    return str(video_id)