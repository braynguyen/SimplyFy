// background.js (background script)
document.getElementById("simplifyBtn").addEventListener("click", () => {
  // Query the active tab in the current window
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (tabs.length === 0) {
      console.error("No active tab found.");
      return;
    }

    // Ensure that the script is executed in the active tab
    chrome.scripting.executeScript({
      target: { tabId: tabs[0].id },
      files: ['content.js'], // Inject the content.js file
    });
  });
});
