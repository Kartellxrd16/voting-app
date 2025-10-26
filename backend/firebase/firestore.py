# backend/firebase/firestore.py
import firebase_admin
from firebase_admin import credentials, firestore
import os
import json
from typing import List, Dict, Optional
import asyncio

# Initialize Firebase Admin SDK
def initialize_firebase():
    try:
        # Check if already initialized
        firebase_admin.get_app()
        print("✅ Firebase already initialized")
        return True
    except ValueError:
        print("🔄 Initializing Firebase...")
        try:
            # Method 1: Try to use service account key file
            service_account_paths = [
                "serviceAccountKey.json",
                "../serviceAccountKey.json",
                "./serviceAccountKey.json"
            ]
            
            for path in service_account_paths:
                if os.path.exists(path):
                    cred = credentials.Certificate(path)
                    firebase_admin.initialize_app(cred)
                    print(f"✅ Firebase initialized with service account file: {path}")
                    return True
            
            # Method 2: Try environment variables for service account
            project_id = os.getenv("FIREBASE_PROJECT_ID", "voting-app-5249d")
            private_key = os.getenv("FIREBASE_PRIVATE_KEY", "")
            client_email = os.getenv("FIREBASE_CLIENT_EMAIL", "")
            
            if private_key and client_email:
                cred_dict = {
                    "type": "service_account",
                    "project_id": project_id,
                    "private_key_id": os.getenv("FIREBASE_PRIVATE_KEY_ID", ""),
                    "private_key": private_key.replace('\\n', '\n'),
                    "client_email": client_email,
                    "client_id": os.getenv("FIREBASE_CLIENT_ID", ""),
                    "auth_uri": "https://accounts.google.com/o/oauth2/auth",
                    "token_uri": "https://oauth2.googleapis.com/token",
                    "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
                    "client_x509_cert_url": os.getenv("FIREBASE_CLIENT_CERT_URL", "")
                }
                
                cred = credentials.Certificate(cred_dict)
                firebase_admin.initialize_app(cred)
                print("✅ Firebase initialized with environment variables")
                return True
            
            # Method 3: Use default credentials (if running on Firebase environment)
            try:
                firebase_admin.initialize_app()
                print("✅ Firebase initialized with default credentials")
                return True
            except Exception as default_error:
                print(f"❌ Default credentials failed: {default_error}")
                raise Exception("Firebase initialization failed. Please add serviceAccountKey.json to backend folder")
                
        except Exception as e:
            print(f"❌ Firebase initialization error: {e}")
            raise Exception(f"Firebase initialization failed: {str(e)}")

# Initialize Firebase
try:
    firebase_initialized = initialize_firebase()
    db = firestore.client()
    print("✅ Firestore client initialized successfully")
except Exception as e:
    print(f"❌ Critical: Firestore initialization failed: {e}")
    print("💡 Please download serviceAccountKey.json from Firebase Console")
    print("💡 Go to: Firebase Console > Project Settings > Service Accounts > Generate New Private Key")
    raise e

# Firestore Service Class
class FirestoreService:
    def __init__(self):
        self.db = db
    
    async def get_user_notifications(self, user_id: str, user_type: str) -> List[Dict]:
        """Get notifications for a specific user"""
        try:
            # Run the Firestore query in a thread pool since it's blocking
            loop = asyncio.get_event_loop()
            docs = await loop.run_in_executor(
                None,
                lambda: self.db.collection('notifications')
                .where('user_id', '==', user_id)
                .where('user_type', '==', user_type)
                .order_by('created_at', direction=firestore.Query.DESCENDING)
                .stream()
            )
            
            notifications = []
            for doc in docs:
                notification_data = doc.to_dict()
                notification_data['id'] = doc.id
                
                # Convert Firestore timestamps
                if 'created_at' in notification_data:
                    notification_data['created_at'] = notification_data['created_at'].replace(tzinfo=None)
                if 'read_at' in notification_data and notification_data['read_at']:
                    notification_data['read_at'] = notification_data['read_at'].replace(tzinfo=None)
                
                notifications.append(notification_data)
            
            return notifications
            
        except Exception as e:
            print(f"Error getting user notifications: {e}")
            raise e
    
    async def mark_notification_read(self, notification_id: str) -> bool:
        """Mark a notification as read"""
        try:
            loop = asyncio.get_event_loop()
            await loop.run_in_executor(
                None,
                lambda: self.db.collection('notifications').document(notification_id).update({
                    'is_read': True,
                    'read_at': firestore.SERVER_TIMESTAMP
                })
            )
            return True
            
        except Exception as e:
            print(f"Error marking notification as read: {e}")
            raise e
    
    async def get_unread_notifications_count(self, user_id: str, user_type: str) -> int:
        """Get count of unread notifications for a user"""
        try:
            loop = asyncio.get_event_loop()
            docs = await loop.run_in_executor(
                None,
                lambda: self.db.collection('notifications')
                .where('user_id', '==', user_id)
                .where('user_type', '==', user_type)
                .where('is_read', '==', False)
                .stream()
            )
            
            count = sum(1 for _ in docs)
            return count
            
        except Exception as e:
            print(f"Error counting unread notifications: {e}")
            raise e
    
    async def delete_notification(self, notification_id: str) -> bool:
        """Delete a notification"""
        try:
            loop = asyncio.get_event_loop()
            await loop.run_in_executor(
                None,
                lambda: self.db.collection('notifications').document(notification_id).delete()
            )
            return True
            
        except Exception as e:
            print(f"Error deleting notification: {e}")
            raise e

# Create and export the service instance
firestore_service = FirestoreService()