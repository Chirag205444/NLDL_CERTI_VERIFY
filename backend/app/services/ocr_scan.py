import re
import numpy as np
from pdf2image import convert_from_path
from paddleocr import PaddleOCR


# Initialize PaddleOCR once when the server starts
ocr = PaddleOCR(
    lang="en",
    enable_mkldnn=False,
    use_doc_orientation_classify=False,
    use_doc_unwarping=False,
    use_textline_orientation=False
)


date_pattern = re.compile(
    r"(January|February|March|April|May|June|July|August|"
    r"September|October|November|December)\s+\d{1,2},\s+\d{4}",
    re.IGNORECASE
)


def get_ocr_lines(pdf_path):

    pages = convert_from_path(
        pdf_path,
        dpi=200,
        first_page=1,
        last_page=1
    )

    if not pages:
        return []

    image = np.array(pages[0])

    # PaddleOCR 3.x
    results = ocr.predict(image)

    lines = []

    for result in results:

        # PaddleOCR 3.x returns a result object/dictionary
        result_data = result

        try:
            texts = result_data["rec_texts"]
            scores = result_data["rec_scores"]
            boxes = result_data["rec_boxes"]
        except Exception:
            continue

        for text, confidence, box in zip(
            texts,
            scores,
            boxes
        ):

            text = str(text).strip()

            if not text:
                continue

            confidence = float(confidence)

            # rec_boxes are normally:
            # [x1, y1, x2, y2]

            x1, y1, x2, y2 = box

            lines.append({
                "text": text,
                "confidence": confidence,
                "x": float(x1),
                "y": float(y1),
                "width": float(x2 - x1),
                "height": float(y2 - y1)
            })

    # Reading order
    lines.sort(key=lambda x: (x["y"], x["x"]))

    return lines


def parse_infosys_certificate(lines):

    name = "Not Found"
    course = "Not Found"
    completed_on = "Not Found"

    # -----------------------------
    # Extract Name
    # -----------------------------

    for i, line in enumerate(lines):

        text = line["text"].lower()

        if "awarded" in text:

            for j in range(i + 1, len(lines)):

                candidate = lines[j]["text"].strip()
                lower = candidate.lower()

                if (
                    len(candidate) < 3
                    or "successfully" in lower
                    or "course" in lower
                    or "certificate" in lower
                    or "infosys" in lower
                    or "issued" in lower
                ):
                    continue

                name = candidate
                break

            break

    # -----------------------------
    # Extract Course
    # -----------------------------

    for i, line in enumerate(lines):

        text = line["text"].lower()

        if "completing" in text:

            for j in range(i + 1, len(lines)):

                candidate = lines[j]["text"].strip()
                lower = candidate.lower()

                if (
                    len(candidate) < 3
                    or lower.startswith("on ")
                    or "infosys" in lower
                    or "issued" in lower
                    or "congratulations" in lower
                    or "verify" in lower
                ):
                    continue

                course = candidate
                break

            break

    # -----------------------------
    # Extract Completion Date
    # -----------------------------

    for line in lines:

        text = line["text"]
        lower = text.lower()

        # Ignore footer issue date
        if "issued" in lower:
            continue

        match = date_pattern.search(text)

        if match:
            completed_on = match.group(0)
            break

    return {
        "Holder Name": name,
        "Course": course,
        "Completed On": completed_on
    }


def scan_ocr(pdf_path):

    try:

        lines = get_ocr_lines(pdf_path)

        if not lines:
            return {
                "Holder Name": "Not Found",
                "Course": "Not Found",
                "Completed On": "Not Found"
            }

        return parse_infosys_certificate(lines)

    except Exception as e:

        return {
            "Holder Name": "Not Found",
            "Course": "Not Found",
            "Completed On": "Not Found",
            "Error": str(e)
        }