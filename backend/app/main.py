from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import engine, Base
from app.routers import auth, customers, orders, payments, measurements, dashboard, settings

# Create all tables (In production, use Alembic migrations)
Base.metadata.create_all(bind=engine)

app = FastAPI(title="TailorPOS API", description="API for TailorPOS", version="1.0.0")

# CORS for local development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/api/health", tags=["health"])
def health_check():
    return {"success": True, "message": "TailorPOS API is running"}

app.include_router(auth.router)
app.include_router(customers.router)
app.include_router(orders.router)
app.include_router(payments.router)
app.include_router(measurements.router)
app.include_router(dashboard.router)
app.include_router(settings.router)

