const fs = require('fs');
const csv = require('csv-parser');
const puppeteer = require('puppeteer');

function readWebsitesFromCsv(filePath) {
  return new Promise((resolve, reject) => {
    const websites = [];
    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', (row) => {
        if (row['Website Link'] && row['Website Link'].startsWith('http')) {
          websites.push(row['Website Link']);
        }
      })
      .on('end', () => {
        resolve(websites);
      })
      .on('error', (error) => {
        reject(error);
      });
  });
}

async function extractEmailsFromWebsite(url) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  try {
    await page.goto(url, { waitUntil: 'networkidle2', timeout: 60000 });
    const html = await page.content();
    const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
    const emails = html.match(emailRegex);
    return [...new Set(emails || [])]; // Remove duplicates
  } catch (error) {
    console.error(`Error fetching ${url}:`, error);
    return [];
  } finally {
    await browser.close();
  }
}

function writeEmailsToCsv(filePath, emailData) {
  const header = 'Website,Emails\n';
  const rows = emailData.map(({ website, emails }) => `${website},"${emails.join(', ')}"`).join('\n');
  fs.writeFileSync(filePath, header + rows);
}

async function main(inputCsv, outputCsv) {
  try {
    const websites = await readWebsitesFromCsv(inputCsv);
    const emailData = [];

    for (const website of websites) {
      console.log(`Extracting emails from ${website}...`);
      const emails = await extractEmailsFromWebsite(website);
      emailData.push({ website, emails });
    }

    writeEmailsToCsv(outputCsv, emailData);
    console.log(`Emails have been written to ${outputCsv}`);
  } catch (error) {
    console.error('Error processing CSV:', error);
  }
}

const inputCsv = 'input_websites.csv'; // Input CSV file path
const outputCsv = 'extracted_emails.csv'; // Output CSV file path
main(inputCsv, outputCsv);
