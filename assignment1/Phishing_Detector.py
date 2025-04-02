import re
import requests
import hashlib
from urllib.parse import urlparse
from email_validator import validate_email, EmailNotValidError
import dns.resolver
import os
from dotenv import load_dotenv
load_dotenv()

API_KEY = os.getenv("API_KEY")


def check_url(url, api_key=API_KEY):
    try:
        url_id = hashlib.sha256(url.encode()).hexdigest()

        headers = {
            "x-apikey": api_key
        }

        response = requests.get(
            f"https://www.virustotal.com/api/v3/urls/{url_id}",
            headers=headers
        )

        if response.status_code == 200:
            data = response.json()
            stats = data["data"]["attributes"]["last_analysis_stats"]
            print(f"→ VT Result: {stats}")
            if stats.get("malicious", 0) > 0 or stats.get("phishing", 0) > 0:
                return True
    except:
        pass  

    return False

def checking_links(txt):
    urls = re.findall(r'https?://[^\s<>"]+|www\.[^\s<>"]+', txt)

    suspicious_suffixes = [
        ".ru", ".xyz", ".click", ".tk", ".top", ".club", ".info", ".biz",
        ".site", ".win",".space", ".cam",".vip",".zip", ".mov", ".quest", ".party"]

    for url in urls:
        parsed = urlparse(url)
        domain = parsed.hostname or ""

        if re.match(r'^\d+\.\d+\.\d+\.\d+$', domain):
            return True

        if any(domain.endswith(suffix) for suffix in suspicious_suffixes):
            return True
        
        if check_url(url):
            return True
    return False

def checking_suspicious_words(txt):
    suspicious_words = [
        "urgent", "immediately", "action required", "verify", "update",
        "login", "account suspended", "click here", "confirm", "security alert",
        "your account will be closed", "limited access", "unauthorized", "final warning", "act now"
    ]

    txt = txt.lower() 
    for word in suspicious_words:
        if word in txt:
            return True

    return False


def checking_address(txt):
    emails = re.findall(r'[\w\.-]+@[\w\.-]+\.\w+', txt)
    suspicious = []

    for email in emails:
        try :
            v = validate_email(email)
            normalized_email = v.email
            domain = normalized_email.split("@")[1].lower()

            if domain.endswith((".ru", ".xyz", ".click", ".tk", ".top")) or re.match(r'\d+\.\d+\.\d+\.\d+', domain):
                suspicious.append(email)
                continue

            try:
                dns.resolver.resolve(domain, 'MX')
            except (dns.resolver.NoAnswer, dns.resolver.NXDOMAIN, dns.resolver.NoNameservers, dns.exception.Timeout):
                suspicious.append(email)
            
        except EmailNotValidError:
            suspicious.append(email)
    return len(suspicious)>0


def main():
    for fname in os.listdir("assignment1"):
        if not fname.endswith(".txt"):
            continue
        with open(f"assignment1/{fname}", encoding="utf-8") as f:
            email_content = f.read()
        print(f"\nScanning: {fname}")
        indicators = []
        if checking_links(email_content):
            indicators.append("Suspicious link - don't click on this")
        if checking_suspicious_words(email_content):
            indicators.append("Urgent tone and suspicious word - don't click on this")
        if checking_address(email_content):
            indicators.append("Suspicious sender address - don't click on this")

        if indicators:
            print("This email seems to be a phishing attempt:")
            print("Indicators:")
            for ind in indicators:
                print(f" - {ind}")
        else:
            print("No phishing indicators found.")
        print("-" * 30)

if __name__ == "__main__":
    main()