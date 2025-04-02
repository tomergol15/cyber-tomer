import sys
import os

sys.path.append(os.path.abspath(".."))

from flask import Flask, request, jsonify
from flask_cors import CORS
from Phishing_Detector import checking_links, checking_address, checking_suspicious_words

app = Flask(__name__)
CORS(app)  

@app.route("/scan", methods=["POST"])
def scan_email():
    data = request.get_json()
    content = data.get("content", "")

    indicators = []

    if checking_links(content):
        indicators.append("Suspicious link - don't click on this")

  
    if checking_suspicious_words(content):
        indicators.append("Urgent tone and suspicious word - don't click on this")

    
    if checking_address(content):
        indicators.append("Suspicious sender address - don't click on this")

   
    return jsonify({
        "phishing": bool(indicators),
        "indicators": indicators
    })

if __name__ == "__main__":
    app.run(port=5000)
