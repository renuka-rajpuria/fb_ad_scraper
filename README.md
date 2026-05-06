# Ad Trace — Facebook Ad Scraper Chrome Extension

A Chrome extension that scrapes Facebook ads via the Facebook Ad Manager for competitor analysis. Ad Trace allows marketers and analysts to track competitor ad strategies, download reports, and get AI-powered insights — all from their browser.

## Overview

Ad Trace lets you input a competitor's Facebook Ad Library link, scrape their active ads, and generate structured reports. It is built for teams who want to monitor competitor ad activity without manual effort.

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
- [ ] _(features will be marked as done once developed)_

### To Do
- [ ] Add a competitor's Facebook Ad Library link to scrape their ads
- [ ] Download scraped ad data as a CSV report
- [ ] Save competitors for frequent use (persistent competitor list)
- [ ] Get an AI-generated summary of competitor ad strategy
- [ ] Receive the report via email
- [ ] Set frequency and schedule for automated report downloads
- [ ] Incremental scraping — resume from last scraped ad instead of starting from the beginning every time
- [ ] Download ad creative images

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
