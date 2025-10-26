# backend/utils/email_service.py
import smtplib
import os
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

class EmailService:
    def __init__(self):
        self.smtp_server = os.getenv("SMTP_SERVER", "smtp.gmail.com")
        self.smtp_port = int(os.getenv("SMTP_PORT", 587))
        self.email = os.getenv("NOTIFICATION_EMAIL")
        self.password = os.getenv("EMAIL_PASSWORD")
        print(f"Email service initialized with server: {self.smtp_server}")
    
    def send_email(self, to_email: str, subject: str, body: str) -> bool:
        """Send email notification"""
        try:
            if not self.email or not self.password:
                print("Email credentials not configured. Skipping email send.")
                return False
                
            msg = MIMEMultipart()
            msg['From'] = self.email
            msg['To'] = to_email
            msg['Subject'] = subject
            
            msg.attach(MIMEText(body, 'html'))
            
            server = smtplib.SMTP(self.smtp_server, self.smtp_port)
            server.starttls()
            server.login(self.email, self.password)
            server.send_message(msg)
            server.quit()
            
            print(f"Email sent successfully to {to_email}")
            return True
            
        except Exception as e:
            print(f"Email sending failed to {to_email}: {e}")
            return False
    
    def send_application_submitted_email(self, student_name: str, student_email: str, position: str, party_name: str):
        """Send application submitted confirmation email"""
        subject = "Candidate Application Received - UB Voting System"
        body = f"""
        <h3>Dear {student_name},</h3>
        <p>Your application for <strong>{position}</strong> has been successfully submitted.</p>
        <p><strong>Party Affiliation:</strong> {party_name}</p>
        <p>Your application is now under review by the election committee. You will be notified once a decision is made.</p>
        <p>Best regards,<br>UB Voting System Team</p>
        """
        return self.send_email(student_email, subject, body)
    
    def send_application_approved_email(self, student_name: str, student_email: str, position: str, party_name: str):
        """Send application approved email"""
        subject = "Candidate Application Approved - UB Voting System"
        body = f"""
        <h3>Congratulations {student_name}!</h3>
        <p>Your application for <strong>{position}</strong> has been <strong>APPROVED</strong>.</p>
        <p>You are now an official candidate in the upcoming elections. Please prepare your campaign materials.</p>
        <p><strong>Party:</strong> {party_name}</p>
        <p>Best of luck with your campaign!<br>UB Voting System Team</p>
        """
        return self.send_email(student_email, subject, body)
    
    def send_application_rejected_email(self, student_name: str, student_email: str, position: str, rejection_reason: str):
        """Send application rejected email"""
        rejection_reasons = {
            "insufficient_qualifications": "Your qualifications and experience do not meet the requirements for this position.",
            "position_filled": "This position has already been filled by other qualified candidates.",
            "incomplete_application": "Your application was incomplete or missing required information.",
            "academic_standing": "Your current academic standing does not meet the eligibility criteria.",
            "disciplinary_issues": "There are disciplinary concerns that prevent approval at this time.",
            "other": rejection_reason or "The election committee was unable to approve your application at this time."
        }
        
        reason_text = rejection_reasons.get(rejection_reason, rejection_reason)
        
        subject = "Candidate Application Update - UB Voting System"
        body = f"""
        <h3>Application Update</h3>
        <p>Dear {student_name},</p>
        <p>After careful review, your application for <strong>{position}</strong> has not been approved.</p>
        <p><strong>Reason:</strong> {reason_text}</p>
        <p>We encourage you to gain more experience and consider applying again in future elections.</p>
        <p>Thank you for your interest in student leadership.<br>UB Voting System Team</p>
        """
        return self.send_email(student_email, subject, body)

# Create global instance
email_service = EmailService()