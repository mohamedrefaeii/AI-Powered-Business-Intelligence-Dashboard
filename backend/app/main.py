from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.routes import router
from app.core.config import settings
from app.core.database import engine, Base
from app.services.scheduler import start_scheduler
from datetime import datetime

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="AI Business Intelligence Dashboard",
    description="Real-time data analytics with AI predictions",
    version="1.0.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "https://your-frontend-domain.com"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API routes
app.include_router(router, prefix="/api")

@app.on_event("startup")
async def startup_event():
    """Start the background scheduler on startup"""
    start_scheduler()

@app.get("/")
async def root():
    return {
        "message": "AI Business Intelligence Dashboard API",
        "version": "1.0.0",
        "timestamp": datetime.now().isoformat()
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "app.main:app",
        host=settings.BACKEND_HOST,
        port=settings.BACKEND_PORT,
        reload=True
    )
