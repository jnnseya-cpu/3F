"""
Le Congo D'Abord — FastAPI Backend
AI Party Operating System
Founder & President: Mr Justin Nseya
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import os
from dotenv import load_dotenv

load_dotenv()

# Import routers
from routers import members, contributions, candidates, roles, ai_agents
from security import SecurityHeadersMiddleware, HTTPSRedirectInProdMiddleware

app = FastAPI(
    title="Le Congo D'Abord API",
    description="Le Congo D'Abord AI Party Operating System — Backend API",
    version="1.1.0",
    docs_url="/docs",
    redoc_url="/redoc",
)

# Security middleware (order matters: HTTPS redirect first, then headers)
app.add_middleware(SecurityHeadersMiddleware)
app.add_middleware(HTTPSRedirectInProdMiddleware)

# CORS — restrict to known origins only
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://localhost:3001",
        os.getenv("FRONTEND_URL", "http://localhost:3000"),
    ],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "PATCH", "DELETE"],
    allow_headers=["Authorization", "Content-Type"],
)

# Include routers
app.include_router(members.router, prefix="/api", tags=["Members"])
app.include_router(contributions.router, prefix="/api", tags=["Contributions"])
app.include_router(candidates.router, prefix="/api", tags=["Candidates"])
app.include_router(roles.router, prefix="/api", tags=["Roles"])
app.include_router(ai_agents.router, prefix="/api/agents", tags=["AI Agents"])

@app.get("/")
async def root():
    return {
        "system": "Le Congo D'Abord OS",
        "party": "Le Congo D'Abord",
        "version": "1.1.0",
        "founder": "Mr Justin Nseya",
        "status": "operational",
        "agents": 23,
        "provinces": 26,
        "encryption": "AES-256-GCM field-level + TLS in transit",
    }

@app.get("/health")
async def health():
    return {"status": "healthy", "service": "Le Congo D'Abord Backend"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
