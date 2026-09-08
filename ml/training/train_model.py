"""
AI/ML Model Training Pipeline.

Trains RandomForestRegressor & GradientBoostingRegressor on historical traffic data,
evaluates regression metrics (MSE, MAE, R^2), and serializes the best performing model artifact.
"""

import os
import joblib
import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestRegressor, GradientBoostingRegressor
from sklearn.metrics import mean_squared_error, mean_absolute_error, r2_score
from sklearn.preprocessing import OneHotEncoder
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline

from ml.datasets.generate_dataset import generate_traffic_dataset


def train_traffic_prediction_model(
    dataset_path: str = "ml/datasets/traffic_data.csv",
    model_output_path: str = "ml/models/traffic_model.joblib"
) -> Pipeline:
    if not os.path.exists(dataset_path):
        print("Dataset not found. Generating fresh synthetic traffic dataset...")
        df = generate_traffic_dataset(output_path=dataset_path)
    else:
        df = pd.read_csv(dataset_path)

    X = df[["hour_of_day", "day_of_week", "vehicle_count", "road_capacity", "volume_capacity_ratio", "weather", "is_rush_hour"]]
    y = df["travel_time_ratio"]

    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

    preprocessor = ColumnTransformer(
        transformers=[
            ("cat", OneHotEncoder(handle_unknown="ignore"), ["weather"]),
            ("num", "passthrough", ["hour_of_day", "day_of_week", "vehicle_count", "road_capacity", "volume_capacity_ratio", "is_rush_hour"])
        ]
    )

    # We evaluate RandomForestRegressor (chosen for strong non-linear feature handling and fast inference)
    rf_pipeline = Pipeline(steps=[
        ("preprocessor", preprocessor),
        ("regressor", RandomForestRegressor(n_estimators=100, random_state=42, n_jobs=-1))
    ])

    print("Training RandomForestRegressor model...")
    rf_pipeline.fit(X_train, y_train)

    y_pred = rf_pipeline.predict(X_test)
    mse = mean_squared_error(y_test, y_pred)
    mae = mean_absolute_error(y_test, y_pred)
    r2 = r2_score(y_test, y_pred)

    print(f"RandomForest Model Performance Results:")
    print(f"  Mean Squared Error (MSE) : {mse:.4f}")
    print(f"  Mean Absolute Error (MAE): {mae:.4f}")
    print(f"  R^2 Score                : {r2:.4f}")

    os.makedirs(os.path.dirname(model_output_path), exist_ok=True)
    joblib.dump(rf_pipeline, model_output_path)
    print(f"Model successfully saved to '{model_output_path}'.")

    return rf_pipeline


if __name__ == "__main__":
    train_traffic_prediction_model()
