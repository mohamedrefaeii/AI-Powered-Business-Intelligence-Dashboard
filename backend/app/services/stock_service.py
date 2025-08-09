import requests
import pandas as pd
from datetime import datetime, timedelta
from typing import List, Dict, Optional
from app.core.config import settings
from app.models.stock import Stock, StockPrediction
from sqlalchemy.orm import Session

class StockService:
    def __init__(self):
        self.api_key = settings.ALPHA_VANTAGE_API_KEY
        self.base_url = "https://www.alphavantage.co/query"
        
    def fetch_stock_data(self, symbol: str) -> Dict:
        """Fetch real-time stock data from Alpha Vantage"""
        params = {
            "function": "GLOBAL_QUOTE",
            "symbol": symbol,
            "apikey": self.api_key
        }
        
        try:
            response = requests.get(self.base_url, params=params)
            data = response.json()
            
            if "Global Quote" in data:
                quote = data["Global Quote"]
                return {
                    "symbol": symbol,
                    "price": float(quote["05. price"]),
                    "change": float(quote["09. change"]),
                    "change_percent": float(quote["10. change percent"].rstrip("%")),
                    "volume": int(quote["06. volume"]),
                    "market_cap": None,
                    "high_52w": None,
                    "low_52w": None,
                    "pe_ratio": None,
                    "dividend_yield": None
                }
        except Exception as e:
            print(f"Error fetching stock data: {e}")
            return None
            
    def fetch_historical_data(self, symbol: str, days: int = 365) -> pd.DataFrame:
        """Fetch historical stock data for ML training"""
        params = {
            "function": "TIME_SERIES_DAILY",
            "symbol": symbol,
            "outputsize": "full",
            "apikey": self.api_key
        }
        
        try:
            response = requests.get(self.base_url, params=params)
            data = response.json()
            
            if "Time Series (Daily)" in data:
                df = pd.DataFrame.from_dict(data["Time Series (Daily)"], orient='index')
                df = df.astype(float)
                df.index = pd.to_datetime(df.index)
                df = df.sort_index()
                df = df.tail(days)
                df.columns = ['open', 'high', 'low', 'close', 'volume']
                return df
        except Exception as e:
            print(f"Error fetching historical data: {e}")
            return pd.DataFrame()
            
    def get_popular_stocks(self) -> List[Dict]:
        """Get popular stock symbols with their data"""
        popular_symbols = ["AAPL", "GOOGL", "MSFT", "AMZN", "TSLA", "META", "NVDA", "NFLX"]
        stocks = []
        
        for symbol in popular_symbols:
            data = self.fetch_stock_data(symbol)
            if data:
                stocks.append(data)
                
        return stocks
