from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from fastapi.responses import Response
import fitz
import uuid
import asyncio

# Import AI Agents
from app.services.muse_agent import (
    chat_with_node, 
    generate_chapter_title, 
    analyze_page_difficulty,
    extract_knowledge_graph
)
from app.services.sam_agent import magic_wand_segment

# Import Pydantic models from payload.py schema
from app.schemas.payload import ConceptWebRequest

router = APIRouter()

# ==========================================
# 1. IN-MEMORY STORAGE (ZERO-STORAGE ARCHITECTURE)
# ==========================================
EPHEMERAL_STORE = {}       # Stores image bytes for Vision/Magic Wand
EPHEMERAL_TEXT_STORE = {}  # Stores extracted text for Knowledge Graph

# ==========================================
# 2. API ENDPOINTS
# ==========================================

@router.post("/upload")
async def upload_pdf(file: UploadFile = File(...)):
    """Lightning Fast Upload: Extracts images and text concurrently using asyncio.gather."""
    pdf_bytes = await file.read()
    doc = fitz.open(stream=pdf_bytes, filetype="pdf")
    
    session_id = str(uuid.uuid4())[:8]
    mat = fitz.Matrix(2.0, 2.0)
    
    async def process_single_page(page_num: int):
        page = doc.load_page(page_num)
        page_text = page.get_text("text")
        
        # Render page to image bytes
        pix = page.get_pixmap(matrix=mat)
        img_bytes = pix.tobytes("png")
        
        node_id = f"node-{page_num}"
        store_key = f"{session_id}_page_{page_num + 1}"
        
        # Save both image AND text in RAM!
        EPHEMERAL_STORE[store_key] = img_bytes
        EPHEMERAL_TEXT_STORE[node_id] = page_text
        
        virtual_url = f"/api/memory-image/{store_key}"
        
        # Run AI title generation and difficulty analysis CONCURRENTLY (Super Fast!)
        chapter_title, difficulty_data = await asyncio.gather(
            generate_chapter_title(page_text, page_num + 1),
            analyze_page_difficulty(page_text)
        )
        
        return {
            "id": node_id,
            "imageUrl": virtual_url,
            "label": chapter_title,
            "difficulty": difficulty_data 
        }

    # Create asynchronous tasks for all pages at once
    tasks = [process_single_page(i) for i in range(len(doc))]
    processed_pages = await asyncio.gather(*tasks)

    doc.close()
    return {
        "filename": file.filename,
        "message": "Lightning Fast Extraction Successful",
        "nodes_data": processed_pages
    }


@router.get("/memory-image/{store_key}")
async def serve_memory_image(store_key: str):
    """Serves generated page images strictly from RAM."""
    img_bytes = EPHEMERAL_STORE.get(store_key)
    if not img_bytes:
        raise HTTPException(status_code=404, detail="Image expired.")
    return Response(content=img_bytes, media_type="image/png")


@router.post("/chat")
async def chat_endpoint(image_url: str = Form(...), message: str = Form(...)):
    """General AI Chat for the selected page."""
    store_key = image_url.split("/")[-1]
    img_bytes = EPHEMERAL_STORE.get(store_key)
    if not img_bytes: return {"reply": "Error: Expired."}
    
    reply = await chat_with_node(img_bytes, message)
    return {"reply": reply}


@router.post("/knowledge-graph")
async def knowledge_graph_endpoint(payload: ConceptWebRequest):
    """Combines text from selected pages to generate a Visual Concept Web rapidly."""
    combined_text = ""
    for nid in payload.node_ids:
        combined_text += EPHEMERAL_TEXT_STORE.get(nid, "") + "\n\n"
        
    if not combined_text.strip():
        return {"nodes": [], "edges": []}
        
    print("🧠 Generating Concept Web & Smart Notes...")
    graph_data = await extract_knowledge_graph(combined_text)
    return graph_data


@router.post("/magic-wand")
async def magic_wand_endpoint(
    image_url: str = Form(...), 
    x1: float = Form(...), y1: float = Form(...),
    x2: float = Form(...), y2: float = Form(...)
):
    """Magic Wand: Crops region via SAM 3.1 & Explains via Muse AI."""
    store_key = image_url.split("/")[-1]
    img_bytes = EPHEMERAL_STORE.get(store_key)
    if not img_bytes: return {"reply": "❌ Error: Expired."}
        
    # Ensure coordinates are perfectly formatted Integers
    box = [int(min(x1, x2)), int(min(y1, y2)), int(max(x1, x2)), int(max(y1, y2))]
    
    # 1. Spatial Segmentation (SAM 3.1)
    sam_result = await magic_wand_segment(img_bytes, box)
    if sam_result.get("error"):
        print(f"⚠️ SAM 3.1 Warning: {sam_result.get('error')}")
    else:
        print("✅ SAM 3.1 Extraction Successful!")
    
    # 2. Deep Academic Explanation (Muse AI)
    explanation_prompt = f"The user highlighted a specific diagram using a bounding box with coordinates [X1:{box[0]}, Y1:{box[1]}, X2:{box[2]}, Y2:{box[3]}]. Focus ONLY on this specific area and explain what it is, its components, and its purpose in deep academic detail using emojis and markdown formatting."
    muse_reply = await chat_with_node(img_bytes, explanation_prompt)
    
    return {"reply": muse_reply}