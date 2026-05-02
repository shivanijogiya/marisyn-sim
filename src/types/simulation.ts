export interface Pod {
  id: string;
  x: number;
  y: number;
  depth: number;
  energy: number;
  maxEnergy: number;
  state: 'docked' | 'idle' | 'scanning' | 'returning' | 'moving';
  velocityX: number;
  velocityY: number;
  detectedMicrobes: Microbe[];
  scanningRadius: number;
  lightBeamActive: boolean;
}

export interface Shell {
  x: number;
  y: number;
  depth: number;
  dockedPods: string[];
  energyStorage: number;
  dataStorage: DetectedData[];
}

export interface Microbe {
  id: string;
  x: number;
  y: number;
  depth: number;
  pressureTolerance: number;
  cellMembraneFlexibility: number;
  metalInteraction: boolean;
  bioluminescent: boolean;
  glowIntensity: number;
}

export interface DetectedData {
  microbeId: string;
  depth: number;
  pressure: number;
  timestamp: number;
  biosignature: string;
}

export interface WaterCurrent {
  x: number;
  y: number;
  width: number;
  height: number;
  velocityX: number;
  velocityY: number;
  strength: number;
}

export interface EnvironmentalEvent {
  type: 'chemical_spike' | 'microbial_bloom' | 'pressure_gradient' | 'turbidity';
  x: number;
  y: number;
  radius: number;
  intensity: number;
  active: boolean;
}

export interface SimulationState {
  shell: Shell;
  pods: Pod[];
  microbes: Microbe[];
  currents: WaterCurrent[];
  events: EnvironmentalEvent[];
  isPaused: boolean;
  time: number;
  maxDepth: number;
  currentStrength: number;
}

export const HADAL_ZONE = {
  MIN_DEPTH: 6000,
  MAX_DEPTH: 11000,
  PRESSURE_AT_6000M: 600,
  PRESSURE_AT_11000M: 1100,
};

export const POD_CONFIG = {
  MAX_ENERGY: 100,
  ENERGY_CONSUMPTION_RATE: 0.1,
  ENERGY_SCAN_RATE: 0.5,
  ENERGY_MOVE_RATE: 0.3,
  ENERGY_HARVEST_RATE: 2,
  PASSIVE_THRESHOLD: 20,
  SCAN_RADIUS: 80,
  MAX_SPEED: 2,
};

export const SIMULATION_CONFIG = {
  WIDTH: 1000,
  HEIGHT: 700,
  SHELL_DEPTH: 6500,
  TICK_RATE: 50,
};
