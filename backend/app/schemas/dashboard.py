from pydantic import BaseModel

class DashboardResponse(BaseModel):
    today_sales: float
    today_orders: int
    pending_orders: int
    ready_orders: int
    today_collection: float
