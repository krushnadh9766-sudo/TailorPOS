from sqlalchemy import Column, Integer, String, Float, DateTime
from sqlalchemy.sql import func
from app.database import Base

class MeasurementTemplate(Base):
    __tablename__ = "measurement_templates"
    
    id = Column(Integer, primary_key=True, index=True)
    garment_type = Column(String(100))
    measurement_name = Column(String(100))
    min_value = Column(Float, nullable=True)
    max_value = Column(Float, nullable=True)
    unit = Column(String(50), default="inch")
    sort_order = Column(Integer, default=0)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
