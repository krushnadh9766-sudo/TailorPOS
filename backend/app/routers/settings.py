from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.schemas.settings import ShopSettingUpdate, ShopSettingResponse
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
    return {"success": True, "message": "Success", "data": ShopSettingResponse.model_validate(setting).model_dump()}

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
    return {"success": True, "message": "Settings updated", "data": ShopSettingResponse.model_validate(setting).model_dump()}
