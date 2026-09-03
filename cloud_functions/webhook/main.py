import os
import json
import functions_framework
from google.cloud import speech
from google.cloud import translate_v2 as translate
from google.cloud import bigquery
import base64

# Initialize clients (globally to reuse across invocations)
try:
    speech_client = speech.SpeechClient()
    translate_client = translate.Client()
    bq_client = bigquery.Client()
except Exception as e:
    print(f"Error initializing GCP clients: {e}")
    speech_client = None
    translate_client = None
    bq_client = None

def transcribe_audio(audio_content: bytes, language_code: str = "hi-IN") -> str:
    """Transcribes audio using Google Cloud Speech-to-Text."""
    if not speech_client:
        return "[Mock Transcription: Broken pipe at sector 4]"

    audio = speech.RecognitionAudio(content=audio_content)
    config = speech.RecognitionConfig(
        encoding=speech.RecognitionConfig.AudioEncoding.OGG_OPUS,
        sample_rate_hertz=16000,
        language_code=language_code,
    )

    try:
        response = speech_client.recognize(config=config, audio=audio)
        transcript = ""
        for result in response.results:
            transcript += result.alternatives[0].transcript
        return transcript
    except Exception as e:
        print(f"Transcription error: {e}")
        return ""

def translate_to_english(text: str) -> str:
    """Translates text to English using Google Cloud Translation API."""
    if not translate_client:
        return text # mock

    try:
        result = translate_client.translate(text, target_language="en")
        return result["translatedText"]
    except Exception as e:
        print(f"Translation error: {e}")
        return text

def store_in_bigquery(original_text: str, english_text: str, source: str):
    """Stores the raw and translated text in BigQuery."""
    if not bq_client:
        print(f"Mocking BigQuery insert: {english_text}")
        return

    # In a real app, you'd define the exact table name in an environment variable
    table_id = os.environ.get("BQ_TABLE_CITIZEN_REQUESTS", "project.dataset.citizen_requests")
    
    rows_to_insert = [
        {"original_text": original_text, "english_text": english_text, "source": source}
    ]
    
    try:
        errors = bq_client.insert_rows_json(table_id, rows_to_insert)
        if errors:
            print(f"Encountered errors while inserting rows: {errors}")
    except Exception as e:
        print(f"BigQuery Insert error: {e}")

@functions_framework.http
def webhook_receiver(request):
    """HTTP Cloud Function to receive WhatsApp/Telegram webhooks."""
    request_json = request.get_json(silent=True)
    
    if not request_json:
        return 'Invalid request', 400

    source = request_json.get("source", "unknown") # e.g., "whatsapp"
    message_type = request_json.get("type", "text")
    
    original_text = ""
    english_text = ""

    if message_type == "text":
        original_text = request_json.get("text", "")
        english_text = translate_to_english(original_text)
    elif message_type == "audio":
        # Expecting base64 encoded audio
        audio_b64 = request_json.get("audio_data", "")
        if audio_b64:
            audio_bytes = base64.b64decode(audio_b64)
            original_text = transcribe_audio(audio_bytes)
            english_text = translate_to_english(original_text)
    
    store_in_bigquery(original_text, english_text, source)

    return 'OK', 200
