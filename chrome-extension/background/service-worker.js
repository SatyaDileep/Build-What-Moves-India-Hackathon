// DocBridge Background Service Worker

chrome.runtime.onInstalled.addListener(function() {
  // Set default stats
  chrome.storage.local.get('docbridge_stats', function(data) {
    if (!data.docbridge_stats) {
      chrome.storage.local.set({ docbridge_stats: { processed: 0 } });
    }
  });
  
  // Set default nudge enabled
  chrome.storage.local.get('docbridge_nudge_enabled', function(data) {
    if (data.docbridge_nudge_enabled === undefined) {
      chrome.storage.local.set({ docbridge_nudge_enabled: true });
    }
  });
});

// Listen for messages from content scripts
chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
  if (message.type === 'PORTAL_DETECTED') {
    // Update badge with portal name
    if (sender.tab) {
      chrome.action.setBadgeText({
        text: '\u2713',
        tabId: sender.tab.id
      });
      chrome.action.setBadgeBackgroundColor({
        color: '#138808',
        tabId: sender.tab.id
      });
      chrome.action.setTitle({
        title: 'DocBridge - ' + (message.portalName || 'Gov portal detected'),
        tabId: sender.tab.id
      });
    }
    sendResponse({ ok: true });
  }
  
  if (message.type === 'GET_STATS') {
    chrome.storage.local.get('docbridge_stats', function(data) {
      sendResponse(data.docbridge_stats || { processed: 0 });
    });
    return true; // async response
  }
});

// Clear badge when navigating away from gov sites
chrome.tabs.onUpdated.addListener(function(tabId, changeInfo) {
  if (changeInfo.url) {
    var url = changeInfo.url;
    if (url.indexOf('.gov.in') === -1 && url.indexOf('.nic.in') === -1) {
      chrome.action.setBadgeText({ text: '', tabId: tabId });
    }
  }
});
