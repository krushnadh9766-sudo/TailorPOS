from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, Text
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database import Base

class Measurement(Base):
    __tablename__ = "measurements"
    
    id = Column(Integer, primary_key=True, index=True)
    customer_id = Column(Integer, ForeignKey("customers.id"))
    garment_type = Column(String(100))
    chest = Column(String(50), nullable=True)
    waist = Column(String(50), nullable=True)
    shoulder = Column(String(50), nullable=True)
    sleeve = Column(String(50), nullable=True)
    length = Column(String(50), nullable=True)
    neck = Column(String(50), nullable=True)
    hip = Column(String(50), nullable=True)
    thigh = Column(String(50), nullable=True)
    bottom = Column(String(50), nullable=True)
    inseam = Column(String(50), nullable=True)
    notes = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    customer = relationship("Customer", back_populates="measurements")
