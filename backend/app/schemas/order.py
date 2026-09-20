from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

class OrderItemBase(BaseModel):
    garment_type: str
    quantity: int
    unit_price: float

class OrderItemCreate(OrderItemBase):
    pass

class OrderItemResponse(OrderItemBase):
    id: int
    amount: float
    
    class Config:
        from_attributes = True

class OrderBase(BaseModel):
    customer_id: int
    order_date: Optional[datetime] = None
    delivery_date: Optional[datetime] = None
    extra_charges: float = 0.0
    discount: float = 0.0
    notes: Optional[str] = None

class OrderCreate(OrderBase):
    items: List[OrderItemCreate]

class OrderUpdateStatus(BaseModel):
    status: str

class OrderResponse(OrderBase):
    id: int
    order_number: str
    status: str
    subtotal: float
    total: float
    paid_amount: float
    balance_amount: float
    items: List[OrderItemResponse] = []
    
    class Config:
        from_attributes = True
