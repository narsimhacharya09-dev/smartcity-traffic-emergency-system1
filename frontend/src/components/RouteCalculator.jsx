import React, { useState } from 'react';
import { Route, Cpu, Zap, Clock, Navigation, CornerDownRight } from 'lucide-react';

export default function RouteCalculator({ locations, onCalculate, routeResult }) {
  const [source, setSource] = useState('');
  const [destination, setDestination] = useState('');
  const [useCache, setUseCache] = useState(true);
  const [includeAlternatives, setIncludeAlternatives] = useState(true);
  const [useMl, setUseMl] = useState(false);

  const handleCalculate = (e) => {
    e.preventDefault();
    if (!source || !destination) return;
    onCalculate(source, destination, useCache, includeAlternatives, useMl);
  };

  return (
    <div className="glass-panel p-5 rounded-xl border border-slate-700 shadow-xl flex flex-col h-full">
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-700">
        <div className="flex items-center gap-2">
          <Route className="w-5 h-5 text-cyan-400" />
          <h2 className="text-lg font-bold text-slate-100">Dijkstra Shortest Path Finder</h2>
        </div>
        {routeResult?.from_cache !== undefined && (
          <span className={`px-2.5 py-1 rounded text-xs font-extrabold border ${
            routeResult.from_cache
              ? 'bg-emerald-950 border-emerald-600 text-emerald-300'
              : 'bg-amber-950 border-amber-600 text-amber-300'
          }`}>
            CACHE {routeResult.from_cache ? 'HIT ⚡' : 'MISS 🔄'}
          </span>
        )}
      </div>

      <form onSubmit={handleCalculate} className="space-y-4 mb-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Origin Node</label>
            <select
              value={source}
              onChange={(e) => setSource(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-cyan-500"
              required
            >
              <option value="">Select Origin...</option>
              {locations.map((loc) => (
                <option key={loc.id} value={loc.id}>{loc.name} ({loc.type})</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Destination Node</label>
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

        <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-slate-300">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={useCache}
              onChange={(e) => setUseCache(e.target.checked)}
              className="rounded bg-slate-800 border-slate-700 text-cyan-500 focus:ring-cyan-500"
            />
            <span>Enable Route Cache</span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={includeAlternatives}
              onChange={(e) => setIncludeAlternatives(e.target.checked)}
              className="rounded bg-slate-800 border-slate-700 text-cyan-500 focus:ring-cyan-500"
            />
            <span>Show Alternative Routes</span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={useMl}
              onChange={(e) => setUseMl(e.target.checked)}
              className="rounded bg-slate-800 border-slate-700 text-purple-500 focus:ring-purple-500"
            />
            <span className="flex items-center gap-1 text-purple-300">
              <Cpu className="w-3.5 h-3.5" /> AI/ML Edge Weights
            </span>
          </label>
        </div>

        <button
          type="submit"
          className="w-full py-2.5 px-4 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold rounded-lg shadow-lg flex items-center justify-center gap-2 transition-all"
        >
          <Navigation className="w-4 h-4" />
          Compute Dijkstra Route
        </button>
      </form>

      {/* Results Display */}
      {routeResult && (
        <div className="mt-2 p-4 bg-slate-800/90 border border-slate-700 rounded-lg flex-1 overflow-y-auto space-y-3">
          {routeResult.success ? (
            <>
              <div className="grid grid-cols-3 gap-2 text-center py-2 bg-slate-900/60 rounded-lg border border-slate-700/50">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Total Distance</span>
                  <span className="text-base font-extrabold text-cyan-400">{routeResult.total_distance} km</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Est. Time</span>
                  <span className="text-base font-extrabold text-emerald-400">{routeResult.estimated_travel_time} min</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Calc Latency</span>
                  <span className="text-base font-extrabold text-purple-400">{routeResult.calculation_time_ms} ms</span>
                </div>
              </div>

              <div>
                <span className="text-xs font-bold text-slate-300 block mb-1">
                  Optimal Path ({routeResult.route.length} nodes, {routeResult.visited_nodes_count} visited):
                </span>
                <div className="p-2.5 bg-slate-900 rounded font-mono text-xs text-cyan-300 break-words border border-slate-800">
                  {routeResult.route.join(' ➔ ')}
                </div>
              </div>

              {/* Alternative Routes Comparison */}
              {routeResult.alternatives && routeResult.alternatives.length > 0 && (
                <div className="pt-2 border-t border-slate-700">
                  <span className="text-xs font-bold text-purple-300 block mb-2 flex items-center gap-1">
                    <CornerDownRight className="w-3.5 h-3.5" /> Alternative Route Options:
                  </span>
                  <div className="space-y-1.5">
                    {routeResult.alternatives.map((alt, i) => (
                      <div key={i} className="p-2 bg-purple-950/40 border border-purple-800/50 rounded text-xs flex justify-between items-center text-purple-200">
                        <span>Alt #{i + 1}: <span className="font-mono text-[11px]">{alt.route.join('➔')}</span></span>
                        <span className="font-bold">{alt.total_distance} km / {alt.estimated_travel_time} min</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="p-3 bg-rose-950/60 border border-rose-700 rounded text-rose-300 text-xs font-semibold text-center">
              ❌ {routeResult.message || 'Route calculation failed'}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
