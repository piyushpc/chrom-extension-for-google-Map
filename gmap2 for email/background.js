chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'extractData') {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.scripting.executeScript(
        {
          target: { tabId: tabs[0].id },
          func: extractBusinessInfo,
        },
        (results) => {
          if (chrome.runtime.lastError || !results || !results[0]) {
            console.error('Script execution failed:', chrome.runtime.lastError);
            sendResponse({ success: false });
          } else {
            const data = results[0].result;
            console.log('Business Data extracted:', data);
            const csvContent = convertToCSV(data);
            sendResponse({ success: true, data: csvContent });
          }
        }
      );
    });
    return true; // Indicate that the response will be sent asynchronously
  }
});

function extractBusinessInfo() {
  const data = [];
  const resultItems = document.querySelectorAll('.Nv2PK'); // Selector for search result items

  resultItems.forEach((item) => {
    const nameElement = item.querySelector('.qBF1Pd'); // Selector for the name
    const addressElement = item.querySelector('.W4Efsd > span'); // Selector for the address
    const ratingElement = item.querySelector('.MW4etd'); // Selector for the rating
    const reviewCountElement = item.querySelector('.UY7F9'); // Selector for the review count
    const detailsLinkElement = item.querySelector('a'); // Selector for the details link
    const websiteElement = item.querySelector('a[data-value="Website"]'); // Example selector for website links

    if (nameElement && addressElement && detailsLinkElement) {
      const name = nameElement.innerText;
      const address = addressElement.innerText;
      const rating = ratingElement ? ratingElement.innerText : 'N/A';
      const reviewCount = reviewCountElement ? reviewCountElement.innerText : 'N/A';
      const detailsLink = detailsLinkElement.href;
      const websiteLink = websiteElement ? websiteElement.href : 'N/A';

      data.push({ name, address, rating, reviewCount, detailsLink, websiteLink });
    }
  });

  return data;
}

function convertToCSV(data) {
  const headers = ['Name', 'Address', 'Rating', 'Review Count', 'Details Link', 'Website Link'];
  const csvRows = data.map(item => [
    item.name,
    item.address,
    item.rating,
    item.reviewCount,
    item.detailsLink,
    item.websiteLink
  ]);

  const csvContent = [
    headers.join(','),
    ...csvRows.map(row => row.join(','))
  ].join('\n');

  return csvContent;
}
