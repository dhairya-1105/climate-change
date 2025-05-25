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

    try:
        body = await request.json()
        user_query = body.get("user_query")
        if not user_query:
            return {"error": "user_query is required"}
        steps = body.get("steps", [])

        response = agentic_rag.invoke({"user_query": user_query, "steps": steps})
        print("RAG Response:", response)
        return {"result": response}

    except Exception as e:
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Internal error: {str(e)}")
