from flask import Flask, request, jsonify
import requests
import os
from dotenv import load_dotenv

load_dotenv()

API_URL = os.getenv('REAL_ESTATE_API_URL')
API_KEY = os.getenv('REAL_ESTATE_API_KEY')

app = Flask(__name__)

@app.route('/fetch_property_data', methods=['GET'])
def get_property_data():
    property_identifier = request.args.get('property_id')
    
    if not property_identifier:
        return jsonify({'error': 'Property ID is required.'}), 400

    auth_headers = {"Authorization": f"Bearer {API_KEY}"}
    api_response = requests.get(f"{API_URL}/{property_identifier}", headers=auth_headers)
    
    if api_response.status_code == 200:
        property_info = api_response.json()
        return jsonify(property_info)
    else:
        return jsonify({'error': 'Failed to fetch property data'}), api_response.status_code

@app.route('/property_analytics', methods=['POST'])
def analyze_property():
    analysis_request_data = request.get_json()
    analysis_type = analysis_request_data.get('analytics_type')
    analysis_parameters = analysis_request_data.get('parameters')

    if analysis_type == 'price_trends':
        analysis_result = {'message': 'Simulated price trend analysis result', 'parameters': analysis_parameters}
    else:
        analysis_result = {'error': 'Unsupported analytics type'}

    return jsonify(analysis_result)

if __name__ == '__main__':
    app.run(debug=True)