from flask import Flask, request, jsonify
import requests
import os
from dotenv import load_dotenv
import logging

# Setting up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

load_dotenv()

API_URL = os.getenv('REAL_ESTATE_API_URL')
API_KEY = os.getenv('REAL_ESTATE_API_KEY')

app = Flask(__name__)

def fetch_api_data(endpoint, headers):
    try:
        response = requests.get(endpoint, headers=headers)
        if response.status_code == 200:
            logger.info(f"Successfully fetched data from API for endpoint: {endpoint}")
            return True, response.json()
        else:
            logger.error(f"Failed to fetch data from API with status code: {response.status_code}")
            return False, {}
    except Exception as e:
        logger.exception(f"Exception occurred while fetching data from API: {str(e)}")
        return False, {}

@app.route('/fetch_property_data', methods=['GET'])
def get_property_data():
    property_id = request.args.get('property_id')
    if not property_id:
        logger.warning("No property ID provided in request.")
        return jsonify({'error': 'Property ID is required.'}), 400

    success, data = fetch_api_data(f"{API_URL}/{property_id}", {"Authorization": f"Bearer {API_KEY}"})
    if success:
        logger.info("Successfully returned property data.")
        return jsonify(data)
    else:
        logger.error("Failed to fetch property data.")
        return jsonify({'error': 'Failed to fetch property data'}), 400

@app.route('/property_analytics', methods=['POST'])
def analyze_property():
    content = request.get_json()
    analytics_type = content.get('analytics_type')
    parameters = content.get('parameters')

    if analytics_type == 'price_trends':
        logger.info("Performing price trend analysis.")
        return jsonify({'message': 'Simulated price trend analysis result', 'parameters': parameters})
    else:
        logger.warning(f"Unsupported analytics type: {analytics_type}")
        return jsonify({'error': 'Unsupported analytics type'})

if __name__ == '__main__':
    logger.info("Starting the RealtyChain Flask application.")
    app.run(debug=True)