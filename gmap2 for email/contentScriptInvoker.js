chrome.runtime.sendMessage({ action: "scrapeData" });
// contentScriptInvoker.js

//content.cs

// Function to be executed in the context of the current tab
function extractGoogleMapsData() {
  const data = [];
  const resultItems = document.querySelectorAll('.Nv2PK'); // Selector for search result items
  
  resultItems.forEach((item) => {
    const nameElement = item.querySelector('.qBF1Pd'); // Selector for the name
    const addressElement = item.querySelector('.W4Efsd > span'); // Selector for the address
    const ratingElement = item.querySelector('.MW4etd'); // Selector for the rating
    const reviewCountElement = item.querySelector('.UY7F9'); // Selector for the review count

    if (nameElement && addressElement) {
      const name = nameElement.innerText;
      const address = addressElement.innerText;
      const rating = ratingElement ? ratingElement.innerText : 'N/A';
      const reviewCount = reviewCountElement ? reviewCountElement.innerText : 'N/A';

      data.push({ name, address, rating, reviewCount });
    }
  });
  
  return data;
}


//background 

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log('Message received:', request);
  if (request.action === 'extractData') {
    // Perform data extraction logic
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.scripting.executeScript(
        {
          target: { tabId: tabs[0].id },
          func: extractGoogleMapsData,
        },
        (results) => {
          if (chrome.runtime.lastError || !results || !results[0]) {
            console.error('Script execution failed:', chrome.runtime.lastError);
            sendResponse({ success: false });
          } else {
            console.log('Data extracted:', results[0].result);
            sendResponse({ success: true, data: results[0].result });
          }
        }
      );
    });
    return true; // Indicate that the response will be sent asynchronously
  }
});

// Function to be executed in the context of the current tab
function extractGoogleMapsData() {
  const data = [];
  const resultItems = document.querySelectorAll('.Nv2PK'); // Selector for search result items
  
  resultItems.forEach((item) => {
    const nameElement = item.querySelector('.qBF1Pd'); // Selector for the name
    const addressElement = item.querySelector('.W4Efsd > span'); // Selector for the address
    const ratingElement = item.querySelector('.MW4etd'); // Selector for the rating
    const reviewCountElement = item.querySelector('.UY7F9'); // Selector for the review count

    if (nameElement && addressElement) {
      const name = nameElement.innerText;
      const address = addressElement.innerText;
      const rating = ratingElement ? ratingElement.innerText : 'N/A';
      const reviewCount = reviewCountElement ? reviewCountElement.innerText : 'N/A';

      data.push({ name, address, rating, reviewCount });
    }
  });
  
  return data;
}


  //popup.js
  document.getElementById('extractBtn').addEventListener('click', () => {
    chrome.runtime.sendMessage({ action: 'extractData' }, (response) => {
      if (response && response.success) {
        console.log('Data extraction initiated.');
        downloadCSV(response.data);
      } else {
        console.error('Failed to initiate data extraction.');
      }
    });
  });
  
  function downloadCSV(csvContent) {
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'extracted_data.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
  
  
  //menifest.js

  {
    "manifest_version": 3,
    "name": "Google Maps Data Extractor",
    "version": "1.0",
    "permissions": ["activeTab", "scripting"],
    "background": {
      "service_worker": "background.js"
    },
    "action": {
      "default_popup": "popup.html",
      "default_icon": {
        "16": "icons/icon16.png",
        "48": "icons/icon48.png",
        "128": "icons/icon128.png"
      }
    },
    "host_permissions": [
      "https://*.google.com/maps/*"
    ]
  }

  //popup.html

  <!DOCTYPE html>
<html>
<head>
  <title>Google Maps Data Extractor</title>
  <style>
    body {
      font-family: Arial, sans-serif;
    }
    button {
      margin-top: 20px;
      padding: 10px 20px;
      font-size: 16px;
      cursor: pointer;
    }
  </style>
</head>
<body>
  <h1>Google Maps Data Extractor</h1>
  <button id="extractBtn">Extract Data</button>
  <script src="popup.js"></script>
</body>
</html>
