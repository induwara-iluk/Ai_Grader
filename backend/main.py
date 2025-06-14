from fastapi import FastAPI
from pydantic import BaseModel
import google.generativeai as genai
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
# … your other imports …

app = FastAPI()

# === CORS: allow calls from your frontend ===
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],        # for production, replace "*" with your exact Vercel domain
    allow_credentials=True,
    allow_methods=["*"],        # this allows GET, POST, OPTIONS, etc.
    allow_headers=["*"],        # this allows Content-Type, Authorization, etc.
)


# Health-check endpoint
@app.get("/")
async def root():
    return {"message": "🎉 FastAPI is up and running!"}

# === Gemini setup ===
genai.configure(api_key="YOUR_GOOGLE_API_KEY")
model = genai.GenerativeModel("gemini-1.5-flash")

# === Request schema ===
class GradeRequest(BaseModel):
    question: str
    correct_answer: str
    student_answer: str
    max_marks: int = 2

# === Grading endpoint ===
@app.post("/grade")
async def grade(req: GradeRequest):
    prompt = f"""
You are an exam grader.

Grade the following student's response out of {req.max_marks}, focusing on key concepts.
Accept synonyms and similar phrasing.

Question:
{req.question}

Correct Answer:
{req.correct_answer}

Student's Answer:
{req.student_answer}

Respond exactly in this format:
Score: X/{req.max_marks}
Feedback: <brief justification>
"""
    resp = model.generate_content(prompt)
    return {"result": resp.text.strip()}
