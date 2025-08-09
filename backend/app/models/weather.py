from sqlalchemy import Column, Integer, String, Float, DateTime, JSON
from sqlalchemy.sql import func
from app.core.database import Base

class Weather(Base):
    __tablename__ = "weather"
    
    id = Column(Integer, primary_key=True, index=True)
    city = Column(String(100), index=True)
    country = Column(String(10))
    temperature = Column(Float)
    feels_like = Column(Float)
    humidity = Column(Integer)
    pressure = Column(Integer)
    wind_speed = Column(Float)
    weather_main = Column(String(50))
    weather_description = Column(String(200))
    timestamp = Column(DateTime(timezone=True), server_default=func.now())
    forecast_data = Column(JSON)

class WeatherForecast(Base):
    __tablename__ = "weather_forecasts"
    
    id = Column(Integer, primary_key=True, index=True)
    city = Column(String(100), index=True)
    forecast_date = Column(DateTime(timezone=True))
    temperature = Column(Float)
    humidity = Column(Integer)
    weather_main = Column(String(50))
    created_at = Column(DateTime(timezone=True), server_default=func.now())
