import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from app.config import settings
from app.database.connection import Base, engine
from app.models import user, community, user_community, echo, like
from app.routes import health, users, communities, echoes

app = FastAPI(title=settings.APP_NAME, docs_url="/docs")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Serve the uploads folder so the app can view the images
app.mount("/api/echo/uploads", StaticFiles(directory=os.path.join(os.path.dirname(__file__), "uploads")), name="uploads")

Base.metadata.create_all(bind=engine)

app.include_router(health.router, prefix="/api")
app.include_router(users.router, prefix="/api/users", tags=["Users"])
app.include_router(communities.router, prefix="/api/communities", tags=["Communities"])
app.include_router(echoes.router, prefix="/api/echo", tags=["Echoes"])

@app.get("/", tags=["System"])
async def root():
    return {"message": "Welcome to EchoWall API. Visit /docs for documentation."}
