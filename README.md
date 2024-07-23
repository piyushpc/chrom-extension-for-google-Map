I Developed a Chrome extension that automates the extraction of email addresses from websites listed in a CSV file. This tool efficiently handles large datasets and is designed to streamline the process of gathering contact information from online sources
Extension Structure
Manifest File (manifest.json):
This file defines the permissions, scripts, and basic settings of the Chrome extension.

Background Script (background.js):
This script listens for messages and executes the main logic of the extension.

Popup Script (popup.js):
This script manages the user interface interaction through the popup window.

CSV Parser:
Reads the input CSV file to extract website links.

Puppeteer Script:
Visits each website link and extracts email addresses.

CSV Integration: Reads a CSV file containing website links and processes each link to extract relevant data.
Automated Web Navigation: Utilized Puppeteer, a Node.js library, to automate browser tasks and navigate through each website.
Email Extraction: Implemented regex-based parsing to identify and extract email addresses from the HTML content of web pages.
Asynchronous Processing: Leveraged JavaScript's asynchronous capabilities to handle multiple operations simultaneously, ensuring efficient data extraction.
Data Output: Compiled extracted emails into a new CSV file for easy access and further analysis.
