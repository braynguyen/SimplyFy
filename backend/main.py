from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import os
from openai import OpenAI
from dotenv import load_dotenv
import firebase_admin
from firebase_admin import credentials
from firebase_admin import db

load_dotenv()
LOGGING = True

# Load the API key from environment variables
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
MODEL = "gpt-3.5-turbo"
app = FastAPI()
client = OpenAI(api_key=OPENAI_API_KEY)

if LOGGING:
    # Initialize DB with admin priviledges
    cred = credentials.Certificate('serviceAccountKey.json')
    firebase_admin.initialize_app(cred, {
        'databaseURL': os.getenv("DATABASE_URL")
    })
    ref = db.reference('/')
    text_ref = ref.child('text')

# Enable CORS for the entire application
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)


class TextSimplificationRequest(BaseModel):
    text: str
    context: str

class TextSimplificationResponse(BaseModel):
    simplified_text: str
    prompt: str
    system_prompt: str
    model: str

@app.post("/simplify", response_model=TextSimplificationResponse)
def simplify_text(request: TextSimplificationRequest):
    try:
        # Create the prompt asking Gemini to simplify the text
        prompt = f"""Simplify the following text sentence by sentence and returning the simplified text and only the simplified text. 
        
        If the text does not need to be simplified or you do not not know how to simplify just return the text: 
        
        Given this context do not return any simplication of this text. Just use it to better simplify the given text. Here is the context of the previous simplified text: {request.context}

        Here is the text you must simplify: {request.text}
        """

        system_prompt = "You are a text simplification agent that will, given any text, return a simplified version for a reader. Do not provide anything extra to the context just make it easier to read."

        response = client.chat.completions.create(
            model=MODEL,
            messages=[
                {
                    "role": "system",
                    "content": system_prompt
                },
                {
                    "role": "user",
                    "content": prompt,
                },
            ]
        )


        # Return the simplified text
        simplified_text = response.choices[0].message.content
        
        return TextSimplificationResponse(
                simplified_text=simplified_text,
                prompt=prompt,
                system_prompt=system_prompt,
                model=MODEL
            )
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error simplifying text: {str(e)}")

class StoreRequest(BaseModel):
    original: str
    simplified: str
    prompt: str
    system_prompt: str
    model: str
    url: str


@app.post("/store")
def store_text(request: StoreRequest):

    if LOGGING:
        text_ref.push({
                    'original': request.original,
                    'simplified': request.simplified,
                    'prompt': request.prompt,
                    'system_prompt': request.system_prompt,
                    'model': request.model,
                    'url': request.url
                })
        return {"status": "success"}, 200
    else:
        return {"detail": "Logging is not enabled"}, 400