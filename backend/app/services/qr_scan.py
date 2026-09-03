import cv2
import json
import numpy as np
from pdf2image import convert_from_path


# =========================================================
# Optional Pyzbar fallback
# =========================================================
# Pyzbar can provide better QR decoding in some cases.
# However, on Windows it may require additional DLLs.
# Therefore, we import it safely.
# If unavailable, the program continues using OpenCV.

try:
    from pyzbar.pyzbar import decode as pyzbar_decode
    PYZBAR_AVAILABLE = True
except Exception:
    pyzbar_decode = None
    PYZBAR_AVAILABLE = False


# =========================================================
# Possible field names used by different certificate issuers
# =========================================================

NAME_KEYS = [
    "issuedTo",
    "name",
    "studentName",
    "holderName",
    "recipientName",
    "candidateName",
    "learnerName",
    "fullName",
    "recipient",
    "issued_to"
]


COURSE_KEYS = [
    "certificate",
    "course",
    "courseName",
    "courseTitle",
    "title",
    "program",
    "programName",
    "certification",
    "certificationName",
    "credential",
    "achievement",
    "subject"
]


DATE_KEYS = [
    "completedOn",
    "completionDate",
    "dateCompleted",
    "completedDate",
    "issueDate",
    "issuedOn",
    "dateIssued",
    "awardDate",
    "earnedOn",
    "completed_at"
]


# =========================================================
# Recursive JSON search
# =========================================================

def find_key(obj, possible_keys):

    if isinstance(obj, dict):

        for key, value in obj.items():

            if key.lower() in [k.lower() for k in possible_keys]:

                if isinstance(value, dict):

                    if "name" in value:
                        return value["name"]

                    if "fullName" in value:
                        return value["fullName"]

                return value

        for value in obj.values():

            result = find_key(value, possible_keys)

            if result is not None:
                return result

    elif isinstance(obj, list):

        for item in obj:

            result = find_key(item, possible_keys)

            if result is not None:
                return result

    return None


# =========================================================
# Decode QR using OpenCV
# =========================================================

def decode_with_opencv(image):

    detector = cv2.QRCodeDetector()

    # -----------------------------------------------------
    # Attempt 1: Normal detection
    # -----------------------------------------------------

    try:

        data, points, _ = detector.detectAndDecode(image)

        if data:
            return data

    except Exception:
        pass


    # -----------------------------------------------------
    # Attempt 2: Multiple QR detection
    # -----------------------------------------------------

    try:

        result = detector.detectAndDecodeMulti(image)

        if result is not None:

            ok, decoded_info, points, straight_qrcode = result

            if ok and decoded_info:

                for data in decoded_info:

                    if data:
                        return data

    except Exception:
        pass


    return None


# =========================================================
# Decode QR using Pyzbar
# =========================================================

def decode_with_pyzbar(image):

    if not PYZBAR_AVAILABLE:
        return None

    try:

        results = pyzbar_decode(image)

        for result in results:

            try:
                data = result.data.decode("utf-8")

                if data:
                    return data

            except Exception:
                pass

    except Exception:
        pass

    return None


# =========================================================
# Create different versions of image
# =========================================================

def generate_image_variants(image):

    variants = []

    # -----------------------------------------------------
    # Original
    # -----------------------------------------------------

    variants.append(image)


    # -----------------------------------------------------
    # Grayscale
    # -----------------------------------------------------

    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)

    variants.append(gray)


    # -----------------------------------------------------
    # Upscaling
    # -----------------------------------------------------

    for scale in [2, 3, 4]:

        enlarged = cv2.resize(
            gray,
            None,
            fx=scale,
            fy=scale,
            interpolation=cv2.INTER_CUBIC
        )

        variants.append(enlarged)


    # -----------------------------------------------------
    # OTSU threshold
    # -----------------------------------------------------

    enlarged_3x = cv2.resize(
        gray,
        None,
        fx=3,
        fy=3,
        interpolation=cv2.INTER_CUBIC
    )

    _, otsu = cv2.threshold(
        enlarged_3x,
        0,
        255,
        cv2.THRESH_BINARY + cv2.THRESH_OTSU
    )

    variants.append(otsu)


    # -----------------------------------------------------
    # Inverted OTSU
    # -----------------------------------------------------

    _, otsu_inv = cv2.threshold(
        enlarged_3x,
        0,
        255,
        cv2.THRESH_BINARY_INV + cv2.THRESH_OTSU
    )

    variants.append(otsu_inv)


    # -----------------------------------------------------
    # Adaptive threshold
    # -----------------------------------------------------

    adaptive = cv2.adaptiveThreshold(
        enlarged_3x,
        255,
        cv2.ADAPTIVE_THRESH_GAUSSIAN_C,
        cv2.THRESH_BINARY,
        31,
        5
    )

    variants.append(adaptive)


    # -----------------------------------------------------
    # Sharpened image
    # -----------------------------------------------------

    sharpen_kernel = np.array([
        [0, -1, 0],
        [-1, 5, -1],
        [0, -1, 0]
    ])

    sharpened = cv2.filter2D(
        enlarged_3x,
        -1,
        sharpen_kernel
    )

    variants.append(sharpened)


    # -----------------------------------------------------
    # CLAHE contrast enhancement
    # -----------------------------------------------------

    clahe = cv2.createCLAHE(
        clipLimit=2.0,
        tileGridSize=(8, 8)
    )

    enhanced = clahe.apply(gray)

    enhanced = cv2.resize(
        enhanced,
        None,
        fx=3,
        fy=3,
        interpolation=cv2.INTER_CUBIC
    )

    variants.append(enhanced)


    return variants


# =========================================================
# Decode QR from image
# =========================================================

def decode_qr(image):

    variants = generate_image_variants(image)


    # =====================================================
    # FIRST: OpenCV
    # =====================================================

    for variant in variants:

        data = decode_with_opencv(variant)

        if data:

            print("QR detected using OpenCV")

            return data


    # =====================================================
    # SECOND: Pyzbar fallback
    # =====================================================

    if PYZBAR_AVAILABLE:

        print("OpenCV could not decode QR. Trying Pyzbar...")

        for variant in variants:

            data = decode_with_pyzbar(variant)

            if data:

                print("QR detected using Pyzbar")

                return data


    return None


# =========================================================
# Process QR data
# =========================================================

def process_qr_data(pdf_path, raw_data):

    raw_data = raw_data.strip()


    # =====================================================
    # JSON QR
    # =====================================================

    if raw_data.startswith("{"):

        try:

            cert_json = json.loads(raw_data)

            student_name = find_key(
                cert_json,
                NAME_KEYS
            ) or "Not Found"

            course_title = find_key(
                cert_json,
                COURSE_KEYS
            ) or "Not Found"

            completed_date = find_key(
                cert_json,
                DATE_KEYS
            ) or "Not Found"


            return {
                "File": pdf_path,
                "Holder Name": student_name,
                "Course": course_title,
                "Completed On": completed_date,
                "QR Type": "JSON",
                "Status": "Success"
            }


        except Exception:

            return {
                "File": pdf_path,
                "Holder Name": "Not Found",
                "Course": "Not Found",
                "Completed On": "Not Found",
                "QR Type": "JSON",
                "Status": "Invalid JSON"
            }


    # =====================================================
    # URL QR
    # =====================================================

    elif raw_data.startswith("http"):

        return {
            "File": pdf_path,
            "Holder Name": "Not Found",
            "Course": "Not Found",
            "Completed On": "Not Found",
            "QR Type": "URL",
            "Status": raw_data
        }


    # =====================================================
    # Plain Text QR
    # =====================================================

    else:

        return {
            "File": pdf_path,
            "Holder Name": "Not Found",
            "Course": "Not Found",
            "Completed On": "Not Found",
            "QR Type": "Text",
            "Status": raw_data
        }


# =========================================================
# Scan One Certificate
# =========================================================

def scan_certificate(pdf_path):

    # =====================================================
    # PDF → Image
    # =====================================================

    try:

        pages = convert_from_path(
            pdf_path,
            dpi=250,
            first_page=1,
            last_page=1
        )


        if not pages:

            return {
                "File": pdf_path,
                "Holder Name": "Not Found",
                "Course": "Not Found",
                "Completed On": "Not Found",
                "QR Type": "None",
                "Status": "PDF Conversion Failed"
            }


        # PIL → NumPy
        image = np.array(pages[0])


        # RGB → BGR
        image = cv2.cvtColor(
            image,
            cv2.COLOR_RGB2BGR
        )


    except Exception as e:

        return {
            "File": pdf_path,
            "Holder Name": "Not Found",
            "Course": "Not Found",
            "Completed On": "Not Found",
            "QR Type": "None",
            "Status": f"PDF Error: {e}"
        }


    # =====================================================
    # Decode QR
    # =====================================================

    data = decode_qr(image)


    # =====================================================
    # QR Not Found
    # =====================================================

    if not data:

        return {
            "File": pdf_path,
            "Holder Name": "Not Found",
            "Course": "Not Found",
            "Completed On": "Not Found",
            "QR Type": "None",
            "Status": "QR Not Found"
        }


    # =====================================================
    # Process QR data
    # =====================================================

    return process_qr_data(
        pdf_path,
        data
    )