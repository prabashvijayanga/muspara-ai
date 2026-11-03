from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# 1. Import the router from our endpoints file
from app.api.endpoints import router

# Initialize the FastAPI application
app = FastAPI(title="Spatial Knowledge Engine API")

# Allow the Next.js frontend to communicate with this FastAPI backend
# CORS (Cross-Origin Resource Sharing) prevents browser security blocks
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins for the hackathon
    allow_credentials=True,
    allow_methods=["*"],  # Allow all HTTP methods (GET, POST, etc.)
    allow_headers=["*"],  # Allow all headers
)

# Include the API routes defined in endpoints.py
app.include_router(router, prefix="/api")

# A simple health check route to verify the server is running
@app.get("/")
def read_root():
    return {"status": "Agentic Backend is Running 🚀"}