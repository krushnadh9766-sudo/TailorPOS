from sqlalchemy import Column, Integer, String, Boolean, Float, DateTime
from sqlalchemy.sql import func
from app.database import Base

class ShopSetting(Base):
    __tablename__ = "shop_settings"
    
    id = Column(Integer, primary_key=True, index=True)
    shop_name = Column(String(255))
    shop_address = Column(String(255))
    city = Column(String(100))
    phone = Column(String(20))
    email = Column(String(255), nullable=True)
    currency = Column(String(10), default="INR")
    tax_enabled = Column(Boolean, default=False)
    tax_percentage = Column(Float, default=0.0)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
