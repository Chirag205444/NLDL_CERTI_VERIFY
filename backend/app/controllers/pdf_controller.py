import tempfile
import shutil
from pathlib import Path

from app.services.qr_scan import scan_certificate


def scan_pdfs(files):

    results = []

    for file in files:

        temp_path = None

        try:

            # Save uploaded PDF temporarily
            with tempfile.NamedTemporaryFile(
                delete=False,
                suffix=".pdf"
            ) as temp:

                shutil.copyfileobj(file.file, temp)
                temp_path = temp.name

            # Send PDF path to QR service
            result = scan_certificate(temp_path)

            results.append({
                "file": file.filename,
                "qr_result": result
            })

        except Exception as e:

            results.append({
                "file": file.filename,
                "qr_result": {
                    "status": f"Error: {e}"
                }
            })

        finally:

            if temp_path:
                Path(temp_path).unlink(missing_ok=True)

    return {
        "results": results
    }