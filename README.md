# SimplyFy - A Chrome Extension for Simplified Text Readability

SimplyFy is a Chrome extension that allows users to highlight any text on a webpage and instantly convert it into a simplified version for improved readability.

## Features
- Highlight text on any webpage and simplify it instantly
- Uses NLP techniques for text simplification
- Fast and easy to use with a simple UI

## Installation

### Option 1: Install from Chrome Web Store
(Coming soon)

### Option 2: Run Locally
1. Open Chrome and navigate to `chrome://extensions/`.
2. Enable **Developer Mode** (toggle switch in the top-right corner).
3. Click **Load unpacked** and select the `/extensions` folder of the project.
4. The SimplyFy extension should now be loaded into Chrome.

## Running the NLP Server
SimplyFy requires a backend to process text simplifications using NLP techniques. To set up the NLP server:

1. Open a terminal and navigate to the `nlp` folder.
2. create a `.env` file and set your **GEMINI_API_KEY**
2. Install dependencies:
   ```sh
   pip install -r requirements.txt
   ```
3. Start the FastAPI server:
   ```sh
   fastapi dev main.py
   ```

## Usage
1. Highlight any text on a webpage.
2. Right-click and select **SimplyFy** from the context menu.
3. Hit the **Simplify** button
4. The text will be replaced by a simplified version
