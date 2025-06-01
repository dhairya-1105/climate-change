import os
import subprocess
from fastapi import FastAPI, Request, HTTPException
from fastapi.responses import StreamingResponse
from dotenv import load_dotenv
from fastapi.middleware.cors import CORSMiddleware

load_dotenv()
app = FastAPI()
API_KEY = os.getenv("API_KEY")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "https://climate-change-silk.vercel.app"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

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
        type_ = body.get("type")
        latitude = body.get("latitude")
        longitude = body.get("longitude")
        script_dir = os.path.dirname(os.path.abspath(__file__))
        worker_path = os.path.join(script_dir, 'base_rag.py')

        def generate():
            process = subprocess.Popen(
                ['python', '-u', worker_path, str(user_query), str(type_), str(latitude), str(longitude)],
                stdout=subprocess.PIPE,
                stderr=subprocess.STDOUT,
                text=True,
                bufsize=1
            )
            for line in iter(process.stdout.readline, ''):
                yield line
            process.stdout.close()
            process.wait()
        print(user_query)
        return StreamingResponse(generate(), media_type="text/plain")
    except Exception as e:
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Internal error: {str(e)}")