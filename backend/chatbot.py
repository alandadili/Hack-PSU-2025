# backend/chatbot.py
import os
import re
import json
import ctypes
from google import genai
from dotenv import load_dotenv

load_dotenv()

# attempt to load libcleaner.so from utils folder; provide Python fallback
_cleaner_lib = None
_preprocess_from_c = None
_lib_path = os.path.join(os.path.dirname(__file__), "utils", "libcleaner.so")
if os.path.exists(_lib_path):
    try:
        _cleaner_lib = ctypes.CDLL(_lib_path)
        # assume C function: char* preprocess_text(const char* input)
        _cleaner_lib.preprocess_text.argtypes = [ctypes.c_char_p]
        _cleaner_lib.preprocess_text.restype = ctypes.c_char_p

        def _preprocess_text_c(text: str):
            res = _cleaner_lib.preprocess_text(text.encode("utf-8"))
            if not res:
                return "", 0
            try:
                decoded = ctypes.cast(res, ctypes.c_char_p).value.decode("utf-8")
            except Exception:
                decoded = res.decode("utf-8") if isinstance(res, (bytes, bytearray)) else str(res)
            # expect JSON: {"cleaned":"...","word_count": N} or plain cleaned text
            try:
                j = json.loads(decoded)
                return j.get("cleaned", ""), int(j.get("word_count", 0))
            except Exception:
                cleaned = decoded
                return cleaned, len(cleaned.split())

        _preprocess_from_c = _preprocess_text_c
    except Exception:
        _preprocess_from_c = None

# Python fallback cleaner
def _preprocess_text_py(text: str):
    s = text.strip()
    s = re.sub(r'\s+', ' ', s)
    s = re.sub(r'[^A-Za-z0-9\s\.,!?\-@#\$%&\(\)]', '', s)
    return s, len(s.split())

# public preprocess_text uses C impl if available
def preprocess_text(text: str):
    if _preprocess_from_c:
        try:
            return _preprocess_from_c(text)
        except Exception:
            pass
    return _preprocess_text_py(text)
class Chats:
    def __init__(self):
        self.chat = None
        self.client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))
    def set_chat(self):
        self.chat = self.client.chats.create(model="gemini-2.5-pro")
    def get_chat(self):
        if not self.chat:
            self.set_chat()
        return self.chat

async def handle_user_message(user_text: str) -> str:
    print("[DEBUG] 1" + user_text)
    # clean input
    cleaned, word_count = preprocess_text(user_text)
    print("[DEBUG] 2" + cleaned)
    print(f"[DEBUG] Cleaned text: {cleaned} | Word count: {word_count}")

    if word_count > 100:
        return "Your message is too long. Please shorten it."

    # use model object and send_message with timeout
    try:
        import asyncio
        from concurrent.futures import TimeoutError
        
        chats = Chats()
        chat = chats.get_chat()
        
        # Wrap the synchronous call in an executor to prevent blocking
        loop = asyncio.get_event_loop()
        response = await loop.run_in_executor(
            None,
            lambda: chat.send_message(cleaned)  # 120 second timeout
        )
        
        # normalize response
        if hasattr(response, "text") and response.text:
            return response.text
        if isinstance(response, dict):
            # many SDKs put output under 'output' or 'candidates'
            if "output" in response:
                return response["output"]
            if "candidates" in response:
                return response["candidates"][0].get("output", "") if response["candidates"] else ""
        # fallback str
        return str(response)
    except TimeoutError:
        print("[ERROR] Gemini request timed out")
        return "Sorry, the request timed out. Please try again."
    except Exception as e:
        print("[ERROR] Gemini request failed:", e)
        return "Sorry, an error occurred while contacting the language model."
    
print(handle_user_message("Please do someth<<<>>>>\ing and work 9&(*^$QY#JF or else i will be sad"))