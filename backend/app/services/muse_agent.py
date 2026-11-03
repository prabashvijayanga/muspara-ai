import os
import base64
import json
import httpx
from dotenv import load_dotenv, find_dotenv

# ==========================================
# 1. CONFIGURATION & ENVIRONMENT SETUP
# ==========================================
load_dotenv(find_dotenv())

API_KEY = os.getenv("META_API_KEY") or os.getenv("MODEL_API_KEY")
_base_api_url = os.getenv("META_API_URL", "https://api.meta.ai/v1")

if not _base_api_url.endswith("/chat/completions"):
    API_URL = f"{_base_api_url.rstrip('/')}/chat/completions"
else:
    API_URL = _base_api_url

print(f"🔍 DEBUG: Loaded API Key -> {'YES' if API_KEY else 'NO'}")

# ==========================================
# 2. CORE AI FEATURES (MUSPARA AI)
# ==========================================

async def chat_with_node(img_bytes: bytes, user_message: str) -> str:
    """Feature 1: Interactive Visual Tutor (Explains diagrams & answers questions)."""
    if not API_KEY: 
        return "Error: API Key is missing."
    
    try:
        base64_image = base64.b64encode(img_bytes).decode('utf-8')
    except Exception as e: 
        return f"Error: Could not encode memory image. Details: {e}"

    prompt = f"""You are an expert academic tutor named MUSPARA AI.
    CRITICAL FORMATTING RULES:
    1. Use Markdown headings (###).
    2. Use relevant emojis.
    3. Use Tables for comparisons.
    4. Highlight key terms with **bold**.
    
    User's Question: {user_message}"""

    headers = {"Authorization": f"Bearer {API_KEY}", "Content-Type": "application/json"}
    payload = {
        "model": "muse-spark-1.3",
        "messages": [
            {"role": "user", "content": [
                {"type": "text", "text": prompt},
                {"type": "image_url", "image_url": {"url": f"data:image/jpeg;base64,{base64_image}"}}
            ]}
        ],
        "temperature": 0.7,
        "max_tokens": 8192  # Prevent response cutoff
    }

    try:
        async with httpx.AsyncClient(timeout=60.0) as client:
            response = await client.post(API_URL, headers=headers, json=payload)
            if response.status_code == 200: 
                return response.json()["choices"][0]["message"]["content"]
            return f"AI Service Error: {response.text}"
    except Exception as e: 
        return f"Connection Error: {str(e)}"


async def generate_chapter_title(page_text: str, page_num: int) -> str:
    """Feature 2: Automatic Chapter Title Generation."""
    if not API_KEY or not page_text.strip(): 
        return f"Page {page_num}"
        
    prompt = f"Provide a short professional title (max 4-5 words) for this text. Do not add quotes.\nText: {page_text[:1000]}"
    headers = {"Authorization": f"Bearer {API_KEY}", "Content-Type": "application/json"}
    payload = {"model": "muse-spark-1.3", "messages": [{"role": "user", "content": prompt}], "temperature": 0.3}
    
    try:
        async with httpx.AsyncClient(timeout=30.0) as client:
            response = await client.post(API_URL, headers=headers, json=payload)
            if response.status_code == 200: 
                return response.json()["choices"][0]["message"]["content"].strip().replace('"', '')
    except Exception: 
        pass
    return f"Page {page_num}"


async def analyze_page_difficulty(page_text: str) -> dict:
    """Feature 3: Difficulty Detection (Easy/Medium/Hard Badges)."""
    if not API_KEY or not page_text.strip(): 
        return {"level": "Easy", "score": 1, "reason": "No text detected."}
        
    prompt = f"""Rate academic difficulty from 1 to 10. 1-3=Easy, 4-7=Medium, 8-10=Hard.
    Respond ONLY in strict JSON like this: {{"level": "Hard", "score": 9, "reason": "Contains physics equations"}}
    Text: {page_text[:1500]}"""
    
    headers = {"Authorization": f"Bearer {API_KEY}", "Content-Type": "application/json"}
    payload = {"model": "muse-spark-1.3", "messages": [{"role": "user", "content": prompt}], "temperature": 0.1}
    
    try:
        async with httpx.AsyncClient(timeout=30.0) as client:
            response = await client.post(API_URL, headers=headers, json=payload)
            if response.status_code == 200:
                clean_json = response.json()["choices"][0]["message"]["content"].replace('```json', '').replace('```', '').strip()
                return json.loads(clean_json)
    except Exception: 
        pass
    return {"level": "Medium", "score": 5, "reason": "Default score applied."}


# ==========================================
# 🌟 SUPER FEATURE: KNOWLEDGE GRAPH & SMART NOTES
# ==========================================
async def extract_knowledge_graph(combined_text: str) -> dict:
    """
    Feature 4: Visual Concept Web.
    Extracts core concepts, memorable notes, and relationships as a strict JSON structure.
    """
    if not API_KEY or not combined_text.strip():
        return {"nodes": [], "edges": []}

    prompt = f"""
    Analyze the following academic text. Create an Interactive Knowledge Graph and Memorable Short Notes.
    
    INSTRUCTIONS:
    1. Identify the 5-8 most important core concepts.
    2. For each concept, generate a 'memorable_note' designed for extreme memory retention:
       - Use an analogy (e.g., "Think of this like a traffic cop...").
       - Use bullet points and emojis.
    3. Identify how these concepts connect to each other (edges).
    
    RESPOND STRICTLY IN VALID JSON FORMAT EXACTLY LIKE THIS EXAMPLE (No markdown block around it):
    {{
      "nodes": [
        {{ "id": "cpu", "label": "Central Processing Unit", "memorable_note": "🧠 **The Brain**\\nExecutes instructions.\\n*Analogy:* Like a head chef." }}
      ],
      "edges": [
        {{ "source": "cpu", "target": "alu", "relationship": "contains" }}
      ]
    }}

    TEXT TO ANALYZE:
    {combined_text[:4000]}
    """

    headers = {"Authorization": f"Bearer {API_KEY}", "Content-Type": "application/json"}
    payload = {"model": "muse-spark-1.3", "messages": [{"role": "user", "content": prompt}], "temperature": 0.3}

    try:
        async with httpx.AsyncClient(timeout=60.0) as client:
            response = await client.post(API_URL, headers=headers, json=payload)
            if response.status_code == 200:
                result_text = response.json()["choices"][0]["message"]["content"]
                clean_json = result_text.replace('```json', '').replace('```', '').strip()
                return json.loads(clean_json)
    except Exception as e:
        print(f"Graph AI Error: {e}")
        
    return {"nodes": [], "edges": []}