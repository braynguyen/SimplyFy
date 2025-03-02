function simplifyText() {
    // Get the selected (highlighted) text on the page
    const selectedText = window.getSelection().toString().trim();

    console.log(selectedText);
  
    if (selectedText) {
      // Send the selected text to your FastAPI backend for simplification
      fetch("http://localhost:8000/simplify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ text: selectedText })
      })
      .then(response => response.json())
      .then(data => {
        // Replace the selected text with the simplified text
        const simplifiedText = data.simplified_text;
        
        // Replace the selected text with simplified text
        const selection = window.getSelection();
        if (selection.rangeCount > 0) {
          const range = selection.getRangeAt(0);
              range.deleteContents();
            // console.log(range);
          range.insertNode(document.createTextNode(simplifiedText));
        }
      })
          
      .catch(error => {
        console.error("Error simplifying text:", error);
      });
    } else {
      console.log("No text selected.");
    }
  }
  
  // Automatically call the function when content.js is executed
  simplifyText();
  