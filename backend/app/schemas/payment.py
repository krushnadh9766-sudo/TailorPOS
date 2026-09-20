from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class PaymentBase(BaseModel):
    amount: float
    method: str
    reference: Optional[str] = None
    notes: Optional[str] = None

class PaymentCreate(PaymentBase):
    pass

class PaymentResponse(PaymentBase):
    id: int
    order_id: int
    payment_date: datetime
    
    class Config:
        from_attributes = True
