// background.js (background script)
document.getElementById("simplifyBtn").addEventListener("click", () => {
  executeSimplifyScript();
});


function executeSimplifyScript() {
  // Query the active tab in the current window
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (tabs.length === 0) {
      console.error("No active tab found.");
      return;
    }

    // Run the script in the active tab
    chrome.scripting.executeScript({
      target: { tabId: tabs[0].id },
      files: ['content.js'],
    });
  });
}
