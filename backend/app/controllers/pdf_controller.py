import tempfile
import shutil
from pathlib import Path

from app.services.qr_scan import scan_certificate
from app.services.ocr_scan import scan_ocr


def scan_pdfs(files):

    results = []

    for file in files:

        temp_path = None

        try:

            # --------------------------------
            # Save uploaded PDF temporarily
            # --------------------------------

            with tempfile.NamedTemporaryFile(
                delete=False,
                suffix=".pdf"
            ) as temp:

                shutil.copyfileobj(file.file, temp)
                temp_path = temp.name

            # --------------------------------
            # STEP 1: QR SCAN
            # --------------------------------

            qr_result = scan_certificate(temp_path)

            print(f"QR completed -> {file.filename}")

            # --------------------------------
            # STEP 2: OCR SCAN
            # Same PDF
            # --------------------------------

            ocr_result = scan_ocr(temp_path)

            print(f"OCR completed -> {file.filename}")

            # --------------------------------
            # Combine both results
            # --------------------------------

            results.append({
                "file": file.filename,
                "qr_result": qr_result,
                "ocr_result": ocr_result
            })

        except Exception as e:

            results.append({
                "file": file.filename,
                "qr_result": {
                    "status": "Failed"
                },
                "ocr_result": {
                    "status": "Failed"
                },
                "error": str(e)
            })

        finally:

            # Delete temporary PDF
            if temp_path:
                Path(temp_path).unlink(missing_ok=True)

    return {
        "results": results
    }