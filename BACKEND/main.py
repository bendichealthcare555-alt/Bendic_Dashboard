from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI

app = FastAPI(
    title="Pharma Sales Analytics API",
    version="1.0.0"
)
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "https://bendic-dashboard-1.onrender.com"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root():
    return {
        "status": "success",
        "message": "Pharma Analytics Backend Running"
    }

@app.get("/health")
def health():
    return {
        "status": "healthy"
    }

from database.supabase_client import supabase

@app.get("/test-db")
def test_db():

    result = (
        supabase
        .table("party_master")
        .select("*")
        .limit(1)
        .execute()
    )

    return {
        "status": "success",
        "rows": result.data
    }

from routes.upload import router as upload_router

app.include_router(upload_router)

from routes.dashboard import router as dashboard_router
app.include_router(dashboard_router)
