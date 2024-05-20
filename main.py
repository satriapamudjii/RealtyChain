from flask import Flask, request, jsonify
import requests
import os
from dotenv import load_dotenv

load_dotenv()

API_URL = os.getenv('REAL_ESTATE_API_URL')
API_KEY = os.getenv('REAL_ESTATE_API_KEY')

app = Flask(__name__)

def fetch_api_data(endpoint, headers):
    response = requests.get(endpoint, headers=headers)
    if response.status_code == 200:
        return True, response.json()
    return False, {}

@app.route('/fetch_property_data', methods=['GET'])
def get_property_data():
    property_id = request.args.get('property_id')
    if not property_id:
        return jsonify({'error': 'Property ID is required.'}), 400

    success, data = fetch_api_data(f"{API_URL}/{property_id}", {"Authorization": f"Bearer {API_KEY}"})
    if success:
        return jsonify(data)
    else:
        return jsonify({'error': 'Failed to fetch property data'}), 400

@app.route('/property_analytics', methods=['POST'])
def analyze_property():
    content = request.get_json()
    analytics_type = content.get('analytics_type')
    parameters = content.get('parameters')

    if analytics_type == 'price_trends':
        return jsonify({'message': 'Simulated price trend analysis result', 'parameters': parameters})
    else:
        return jsonify({'error': 'Unsupported analytics type'})

if __name__ == '__main__':
    app.run(debug=True)