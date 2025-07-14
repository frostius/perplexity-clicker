let badgeCount = 0;

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "updateBadge") {
    badgeCount = message.count;
    chrome.browserAction.setBadgeText({ text: badgeCount > 0 ? badgeCount.toString() : '' });
    chrome.browserAction.setBadgeBackgroundColor({ color: '#7444' });
  }
});

// Clear badge on extension load
chrome.runtime.onInstalled.addListener(() => {
  chrome.browserAction.setBadgeText({ text: '' });
});
chrome.runtime.onStartup.addListener(() => {
  chrome.browserAction.setBadgeText({ text: '' });
});
