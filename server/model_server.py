from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from transformers import T5ForConditionalGeneration, T5Tokenizer
import uvicorn

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

model_name = "google/flan-t5-base"
model = T5ForConditionalGeneration.from_pretrained(model_name)
tokenizer = T5Tokenizer.from_pretrained(model_name)

@app.post("/generate")
async def generate(request: Request):
    data = await request.json()
    mood = data.get("mood", "neutral")
    
   prompt = f"""
User is feeling {mood}. Write a heartfelt, 200-word emotional message that supports them.
Make it warm, empathetic, and include 1–2 relevant motivational quotes from famous authors.
Avoid sounding robotic or overly formal.
"""

    inputs = tokenizer(prompt, return_tensors="pt")
    output = model.generate(**inputs, max_new_tokens=256)
    message = tokenizer.decode(output[0], skip_special_tokens=True)

    return {"message": message}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
