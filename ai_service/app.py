from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import uvicorn
import sys

app = FastAPI(title="Farm2Market AI Service")

# Try importing ML libraries
try:
    import pickle
    import pandas as pd
    
    with open('models/rf_model.pkl', 'rb') as f:
        rf_model = pickle.load(f)
    with open('models/kmeans_model.pkl', 'rb') as f:
        kmeans_model = pickle.load(f)
    with open('models/label_encoder.pkl', 'rb') as f:
        encoder = pickle.load(f)
    ML_LOADED = True
except Exception as e:
    print(f"Warning: ML models or libraries (pandas/scikit-learn) could not be loaded. Running in MOCK mode. Error: {e}")
    ML_LOADED = False

class PredictionRequest(BaseModel):
    Harvest_Quantity_kg: float
    Distance_to_Warehouse_km: float
    Travel_Time_hr: float
    Temperature_C: float
    Humidity_pct: float
    Demand_Index: float

@app.post("/predict")
def predict_spoilage(req: PredictionRequest):
    if not ML_LOADED:
        # Mock prediction logic if ML is unavailable
        spoilage = "High" if req.Temperature_C > 30 else "Low"
        return {
            "Spoilage_Risk": spoilage,
            "Farmer_Group": 1,
            "_mode": "mock"
        }

    # Real ML prediction logic
    data = pd.DataFrame([{
        "Harvest_Quantity_kg": req.Harvest_Quantity_kg,
        "Distance_to_Warehouse_km": req.Distance_to_Warehouse_km,
        "Travel_Time_hr": req.Travel_Time_hr,
        "Temperature_C": req.Temperature_C,
        "Humidity_pct": req.Humidity_pct,
        "Demand_Index": req.Demand_Index
    }])

    spoilage_encoded = rf_model.predict(data)[0]
    spoilage_label = encoder.inverse_transform([spoilage_encoded])[0]
    farmer_group = int(kmeans_model.predict(data)[0])

    return {
        "Spoilage_Risk": spoilage_label,
        "Farmer_Group": farmer_group,
        "_mode": "real"
    }

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=5000)
