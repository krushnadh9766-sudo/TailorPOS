from sqlalchemy.orm import Session
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
