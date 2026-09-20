from pydantic import BaseModel
from typing import Optional

class ShopSettingBase(BaseModel):
    shop_name: str
    shop_address: str
    city: str
    phone: str
    email: Optional[str] = None
    currency: str = "INR"
    tax_enabled: bool = False
    tax_percentage: float = 0.0

class ShopSettingUpdate(ShopSettingBase):
    pass

class ShopSettingResponse(ShopSettingBase):
    id: int
    
    class Config:
        from_attributes = True
