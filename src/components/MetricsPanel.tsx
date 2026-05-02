import { Activity, Battery, Gauge, Waves, Eye, Database } from 'lucide-react';
import { SimulationState } from '../types/simulation';
import { calculatePressure } from '../simulation/engine';

interface MetricsPanelProps {
  state: SimulationState;
}

export const MetricsPanel = ({ state }: MetricsPanelProps) => {
  const getStateColor = (podState: string) => {
    const colors = {
      docked: 'text-gray-400',
      idle: 'text-blue-400',
      scanning: 'text-green-400',
      returning: 'text-orange-400',
      moving: 'text-purple-400',
    };
    return colors[podState as keyof typeof colors] || 'text-gray-400';
  };

  const getEnergyColor = (energy: number, maxEnergy: number) => {
    const percentage = (energy / maxEnergy) * 100;
    if (percentage > 60) return 'text-green-400';
    if (percentage > 30) return 'text-yellow-400';
    return 'text-red-400';
  };

  return (
    <div className="bg-gray-900 border-2 border-gray-700 rounded-lg p-4 space-y-4">
      <h2 className="text-xl font-bold text-blue-300 mb-3 flex items-center gap-2">
        <Activity size={20} />
        Live Metrics
      </h2>

      <div className="space-y-4">
        <div className="bg-gray-800 rounded p-3 space-y-2">
          <h3 className="text-sm font-semibold text-gray-400 flex items-center gap-2">
            <Waves size={16} />
            Environment
          </h3>
          <div className="space-y-1 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-400">Max Depth:</span>
              <span className="text-blue-300 font-mono">{state.maxDepth.toFixed(0)}m</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Current Strength:</span>
              <span className="text-cyan-300 font-mono">{state.currentStrength.toFixed(1)}x</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Active Events:</span>
              <span className="text-yellow-300 font-mono">{state.events.filter(e => e.active).length}</span>
            </div>
          </div>
        </div>

        <div className="bg-gray-800 rounded p-3 space-y-2">
          <h3 className="text-sm font-semibold text-gray-400 flex items-center gap-2">
            <Database size={16} />
            Shell Status
          </h3>
          <div className="space-y-1 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-400">Depth:</span>
              <span className="text-blue-300 font-mono">{state.shell.depth.toFixed(0)}m</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Pressure:</span>
              <span className="text-purple-300 font-mono">
                {calculatePressure(state.shell.depth).toFixed(0)} atm
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Docked Pods:</span>
              <span className="text-green-300 font-mono">{state.shell.dockedPods.length}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Data Stored:</span>
              <span className="text-cyan-300 font-mono">{state.shell.dataStorage.length} records</span>
            </div>
          </div>
        </div>

        {state.pods.map(pod => (
          <div key={pod.id} className="bg-gray-800 rounded p-3 space-y-2">
            <h3 className={`text-sm font-semibold flex items-center gap-2 ${getStateColor(pod.state)}`}>
              <Activity size={16} />
              {pod.id.toUpperCase()}
            </h3>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between items-center">
                <span className="text-gray-400 flex items-center gap-1">
                  <Battery size={14} />
                  Energy:
                </span>
                <div className="flex items-center gap-2">
                  <div className="w-24 h-2 bg-gray-700 rounded overflow-hidden">
                    <div
                      className={`h-full transition-all ${
                        pod.energy > 60 ? 'bg-green-500' : pod.energy > 30 ? 'bg-yellow-500' : 'bg-red-500'
                      }`}
                      style={{ width: `${(pod.energy / pod.maxEnergy) * 100}%` }}
                    />
                  </div>
                  <span className={`font-mono ${getEnergyColor(pod.energy, pod.maxEnergy)}`}>
                    {pod.energy.toFixed(0)}%
                  </span>
                </div>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400 flex items-center gap-1">
                  <Gauge size={14} />
                  Depth:
                </span>
                <span className="text-blue-300 font-mono">{pod.depth.toFixed(0)}m</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Pressure:</span>
                <span className="text-purple-300 font-mono">{calculatePressure(pod.depth).toFixed(0)} atm</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">State:</span>
                <span className={`font-mono uppercase ${getStateColor(pod.state)}`}>{pod.state}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400 flex items-center gap-1">
                  <Eye size={14} />
                  Detected:
                </span>
                <span className="text-green-300 font-mono">{pod.detectedMicrobes.length} microbes</span>
              </div>
              {pod.lightBeamActive && (
                <div className="flex items-center gap-2 text-xs text-cyan-400 mt-1">
                  <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse" />
                  Bio-optical scanning active
                </div>
              )}
            </div>
          </div>
        ))}

        <div className="bg-gray-800 rounded p-3 space-y-2">
          <h3 className="text-sm font-semibold text-gray-400">Microbe Population</h3>
          <div className="space-y-1 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-400">Total Microbes:</span>
              <span className="text-green-300 font-mono">{state.microbes.length}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Bioluminescent:</span>
              <span className="text-cyan-300 font-mono">
                {state.microbes.filter(m => m.bioluminescent).length}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Currently Glowing:</span>
              <span className="text-yellow-300 font-mono">
                {state.microbes.filter(m => m.glowIntensity > 0).length}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
