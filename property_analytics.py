import os
from dotenv import load_dotenv
import pandas as pd
from sklearn.linear_model import LinearRegression
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_squared_error
import numpy as np

load_dotenv()

class RealEstateAnalyzer:
    def __init__(self, data_path):
        self.data_path = data_path
        self.data = self.load_data()
        self.optimize_data_memory()

    def load_data(self):
        try:
            data = pd.read_csv(self.data_path)
            return data
        except FileNotFoundError:
            return None

    def optimize_data_memory(self):
        if self.data is not None:
            for col in self.data.select_dtypes(include=['float64', 'int64']).columns:
                col_min = self.data[col].min()
                col_max = self.data[col].max()
                if pd.api.types.is_float_dtype(self.data[col]):
                    self.data[col] = pd.to_numeric(self.data[col], downcast='float')
                elif pd.api.types.is_integer_dtype(self.data[col]):
                    if col_min > np.iinfo(np.int8).min and col_max < np.iinfo(np.int8).max:
                        self.data[col] = self.data[col].astype(np.int8)
                    elif col_min > np.iinfo(np.int16).min and col_max < np.iinfo(np.int16).max:
                        self.data[col] = self.data[col].astype(np.int16)
                    elif col_min > np.iinfo(np.int32).min and col_max < np.iinfo(np.int32).max:
                        self.data[col] = self.data[col].astype(np.int32)
                    else:
                        self.data[col] = self.data[col].astype(np.int64)
        
    def show_summary(self):
        if self.data is not None:
            return self.data.describe()
        else:
            return "No data to summarize."

    def analyze_trends(self, column):
        if self.data is not None:
            try:
                return self.data.groupby(column).mean()
            except KeyError:
                return "Column not found in the dataset."
        else:
            return "No data to analyze."

    def predict_property_value(self, features):
        if self.data is not None:
            X = self.data[features]
            y = self.data['Price']
            
            X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
            
            model = LinearRegression()
            model.fit(X_train, y_train)
            
            predictions = model.predict(X_test)
            mse = mean_squared_error(y_test, predictions)
            
            return {
                "predictions": predictions,
                "mean_squared_error": mse,
                "model_coefficients": model.coef_
            }
        else:
            return "No data available for prediction."

    def find_investment_opportunities(self):
        if self.data is not None:
            market_average = np.mean(self.data['Price'])
            opportunities = self.data[(self.data['Price'] < market_average) & (self.data['Demand'] == 'High')]
            return opportunities
        else:
            return "No data to identify investment opportunities."

if __name__ == "__main__":
    data_path = os.getenv('REAL_ESTATE_DATA_PATH')
    analyzer = RealEstateAnalyzer(data_path)
    
    print(analyzer.show_summary())
    
    print(analyzer.analyze_trends('Year'))
    
    features = ['Area', 'Bedrooms', 'Bathrooms']
    print(analyzer.predict_property_value(features))
    
    print(analyzer.find_investment_opportunities())