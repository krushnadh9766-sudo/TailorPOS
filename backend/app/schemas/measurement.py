from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class MeasurementBase(BaseModel):
    garment_type: str
    chest: Optional[str] = None
    waist: Optional[str] = None
    shoulder: Optional[str] = None
    sleeve: Optional[str] = None
    length: Optional[str] = None
    neck: Optional[str] = None
    hip: Optional[str] = None
    thigh: Optional[str] = None
    bottom: Optional[str] = None
    inseam: Optional[str] = None
    notes: Optional[str] = None

class MeasurementCreate(MeasurementBase):
    pass

class MeasurementUpdate(MeasurementBase):
    pass

class MeasurementResponse(MeasurementBase):
    id: int
    customer_id: int
    
    class Config:
        from_attributes = True
