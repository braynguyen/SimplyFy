chrome.runtime.onInstalled.addListener(() => {
    console.log("Text Simplifier Extension Installed");
  });
  
chrome.commands.onCommand.addListener((command) => {
  console.log('Command received:', command);
  if (command === "simplify-action") {
    executeSimplifyScript();
  }
});

// gets the current tab
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === "getCurrentTabUrl") {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      sendResponse({url: tabs[0].url});
    });
    return true; // Required for async sendResponse
  }
});

// Function to execute the simplification script in the active tab
function executeSimplifyScript() {
  // Query the active tab in the current window
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (tabs.length === 0) {
      console.error("No active tab found.");
      return;
    }

    // Run the content script in the active tab
    chrome.scripting.executeScript({
      target: { tabId: tabs[0].id },
      files: ['content.js'],
    });
  });
}