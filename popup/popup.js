const scrapeBtn = document.getElementById('scrape-btn');
const errorMsg = document.getElementById('error-msg');
const statusBox = document.getElementById('status-box');
const resultsBox = document.getElementById('results-box');
const resultsSummary = document.getElementById('results-summary');

// On popup open, check if background has stored results
chrome.runtime.sendMessage({ type: 'getAds' }, (response) => {
  if (response && response.ads && response.ads.length > 0) {
    showResults(response.ads.length);
  }
});

scrapeBtn.addEventListener('click', () => {
  const url = document.getElementById('url-input').value.trim();

  if (!url.startsWith('https://www.facebook.com/ads')) {
    errorMsg.textContent = 'Please enter a valid Facebook Ad Library URL.';
    return;
  }

  errorMsg.textContent = '';
  statusBox.classList.remove('hidden');
  resultsBox.classList.add('hidden');
  scrapeBtn.disabled = true;
  scrapeBtn.textContent = 'Scraping...';

  const activeOnly = document.getElementById('active-only').checked;
  const urlObj = new URL(url);
  urlObj.searchParams.set('active_status', activeOnly ? 'active' : 'all');
  urlObj.searchParams.set('sort_data[mode]', 'total_impressions');
  urlObj.searchParams.set('sort_data[direction]', 'desc');
  chrome.tabs.create({ url: urlObj.toString() });
});

chrome.runtime.onMessage.addListener((msg) => {
  if (msg.type === 'progress') {
    document.getElementById('status-text').textContent = 'Scraping in progress... loading ads.';
  }
  if (msg.type === 'done') {
    statusBox.classList.add('hidden');
    scrapeBtn.disabled = false;
    scrapeBtn.textContent = 'Scrape';
    showResults(msg.ads.length);
  }
  if (msg.type === 'error') {
    statusBox.classList.add('hidden');
    scrapeBtn.disabled = false;
    scrapeBtn.textContent = 'Scrape';
    errorMsg.textContent = 'Scraping failed. Please try again.';
  }
});

function showResults(count) {
  resultsBox.classList.remove('hidden');
  resultsSummary.textContent = `${count} ads scraped successfully.`;
}
