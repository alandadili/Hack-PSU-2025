#terminal commands:
#.\.venv\Scripts\activate 1st
#pip install google-genai 2nd

from google import genai
import os
client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

chat= client.chats.create(model="gemini-2.5-pro")
while True:
    message = input("You: ")
    if message.lower() in ['exit']: #exit to end chat
        break
    response = chat.send_message(message)
    print("Gemini:", response.text)