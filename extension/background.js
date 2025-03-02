chrome.runtime.onInstalled.addListener(() => {
    console.log("Text Simplifier Extension Installed");
  });
  
// Listen for command (keyboard shortcut) to trigger simplify action
chrome.commands.onCommand.addListener((command) => {
  console.log('Command received:', command); // Log the command received
  if (command === "simplify-action") {
    executeSimplifyScript();
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