"""
EndoAssist — Image Processing Server
Pipeline (mirrors the Kaggle notebook):
  1. NLM Denoising  (fastNlMeansDenoisingColored)
  2. CLAHE Contrast Enhancement  (LAB colour space)
  3. Polyp Detection  (colour + LAB-A heuristic → largest contour + bounding box)
Returns three base64-encoded images as JSON.
"""

import io
import base64
import traceback

import cv2
import numpy as np
from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

app = FastAPI(title="EndoAssist Processing Server", version="1.0.0")

# Allow the Vite dev-server to reach this API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_methods=["*"],
    allow_headers=["*"],
)


# ── Helpers ──────────────────────────────────────────────────────────────────

def _encode_image(rgb_img: np.ndarray) -> str:
    """Encode an RGB numpy array as a base64 data-URL (JPEG)."""
    bgr = cv2.cvtColor(rgb_img, cv2.COLOR_RGB2BGR)
    success, buffer = cv2.imencode(".jpg", bgr, [cv2.IMWRITE_JPEG_QUALITY, 92])
    if not success:
        raise RuntimeError("cv2.imencode failed")
    b64 = base64.b64encode(buffer).decode("utf-8")
    return f"data:image/jpeg;base64,{b64}"


def _read_upload(data: bytes) -> np.ndarray:
    """Decode uploaded bytes → RGB numpy array."""
    arr = np.frombuffer(data, dtype=np.uint8)
    bgr = cv2.imdecode(arr, cv2.IMREAD_COLOR)
    if bgr is None:
        raise ValueError("Could not decode image — unsupported format?")
    return cv2.cvtColor(bgr, cv2.COLOR_BGR2RGB)


# ── Pipeline steps ────────────────────────────────────────────────────────────

def step_denoise(rgb: np.ndarray) -> np.ndarray:
    """Non-Local Means denoising (same params as notebook)."""
    return cv2.fastNlMeansDenoisingColored(rgb, None, 10, 10, 7, 21)


def step_clahe(denoised_rgb: np.ndarray) -> np.ndarray:
    """CLAHE in LAB colour space (same params as notebook)."""
    lab = cv2.cvtColor(denoised_rgb, cv2.COLOR_RGB2LAB)
    l, a, b = cv2.split(lab)
    clahe = cv2.createCLAHE(clipLimit=2.0, tileGridSize=(8, 8))
    enhanced_lab = cv2.merge((clahe.apply(l), a, b))
    return cv2.cvtColor(enhanced_lab, cv2.COLOR_LAB2RGB)


def step_detect_polyp(original_rgb: np.ndarray, enhanced_rgb: np.ndarray) -> np.ndarray:
    """
    Heuristic polyp detection (no pre-supplied mask):
      • Red/pink hue mask (HSV)  — polyps absorb less red light
      • LAB-A channel threshold  — positive A = red-green axis
      • Morphological cleanup → largest contour
      • Draw green outline + red bounding box (same as notebook)
    """
    # --- Build colour mask ---
    hsv = cv2.cvtColor(enhanced_rgb, cv2.COLOR_RGB2HSV)
    red_lo = cv2.inRange(hsv, (0,   25,  60), (18,  255, 255))
    red_hi = cv2.inRange(hsv, (158, 25,  60), (180, 255, 255))
    color_mask = cv2.bitwise_or(red_lo, red_hi)

    # --- LAB-A channel (reddish regions) ---
    lab = cv2.cvtColor(enhanced_rgb, cv2.COLOR_RGB2LAB)
    _, a_ch, _ = cv2.split(lab)
    _, a_mask = cv2.threshold(a_ch, 132, 255, cv2.THRESH_BINARY)

    combined = cv2.bitwise_or(color_mask, a_mask)

    # --- Morphological cleanup ---
    k = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (9, 9))
    combined = cv2.morphologyEx(combined, cv2.MORPH_CLOSE, k, iterations=3)
    combined = cv2.morphologyEx(combined, cv2.MORPH_OPEN,  k, iterations=2)
    combined = cv2.dilate(combined, k, iterations=1)

    # --- Find largest contour ---
    contours, _ = cv2.findContours(combined, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)

    result = original_rgb.copy()
    if contours:
        largest = max(contours, key=cv2.contourArea)

        # Only draw if the region is large enough to be meaningful
        if cv2.contourArea(largest) > 200:
            # Green contour outline (thickness=3, same as notebook)
            cv2.drawContours(result, [largest], -1, (0, 255, 0), 3)

            # Red bounding box (thickness=2, same as notebook)
            x, y, w, h = cv2.boundingRect(largest)
            cv2.rectangle(result, (x, y), (x + w, y + h), (255, 0, 0), 2)

    return result


# ── Endpoint ──────────────────────────────────────────────────────────────────

@app.post("/analyze")
async def analyze(image: UploadFile = File(...)):
    """
    POST /analyze
    Body : multipart/form-data  →  field "image" (any common image file)
    Returns JSON:
      {
        "denoised":  "data:image/jpeg;base64,…",
        "contrast":  "data:image/jpeg;base64,…",
        "polyp":     "data:image/jpeg;base64,…"
      }
    """
    try:
        raw_bytes = await image.read()
        original = _read_upload(raw_bytes)

        denoised  = step_denoise(original)
        enhanced  = step_clahe(denoised)
        detected  = step_detect_polyp(original, enhanced)

        return JSONResponse({
            "denoised": _encode_image(denoised),
            "contrast": _encode_image(enhanced),
            "polyp":    _encode_image(detected),
        })

    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception:
        traceback.print_exc()
        raise HTTPException(status_code=500, detail="Internal processing error")


@app.get("/health")
def health():
    return {"status": "ok"}
