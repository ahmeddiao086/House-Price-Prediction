from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
import joblib
import numpy as np

from app.schemas.prediction import PredictionRequest
from app.services.preprocessing import prepare_data


my_model = {}


@asynccontextmanager
async def lifespan(app: FastAPI):
    print("Server is waking up... Loading the heavy AI model now!")

    my_model["recipe"] = joblib.load("models/house_price.pkl")
    yield
    print("Server is shutting down. Clearing the memory. Bye!")
    my_model.clear()

app = FastAPI(lifespan=lifespan)


app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
def health_check():
    return {"status": "ok"}


@app.post("/predict")
def predict_price(request: PredictionRequest):
    input_table = prepare_data(request)

    # Get the raw log prediction
    raw_prediction = my_model["recipe"].predict(input_table)[0]

    # Invert it back to real rupees!
    real_price = np.expm1(raw_prediction)

    return {"predicted_price": float(real_price)}