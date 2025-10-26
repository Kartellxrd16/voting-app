# backend/routes/applications.py
from fastapi import APIRouter, HTTPException
from firebase_admin import firestore
from utils.email_service import email_service
from models.schemas import CandidateApplication, ApplicationUpdate, ApplicationResponse
from typing import List, Optional
import asyncio
from datetime import datetime

router = APIRouter()

def get_firestore_db():
    """Safely get Firestore client"""
    try:
        return firestore.client()
    except Exception as e:
        print(f"❌ Error getting Firestore client: {e}")
        raise HTTPException(status_code=500, detail="Database connection failed")

# Initialize Firestore when needed
db = get_firestore_db()

async def create_notification(notification_data: dict):
    """Create a notification in Firestore"""
    try:
        db = get_firestore_db()  # Get fresh client
        doc_ref = db.collection('notifications').document()
        notification_data['id'] = doc_ref.id
        notification_data['created_at'] = firestore.SERVER_TIMESTAMP
        notification_data['is_read'] = False
        
        await doc_ref.set(notification_data)
        return doc_ref.id
    except Exception as e:
        print(f"Error creating notification: {e}")
        return None

@router.post("/candidate-applications", response_model=dict)
async def submit_application(application: CandidateApplication):
    try:
        db = get_firestore_db()  # Get fresh client
        print("Received application:", application.dict())
        
        # Convert to Firestore format
        application_data = {
            'student_id': application.studentId,
            'student_name': application.studentName,
            'email': application.email,
            'position': application.position,
            'party': application.party,
            'party_name': application.partyName,
            'manifesto': application.manifesto,
            'qualifications': application.qualifications,
            'achievements': application.achievements,
            'campaign_promise': application.campaignPromise,
            'status': 'pending',
            'year_of_study': application.yearOfStudy,
            'faculty': application.faculty,
            'reviewed_at': None,
            'reviewed_by': None,
            'rejection_reason': None,
            'created_at': firestore.SERVER_TIMESTAMP,
            'updated_at': firestore.SERVER_TIMESTAMP
        }
        
        # Create application in Firestore
        doc_ref = db.collection('candidate_applications').document()
        application_id = doc_ref.id
        application_data['id'] = application_id
        
        # Use set() instead of add() for more control
        doc_ref.set(application_data)
        print(f"Application saved with ID: {application_id}")
        
        # Create notifications
        notification_tasks = [
            create_notification({
                'user_id': 'admin',
                'user_type': 'admin',
                'title': 'New Candidate Application',
                'message': f"Student {application.studentName} has applied for {application.position} as {application.partyName}.",
                'type': 'application_submitted',
                'related_application_id': application_id
            }),
            create_notification({
                'user_id': application.studentId,
                'user_type': 'student',
                'title': 'Application Submitted',
                'message': f"Your application for {application.position} has been received and is under review.",
                'type': 'application_submitted',
                'related_application_id': application_id
            })
        ]
        
        # Wait for notifications to be created
        await asyncio.gather(*notification_tasks)
        
        # Send email to student (in background)
        try:
            email_service.send_application_submitted_email(
                application.studentName,
                application.email,
                application.position,
                application.partyName
            )
        except Exception as email_error:
            print(f"Email sending failed: {email_error}")
        
        return {
            "message": "Application submitted successfully", 
            "application_id": application_id,
            "status": "pending"
        }
        
    except Exception as e:
        print(f"Error in submit_application: {e}")
        raise HTTPException(status_code=500, detail=f"Server error: {str(e)}")

@router.get("/candidate-applications", response_model=List[ApplicationResponse])
async def get_applications(status: Optional[str] = None):
    try:
        db = get_firestore_db()  # Get fresh client
        collection_ref = db.collection('candidate_applications')
        
        if status:
            query = collection_ref.where('status', '==', status)
        else:
            query = collection_ref
        
        # Get documents ordered by creation date
        docs = query.order_by('created_at', direction=firestore.Query.DESCENDING).stream()
        
        applications_list = []
        for doc in docs:
            app_data = doc.to_dict()
            app_data['id'] = doc.id
            
            # Convert Firestore timestamps to Python datetime
            if 'created_at' in app_data:
                app_data['created_at'] = app_data['created_at'].replace(tzinfo=None)
            if 'updated_at' in app_data:
                app_data['updated_at'] = app_data['updated_at'].replace(tzinfo=None) if app_data['updated_at'] else None
            if 'reviewed_at' in app_data:
                app_data['reviewed_at'] = app_data['reviewed_at'].replace(tzinfo=None) if app_data['reviewed_at'] else None
            
            applications_list.append(ApplicationResponse(**app_data))
        
        return applications_list
        
    except Exception as e:
        print(f"Error in get_applications: {e}")
        raise HTTPException(status_code=500, detail=f"Server error: {str(e)}")

@router.get("/candidate-applications/{application_id}", response_model=ApplicationResponse)
async def get_application(application_id: str):
    try:
        db = get_firestore_db()  # Get fresh client
        doc_ref = db.collection('candidate_applications').document(application_id)
        doc = doc_ref.get()
        
        if not doc.exists:
            raise HTTPException(status_code=404, detail="Application not found")
        
        app_data = doc.to_dict()
        app_data['id'] = doc.id
        
        # Convert Firestore timestamps
        if 'created_at' in app_data:
            app_data['created_at'] = app_data['created_at'].replace(tzinfo=None)
        if 'updated_at' in app_data:
            app_data['updated_at'] = app_data['updated_at'].replace(tzinfo=None) if app_data['updated_at'] else None
        if 'reviewed_at' in app_data:
            app_data['reviewed_at'] = app_data['reviewed_at'].replace(tzinfo=None) if app_data['reviewed_at'] else None
        
        return ApplicationResponse(**app_data)
        
    except Exception as e:
        print(f"Error in get_application: {e}")
        raise HTTPException(status_code=500, detail=f"Server error: {str(e)}")

@router.put("/candidate-applications/{application_id}", response_model=dict)
async def update_application(application_id: str, update: ApplicationUpdate):
    try:
        db = get_firestore_db()  # Get fresh client
        
        # Get application details first
        doc_ref = db.collection('candidate_applications').document(application_id)
        doc = doc_ref.get()
        
        if not doc.exists:
            raise HTTPException(status_code=404, detail="Application not found")
        
        application_data = doc.to_dict()
        
        # Prepare update data
        update_data = {
            'status': update.status,
            'reviewed_by': update.reviewed_by,
            'reviewed_at': firestore.SERVER_TIMESTAMP,
            'updated_at': firestore.SERVER_TIMESTAMP
        }
        
        if update.rejection_reason:
            update_data['rejection_reason'] = update.rejection_reason
        
        # Update application in Firestore
        doc_ref.update(update_data)
        
        # Handle notifications and emails based on status
        if update.status == "approved":
            # Update user's candidate status in users collection
            candidate_profile = {
                'applicationStatus': 'approved',
                'appliedPositions': [application_data['position']],
                'approvedPositions': [application_data['position']],
                'applicationDate': application_data.get('created_at'),
                'approvalDate': firestore.SERVER_TIMESTAMP,
                'manifesto': application_data['manifesto'],
                'party': application_data['party'],
                'partyName': application_data['party_name'],
                'isActive': True
            }
            
            # Update user document
            user_ref = db.collection('users').document(application_data['student_id'])
            user_ref.update({
                'isCandidate': True,
                'candidateProfile': candidate_profile,
                'updated_at': firestore.SERVER_TIMESTAMP
            })
            
            # Create notification and send email
            await asyncio.gather(
                create_notification({
                    'user_id': application_data['student_id'],
                    'user_type': 'student',
                    'title': 'Application Approved!',
                    'message': f"Congratulations! Your application for {application_data['position']} has been approved.",
                    'type': 'application_approved',
                    'related_application_id': application_id
                })
            )
            
            # Send email
            try:
                email_service.send_application_approved_email(
                    application_data['student_name'],
                    application_data['email'],
                    application_data['position'],
                    application_data['party_name']
                )
            except Exception as email_error:
                print(f"Approval email failed: {email_error}")
            
        elif update.status == "rejected":
            # Create notification and send email
            await asyncio.gather(
                create_notification({
                    'user_id': application_data['student_id'],
                    'user_type': 'student',
                    'title': 'Application Decision',
                    'message': f"Your application for {application_data['position']} was not approved. Reason: {update.rejection_reason}",
                    'type': 'application_rejected',
                    'related_application_id': application_id
                })
            )
            
            # Send email
            try:
                email_service.send_application_rejected_email(
                    application_data['student_name'],
                    application_data['email'],
                    application_data['position'],
                    update.rejection_reason or "other"
                )
            except Exception as email_error:
                print(f"Rejection email failed: {email_error}")
        
        return {"message": f"Application {update.status} successfully", "application_id": application_id}
        
    except Exception as e:
        print(f"Error in update_application: {e}")
        raise HTTPException(status_code=500, detail=f"Server error: {str(e)}")