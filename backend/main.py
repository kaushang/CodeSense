from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from agent import run_agent

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "https://codesense-mocha.vercel.app",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ReviewRequest(BaseModel):
    code: str
    language: str
    instruction: str

@app.post("/review")
async def review_code(request: ReviewRequest):
    if not request.code.strip():
        raise HTTPException(status_code=400, detail="Code cannot be empty")
    if not request.language.strip():
        raise HTTPException(status_code=400, detail="Language cannot be empty")
    if not request.instruction.strip():
        raise HTTPException(status_code=400, detail="Instruction cannot be empty")
    try:
        result = run_agent(request.code, request.language, request.instruction)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Agent error: {str(e)}")

@app.get("/health")
async def health_check():
    return {"status": "ok"}