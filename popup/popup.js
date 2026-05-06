const scrapeBtn = document.getElementById('scrape-btn');
const errorMsg = document.getElementById('error-msg');
const statusBox = document.getElementById('status-box');
const resultsBox = document.getElementById('results-box');
const resultsSummary = document.getElementById('results-summary');
const downloadBtn = document.getElementById('download-btn');

let currentAds = [];

// On panel open, check if background has stored results
chrome.runtime.sendMessage({ type: 'getAds' }, (response) => {
  if (response && response.ads && response.ads.length > 0) {
    currentAds = response.ads;
    showResults(currentAds.length);
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
    currentAds = msg.ads;
    statusBox.classList.add('hidden');
    scrapeBtn.disabled = false;
    scrapeBtn.textContent = 'Scrape';
    showResults(currentAds.length);
  }
  if (msg.type === 'error') {
    statusBox.classList.add('hidden');
    scrapeBtn.disabled = false;
    scrapeBtn.textContent = 'Scrape';
    errorMsg.textContent = 'Scraping failed. Please try again.';
  }
});

downloadBtn.addEventListener('click', () => {
  if (!currentAds.length) return;
  const csv = convertToCSV(currentAds);
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `ad_trace_${Date.now()}.csv`;
  a.click();
  URL.revokeObjectURL(url);
});

function showResults(count) {
  resultsBox.classList.remove('hidden');
  resultsSummary.textContent = `${count} ads scraped — sorted by impressions.`;
}
