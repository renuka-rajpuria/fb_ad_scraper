document.getElementById('scrape-btn').addEventListener('click', () => {
  const url = document.getElementById('url-input').value.trim();

  const errorMsg = document.getElementById('error-msg');

  if (!url.startsWith('https://www.facebook.com/ads')) {
    errorMsg.textContent = 'Please enter a valid Facebook Ad Library URL.';
    return;
  }

  errorMsg.textContent = '';
  const activeOnly = document.getElementById('active-only').checked;
  const urlObj = new URL(url);
  urlObj.searchParams.set('active_status', activeOnly ? 'active' : 'all');
  urlObj.searchParams.set('sort_data[mode]', 'total_impressions');
  urlObj.searchParams.set('sort_data[direction]', 'desc');
  chrome.tabs.create({ url: urlObj.toString() });
});
