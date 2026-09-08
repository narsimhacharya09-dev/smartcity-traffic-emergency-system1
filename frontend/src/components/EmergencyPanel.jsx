import React, { useState } from 'react';
import { Siren, Send, CheckCircle2, XCircle, Shield, Truck, Ambulance } from 'lucide-react';

export default function EmergencyPanel({ locations, emergencies, onCreate, onDispatch, onComplete, onCancel }) {
  const [vehicleType, setVehicleType] = useState('AMBULANCE');
  const [source, setSource] = useState('');
  const [destination, setDestination] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!source || !destination) return;
    if (source === destination) {
      alert("Source and Destination cannot be the same!");
      return;
    }
    onCreate(vehicleType, source, destination);
  };

  const getPriorityBadge = (type) => {
    switch (type) {
      case 'AMBULANCE': return <span className="px-2 py-0.5 rounded text-xs font-bold bg-red-900/80 text-red-300 border border-red-700">P1 (Highest)</span>;
      case 'FIRE_TRUCK': return <span className="px-2 py-0.5 rounded text-xs font-bold bg-orange-900/80 text-orange-300 border border-orange-700">P2 (High)</span>;
      case 'POLICE': return <span className="px-2 py-0.5 rounded text-xs font-bold bg-blue-900/80 text-blue-300 border border-blue-700">P3 (Medium)</span>;
      default: return null;
    }
  };

  return (
    <div className="glass-panel p-5 rounded-xl border border-slate-700 shadow-xl flex flex-col h-full">
      <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-700">
        <Siren className="w-5 h-5 text-red-500 animate-pulse" />
        <h2 className="text-lg font-bold text-slate-100">Emergency Response Control</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 mb-6">
        <div>
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
            Emergency Vehicle Type
          </label>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => setVehicleType('AMBULANCE')}
              className={`p-2.5 rounded-lg border text-xs font-bold flex flex-col items-center gap-1 transition-all ${
                vehicleType === 'AMBULANCE'
                  ? 'bg-red-600/30 border-red-500 text-red-200 ring-2 ring-red-500/50'
                  : 'bg-slate-800 border-slate-700 text-slate-400 hover:bg-slate-700'
              }`}
            >
              <Ambulance className="w-5 h-5 text-red-400" />
              Ambulance
            </button>
            <button
              type="button"
              onClick={() => setVehicleType('FIRE_TRUCK')}
              className={`p-2.5 rounded-lg border text-xs font-bold flex flex-col items-center gap-1 transition-all ${
                vehicleType === 'FIRE_TRUCK'
                  ? 'bg-orange-600/30 border-orange-500 text-orange-200 ring-2 ring-orange-500/50'
                  : 'bg-slate-800 border-slate-700 text-slate-400 hover:bg-slate-700'
              }`}
            >
              <Truck className="w-5 h-5 text-orange-400" />
              Fire Truck
            </button>
            <button
              type="button"
              onClick={() => setVehicleType('POLICE')}
              className={`p-2.5 rounded-lg border text-xs font-bold flex flex-col items-center gap-1 transition-all ${
                vehicleType === 'POLICE'
                  ? 'bg-blue-600/30 border-blue-500 text-blue-200 ring-2 ring-blue-500/50'
                  : 'bg-slate-800 border-slate-700 text-slate-400 hover:bg-slate-700'
              }`}
            >
              <Shield className="w-5 h-5 text-blue-400" />
              Police Unit
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Source Station/Facility</label>
            <select
              value={source}
              onChange={(e) => setSource(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-cyan-500"
              required
            >
              <option value="">Select Station...</option>
              {locations.map((loc) => (
                <option key={loc.id} value={loc.id}>{loc.name} ({loc.type})</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Incident Destination</label>
            <select
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-cyan-500"
              required
            >
              <option value="">Select Destination...</option>
              {locations.map((loc) => (
                <option key={loc.id} value={loc.id}>{loc.name} ({loc.type})</option>
              ))}
            </select>
          </div>
        </div>

        <button
          type="submit"
          className="w-full py-2.5 px-4 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-bold rounded-lg shadow-lg flex items-center justify-center gap-2 transition-all"
        >
          <Send className="w-4 h-4" />
          Create Emergency Dispatch Request
        </button>
      </form>

      {/* Active Emergencies Queue */}
      <div className="flex-1 flex flex-col min-h-0">
        <h3 className="text-sm font-bold text-slate-300 mb-2 uppercase tracking-wider">
          Active Emergency Queue ({emergencies.length})
        </h3>

        <div className="overflow-y-auto space-y-2 pr-1 flex-1">
          {emergencies.length === 0 ? (
            <div className="text-center py-6 text-slate-500 text-xs italic">
              No active emergencies in queue. Create one above.
            </div>
          ) : (
            emergencies.map((emg) => (
              <div key={emg.id} className="p-3 bg-slate-800/80 border border-slate-700 rounded-lg flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-cyan-400">{emg.id}</span>
                    {getPriorityBadge(emg.vehicle_type)}
                  </div>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    emg.status === 'IN_TRANSIT' ? 'bg-cyan-900 text-cyan-300 animate-pulse' : 'bg-slate-700 text-slate-300'
                  }`}>
                    {emg.status}
                  </span>
                </div>

                <div className="text-xs text-slate-300 flex items-center gap-2">
                  <span className="font-semibold text-slate-400">Route:</span>
                  <span>{emg.source} ➔ {emg.destination}</span>
                </div>

                <div className="text-xs text-slate-400 flex items-center justify-between">
                  <span>Est Time: <strong className="text-slate-200">{emg.estimated_response_time} min</strong></span>
                  <span>Distance: <strong className="text-slate-200">{emg.total_distance} km</strong></span>
                </div>

                <div className="flex items-center gap-2 mt-1 pt-2 border-t border-slate-700/50">
                  {emg.status !== 'IN_TRANSIT' && emg.status !== 'COMPLETED' && (
                    <button
                      onClick={() => onDispatch(emg.id)}
                      className="px-2.5 py-1 bg-cyan-600 hover:bg-cyan-500 text-white rounded text-xs font-bold flex items-center gap-1"
                    >
                      <Send className="w-3 h-3" /> Dispatch
                    </button>
                  )}
                  {emg.status === 'IN_TRANSIT' && (
                    <button
                      onClick={() => onComplete(emg.id)}
                      className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded text-xs font-bold flex items-center gap-1"
                    >
                      <CheckCircle2 className="w-3 h-3" /> Mark Arrived
                    </button>
                  )}
                  <button
                    onClick={() => onCancel(emg.id)}
                    className="px-2.5 py-1 bg-slate-700 hover:bg-rose-700 text-slate-300 hover:text-white rounded text-xs font-bold flex items-center gap-1"
                  >
                    <XCircle className="w-3 h-3" /> Cancel
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
