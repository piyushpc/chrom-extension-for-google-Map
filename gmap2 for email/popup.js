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

