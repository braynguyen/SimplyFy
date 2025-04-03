from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import os
from openai import OpenAI
from dotenv import load_dotenv

load_dotenv()

# Load the API key from environment variables
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
app = FastAPI()
client = OpenAI(api_key=OPENAI_API_KEY)

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

@app.post("/simplify", response_model=TextSimplificationResponse)
def simplify_text(request: TextSimplificationRequest):
    try:
        # Create the prompt asking Gemini to simplify the text
        print(request.text)
        prompt = f"""Simplify the following text sentence by sentence and returning the simplified text and only the simplified text. 
        
        If the text does not need to be simplified or you do not not know how to simplify just return the text: 
        
        Given this context do not return any simplication of this text. Just use it to better simplify the given text. Here is the context of the previous simplified text: {request.context}

        Here is the text you must simplify: {request.text}
        """


        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {
                    "role": "system",
                    "content": "You are a text simplification agent that will, given any text, return a simplified version for a reader. Do not provide anything extra to the context just make it easier to read."
                },
                {
                    "role": "user",
                    "content": prompt,
                },
            ]
        )
        print(response)

        # Return the simplified text
        simplified_text = response.choices[0].message.content
        print(simplified_text)
        return TextSimplificationResponse(simplified_text=simplified_text)
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error simplifying text: {str(e)}")
