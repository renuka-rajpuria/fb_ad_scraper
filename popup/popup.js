document.getElementById('scrape-btn').addEventListener('click', () => {
  const url = document.getElementById('url-input').value.trim();

  const errorMsg = document.getElementById('error-msg');

  if (!url.startsWith('https://www.facebook.com/ads')) {
    errorMsg.textContent = 'Please enter a valid Facebook Ad Library URL.';
    return;
  }

  errorMsg.textContent = '';
  console.log('URL entered:', url);
});
