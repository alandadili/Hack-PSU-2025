#terminal commands:
#.\.venv\Scripts\activate 1st
#pip install google-genai 2nd
from google import genai
import os
client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))


response=client.models.generate_content(
    model="gemini-2.5-pro",
    contents="Why is my belly round?"
)
print(response.text)