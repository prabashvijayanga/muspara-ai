import os
import requests
import base64
import json
from dotenv import load_dotenv, find_dotenv

# ==========================================
# 1. CONFIGURATION & ENVIRONMENT SETUP
# ==========================================
load_dotenv(find_dotenv())

API_KEY = os.getenv("META_API_KEY") or os.getenv("MODEL_API_KEY")
_base_api_url = os.getenv("META_API_URL", "https://api.meta.ai/v1")

# Use the exact Responses API endpoint for SAM 3.1
SAM_API_URL = os.getenv("META_SAM_URL", f"{_base_api_url.rstrip('/')}/responses")

# ==========================================
# 2. SAM 3.1 ZERO-STORAGE VISION FEATURES
# ==========================================

async def auto_extract_assets(img_bytes: bytes) -> dict:
    """
    Feature: Auto-Diagram & Asset Extraction.
    Uses the Responses API JSON format to extract diagrams.
    """
    headers = {
        "Authorization": f"Bearer {API_KEY}",
        "Content-Type": "application/json"
    }
    
    base64_image = base64.b64encode(img_bytes).decode('utf-8')
    
    payload = {
        "model": "sam-3.1",
        "input": [
            {
                "type": "message", 
                "role": "user", 
                "content": [
                    {"type": "input_text", "text": "charts, graphs, flowcharts, and technical diagrams"},
                    {"type": "input_image", "image_url": f"data:image/png;base64,{base64_image}"}
                ]
            }
        ]
    }
    
    try:
        response = requests.post(SAM_API_URL, headers=headers, json=payload)
        if response.status_code == 200:
            return response.json()
        return {"error": f"SAM API Error: {response.status_code} - {response.text}"}
    except Exception as e:
        return {"error": str(e)}


async def magic_wand_segment(img_bytes: bytes, box: list) -> dict:
    """
    Feature: Interactive 'Select-to-Explain' (Area Selection).
    Sends the selected bounding box to SAM 3.1 securely.
    """
    headers = {
        "Authorization": f"Bearer {API_KEY}",
        "Content-Type": "application/json"
    }
    
    base64_image = base64.b64encode(img_bytes).decode('utf-8')
    
    # --- CRITICAL FIX FOR HTTP 400 ---
    # The Meta API strictly accepts "input_text" and "input_image" types in the content array.
    # We pass the bounding box as a text prompt string so SAM can parse it natively.
    box_prompt = f"box: [{box[0]}, {box[1]}, {box[2]}, {box[3]}]"
    
    payload = {
        "model": "sam-3.1",
        "input": [
            {
                "type": "message", 
                "role": "user", 
                "content": [
                    # Fixed: Changed "type": "box" to "type": "input_text"
                    {"type": "input_text", "text": box_prompt},
                    {"type": "input_image", "image_url": f"data:image/png;base64,{base64_image}"}
                ]
            }
        ]
    }
    
    try:
        response = requests.post(SAM_API_URL, headers=headers, json=payload)
        
        if response.status_code == 200:
            return response.json()
            
        # Detailed Error Logging to Terminal
        error_msg = response.text if response.text else 'Empty Response Body'
        print(f"❌ SAM API ERROR: HTTP {response.status_code} | {error_msg}")
        return {"error": f"HTTP {response.status_code} - {error_msg}"} 
        
    except Exception as e:
        print(f"❌ SAM API CONNECTION ERROR: {str(e)}")
        return {"error": str(e)}