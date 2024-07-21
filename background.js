// find most recent tab to see if we are in a youtube page
// a event listener
chrome.tabs.onUpdated.addListener((tabId, tab) => {
  // check if it includes the specific youtube url
    if (tab.url && tab.url.includes("youtube.com/watch")) {
      // set query paramater by id, we grab the unique value
      const queryParameters = tab.url.split("?")[1];
      const urlParameters = new URLSearchParams(queryParameters);
      
      chrome.tabs.sendMessage(tabId, {
        type: "NEW",
        videoId: urlParameters.get("v"),
      });
    }
  });
  