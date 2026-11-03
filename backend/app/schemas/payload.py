from pydantic import BaseModel
from typing import List

class ConceptWebRequest(BaseModel):
    node_ids: List[str]