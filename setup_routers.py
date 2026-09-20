import os

routers_dir = "backend/app/routers"
services_dir = "backend/app/services"

auth_router = """from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.schemas.auth import LoginRequest, Token, UserResponse
from app.models.user import User
from app.utils.security import verify_password, create_access_token
from app.dependencies.auth import get_current_user

router = APIRouter(prefix="/api/auth", tags=["auth"])

@router.post("/login", response_model=Token)
def login(request: LoginRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == request.email).first()
    if not user or not verify_password(request.password, user.password_hash):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")
    access_token = create_access_token(data={"sub": user.email})
    return {"access_token": access_token, "token_type": "bearer"}

@router.get("/me", response_model=UserResponse)
def get_me(current_user: User = Depends(get_current_user)):
    return current_user
"""

customers_router = """from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.schemas.customer import CustomerCreate, CustomerUpdate, CustomerResponse
from app.models.customer import Customer
from app.models.order import Order
from app.models.payment import Payment
from app.models.measurement import Measurement
from sqlalchemy import or_

router = APIRouter(prefix="/api/customers", tags=["customers"])

@router.get("", response_model=dict)
def get_customers(search: str = None, db: Session = Depends(get_db)):
    query = db.query(Customer).filter(Customer.is_active == True)
    if search:
        query = query.filter(or_(Customer.name.contains(search), Customer.mobile.contains(search)))
    
    customers = query.all()
    
    # Calculate stats manually to match frontend requirements
    result = []
    for c in customers:
        # Avoid running N+1 queries ideally, but for now doing this for simplicity
        orders = db.query(Order).filter(Order.customer_id == c.id).all()
        orders_count = len(orders)
        due_amount = sum([o.balance_amount for o in orders])
        
        c_dict = {
            "id": c.id,
            "name": c.name,
            "mobile": c.mobile,
            "email": c.email,
            "address": c.address,
            "notes": c.notes,
            "is_active": c.is_active,
            "created_at": c.created_at,
            "updated_at": c.updated_at,
            "orders": orders_count,
            "due": due_amount
        }
        result.append(c_dict)

    return {"success": True, "message": "Success", "data": result}

@router.get("/{id}", response_model=dict)
def get_customer(id: int, db: Session = Depends(get_db)):
    customer = db.query(Customer).filter(Customer.id == id, Customer.is_active == True).first()
    if not customer:
        raise HTTPException(status_code=404, detail="Customer not found")
    return {"success": True, "message": "Success", "data": customer}

@router.post("", response_model=dict)
def create_customer(customer: CustomerCreate, db: Session = Depends(get_db)):
    db_customer = Customer(**customer.dict())
    db.add(db_customer)
    db.commit()
    db.refresh(db_customer)
    return {"success": True, "message": "Customer created successfully", "data": db_customer}

@router.put("/{id}", response_model=dict)
def update_customer(id: int, customer: CustomerUpdate, db: Session = Depends(get_db)):
    db_customer = db.query(Customer).filter(Customer.id == id).first()
    if not db_customer:
        raise HTTPException(status_code=404, detail="Customer not found")
    for key, value in customer.dict(exclude_unset=True).items():
        setattr(db_customer, key, value)
    db.commit()
    db.refresh(db_customer)
    return {"success": True, "message": "Customer updated successfully", "data": db_customer}

@router.delete("/{id}")
def delete_customer(id: int, db: Session = Depends(get_db)):
    db_customer = db.query(Customer).filter(Customer.id == id).first()
    if not db_customer:
        raise HTTPException(status_code=404, detail="Customer not found")
    db_customer.is_active = False
    db.commit()
    return {"success": True, "message": "Customer deleted successfully", "data": {}}
"""

orders_router = """from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.schemas.order import OrderCreate, OrderUpdateStatus
from app.services.order_service import create_order, get_orders, get_order, update_order_status
from typing import Optional

router = APIRouter(prefix="/api/orders", tags=["orders"])

@router.get("", response_model=dict)
def list_orders(status: Optional[str] = None, search: Optional[str] = None, db: Session = Depends(get_db)):
    orders = get_orders(db, status=status, search=search)
    return {"success": True, "message": "Success", "data": orders}

@router.get("/{id}", response_model=dict)
def retrieve_order(id: int, db: Session = Depends(get_db)):
    order = get_order(db, id)
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    return {"success": True, "message": "Success", "data": order}

@router.post("", response_model=dict)
def add_order(order_data: OrderCreate, db: Session = Depends(get_db)):
    try:
        order = create_order(db, order_data)
        return {"success": True, "message": "Order created successfully", "data": order}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.patch("/{id}/status", response_model=dict)
def update_status(id: int, status_data: OrderUpdateStatus, db: Session = Depends(get_db)):
    try:
        order = update_order_status(db, id, status_data.status)
        return {"success": True, "message": "Order status updated", "data": order}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
"""

payments_router = """from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.schemas.payment import PaymentCreate
from app.services.payment_service import add_payment, get_order_payments

router = APIRouter(prefix="/api/orders/{order_id}/payments", tags=["payments"])

@router.get("", response_model=dict)
def list_payments(order_id: int, db: Session = Depends(get_db)):
    payments = get_order_payments(db, order_id)
    return {"success": True, "message": "Success", "data": payments}

@router.post("", response_model=dict)
def create_payment(order_id: int, payment_data: PaymentCreate, db: Session = Depends(get_db)):
    try:
        payment = add_payment(db, order_id, payment_data)
        return {"success": True, "message": "Payment added successfully", "data": payment}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
"""

measurements_router = """from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.schemas.measurement import MeasurementCreate, MeasurementUpdate
from app.models.measurement import Measurement

router = APIRouter(prefix="/api/customers/{customer_id}/measurements", tags=["measurements"])

@router.get("", response_model=dict)
def list_measurements(customer_id: int, db: Session = Depends(get_db)):
    measurements = db.query(Measurement).filter(Measurement.customer_id == customer_id).all()
    return {"success": True, "message": "Success", "data": measurements}

@router.get("/{garment_type}", response_model=dict)
def get_measurement(customer_id: int, garment_type: str, db: Session = Depends(get_db)):
    measurement = db.query(Measurement).filter(Measurement.customer_id == customer_id, Measurement.garment_type == garment_type).first()
    if not measurement:
        raise HTTPException(status_code=404, detail="Measurement not found")
    return {"success": True, "message": "Success", "data": measurement}

@router.post("", response_model=dict)
def create_measurement(customer_id: int, measurement: MeasurementCreate, db: Session = Depends(get_db)):
    existing = db.query(Measurement).filter(Measurement.customer_id == customer_id, Measurement.garment_type == measurement.garment_type).first()
    if existing:
        for key, value in measurement.dict(exclude_unset=True).items():
            setattr(existing, key, value)
        db_meas = existing
    else:
        db_meas = Measurement(**measurement.dict(), customer_id=customer_id)
        db.add(db_meas)
    
    db.commit()
    db.refresh(db_meas)
    return {"success": True, "message": "Measurement saved", "data": db_meas}

@router.put("/{garment_type}", response_model=dict)
def update_measurement(customer_id: int, garment_type: str, measurement: MeasurementUpdate, db: Session = Depends(get_db)):
    db_meas = db.query(Measurement).filter(Measurement.customer_id == customer_id, Measurement.garment_type == garment_type).first()
    if not db_meas:
        raise HTTPException(status_code=404, detail="Measurement not found")
    for key, value in measurement.dict(exclude_unset=True).items():
        setattr(db_meas, key, value)
    db.commit()
    db.refresh(db_meas)
    return {"success": True, "message": "Measurement updated", "data": db_meas}
"""

dashboard_router = """from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.services.dashboard_service import get_dashboard_stats

router = APIRouter(prefix="/api/dashboard", tags=["dashboard"])

@router.get("", response_model=dict)
def dashboard_stats(db: Session = Depends(get_db)):
    stats = get_dashboard_stats(db)
    return {"success": True, "message": "Success", "data": stats}
"""

settings_router = """from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.schemas.settings import ShopSettingUpdate
from app.models.shop_setting import ShopSetting

router = APIRouter(prefix="/api/settings/shop", tags=["settings"])

@router.get("", response_model=dict)
def get_shop_settings(db: Session = Depends(get_db)):
    setting = db.query(ShopSetting).first()
    if not setting:
        # Create default
        setting = ShopSetting(shop_name="Tailor POS", shop_address="123 Main Street", city="Bangalore", phone="9876543210")
        db.add(setting)
        db.commit()
        db.refresh(setting)
    return {"success": True, "message": "Success", "data": setting}

@router.put("", response_model=dict)
def update_shop_settings(setting_data: ShopSettingUpdate, db: Session = Depends(get_db)):
    setting = db.query(ShopSetting).first()
    if not setting:
        setting = ShopSetting(**setting_data.dict())
        db.add(setting)
    else:
        for key, value in setting_data.dict(exclude_unset=True).items():
            setattr(setting, key, value)
    db.commit()
    db.refresh(setting)
    return {"success": True, "message": "Settings updated", "data": setting}
"""

order_service = """from sqlalchemy.orm import Session
from sqlalchemy import or_
from app.models.order import Order
from app.models.order_item import OrderItem
from app.models.customer import Customer
from app.schemas.order import OrderCreate

def get_orders(db: Session, status: str = None, search: str = None):
    query = db.query(Order)
    if status and status != 'All':
        query = query.filter(Order.status == status)
    if search:
        query = query.join(Customer).filter(
            or_(
                Order.order_number.contains(search),
                Customer.name.contains(search),
                Customer.mobile.contains(search)
            )
        )
    orders = query.order_by(Order.created_at.desc()).all()
    result = []
    for o in orders:
        o_dict = {
            "id": o.id,
            "order_number": o.order_number,
            "customer": o.customer.name if o.customer else "Unknown",
            "customerMobile": o.customer.mobile if o.customer else "",
            "total": o.total,
            "paid": o.paid_amount,
            "balance": o.balance_amount,
            "dueDate": o.delivery_date.strftime("%d %b %Y") if o.delivery_date else "",
            "orderDate": o.order_date.strftime("%d %b %Y") if o.order_date else "",
            "status": o.status
        }
        # Also need items
        items_arr = [{"type": i.garment_type, "quantity": i.quantity, "price": i.amount} for i in o.items]
        o_dict["items"] = items_arr
        result.append(o_dict)
    return result

def get_order(db: Session, order_id: int):
    order = db.query(Order).filter(Order.id == order_id).first()
    if not order:
        return None
    o_dict = {
        "id": order.id,
        "order_number": order.order_number,
        "customer": order.customer.name if order.customer else "Unknown",
        "customerMobile": order.customer.mobile if order.customer else "",
        "total": order.total,
        "paid": order.paid_amount,
        "balance": order.balance_amount,
        "dueDate": order.delivery_date.strftime("%d %b %Y") if order.delivery_date else "",
        "orderDate": order.order_date.strftime("%d %b %Y") if order.order_date else "",
        "status": order.status,
        "subtotal": order.subtotal,
        "extra_charges": order.extra_charges,
        "discount": order.discount
    }
    items_arr = [{"type": i.garment_type, "quantity": i.quantity, "price": i.amount} for i in order.items]
    o_dict["items"] = items_arr
    return o_dict

def create_order(db: Session, order_data: OrderCreate):
    # generate unique order number
    last_order = db.query(Order).order_by(Order.id.desc()).first()
    next_num = 42 if not last_order else last_order.id + 1
    order_number = f"TP-{next_num:04d}"

    # Calculate item amounts and subtotal
    subtotal = 0.0
    items = []
    for item_data in order_data.items:
        amount = item_data.quantity * item_data.unit_price
        subtotal += amount
        items.append(OrderItem(
            garment_type=item_data.garment_type,
            quantity=item_data.quantity,
            unit_price=item_data.unit_price,
            amount=amount
        ))

    total = subtotal + order_data.extra_charges - order_data.discount
    balance = total # initial paid is 0

    order = Order(
        order_number=order_number,
        customer_id=order_data.customer_id,
        order_date=order_data.order_date,
        delivery_date=order_data.delivery_date,
        subtotal=subtotal,
        extra_charges=order_data.extra_charges,
        discount=order_data.discount,
        total=total,
        paid_amount=0.0,
        balance_amount=balance,
        notes=order_data.notes
    )
    
    db.add(order)
    db.commit()
    db.refresh(order)
    
    for item in items:
        item.order_id = order.id
        db.add(item)
    db.commit()
    
    return get_order(db, order.id)

def update_order_status(db: Session, order_id: int, status: str):
    allowed_statuses = ["Pending", "In Progress", "Ready", "Delivered"]
    if status not in allowed_statuses:
        raise ValueError("Invalid status")
        
    order = db.query(Order).filter(Order.id == order_id).first()
    if not order:
        raise ValueError("Order not found")
        
    order.status = status
    db.commit()
    db.refresh(order)
    return get_order(db, order.id)
"""

payment_service = """from sqlalchemy.orm import Session
from app.models.payment import Payment
from app.models.order import Order
from app.schemas.payment import PaymentCreate

def get_order_payments(db: Session, order_id: int):
    return db.query(Payment).filter(Payment.order_id == order_id).all()

def add_payment(db: Session, order_id: int, payment_data: PaymentCreate):
    order = db.query(Order).filter(Order.id == order_id).first()
    if not order:
        raise ValueError("Order not found")
        
    if payment_data.amount <= 0:
        raise ValueError("Payment amount must be greater than zero")
        
    if payment_data.amount > order.balance_amount:
        raise ValueError("Payment amount cannot exceed balance amount")
        
    payment = Payment(
        order_id=order_id,
        amount=payment_data.amount,
        method=payment_data.method,
        reference=payment_data.reference,
        notes=payment_data.notes
    )
    
    db.add(payment)
    
    # Update order totals
    order.paid_amount += payment.amount
    order.balance_amount = order.total - order.paid_amount
    
    db.commit()
    db.refresh(payment)
    return payment
"""

dashboard_service = """from sqlalchemy.orm import Session
from sqlalchemy import func
from app.models.order import Order
from app.models.payment import Payment
from datetime import date

def get_dashboard_stats(db: Session):
    today = date.today()
    
    # Today's orders
    today_orders = db.query(Order).filter(func.date(Order.order_date) == today).count()
    
    # Today's sales (total value of orders placed today)
    today_sales_result = db.query(func.sum(Order.total)).filter(func.date(Order.order_date) == today).scalar()
    today_sales = float(today_sales_result) if today_sales_result else 0.0
    
    # Pending / Ready orders
    pending_orders = db.query(Order).filter(Order.status == 'Pending').count()
    ready_orders = db.query(Order).filter(Order.status == 'Ready').count()
    
    # Today's collections
    collection_result = db.query(func.sum(Payment.amount)).filter(func.date(Payment.payment_date) == today).scalar()
    today_collection = float(collection_result) if collection_result else 0.0
    
    return {
        "today_sales": today_sales,
        "today_orders": today_orders,
        "pending_orders": pending_orders,
        "ready_orders": ready_orders,
        "today_collection": today_collection
    }
"""

def write_file(path, content):
    with open(path, "w") as f:
        f.write(content)

write_file(os.path.join(routers_dir, "auth.py"), auth_router)
write_file(os.path.join(routers_dir, "customers.py"), customers_router)
write_file(os.path.join(routers_dir, "orders.py"), orders_router)
write_file(os.path.join(routers_dir, "payments.py"), payments_router)
write_file(os.path.join(routers_dir, "measurements.py"), measurements_router)
write_file(os.path.join(routers_dir, "dashboard.py"), dashboard_router)
write_file(os.path.join(routers_dir, "settings.py"), settings_router)

write_file(os.path.join(services_dir, "order_service.py"), order_service)
write_file(os.path.join(services_dir, "payment_service.py"), payment_service)
write_file(os.path.join(services_dir, "dashboard_service.py"), dashboard_service)

print("Routers and Services created.")

