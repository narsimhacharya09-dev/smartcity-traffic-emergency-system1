"""
Synthetic Historical Traffic Dataset Generator.

Generates realistic urban traffic data including temporal, environmental, and spatial
features used to train scikit-learn ML models for travel time prediction.
"""

import os
import random
import pandas as pd
import numpy as np


def generate_traffic_dataset(num_samples: int = 5000, output_path: str = "ml/datasets/traffic_data.csv") -> pd.DataFrame:
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    np.random.seed(42)
    random.seed(42)

    hours = np.random.randint(0, 24, size=num_samples)
    days = np.random.randint(0, 7, size=num_samples)  # 0=Monday, 6=Sunday
    road_capacities = np.random.choice([1000, 1500, 2000, 3000], size=num_samples)

    # Vehicle count influenced by rush hour (7-9 AM and 4-7 PM)
    is_rush = ((hours >= 7) & (hours <= 9)) | ((hours >= 16) & (hours <= 19))
    vehicle_counts = np.zeros(num_samples)

    for i in range(num_samples):
        base_ratio = 0.7 if is_rush[i] else 0.3
        if days[i] >= 5:  # Weekend lower rush
            base_ratio *= 0.6
        vehicle_counts[i] = int(road_capacities[i] * np.clip(np.random.normal(base_ratio, 0.15), 0.05, 1.2))

    weather_conditions = np.random.choice(["CLEAR", "RAIN", "FOG", "STORM"], size=num_samples, p=[0.6, 0.25, 0.1, 0.05])
    weather_multiplier = np.vectorize(lambda w: 1.0 if w == "CLEAR" else (1.25 if w == "RAIN" else (1.4 if w == "FOG" else 1.7)))(weather_conditions)

    v_c_ratio = vehicle_counts / road_capacities
    # Target travel time ratio (multiplier over base free-flow travel time)
    travel_time_ratio = (1.0 + (v_c_ratio ** 2) * 1.5) * weather_multiplier + np.random.normal(0, 0.05, size=num_samples)
    travel_time_ratio = np.clip(travel_time_ratio, 1.0, 3.5)

    df = pd.DataFrame({
        "hour_of_day": hours,
        "day_of_week": days,
        "vehicle_count": vehicle_counts.astype(int),
        "road_capacity": road_capacities,
        "volume_capacity_ratio": np.round(v_c_ratio, 3),
        "weather": weather_conditions,
        "is_rush_hour": is_rush.astype(int),
        "travel_time_ratio": np.round(travel_time_ratio, 3)
    })

    df.to_csv(output_path, index=False)
    print(f"Dataset successfully generated with {num_samples} samples at '{output_path}'.")
    return df


if __name__ == "__main__":
    generate_traffic_dataset()
