from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from secrets import token_hex
import pathlib
from tensorflow.keras.models import load_model
from PIL import Image
from numpy import asarray
import numpy as np


app = FastAPI()

origins = [
    "https://potato-leaf-disease-detect-api-production.up.railway.app",
    "https://potato-leaf-disease-detect-api-production.up.railway.app/predict",
    "http://localhost",
    "http://localhost:8080",
    "http://localhost:5173/"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

model = load_model("Potato-Disease-Classification.h5")

class_name = ['Early_Blight', 'Healthy', 'Late_Blight']

class PredictionOut(BaseModel):
    model_pred: str


@app.get("/")
def home():
    return {"command": "hello"}


@app.post("/predict", response_model=PredictionOut)
async def predict(image_f: UploadFile):
    file_ext = image_f.filename.split(".").pop()
    file_name = token_hex(10)
    file_path = f"{file_name}.{file_ext}"
    with open(file_path, "wb") as f:
        contents = await image_f.read()
        f.write(contents)
    
    img = Image.open(file_path)
    np_img = asarray(img)
    img = np_img[None,:,:,:]
    pred = model.predict(img)
   
    # os.remove(file_path)

    output = class_name[np.argmax(pred[0])]

    return {
        "model_pred": str(output)
        }