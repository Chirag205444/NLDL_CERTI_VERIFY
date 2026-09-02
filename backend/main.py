from fastapi import FastAPI
from app.routes.pdf_routes import router

app = FastAPI()

app.include_router(router)


@app.get("/")
def home():
    return {"message": "Certificate Scanner API is running"}