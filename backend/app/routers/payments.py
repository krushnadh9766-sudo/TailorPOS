from fastapi import APIRouter, Depends, HTTPException
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
