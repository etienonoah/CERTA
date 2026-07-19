from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import pickle
import pandas as pd
import uvicorn

app = FastAPI(title="Farm2Market AI Service")

# Load models and encoder
try:
    with open('models/rf_model.pkl', 'rb') as f:
        rf_model = pickle.load(f)
    with open('models/kmeans_model.pkl', 'rb') as f:
        kmeans_model = pickle.load(f)
    with open('models/label_encoder.pkl', 'rb') as f:
        encoder = pickle.load(f)
except Exception as e:
    print(f"Error loading models: {e}")
    rf_model, kmeans_model, encoder = None, None, None

class PredictionRequest(BaseModel):
    Harvest_Quantity_kg: float
    Distance_to_Warehouse_km: float
    Travel_Time_hr: float
    Temperature_C: float
    Humidity_pct: float
    Demand_Index: float

@app.post("/predict")
def predict_spoilage(req: PredictionRequest):
    if rf_model is None or kmeans_model is None:
        raise HTTPException(status_code=500, detail="Models not loaded")

    # Prepare data for prediction
    data = pd.DataFrame([{
        "Harvest_Quantity_kg": req.Harvest_Quantity_kg,
        "Distance_to_Warehouse_km": req.Distance_to_Warehouse_km,
        "Travel_Time_hr": req.Travel_Time_hr,
        "Temperature_C": req.Temperature_C,
        "Humidity_pct": req.Humidity_pct,
        "Demand_Index": req.Demand_Index
    }])

    # Predict Spoilage Risk
    spoilage_encoded = rf_model.predict(data)[0]
    spoilage_label = encoder.inverse_transform([spoilage_encoded])[0]

    # Predict Farmer Group Cluster
    farmer_group = int(kmeans_model.predict(data)[0])

    return {
        "Spoilage_Risk": spoilage_label,
        "Farmer_Group": farmer_group
    }

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=5000)
