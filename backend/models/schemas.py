# backend/models/schemas.py
from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class CandidateApplication(BaseModel):
    studentId: str
    studentName: str
    email: str
    position: str
    party: str
    partyName: str
    manifesto: str
    qualifications: str
    achievements: str
    campaignPromise: str
    yearOfStudy: str
    faculty: str

class ApplicationUpdate(BaseModel):
    status: str
    reviewed_by: str
    rejection_reason: Optional[str] = None

class ApplicationResponse(BaseModel):
    id: str
    student_id: str
    student_name: str
    email: str
    position: str
    party: str
    party_name: str
    status: str
    manifesto: str
    qualifications: str
    achievements: str
    campaign_promise: str
    created_at: datetime
    updated_at: Optional[datetime]
    reviewed_at: Optional[datetime]
    reviewed_by: Optional[str]
    rejection_reason: Optional[str]
    year_of_study: str
    faculty: str

class NotificationResponse(BaseModel):
    id: str
    user_id: str
    user_type: str
    title: str
    message: str
    type: str
    is_read: bool
    created_at: datetime
    related_application_id: Optional[str]