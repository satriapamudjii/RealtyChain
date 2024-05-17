from flask import Flask, request, jsonify
import requests
import os
from dotenv import load_dotenv

load_dotenv()

REAL_ESTATE_API_URL = os.getenv('REAL_ESTATE_API_URL')
REAL_ESTATE_API_KEY = os.getenv('REAL_ESTATE_API_KEY')

app = Flask(__name__)

@app.route('/fetch_property_data', methods=['GET'])
def fetch_property_data():
    property_id = request.args.get('property_id')
    
    if not property_id:
        return jsonify({'error': 'Property ID is required.'}), 400

    headers = {"Authorization": f"Bearer {REAL_ESTATE_API_KEY}"}
    response = requests.get(f"{REAL_ESTATE_API_URL}/{property_id}", headers=headers)
    
    if response.status_code == 200:
        property_data = response.json()
        return jsonify(property_data)
    else:
        return jsonify({'error': 'Failed to fetch property data'}), response.status_code

@app.route('/property_analytics', methods=['POST'])
def property_analytics():
    request_data = request.get_json()
    analytics_type = request_data.get('analytics_type')
    parameters = request_data.get('parameters')

    if analytics_type == 'price_trends':
        result = {'message': 'Simulated price trend analysis result', 'parameters': parameters}
    else:
        result = {'error': 'Unsupported analytics type'}

    return jsonify(result)

if __name__ == '__main__':
    app.run(debug=True)