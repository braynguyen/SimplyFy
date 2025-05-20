function simplifyText() {
    // get the selected text
    const selectedText = window.getSelection().toString().trim();

    if (selectedText) {
        // get all of the selected HTML
        const selection = window.getSelection();
        if (selection.rangeCount > 0) {
            const range = selection.getRangeAt(0);

            // clone the selected HTML
            const selectedContents = range.cloneContents();

            // get all text nodes within the selected HTML
            const textNodes = getTextNodesInRange(selectedContents);

            let previousOriginalText = "";
            let previousSimplifiedText = "";
            let model;
            let prompt;
            let system_prompt;

            // create an array of promises for all simplification requests
            const simplificationPromises = textNodes.map((node, i) => {
                const originalText = node.textContent.trim();
                if (!originalText) return Promise.resolve();
                
                previousOriginalText = previousOriginalText + (i > 0 ? "\n" : "") + originalText;
                
                return fetch("http://localhost:8000/simplify", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        text: originalText,
                        context: previousOriginalText,
                    })
                })
                .then(response => response.json())
                .then(data => {
                    // Replace the text node with the simplified text
                    node.textContent = data.simplified_text;
                    model = data.model;
                    prompt = data.prompt;
                    system_prompt = data.system_prompt;
                    previousSimplifiedText = previousSimplifiedText + (i > 0 ? "\n" : "") + data.simplified_text;
                })
                .catch(error => {
                    console.error("Error simplifying text:", error);
                });
            });

            // wait for all simplification requests to complete
            Promise.all(simplificationPromises)
                .then(() => {
                    // replace the original selected HTML with the simplified HTML
                    range.deleteContents();
                    range.insertNode(selectedContents);

                    // log the query in the database
                    const url = window.location.href;
                    const storeData = {
                        original: previousOriginalText,
                        simplified: previousSimplifiedText,
                        prompt: prompt,
                        system_prompt: system_prompt,
                        model: model,
                        url: url
                    };
                    console.log('Storing data:', storeData);
                    fetch("http://localhost:8000/store", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify(storeData)
                    })
                    .then(response => {
                        if (!response.ok) {
                            return response.text().then(text => {
                                throw new Error(`HTTP error! status: ${response.status}, body: ${text}`);
                            });
                        }
                        return response.json();
                    })
                    .then(data => console.log('Successfully stored:', data))
                    .catch(error => console.error('Error storing data:', error));
                });
        }
    } else {
        console.log("No text selected.");
    }
}

// Helper function to find all text nodes within a given node
function getTextNodesInRange(node) {
    const textNodes = [];
    const walk = document.createTreeWalker(node, NodeFilter.SHOW_TEXT, null, false);

    let currentNode;
    while (currentNode = walk.nextNode()) {
        textNodes.push(currentNode);
    }

    return textNodes;
}

simplifyText();
