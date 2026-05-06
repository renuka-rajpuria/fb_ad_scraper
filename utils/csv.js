function convertToCSV(ads) {
  const headers = [
    'Index', 'Advertiser Name', 'Status', 'Media Type', 'Platforms',
    'Ad Body', 'Headline', 'CTA Text', 'CTA Link', 'Start Date',
    'Number of Variants', 'Library ID', 'Ad Detail Link',
    'Impression Range', 'Country Targeting'
  ];

  const escape = (val) => {
    if (val === null || val === undefined) return '';
    const str = String(val).replace(/"/g, '""');
    return `"${str}"`;
  };

  const rows = ads.map(ad => [
    ad.index,
    escape(ad.advertiserName),
    escape(ad.status),
    escape(ad.mediaType),
    escape(ad.platforms),
    escape(ad.adBody),
    escape(ad.headline),
    escape(ad.ctaText),
    escape(ad.ctaLink),
    escape(ad.startDate),
    ad.numberOfVariants,
    escape(ad.libraryId),
    escape(ad.adDetailLink),
    escape(ad.impressionRange),
    escape(ad.countryTargeting)
  ].join(','));

  return [headers.join(','), ...rows].join('\n');
}
