const API_BASE = '/api';

export async function fetchHealth() {
  const res = await fetch(`${API_BASE}/health`);
  return res.json();
}

export async function fetchLocations() {
  const res = await fetch(`${API_BASE}/locations`);
  return res.json();
}

export async function fetchRoads() {
  const res = await fetch(`${API_BASE}/roads`);
  return res.json();
}

export async function fetchTrafficSummary() {
  const res = await fetch(`${API_BASE}/traffic`);
  return res.json();
}

export async function updateRoadTraffic(roadId, trafficLevel, status) {
  const res = await fetch(`${API_BASE}/traffic/update`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ road_id: roadId, traffic_level: trafficLevel, status: status })
  });
  return res.json();
}

export async function randomizeTraffic() {
  const res = await fetch(`${API_BASE}/traffic/randomize`, { method: 'POST' });
  return res.json();
}

export async function calculateRoute(source, destination, useCache = true, includeAlternatives = true, useMl = false) {
  const res = await fetch(`${API_BASE}/routes/calculate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      source,
      destination,
      use_cache: useCache,
      include_alternatives: includeAlternatives,
      use_ml_prediction: useMl
    })
  });
  return res.json();
}

export async function createEmergency(vehicleType, source, destination, customId) {
  const res = await fetch(`${API_BASE}/emergency`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      vehicle_type: vehicleType,
      source,
      destination,
      custom_id: customId
    })
  });
  return res.json();
}

export async function fetchEmergencies() {
  const res = await fetch(`${API_BASE}/emergency`);
  return res.json();
}

export async function dispatchEmergency(id) {
  const res = await fetch(`${API_BASE}/emergency/${id}/dispatch`, { method: 'POST' });
  return res.json();
}

export async function completeEmergency(id) {
  const res = await fetch(`${API_BASE}/emergency/${id}/complete`, { method: 'POST' });
  return res.json();
}

export async function cancelEmergency(id) {
  const res = await fetch(`${API_BASE}/emergency/${id}/cancel`, { method: 'POST' });
  return res.json();
}

export async function fetchSignals() {
  const res = await fetch(`${API_BASE}/signals`);
  return res.json();
}

export async function fetchAnalytics() {
  const res = await fetch(`${API_BASE}/analytics`);
  return res.json();
}

export async function fetchCacheStats() {
  const res = await fetch(`${API_BASE}/cache/stats`);
  return res.json();
}

export async function clearRouteCache() {
  const res = await fetch(`${API_BASE}/cache/clear`, { method: 'POST' });
  return res.json();
}

export async function predictMlTraffic(hour, day, vehicleCount, capacity, weather) {
  const res = await fetch(`${API_BASE}/ml/predict`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      hour_of_day: hour,
      day_of_week: day,
      vehicle_count: vehicleCount,
      road_capacity: capacity,
      weather: weather
    })
  });
  return res.json();
}
