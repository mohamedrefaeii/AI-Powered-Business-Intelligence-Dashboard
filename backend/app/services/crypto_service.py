import requests
import pandas as pd
from datetime import datetime
from typing import List, Dict, Optional
from app.core.config import settings
from app.models.crypto import Crypto, CryptoPrediction

class CryptoService:
    def __init__(self):
        self.base_url = "https://api.binance.com/api/v3"
        
    def fetch_crypto_data(self, symbol: str) -> Dict:
        """Fetch real-time cryptocurrency data from Binance"""
        endpoint = f"{self.base_url}/ticker/24hr"
        params = {"symbol": symbol}
        
        try:
            response = requests.get(endpoint, params=params)
            data = response.json()
            
            if "symbol" in data:
                return {
                    "symbol": data["symbol"],
                    "price": float(data["lastPrice"]),
                    "change_24h": float(data["priceChange"]),
                    "change_percent_24h": float(data["priceChangePercent"]),
                    "volume_24h": float(data["volume"]),
                    "market_cap": float(data["quoteVolume"]),
                    "high_24h": float(data["highPrice"]),
                    "low_24h": float(data["lowPrice"]),
                    "timestamp": datetime.now()
                }
        except Exception as e:
            print(f"Error fetching crypto data: {e}")
            return None
            
    def get_popular_cryptos(self) -> List[Dict]:
        """Get popular cryptocurrency symbols with their data"""
        popular_symbols = ["BTCUSDT", "ETHUSDT", "BNBUSDT", "ADAUSDT", "SOLUSDT", "DOTUSDT", "MATICUSDT", "LINKUSDT"]
        cryptos = []
        
        for symbol in popular_symbols:
            data = self.fetch_crypto_data(symbol)
            if data:
                cryptos.append(data)
                
        return cryptos
        
    def fetch_historical_data(self, symbol: str, interval: str = "1d", limit: int = 365) -> pd.DataFrame:
        """Fetch historical crypto data for ML training"""
        endpoint = f"{self.base_url}/klines"
        params = {
            "symbol": symbol,
            "interval": interval,
            "limit": limit
        }
        
        try:
            response = requests.get(endpoint, params=params)
            data = response.json()
            
            if isinstance(data, list):
                df = pd.DataFrame(data, columns=[
                    'open_time', 'open', 'high', 'low', 'close', 'volume',
                    'close_time', 'quote_asset_volume', 'number_of_trades',
                    'taker_buy_base_asset_volume', 'taker_buy_quote_asset_volume', 'ignore'
                ])
                
                df['open_time'] = pd.to_datetime(df['open_time'], unit='ms')
                df['close'] = df['close'].astype(float)
                df['volume'] = df['volume'].astype(float)
                df = df[['open_time', 'close', 'volume']]
                df.columns = ['timestamp', 'price', 'volume']
                
                return df
        except Exception as e:
            print(f"Error fetching historical crypto data: {e}")
            return pd.DataFrame()
