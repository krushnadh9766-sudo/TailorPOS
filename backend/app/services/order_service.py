from sqlalchemy.orm import Session
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
