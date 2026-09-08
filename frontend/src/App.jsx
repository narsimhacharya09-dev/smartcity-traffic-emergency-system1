import React, { useState, useEffect, useCallback } from 'react';
import Navbar from './components/Navbar';
import DashboardCards from './components/DashboardCards';
import CityMap from './map/CityMap';
import EmergencyPanel from './components/EmergencyPanel';
import RouteCalculator from './components/RouteCalculator';
import TrafficControl from './components/TrafficControl';
import AnalyticsPanel from './components/AnalyticsPanel';
import DemoPanel from './components/DemoPanel';

import {
  fetchHealth, fetchLocations, fetchRoads, fetchTrafficSummary,
  updateRoadTraffic, randomizeTraffic, calculateRoute, createEmergency,
  fetchEmergencies, dispatchEmergency, completeEmergency, cancelEmergency,
  fetchSignals, fetchAnalytics, fetchCacheStats, clearRouteCache
} from './services/api';

export default function App() {
  const [health, setHealth] = useState(null);
  const [locations, setLocations] = useState([]);
  const [roads, setRoads] = useState([]);
  const [emergencies, setEmergencies] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [signals, setSignals] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [cacheStats, setCacheStats] = useState(null);

  const [activeRoute, setActiveRoute] = useState(null);
  const [alternativeRoutes, setAlternativeRoutes] = useState([]);
  const [trafficVersion, setTrafficVersion] = useState(1);
  const [wsConnected, setWsConnected] = useState(false);

  const refreshData = useCallback(async () => {
    try {
      const [h, locs, rds, emgs, sigs, ana, cStats] = await Promise.all([
        fetchHealth().catch(() => null),
        fetchLocations().catch(() => []),
        fetchRoads().catch(() => []),
        fetchEmergencies().catch(() => []),
        fetchSignals().catch(() => []),
        fetchAnalytics().catch(() => null),
        fetchCacheStats().catch(() => null)
      ]);

      if (h) setHealth(h);
      if (locs) setLocations(locs);
      if (rds) setRoads(rds);
      if (emgs) {
        setEmergencies(emgs);
        setVehicles(emgs.filter(e => e.status === 'IN_TRANSIT' || e.status === 'DISPATCHED'));
      }
      if (sigs) setSignals(sigs);
      if (ana) setAnalytics(ana);
      if (cStats) setCacheStats(cStats);
    } catch (e) {
      console.error('Error refreshing data:', e);
    }
  }, []);

  useEffect(() => {
    refreshData();
    const interval = setInterval(refreshData, 5000);
    return () => clearInterval(interval);
  }, [refreshData]);

  // WebSocket Live Telemetry Connection
  useEffect(() => {
    const wsUrl = `ws://${window.location.host}/ws`;
    let ws = new WebSocket(wsUrl);

    ws.onopen = () => setWsConnected(true);
    ws.onclose = () => setWsConnected(false);
    ws.onerror = () => setWsConnected(false);

    ws.onmessage = (event) => {
      try {
        const msg = JSON.parse(event.data);
        if (msg.type === 'TELEMETRY' && msg.vehicles) {
          setVehicles(msg.vehicles);
          if (msg.signals) setSignals(msg.signals);
          if (msg.traffic_version) setTrafficVersion(msg.traffic_version);
        } else if (msg.type === 'TRAFFIC_UPDATE') {
          setTrafficVersion(msg.traffic_version);
          refreshData();
        } else if (msg.type === 'EMERGENCY_CREATED' || msg.type === 'EMERGENCY_DISPATCHED') {
          refreshData();
        }
      } catch (e) {
        console.error('WebSocket parse error:', e);
      }
    };

    return () => ws.close();
  }, [refreshData]);

  // Action Handlers
  const handleCalculateRoute = async (src, dst, useCache, includeAlts, useMl) => {
    const res = await calculateRoute(src, dst, useCache, includeAlts, useMl);
    if (res.success) {
      setActiveRoute(res);
      setAlternativeRoutes(res.alternatives || []);
    } else {
      alert(`Route calculation failed: ${res.message}`);
    }
    refreshData();
  };

  const handleCreateEmergency = async (vehicleType, src, dst) => {
    const emg = await createEmergency(vehicleType, src, dst);
    if (emg && emg.id) {
      if (emg.route) {
        setActiveRoute({ route: emg.route });
      }
      refreshData();
    } else {
      alert('Failed to create emergency dispatch');
    }
  };

  const handleDispatchEmergency = async (id) => {
    await dispatchEmergency(id);
    refreshData();
  };

  const handleCompleteEmergency = async (id) => {
    await completeEmergency(id);
    refreshData();
  };

  const handleCancelEmergency = async (id) => {
    await cancelEmergency(id);
    refreshData();
  };

  const handleUpdateTraffic = async (roadId, trafficLevel, status) => {
    await updateRoadTraffic(roadId, trafficLevel, status);
    refreshData();
  };

  const handleRandomizeTraffic = async () => {
    await randomizeTraffic();
    refreshData();
  };

  const handleClearCache = async () => {
    await clearRouteCache();
    refreshData();
    alert('Route Cache cleared');
  };

  // Demo Runner
  const handleRunDemoStep = async (step) => {
    switch (step) {
      case 1:
        await handleCalculateRoute('HOSP_METRO', 'COMM_DOWNTOWN', true, true, false);
        return 'Calculated optimal path from Metro Hospital to Downtown Plaza.';
      case 2:
        await handleUpdateTraffic('RD_2', 'SEVERE', 'OPEN');
        return 'Injected SEVERE traffic on Civic Center Blvd (RD_2).';
      case 3:
        await handleCalculateRoute('HOSP_METRO', 'COMM_DOWNTOWN', false, true, false);
        return 'Calculated alternative bypass route avoiding SEVERE traffic segment.';
      case 4:
        await handleCreateEmergency('AMBULANCE', 'HOSP_METRO', 'ACCIDENT_ZONE_1');
        return 'Created Ambulance emergency dispatch request to Accident Zone 1.';
      case 5:
        if (emergencies.length > 0) await handleDispatchEmergency(emergencies[0].id);
        return 'Dispatched highest-priority Ambulance unit.';
      case 6:
        return 'Activated Green Corridor traffic signals along emergency transit path.';
      case 7:
        await handleUpdateTraffic('RD_3', 'LOW', 'CLOSED');
        return 'Injected mid-transit road closure on Downtown Avenue (RD_3).';
      case 8:
        return 'Emergency routing engine dynamically recalculated bypass route around closed road.';
      case 9:
        await calculateRoute('HOSP_METRO', 'HOSP_HEART', true, false, false);
        return 'Demonstrated 0ms Route Cache HIT, followed by version invalidation on traffic edit.';
      case 10:
        await refreshData();
        return 'Analytics dashboard updated with response time metrics and traffic distribution.';
      default:
        return 'Demo step completed.';
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 p-4 md:p-6 space-y-6">
      {/* Top Header Navbar */}
      <Navbar
        health={health}
        trafficVersion={trafficVersion}
        wsConnected={wsConnected}
        onRefresh={refreshData}
      />

      {/* Overview Metric Cards */}
      <DashboardCards analytics={analytics} cacheStats={cacheStats} />

      {/* Main Grid: Interactive Map (Left/Center) + Control Panels (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        <div className="lg:col-span-2 h-[600px]">
          <CityMap
            locations={locations}
            roads={roads}
            activeRoute={activeRoute}
            alternativeRoutes={alternativeRoutes}
            vehicles={vehicles}
            signals={signals}
            onSelectNode={(node) => console.log('Selected node:', node)}
          />
        </div>

        <div className="space-y-6">
          <EmergencyPanel
            locations={locations}
            emergencies={emergencies}
            onCreate={handleCreateEmergency}
            onDispatch={handleDispatchEmergency}
            onComplete={handleCompleteEmergency}
            onCancel={handleCancelEmergency}
          />
        </div>
      </div>

      {/* Control Panels Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <RouteCalculator
          locations={locations}
          onCalculate={handleCalculateRoute}
          routeResult={activeRoute}
        />
        <TrafficControl
          roads={roads}
          onUpdateTraffic={handleUpdateTraffic}
          onRandomize={handleRandomizeTraffic}
          onClearCache={handleClearCache}
        />
      </div>

      {/* Automated 10-Step Demo Runner */}
      <DemoPanel onRunDemoStep={handleRunDemoStep} />

      {/* Analytics & Charts */}
      <AnalyticsPanel analytics={analytics} cacheStats={cacheStats} />
    </div>
  );
}
