from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class CustomerBase(BaseModel):
    name: str
    mobile: str
    email: Optional[str] = None
    address: Optional[str] = None
    notes: Optional[str] = None
    is_active: bool = True

class CustomerCreate(CustomerBase):
    pass

class CustomerUpdate(CustomerBase):
    pass

class CustomerResponse(CustomerBase):
    id: int
    created_at: datetime
    updated_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True
