from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.services.dashboard_service import get_dashboard_stats

router = APIRouter(prefix="/api/dashboard", tags=["dashboard"])

@router.get("", response_model=dict)
def dashboard_stats(db: Session = Depends(get_db)):
    stats = get_dashboard_stats(db)
    return {"success": True, "message": "Success", "data": stats}
