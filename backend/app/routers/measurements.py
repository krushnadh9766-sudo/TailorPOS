from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.schemas.measurement import MeasurementCreate, MeasurementUpdate
from app.models.measurement import Measurement

router = APIRouter(prefix="/api/customers/{customer_id}/measurements", tags=["measurements"])

@router.get("", response_model=dict)
def list_measurements(customer_id: int, db: Session = Depends(get_db)):
    measurements = db.query(Measurement).filter(Measurement.customer_id == customer_id).all()
    return {"success": True, "message": "Success", "data": measurements}

@router.get("/{garment_type}", response_model=dict)
def get_measurement(customer_id: int, garment_type: str, db: Session = Depends(get_db)):
    measurement = db.query(Measurement).filter(Measurement.customer_id == customer_id, Measurement.garment_type == garment_type).first()
    if not measurement:
        raise HTTPException(status_code=404, detail="Measurement not found")
    return {"success": True, "message": "Success", "data": measurement}

@router.post("", response_model=dict)
def create_measurement(customer_id: int, measurement: MeasurementCreate, db: Session = Depends(get_db)):
    existing = db.query(Measurement).filter(Measurement.customer_id == customer_id, Measurement.garment_type == measurement.garment_type).first()
    if existing:
        for key, value in measurement.dict(exclude_unset=True).items():
            setattr(existing, key, value)
        db_meas = existing
    else:
        db_meas = Measurement(**measurement.dict(), customer_id=customer_id)
        db.add(db_meas)
    
    db.commit()
    db.refresh(db_meas)
    return {"success": True, "message": "Measurement saved", "data": db_meas}

@router.put("/{garment_type}", response_model=dict)
def update_measurement(customer_id: int, garment_type: str, measurement: MeasurementUpdate, db: Session = Depends(get_db)):
    db_meas = db.query(Measurement).filter(Measurement.customer_id == customer_id, Measurement.garment_type == garment_type).first()
    if not db_meas:
        raise HTTPException(status_code=404, detail="Measurement not found")
    for key, value in measurement.dict(exclude_unset=True).items():
        setattr(db_meas, key, value)
    db.commit()
    db.refresh(db_meas)
    return {"success": True, "message": "Measurement updated", "data": db_meas}
