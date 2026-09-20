from fastapi import APIRouter, Depends, HTTPException
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
