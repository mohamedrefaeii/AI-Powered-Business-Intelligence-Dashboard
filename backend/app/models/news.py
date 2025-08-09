from sqlalchemy import Column, Integer, String, Float, DateTime, JSON, Text
from sqlalchemy.sql import func
from app.core.database import Base

class News(Base):
    __tablename__ = "news"
    
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(500))
    description = Column(Text)
    url = Column(String(500))
    source = Column(String(100))
    published_at = Column(DateTime(timezone=True))
    category = Column(String(50))
    sentiment_score = Column(Float)
    sentiment_label = Column(String(20))
    timestamp = Column(DateTime(timezone=True), server_default=func.now())
    metadata = Column(JSON)
