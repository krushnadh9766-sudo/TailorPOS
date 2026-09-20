import os

base_models_dir = "backend/app/models"

customer_code = """from sqlalchemy import Column, Integer, String, Boolean, Text, DateTime
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database import Base

class Customer(Base):
    __tablename__ = "customers"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), index=True)
    mobile = Column(String(20), index=True)
    email = Column(String(255), nullable=True)
    address = Column(Text, nullable=True)
    notes = Column(Text, nullable=True)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    orders = relationship("Order", back_populates="customer")
    measurements = relationship("Measurement", back_populates="customer")
"""

user_code = """from sqlalchemy import Column, Integer, String, Boolean, DateTime
from sqlalchemy.sql import func
from app.database import Base

class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255))
    mobile = Column(String(20))
    email = Column(String(255), unique=True, index=True)
    password_hash = Column(String(255))
    role = Column(String(50), default="staff")
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
"""

order_code = """from sqlalchemy import Column, Integer, String, Float, ForeignKey, DateTime, Text
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
"""

order_item_code = """from sqlalchemy import Column, Integer, String, Float, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database import Base

class OrderItem(Base):
    __tablename__ = "order_items"
    
    id = Column(Integer, primary_key=True, index=True)
    order_id = Column(Integer, ForeignKey("orders.id"))
    garment_type = Column(String(100))
    quantity = Column(Integer, default=1)
    unit_price = Column(Float, default=0.0)
    amount = Column(Float, default=0.0)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    order = relationship("Order", back_populates="items")
"""

payment_code = """from sqlalchemy import Column, Integer, String, Float, ForeignKey, DateTime, Text
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database import Base

class Payment(Base):
    __tablename__ = "payments"
    
    id = Column(Integer, primary_key=True, index=True)
    order_id = Column(Integer, ForeignKey("orders.id"))
    amount = Column(Float, default=0.0)
    method = Column(String(50))
    reference = Column(String(255), nullable=True)
    payment_date = Column(DateTime(timezone=True), default=func.now())
    notes = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    order = relationship("Order", back_populates="payments")
"""

measurement_code = """from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, Text
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
"""

measurement_template_code = """from sqlalchemy import Column, Integer, String, Float, DateTime
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
"""

shop_setting_code = """from sqlalchemy import Column, Integer, String, Boolean, Float, DateTime
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
"""

models_init = """from .user import User
from .customer import Customer
from .order import Order
from .order_item import OrderItem
from .payment import Payment
from .measurement import Measurement
from .measurement_template import MeasurementTemplate
from .shop_setting import ShopSetting
"""

def write_file(filename, content):
    with open(os.path.join(base_models_dir, filename), "w") as f:
        f.write(content)

write_file("user.py", user_code)
write_file("customer.py", customer_code)
write_file("order.py", order_code)
write_file("order_item.py", order_item_code)
write_file("payment.py", payment_code)
write_file("measurement.py", measurement_code)
write_file("measurement_template.py", measurement_template_code)
write_file("shop_setting.py", shop_setting_code)
write_file("__init__.py", models_init)

print("Models created.")

