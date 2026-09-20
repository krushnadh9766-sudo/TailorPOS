import os

base_schemas_dir = "backend/app/schemas"

auth_code = """from pydantic import BaseModel
from typing import Optional

class LoginRequest(BaseModel):
    email: str
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str

class UserResponse(BaseModel):
    id: int
    name: str
    email: str
    role: str
    
    class Config:
        from_attributes = True
"""

customer_code = """from pydantic import BaseModel
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
"""

order_code = """from pydantic import BaseModel
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
"""

payment_code = """from pydantic import BaseModel
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
"""

measurement_code = """from pydantic import BaseModel
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
"""

dashboard_code = """from pydantic import BaseModel

class DashboardResponse(BaseModel):
    today_sales: float
    today_orders: int
    pending_orders: int
    ready_orders: int
    today_collection: float
"""

settings_code = """from pydantic import BaseModel
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
"""

def write_file(filename, content):
    with open(os.path.join(base_schemas_dir, filename), "w") as f:
        f.write(content)

write_file("auth.py", auth_code)
write_file("customer.py", customer_code)
write_file("order.py", order_code)
write_file("payment.py", payment_code)
write_file("measurement.py", measurement_code)
write_file("dashboard.py", dashboard_code)
write_file("settings.py", settings_code)
write_file("__init__.py", "")

print("Schemas created.")

