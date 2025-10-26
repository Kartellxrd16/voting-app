# backend/main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# Import and initialize Firebase FIRST
from firebase.firestore import initialize_firebase, db
print("✅ Firebase initialized in main.py")

# Now import your routes
from routes.applications import router as applications_router
from routes.notifications import router as notifications_router

# Create FastAPI app instance
app = FastAPI(title="UB Voting System API", version="1.0.0")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # React app URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routes
app.include_router(applications_router, prefix="/api", tags=["applications"])
app.include_router(notifications_router, prefix="/api", tags=["notifications"])

@app.get("/")
async def root():
    return {"message": "UB Voting System API", "status": "running"}

@app.get("/health")
async def health_check():
    return {"status": "healthy", "service": "UB Voting System"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)