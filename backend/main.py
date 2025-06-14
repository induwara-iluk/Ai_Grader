from fastapi import FastAPI
from fastapi import FastAPI
from pydantic import BaseModel
import google.generativeai as genai





app = FastAPI()

@app.get("/")
async def root():
    return {"message": "🎉 FastAPI is up and running!"}

model = genai.GenerativeModel("gemini-1.5-flash")
# Configure your API key (replace with your actual key)
genai.configure(api_key="AIzaSyAhx7IRQ1DsgAM87rDAC17e9MajXsUurdA")

class GradeRequest(BaseModel):
    question: str
    correct_answer: str
    student_answer: str
    max_marks: int = 2


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
    # Call the Gemini model
    resp = model.generate_content(prompt)
    return {"result": resp.text.strip()}


