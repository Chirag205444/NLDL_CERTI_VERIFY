import re
from datetime import datetime


def normalize_text(value):
    if not value:
        return ""

    value = str(value).strip().lower()

    # Remove trailing punctuation
    value = re.sub(r"[.,;:]+$", "", value)

    # Normalize whitespace
    value = re.sub(r"\s+", " ", value)

    return value


def normalize_date(value):
    if not value:
        return ""

    value = str(value).strip()

    # QR date format
    # Example: 2025-11-08T00:00:00Z
    try:
        if "T" in value:
            return datetime.fromisoformat(
                value.replace("Z", "+00:00")
            ).strftime("%Y-%m-%d")
    except ValueError:
        pass

    # OCR date format
    # Example: November 8, 2025
    date_formats = [
        "%B %d, %Y",
        "%b %d, %Y"
    ]

    for fmt in date_formats:
        try:
            return datetime.strptime(
                value,
                fmt
            ).strftime("%Y-%m-%d")
        except ValueError:
            continue

    return normalize_text(value)


def compare_results(qr_result, ocr_result):

    mismatch_count = 0

    # --------------------------------
    # NAME
    # --------------------------------

    qr_name = normalize_text(
        qr_result.get("Holder Name")
    )

    ocr_name = normalize_text(
        ocr_result.get("Holder Name")
    )

    if qr_name == ocr_name:
        name_status = "Match"
    else:
        name_status = "Mismatch"
        mismatch_count += 1

    # --------------------------------
    # COURSE
    # --------------------------------

    qr_course = normalize_text(
        qr_result.get("Course")
    )

    ocr_course = normalize_text(
        ocr_result.get("Course")
    )

    if qr_course == ocr_course:
        course_status = "Match"
    else:
        course_status = "Mismatch"
        mismatch_count += 1

    # --------------------------------
    # COMPLETED ON
    # --------------------------------

    qr_date = normalize_date(
        qr_result.get("Completed On")
    )

    ocr_date = normalize_date(
        ocr_result.get("Completed On")
    )

    if qr_date == ocr_date:
        date_status = "Match"
    else:
        date_status = "Mismatch"
        mismatch_count += 1

    # --------------------------------
    # FINAL COMPARISON
    # --------------------------------

    comparison = {
        "Name": name_status,
        "Course": course_status,
        "Completed On": date_status,
        "mismatch_count": mismatch_count
    }

    return comparison