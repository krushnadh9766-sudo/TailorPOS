from fastapi import APIRouter, Depends, HTTPException
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
        
    orders = db.query(Order).filter(Order.customer_id == customer.id).all()
    orders_count = len(orders)
    due_amount = sum([o.balance_amount for o in orders])
    
    c_dict = {
        "id": customer.id,
        "name": customer.name,
        "mobile": customer.mobile,
        "email": customer.email,
        "address": customer.address,
        "notes": customer.notes,
        "is_active": customer.is_active,
        "created_at": customer.created_at,
        "updated_at": customer.updated_at,
        "orders": orders_count,
        "due": due_amount
    }
    
    return {"success": True, "message": "Success", "data": c_dict}

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
