from fastapi import FastAPI, Request
from pydantic import BaseModel
import subprocess
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# Allow CORS from frontend (adjust origin if needed)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # 👈 your React dev server
    allow_credentials=True,
    allow_methods=["*"],  # or ["POST"]
    allow_headers=["*"],
)

class ScriptRequest(BaseModel):
    code: str


@app.post("/api/run-script/")
async def run_script(req: ScriptRequest):
    try:
        result = subprocess.run(["C:\\Program Files\\Python313\\python.exe", "-c", req.code], capture_output=True, text=True, timeout=5)
        return {"stdout": result.stdout, "stderr": result.stderr}
    except Exception as e:
        return {"error": str(e)}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)