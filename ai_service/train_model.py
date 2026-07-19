import pandas as pd
import numpy as np
import pickle
from sklearn.ensemble import RandomForestClassifier
from sklearn.cluster import KMeans
from sklearn.preprocessing import LabelEncoder
import os

def create_mock_data(num_samples=1000):
    np.random.seed(42)
    
    data = {
        "Harvest_Quantity_kg": np.random.uniform(100, 5000, num_samples),
        "Distance_to_Warehouse_km": np.random.uniform(5, 200, num_samples),
        "Travel_Time_hr": np.random.uniform(0.5, 12, num_samples),
        "Temperature_C": np.random.uniform(20, 40, num_samples),
        "Humidity_pct": np.random.uniform(30, 95, num_samples),
        "Demand_Index": np.random.uniform(1, 10, num_samples),
        "Spoilage_Risk": np.random.choice(["Low", "Medium", "High"], num_samples, p=[0.5, 0.3, 0.2])
    }
    
    # Introduce some logical correlation so the model has something to learn
    # e.g., High temp + long travel time = High Spoilage Risk
    for i in range(num_samples):
        if data["Temperature_C"][i] > 35 and data["Travel_Time_hr"][i] > 6:
            data["Spoilage_Risk"][i] = "High"
        elif data["Temperature_C"][i] < 25 and data["Travel_Time_hr"][i] < 3:
            data["Spoilage_Risk"][i] = "Low"
            
    df = pd.DataFrame(data)
    return df

def train_and_save_models():
    print("Generating mock dataset...")
    df = create_mock_data()
    
    # Encode Target
    encoder = LabelEncoder()
    df["Spoilage_Risk_Encoded"] = encoder.fit_transform(df["Spoilage_Risk"])
    
    # Features
    X = df[[
        "Harvest_Quantity_kg",
        "Distance_to_Warehouse_km",
        "Travel_Time_hr",
        "Temperature_C",
        "Humidity_pct",
        "Demand_Index"
    ]]
    
    y = df["Spoilage_Risk_Encoded"]
    
    print("Training Random Forest Classifier for Spoilage Risk...")
    rf_model = RandomForestClassifier(n_estimators=50, random_state=42)
    rf_model.fit(X, y)
    
    print("Training KMeans for Farmer Clustering...")
    kmeans_model = KMeans(n_clusters=3, random_state=42)
    kmeans_model.fit(X)
    
    print("Saving models and encoder...")
    os.makedirs('models', exist_ok=True)
    
    with open('models/rf_model.pkl', 'wb') as f:
        pickle.dump(rf_model, f)
        
    with open('models/kmeans_model.pkl', 'wb') as f:
        pickle.dump(kmeans_model, f)
        
    with open('models/label_encoder.pkl', 'wb') as f:
        pickle.dump(encoder, f)
        
    print("Models saved successfully to /models.")

if __name__ == "__main__":
    train_and_save_models()
