import { Play, Pause, Anchor, ArrowUp, Wind, Droplets, Zap, AlertTriangle } from 'lucide-react';
import { SimulationState } from '../types/simulation';

interface ControlPanelProps {
  state: SimulationState;
  onReleasePod: (podId: string) => void;
  onRecallPod: (podId: string) => void;
  onTogglePause: () => void;
  onIncreaseDepth: () => void;
  onIncreaseCurrentStrength: () => void;
  onTriggerEvent: (type: 'chemical_spike' | 'microbial_bloom' | 'pressure_gradient' | 'turbidity') => void;
}

export const ControlPanel = ({
  state,
  onReleasePod,
  onRecallPod,
  onTogglePause,
  onIncreaseDepth,
  onIncreaseCurrentStrength,
  onTriggerEvent,
}: ControlPanelProps) => {
  return (
    <div className="bg-gray-900 border-2 border-gray-700 rounded-lg p-4 space-y-4">
      <h2 className="text-xl font-bold text-blue-300 mb-3 flex items-center gap-2">
        <Anchor size={20} />
        MARISYN Control System
      </h2>

      <div className="space-y-3">
        <div>
          <h3 className="text-sm font-semibold text-gray-400 mb-2">Simulation Control</h3>
          <button
            onClick={onTogglePause}
            className={`w-full flex items-center justify-center gap-2 px-4 py-2 rounded font-semibold transition-colors ${
              state.isPaused
                ? 'bg-green-600 hover:bg-green-700 text-white'
                : 'bg-yellow-600 hover:bg-yellow-700 text-white'
            }`}
          >
            {state.isPaused ? <Play size={18} /> : <Pause size={18} />}
            {state.isPaused ? 'Resume' : 'Pause'}
          </button>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-gray-400 mb-2">Pod Operations</h3>
          <div className="space-y-2">
            {state.pods.map(pod => (
              <div key={pod.id} className="flex gap-2">
                <button
                  onClick={() => onReleasePod(pod.id)}
                  disabled={pod.state !== 'docked'}
                  className={`flex-1 px-3 py-2 rounded text-sm font-medium transition-colors ${
                    pod.state === 'docked'
                      ? 'bg-blue-600 hover:bg-blue-700 text-white'
                      : 'bg-gray-700 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  Release {pod.id}
                </button>
                <button
                  onClick={() => onRecallPod(pod.id)}
                  disabled={pod.state === 'docked' || pod.state === 'returning'}
                  className={`flex-1 px-3 py-2 rounded text-sm font-medium transition-colors ${
                    pod.state !== 'docked' && pod.state !== 'returning'
                      ? 'bg-orange-600 hover:bg-orange-700 text-white'
                      : 'bg-gray-700 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  Recall {pod.id}
                </button>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-gray-400 mb-2">Environment</h3>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={onIncreaseDepth}
              className="flex items-center justify-center gap-2 px-3 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded text-sm font-medium transition-colors"
            >
              <ArrowUp size={16} />
              Increase Depth
            </button>
            <button
              onClick={onIncreaseCurrentStrength}
              className="flex items-center justify-center gap-2 px-3 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded text-sm font-medium transition-colors"
            >
              <Wind size={16} />
              Increase Current
            </button>
          </div>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-gray-400 mb-2">Trigger Events</h3>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => onTriggerEvent('chemical_spike')}
              className="flex items-center justify-center gap-2 px-3 py-2 bg-yellow-700 hover:bg-yellow-800 text-white rounded text-sm font-medium transition-colors"
            >
              <Zap size={16} />
              Chemical Spike
            </button>
            <button
              onClick={() => onTriggerEvent('microbial_bloom')}
              className="flex items-center justify-center gap-2 px-3 py-2 bg-green-700 hover:bg-green-800 text-white rounded text-sm font-medium transition-colors"
            >
              <Droplets size={16} />
              Microbial Bloom
            </button>
            <button
              onClick={() => onTriggerEvent('pressure_gradient')}
              className="flex items-center justify-center gap-2 px-3 py-2 bg-purple-700 hover:bg-purple-800 text-white rounded text-sm font-medium transition-colors"
            >
              <ArrowUp size={16} />
              Pressure Gradient
            </button>
            <button
              onClick={() => onTriggerEvent('turbidity')}
              className="flex items-center justify-center gap-2 px-3 py-2 bg-gray-700 hover:bg-gray-800 text-white rounded text-sm font-medium transition-colors"
            >
              <AlertTriangle size={16} />
              Turbidity
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
