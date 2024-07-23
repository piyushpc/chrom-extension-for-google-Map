import csv
import requests
from bs4 import BeautifulSoup
import re

def extract_emails_from_website(url):
    try:
        response = requests.get(url, timeout=10)
        response.raise_for_status()  # Raise an error for bad responses
        html = response.text
        soup = BeautifulSoup(html, 'html.parser')
        
        # Find all mailto links
        email_elements = soup.select('a[href^=mailto]')
        emails = [a['href'].replace('mailto:', '') for a in email_elements]

        # Find emails in the text using regex
        text_emails = set(re.findall(r'[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}', html))
        emails.extend(text_emails)

        return list(set(emails))  # Return unique emails
    except requests.RequestException as e:
        print(f"Error fetching {url}: {e}")
        return []

def read_websites_from_csv(csv_file):
    websites = []
    with open(csv_file, newline='', encoding='utf-8') as file:
        reader = csv.DictReader(file)
        for row in reader:
            if 'Website Link' in row and row['Website Link'].startswith('http'):
                websites.append(row['Website Link'])
    return websites

def write_emails_to_csv(csv_file, email_data):
    with open(csv_file, mode='w', newline='', encoding='utf-8') as file:
        fieldnames = ['Website', 'Emails']
        writer = csv.DictWriter(file, fieldnames=fieldnames)

        writer.writeheader()
        for data in email_data:
            writer.writerow(data)

def main(input_csv, output_csv):
    websites = read_websites_from_csv(input_csv)
    email_data = []

    for website in websites:
        print(f"Extracting emails from {website}...")
        emails = extract_emails_from_website(website)
        email_data.append({'Website': website, 'Emails': ', '.join(emails)})

    write_emails_to_csv(output_csv, email_data)
    print(f"Emails have been written to {output_csv}")

if __name__ == '__main__':
    input_csv = 'input_websites.csv'  # CSV file with website links
    output_csv = 'extracted_emails.csv'  # Output CSV file for emails
    main(input_csv, output_csv)
