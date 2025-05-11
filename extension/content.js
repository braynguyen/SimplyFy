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

            // simplify each text node individually
            let previousText = ""
            for (let i = 0; i < textNodes.length; i++) {
                console.log("original", textNodes[i].textContent)
                const originalText = textNodes[i].textContent.trim();
                console.log("trimmed", originalText)

                if (originalText) {
                    fetch("http://localhost:8000/simplify", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify({
                            text: originalText,
                            context: previousText
                        })
                    })
                        .then(response => response.json())
                        .then(data => {
                            // Replace the text node with the simplified text
                            textNodes[i].textContent = data.simplified_text;
                        })
                        .catch(error => {
                            console.error("Error simplifying text:", error);
                        });
                }
                previousText = previousText + "\n" + originalText;
            }

            // replace the original selected HTML with the simplified HTML
            setTimeout(() => {
                range.deleteContents();
                range.insertNode(selectedContents);
            }, 1000); // Delay to for all API calls to complete
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
