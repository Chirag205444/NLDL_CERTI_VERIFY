from fastapi import APIRouter, UploadFile, File
from app.controllers.pdf_controller import scan_pdfs

router = APIRouter()


@router.post("/scan")
def scan(files: list[UploadFile] = File(...)):
    return scan_pdfs(files)