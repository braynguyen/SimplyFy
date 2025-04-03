from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import os
from google import genai
from dotenv import load_dotenv

load_dotenv()

# Load the API key from environment variables
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
app = FastAPI()

# Enable CORS for the entire application
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)

# Initialize the Gemini client using the genai library
client = genai.Client(api_key=GEMINI_API_KEY)

class TextSimplificationRequest(BaseModel):
    text: str
    context: str

class TextSimplificationResponse(BaseModel):
    simplified_text: str

@app.post("/simplify", response_model=TextSimplificationResponse)
def simplify_text(request: TextSimplificationRequest):
    try:
        # Create the prompt asking Gemini to simplify the text
        # print(request.text)
        prompt = f"""Simplify the following text sentence by sentence and returning the simplified text and only the simplified text. 
        
        If the text does not need to be simplified or you do not not know how to simplify just return the text: 
        
        Here is the context of the previous simplified text: {request.context}

        Here is the text: {request.text}
        """

        # Call the Gemini API to generate simplified text
        response = client.models.generate_content(
            model="gemini-2.0-flash", 
            contents=[{"text": prompt}]
        )
        
        # Return the simplified text
        simplified_text = response.text
        return TextSimplificationResponse(simplified_text=simplified_text)
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error simplifying text: {str(e)}")
