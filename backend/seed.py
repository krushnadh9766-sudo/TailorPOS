import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.database import SessionLocal, engine, Base
from app.models.user import User
from app.models.customer import Customer
from app.models.order import Order
from app.models.order_item import OrderItem
from app.models.payment import Payment
from app.utils.security import get_password_hash

def seed_db():
    print("Creating tables...")
    Base.metadata.create_all(bind=engine)
    
    db = SessionLocal()
    
    # 1. Admin User
    if not db.query(User).filter(User.email == "admin@tailorpos.com").first():
        admin = User(name="Admin", email="admin@tailorpos.com", mobile="1234567890", password_hash=get_password_hash("admin123"), role="admin")
        db.add(admin)
        print("Admin user created.")

    # 2. Customers
    mock_customers = [
        {"id": 1, "name": "Rahul Sharma", "mobile": "9876543210"},
        {"id": 2, "name": "Priya Menon", "mobile": "9845012345"},
        {"id": 3, "name": "Arun Kumar", "mobile": "9900112233"},
        {"id": 4, "name": "Sunita Rao", "mobile": "9712345678"},
        {"id": 5, "name": "Vijay Nair", "mobile": "9988776655"}
    ]
    
    for mc in mock_customers:
        if not db.query(Customer).filter(Customer.id == mc["id"]).first():
            c = Customer(id=mc["id"], name=mc["name"], mobile=mc["mobile"])
            db.add(c)
    db.commit()
    print("Customers created.")
    
    # 3. Orders
    mock_orders = [
        {"id": 1, "order_number": "TP-0041", "customer_id": 1, "total": 2800, "paid": 1600, "balance": 1200, "status": "In Progress", "items": [{"type": "Shirt", "q": 2, "price": 1400}]}, # Wait, 2 shirts = 2800. Pant 1? The prompt said Shirtx2, Pantx1. Total 2800? 2*800 + 1*1200 = 2800. Let's adjust prices to match 2800.
        {"id": 2, "order_number": "TP-0040", "customer_id": 2, "total": 1800, "paid": 1800, "balance": 0, "status": "Ready", "items": [{"type": "Blouse", "q": 3, "price": 600}]},
        {"id": 3, "order_number": "TP-0039", "customer_id": 3, "total": 5500, "paid": 4700, "balance": 800, "status": "Pending", "items": [{"type": "Suit", "q": 1, "price": 5500}]},
        {"id": 4, "order_number": "TP-0038", "customer_id": 4, "total": 3200, "paid": 700, "balance": 2500, "status": "Pending", "items": [{"type": "Kurta", "q": 4, "price": 500}, {"type": "Blouse", "q": 2, "price": 600}]},
        {"id": 5, "order_number": "TP-0037", "customer_id": 5, "total": 1200, "paid": 1200, "balance": 0, "status": "Delivered", "items": [{"type": "Pant", "q": 2, "price": 600}]},
        {"id": 6, "order_number": "TP-0036", "customer_id": 1, "total": 800, "paid": 800, "balance": 0, "status": "Delivered", "items": [{"type": "Shirt", "q": 1, "price": 800}]}
    ]
    
    for mo in mock_orders:
        if not db.query(Order).filter(Order.id == mo["id"]).first():
            # TP-0041: Shirtx2, Pantx1 (1000 + 800 = 1800... wait total 2800. let's do shirt 900x2=1800, pant 1000x1=1000 => 2800)
            if mo["order_number"] == "TP-0041":
                mo["items"] = [{"type": "Shirt", "q": 2, "price": 900}, {"type": "Pant", "q": 1, "price": 1000}]
            
            o = Order(
                id=mo["id"],
                order_number=mo["order_number"],
                customer_id=mo["customer_id"],
                status=mo["status"],
                subtotal=mo["total"],
                total=mo["total"],
                paid_amount=mo["paid"],
                balance_amount=mo["balance"]
            )
            db.add(o)
            db.commit()
            
            # Items
            for item in mo["items"]:
                oi = OrderItem(order_id=o.id, garment_type=item["type"], quantity=item["q"], unit_price=item["price"], amount=item["q"]*item["price"])
                db.add(oi)
            
            # Payment
            if mo["paid"] > 0:
                p = Payment(order_id=o.id, amount=mo["paid"], method="Cash")
                db.add(p)
            db.commit()
            
    print("Orders, Items, and Payments seeded.")
    db.close()

if __name__ == "__main__":
    seed_db()

