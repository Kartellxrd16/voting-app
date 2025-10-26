# backend/routes/notifications.py
from fastapi import APIRouter, HTTPException
from firebase.firestore import firestore_service
from models.schemas import NotificationResponse
from typing import List

router = APIRouter()

@router.get("/notifications/{user_id}", response_model=List[NotificationResponse])
async def get_notifications(user_id: str, user_type: str):
    try:
        notifications_data = await firestore_service.get_user_notifications(user_id, user_type)
        
        notifications_list = []
        for notif_data in notifications_data:
            notifications_list.append(NotificationResponse(**notif_data))
        
        return notifications_list
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Firestore error: {str(e)}")

@router.put("/notifications/{notification_id}/read", response_model=dict)
async def mark_notification_read(notification_id: str):
    try:
        await firestore_service.mark_notification_read(notification_id)
        return {"message": "Notification marked as read", "notification_id": notification_id}
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Firestore error: {str(e)}")

@router.get("/notifications/{user_id}/unread-count", response_model=dict)
async def get_unread_notifications_count(user_id: str, user_type: str):
    try:
        count = await firestore_service.get_unread_notifications_count(user_id, user_type)
        return {"user_id": user_id, "unread_count": count}
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Firestore error: {str(e)}")

@router.delete("/notifications/{notification_id}", response_model=dict)
async def delete_notification(notification_id: str):
    try:
        await firestore_service.delete_notification(notification_id)
        return {"message": "Notification deleted successfully", "notification_id": notification_id}
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Firestore error: {str(e)}")