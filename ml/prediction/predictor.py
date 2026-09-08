"""
ML Traffic Predictor Inference Module.

Provides real-time travel time ratio predictions for given road features,
adjusting dynamic edge weights in Dijkstra's shortest path calculations.
"""

import os
import joblib
import pandas as pd
from typing import Dict, Any, Optional


class TrafficPredictor:
    """
    Inference Engine loading trained joblib model for traffic impact prediction.
    """

    def __init__(self, model_path: str = "ml/models/traffic_model.joblib"):
        self.model_path = model_path
        self.model = None
        self.is_loaded = False
        self._load_model()

    def _load_model(self) -> None:
        if os.path.exists(self.model_path):
            try:
                self.model = joblib.load(self.model_path)
                self.is_loaded = True
            except Exception as e:
                print(f"Failed to load ML model from '{self.model_path}': {e}")
                self.is_loaded = False
        else:
            self.is_loaded = False

    def predict_travel_time_ratio(
        self,
        hour_of_day: int = 8,
        day_of_week: int = 1,
        vehicle_count: int = 1200,
        road_capacity: int = 1500,
        weather: str = "CLEAR"
    ) -> float:
        """
        Predicts travel time multiplier ratio (e.g. 1.25x base time).
        Falls back to analytical heuristic if model is not loaded.
        """
        if not self.is_loaded or self.model is None:
            # Analytical fallback heuristic
            v_c = vehicle_count / max(1, road_capacity)
            rush_multiplier = 1.3 if (7 <= hour_of_day <= 9 or 16 <= hour_of_day <= 19) else 1.0
            return max(1.0, float(1.0 + (v_c ** 2) * rush_multiplier))

        is_rush = 1 if (7 <= hour_of_day <= 9 or 16 <= hour_of_day <= 19) else 0
        v_c_ratio = vehicle_count / max(1, road_capacity)

        df_input = pd.DataFrame([{
            "hour_of_day": hour_of_day,
            "day_of_week": day_of_week,
            "vehicle_count": vehicle_count,
            "road_capacity": road_capacity,
            "volume_capacity_ratio": v_c_ratio,
            "weather": weather,
            "is_rush_hour": is_rush
        }])

        try:
            pred = float(self.model.predict(df_input)[0])
            return max(1.0, round(pred, 2))
        except Exception:
            return 1.2

    def get_status(self) -> Dict[str, Any]:
        return {
            "model_path": self.model_path,
            "is_loaded": self.is_loaded,
            "model_type": "RandomForestRegressor Pipeline" if self.is_loaded else "Heuristic Fallback"
        }


# Global Predictor Instance
traffic_predictor = TrafficPredictor()
