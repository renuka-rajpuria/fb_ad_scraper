# Ad Trace — Facebook Ad Scraper Chrome Extension

A Chrome extension that scrapes Facebook ads via the Facebook Ad Manager for competitor analysis. Ad Trace allows marketers and analysts to track competitor ad strategies, download reports, and get AI-powered insights — all from their browser.

## Overview

Ad Trace lets you input a competitor's Facebook Ad Library link, auto-scroll and scrape all their ads sorted by impressions, and download a structured CSV report — all from a persistent side panel without leaving your browser.

## File Structure

```
fb_ad_scraper/
├── manifest.json          # Chrome extension manifest (MV3)
├── background.js          # Service worker for background tasks
├── content.js             # Content script injected into Facebook pages
├── popup/
│   ├── popup.html         # Extension popup UI
│   ├── popup.js           # Popup logic
│   └── popup.css          # Popup styles
├── options/
│   ├── options.html       # Settings/options page
│   └── options.js         # Options logic
├── utils/
│   ├── scraper.js         # Core scraping logic
│   ├── csv.js             # CSV generation utility
│   └── api.js             # API calls (AI summary, email report)
├── assets/
│   └── icons/             # Extension icons (16, 48, 128px)
└── README.md
```

## Features

### Done
- [x] Add a competitor's Facebook Ad Library link to scrape their ads
- [x] Auto-scroll to load all ads (sorted by total impressions)
- [x] Filter by active ads only or all ads
- [x] Scrape ad data: advertiser name, status, media type, platforms, ad body, headline, CTA text, CTA link, start date, number of variants, library ID, ad detail link
- [x] Side panel UI — stays open while scraping happens in the active tab
- [x] Live scraping progress via badge colour (yellow = in progress, green = done, red = failed)
- [x] Download scraped ad data as a CSV report

### To Do
- [ ] Save competitors for frequent use (persistent competitor list)
- [ ] Get an AI-generated summary of competitor ad strategy
- [ ] Receive the report via email
- [ ] Set frequency and schedule for automated report downloads
- [ ] Incremental scraping — resume from last scraped ad instead of starting from the beginning every time
- [ ] Download ad creative images
- [ ] Multiple competitor scraping and CSV downloads (V2)

## Setup

```bash
# Clone the repository
git clone git@github.com:renuka-rajpuria/fb_ad_scraper.git
cd fb_ad_scraper
```

Then load the extension in Chrome:
1. Go to `chrome://extensions/`
2. Enable **Developer mode**
3. Click **Load unpacked** and select the `fb_ad_scraper` folder

## License

MIT
