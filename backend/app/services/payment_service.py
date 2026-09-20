from sqlalchemy.orm import Session
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
