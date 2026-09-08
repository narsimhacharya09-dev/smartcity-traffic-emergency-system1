"""
Integration Tests for FastAPI REST API Endpoints.
"""

import pytest
from fastapi.testclient import TestClient
from main import app, load_sample_city

# Ensure graph is loaded for tests
load_sample_city()
client = TestClient(app)


def test_api_health_endpoint():
    response = client.get("/api/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert "database" in data
    assert "ml_model" in data


def test_api_locations_and_roads():
    loc_res = client.get("/api/locations")
    assert loc_res.status_code == 200
    locations = loc_res.json()
    assert len(locations) > 0

    road_res = client.get("/api/roads")
    assert road_res.status_code == 200
    roads = road_res.json()
    assert len(roads) > 0


def test_api_calculate_route_and_cache():
    payload = {
        "source": "HOSP_METRO",
        "destination": "COMM_DOWNTOWN",
        "use_cache": True,
        "include_alternatives": True
    }
    res = client.post("/api/routes/calculate", json=payload)
    assert res.status_code == 200
    data = res.json()
    assert data["success"] is True
    assert len(data["route"]) >= 2
    assert "alternatives" in data

    # Test cache stats
    cache_res = client.get("/api/cache/stats")
    assert cache_res.status_code == 200
    cache_data = cache_res.json()
    assert "hits" in cache_data
    assert "misses" in cache_data


def test_api_emergency_lifecycle():
    create_payload = {
        "vehicle_type": "AMBULANCE",
        "source": "HOSP_METRO",
        "destination": "ACCIDENT_ZONE_1",
        "custom_id": "TEST-EMG-999"
    }
    create_res = client.post("/api/emergency", json=create_payload)
    assert create_res.status_code == 200
    emg_data = create_res.json()
    assert emg_data["id"] == "TEST-EMG-999"
    assert emg_data["vehicle_type"] == "AMBULANCE"

    # Dispatch
    disp_res = client.post("/api/emergency/TEST-EMG-999/dispatch")
    assert disp_res.status_code == 200
    assert disp_res.json()["status"] == "IN_TRANSIT"

    # Complete
    comp_res = client.post("/api/emergency/TEST-EMG-999/complete")
    assert comp_res.status_code == 200
    assert comp_res.json()["status"] == "COMPLETED"


def test_api_ml_prediction():
    payload = {
        "hour_of_day": 8,
        "day_of_week": 1,
        "vehicle_count": 1400,
        "road_capacity": 1500,
        "weather": "CLEAR"
    }
    res = client.post("/api/ml/predict", json=payload)
    assert res.status_code == 200
    data = res.json()
    assert "predicted_travel_time_ratio" in data
    assert data["predicted_travel_time_ratio"] >= 1.0
