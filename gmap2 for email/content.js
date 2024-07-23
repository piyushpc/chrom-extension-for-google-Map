chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "extractBusinessInfo") {
    const data = [];
    const resultItems = document.querySelectorAll('.Nv2PK'); // Selector for search result items

    resultItems.forEach((item) => {
      const nameElement = item.querySelector('.qBF1Pd'); // Selector for the name
      const addressElement = item.querySelector('.W4Efsd > span'); // Selector for the address
      const ratingElement = item.querySelector('.MW4etd'); // Selector for the rating
      const reviewCountElement = item.querySelector('.UY7F9'); // Selector for the review count
      const detailsLinkElement = item.querySelector('a'); // Selector for the details link
      const websiteElement = item.querySelector('a[data-value="Website"]'); // Example selector for website links (might need adjustment)

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

    sendResponse({ data });
  }
});
