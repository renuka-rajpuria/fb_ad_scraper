let scrapedAds = [];

chrome.action.onClicked.addListener((tab) => {
  chrome.sidePanel.open({ windowId: tab.windowId });
});

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.type === 'progress') {
    chrome.action.setBadgeText({ text: ' ' });
    chrome.action.setBadgeBackgroundColor({ color: '#f5a623' });
    chrome.runtime.sendMessage({ type: 'progress', count: msg.count }).catch(() => {});
  }

  if (msg.type === 'done') {
    scrapedAds = msg.ads;
    chrome.action.setBadgeText({ text: ' ' });
    chrome.action.setBadgeBackgroundColor({ color: '#42b72a' });
    chrome.runtime.sendMessage({ type: 'done', ads: msg.ads }).catch(() => {});
  }

  if (msg.type === 'error') {
    chrome.action.setBadgeText({ text: ' ' });
    chrome.action.setBadgeBackgroundColor({ color: '#e02020' });
    chrome.runtime.sendMessage({ type: 'error' }).catch(() => {});
  }

  if (msg.type === 'getAds') {
    sendResponse({ ads: scrapedAds });
    return true;
  }
});
