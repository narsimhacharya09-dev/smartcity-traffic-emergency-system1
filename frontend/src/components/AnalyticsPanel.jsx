import React from 'react';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { BarChart3 } from 'lucide-react';

const COLORS = ['#ef4444', '#f97316', '#3b82f6', '#22c55e', '#a855f7'];

export default function AnalyticsPanel({ analytics, cacheStats }) {
  if (!analytics) return null;

  const trafficData = Object.entries(analytics.traffic_distribution || {}).map(([key, val]) => ({
    name: key,
    count: val
  }));

  const emergencyTypeData = Object.entries(analytics.emergency_type_distribution || {}).map(([key, val]) => ({
    name: key.replace('_', ' '),
    count: val
  }));

  const cacheData = [
    { name: 'Cache Hits', value: cacheStats?.hits || 0 },
    { name: 'Cache Misses', value: cacheStats?.misses || 0 }
  ];

  return (
    <div className="glass-panel p-5 rounded-xl border border-slate-700 shadow-xl space-y-6">
      <div className="flex items-center gap-2 pb-3 border-b border-slate-700">
        <BarChart3 className="w-5 h-5 text-purple-400" />
        <h2 className="text-lg font-bold text-slate-100">SmartCity System Analytics & Intelligence</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Traffic Level Distribution Bar Chart */}
        <div className="bg-slate-800/80 p-4 rounded-xl border border-slate-700">
          <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-3">
            Traffic Congestion Distribution
          </h3>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={trafficData}>
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} />
                <YAxis stroke="#94a3b8" fontSize={11} allowDecimals={false} />
                <Tooltip contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', borderRadius: '0.5rem', color: '#f8fafc' }} />
                <Bar dataKey="count" fill="#f97316" radius={[4, 4, 0, 0]}>
                  {trafficData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Emergency Type Pie Chart */}
        <div className="bg-slate-800/80 p-4 rounded-xl border border-slate-700">
          <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-3">
            Emergency Vehicle Types
          </h3>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={emergencyTypeData}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={65}
                  paddingAngle={5}
                  dataKey="count"
                >
                  {emergencyTypeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', borderRadius: '0.5rem', color: '#f8fafc' }} />
                <Legend formatter={(value) => <span className="text-xs text-slate-300 font-medium">{value}</span>} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Route Cache Hit vs Miss Pie Chart */}
        <div className="bg-slate-800/80 p-4 rounded-xl border border-slate-700">
          <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-3">
            Route Cache Efficiency ({cacheStats?.hit_rate_percentage || 0}%)
          </h3>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={cacheData}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={65}
                  paddingAngle={5}
                  dataKey="value"
                >
                  <Cell fill="#10b981" />
                  <Cell fill="#ef4444" />
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', borderRadius: '0.5rem', color: '#f8fafc' }} />
                <Legend formatter={(value) => <span className="text-xs text-slate-300 font-medium">{value}</span>} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
