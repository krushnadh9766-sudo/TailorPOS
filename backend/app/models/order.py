from sqlalchemy import Column, Integer, String, Float, ForeignKey, DateTime, Text
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database import Base

class Order(Base):
    __tablename__ = "orders"
    
    id = Column(Integer, primary_key=True, index=True)
    order_number = Column(String(50), unique=True, index=True)
    customer_id = Column(Integer, ForeignKey("customers.id"))
    order_date = Column(DateTime(timezone=True), default=func.now())
    delivery_date = Column(DateTime(timezone=True), nullable=True)
    status = Column(String(50), default="Pending")
    subtotal = Column(Float, default=0.0)
    extra_charges = Column(Float, default=0.0)
    discount = Column(Float, default=0.0)
    total = Column(Float, default=0.0)
    paid_amount = Column(Float, default=0.0)
    balance_amount = Column(Float, default=0.0)
    notes = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    customer = relationship("Customer", back_populates="orders")
    items = relationship("OrderItem", back_populates="order", cascade="all, delete-orphan")
    payments = relationship("Payment", back_populates="order", cascade="all, delete-orphan")
