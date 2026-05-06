console.log('Ad Trace: content script loaded');

function getMediaType(card) {
  if (card.querySelector('video')) return 'video';
  const images = card.querySelectorAll('img');
  if (images.length > 1) return 'carousel';
  if (images.length === 1) return 'image';
  return 'unknown';
}

function getPlatforms(card) {
  const icons = card.querySelectorAll('div[role="presentation"] div[class*="xtwfq29"]');
  const platforms = [];
  icons.forEach(icon => {
    const style = icon.getAttribute('style') || '';
    if (style.includes('FPcys8kMmkz')) platforms.push('Facebook/Instagram');
  });
  if (platforms.length === 0) {
    const spans = Array.from(card.querySelectorAll('span[aria-label]'));
    spans.forEach(s => platforms.push(s.getAttribute('aria-label')));
  }
  return [...new Set(platforms)].join(', ') || 'N/A';
}

function parseAdCards() {
  const adCards = document.querySelectorAll('div[class*="x1plvlek"][class*="xryxfnj"]');
  return Array.from(adCards).map((card, index) => {
    const advertiserName = card.querySelector('a[href*="facebook.com/"] span')?.innerText?.trim() || '';

    const adBody = card.querySelector('div[style*="white-space: pre-wrap"] span')?.innerText?.trim() || '';

    const statusEl = Array.from(card.querySelectorAll('span')).find(el =>
      el.innerText.trim() === 'Active' || el.innerText.trim() === 'Inactive'
    );
    const status = statusEl?.innerText?.trim() || 'Unknown';

    const libraryIdEl = Array.from(card.querySelectorAll('span')).find(el =>
      el.innerText.includes('Library ID:')
    );
    const libraryId = libraryIdEl?.innerText?.replace('Library ID:', '').trim() || '';

    const startDateEl = Array.from(card.querySelectorAll('span')).find(el =>
      el.innerText.includes('Started running on')
    );
    const startDate = startDateEl?.innerText?.replace('Started running on', '').trim() || '';

    const variantsEl = Array.from(card.querySelectorAll('span')).find(el =>
      el.innerText.includes('ads use this creative')
    );
    const numberOfVariants = variantsEl?.innerText?.match(/(\d+)/)?.[1] || '1';

    // CTA link goes through Facebook's redirect — extract the destination
    const ctaLinkEl = card.querySelector('a[href*="l.facebook.com/l.php"]');
    const ctaLink = ctaLinkEl ? new URL(ctaLinkEl.href).searchParams.get('u') || ctaLinkEl.href : '';

    // CTA button text — last role="button" span text in the card
    const ctaButtonEls = Array.from(card.querySelectorAll('[role="button"]'));
    const ctaText = ctaButtonEls.map(el => el.innerText.trim()).filter(t =>
      t && t.length < 40 && !t.includes('\n') && !t.includes('Library ID')
    ).pop() || '';

    // Headline — text in the link preview card (not the body text)
    const headlineEl = card.querySelector('a[href*="l.facebook.com"] [role="button"]');
    const headline = headlineEl?.innerText?.trim() || '';

    // Ad detail page link
    const adDetailLink = libraryId
      ? `https://www.facebook.com/ads/library/?id=${libraryId}`
      : '';

    const mediaType = getMediaType(card);
    const platforms = getPlatforms(card);

    // imageUrl: skipped for now — extracting CDN links causes React errors on Facebook's end
    const imageUrl = 'N/A';

    // Impression range — only available for political/special category ads
    const impressionEl = Array.from(card.querySelectorAll('span')).find(el =>
      el.innerText.includes('impressions') || el.innerText.match(/\d+[KM]?–\d+[KM]?/)
    );
    const impressionRange = impressionEl?.innerText?.trim() || 'N/A';

    // Country targeting
    const countryEl = Array.from(card.querySelectorAll('span')).find(el =>
      el.innerText.includes('Reaches people in')
    );
    const countryTargeting = countryEl?.innerText?.replace('Reaches people in', '').trim() || 'N/A';

    return {
      index: index + 1,
      advertiserName,
      status,
      mediaType,
      platforms,
      adBody,
      headline,
      ctaText,
      ctaLink,
      startDate,
      numberOfVariants,
      libraryId,
      adDetailLink,
      impressionRange,
      countryTargeting,
      imageUrl,
    };
  }).filter(ad => ad.libraryId !== '');
}

async function autoScrollAndParse() {
  console.log('Ad Trace: starting auto-scroll to load all ads...');
  try {
  let lastCount = 0;
  let stableRounds = 0;

  while (stableRounds < 3) {
    window.scrollTo(0, document.body.scrollHeight);
    await new Promise(r => setTimeout(r, 2500));
    const currentCount = document.querySelectorAll('div[class*="x1plvlek"][class*="xryxfnj"]').length;
    console.log(`Ad Trace: loaded ${currentCount} cards so far...`);
    if (currentCount === lastCount) {
      stableRounds++;
    } else {
      stableRounds = 0;
      lastCount = currentCount;
      chrome.runtime.sendMessage({ type: 'progress', count: currentCount });
    }
  }

    console.log('Ad Trace: all ads loaded, parsing...');
    const ads = parseAdCards();
    console.log(`Ad Trace: total ads parsed: ${ads.length}`);
    console.log('Ad Trace: parsed ads:', JSON.stringify(ads, null, 2));
    chrome.runtime.sendMessage({ type: 'done', ads });
  } catch (err) {
    console.error('Ad Trace: scraping failed', err);
    chrome.runtime.sendMessage({ type: 'error' });
  }
}

// Wait for initial ad cards to appear, then auto-scroll and parse
const observer = new MutationObserver(() => {
  const cards = document.querySelectorAll('div[class*="x1plvlek"][class*="xryxfnj"]');
  if (cards.length > 0) {
    observer.disconnect();
    autoScrollAndParse();
  }
});
observer.observe(document.body, { childList: true, subtree: true });
