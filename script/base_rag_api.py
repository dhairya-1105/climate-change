import os
from fastapi import FastAPI, Request, HTTPException
from base_rag import agentic_rag 
app = FastAPI()
API_KEY = os.getenv("API_KEY")

@app.post("/ask")
async def ask_rag(request: Request):
    api_key = request.headers.get("x-api-key")
    if api_key != API_KEY:
        raise HTTPException(status_code=401, detail="Unauthorized")
    body = await request.json()
    user_query = body.get("user_query")
    if not user_query:
        return {"error": "user_query is required"}
    steps = body.get("steps", [])
    response = agentic_rag.invoke({"user_query": user_query, "steps": steps})
    return {"result": response}