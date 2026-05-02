import { useEffect, useRef } from 'react';
import { SimulationState, HADAL_ZONE, SIMULATION_CONFIG, POD_CONFIG } from '../types/simulation';
import { calculatePressure, depthToY } from '../simulation/engine';

interface OceanViewProps {
  state: SimulationState;
}

export const OceanView = ({ state }: OceanViewProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const render = () => {
      ctx.clearRect(0, 0, SIMULATION_CONFIG.WIDTH, SIMULATION_CONFIG.HEIGHT);

      drawOcean(ctx);
      drawPressureLayers(ctx);
      drawCurrents(ctx, state);
      drawEvents(ctx, state);
      drawMicrobes(ctx, state);
      drawShell(ctx, state);
      drawPods(ctx, state);
    };

    render();
  }, [state]);

  return (
    <canvas
      ref={canvasRef}
      width={SIMULATION_CONFIG.WIDTH}
      height={SIMULATION_CONFIG.HEIGHT}
      className="border-2 border-gray-700 rounded-lg bg-gradient-to-b from-gray-900 to-black"
    />
  );
};

const drawOcean = (ctx: CanvasRenderingContext2D) => {
  const gradient = ctx.createLinearGradient(0, 0, 0, SIMULATION_CONFIG.HEIGHT);
  gradient.addColorStop(0, '#001a33');
  gradient.addColorStop(0.5, '#001122');
  gradient.addColorStop(1, '#000508');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, SIMULATION_CONFIG.WIDTH, SIMULATION_CONFIG.HEIGHT);
};

const drawPressureLayers = (ctx: CanvasRenderingContext2D) => {
  const depths = [6000, 7000, 8000, 9000, 10000, 11000];

  ctx.font = '12px monospace';
  ctx.strokeStyle = 'rgba(100, 150, 200, 0.3)';
  ctx.lineWidth = 1;

  depths.forEach(depth => {
    const y = depthToY(depth);
    const pressure = calculatePressure(depth);

    ctx.beginPath();
    ctx.setLineDash([5, 5]);
    ctx.moveTo(0, y);
    ctx.lineTo(SIMULATION_CONFIG.WIDTH, y);
    ctx.stroke();
    ctx.setLineDash([]);

    ctx.fillStyle = 'rgba(150, 200, 255, 0.7)';
    ctx.fillText(`${depth}m | ${pressure.toFixed(0)} atm`, 10, y - 5);
  });
};

const drawCurrents = (ctx: CanvasRenderingContext2D, state: SimulationState) => {
  state.currents.forEach(current => {
    const spacing = 40;
    const rows = Math.floor(current.height / spacing);
    const cols = Math.floor(current.width / spacing);

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const x = current.x + col * spacing + spacing / 2;
        const y = current.y + row * spacing + spacing / 2;

        const speed = Math.sqrt(current.velocityX ** 2 + current.velocityY ** 2);
        const angle = Math.atan2(current.velocityY, current.velocityX);

        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(angle);

        ctx.strokeStyle = `rgba(100, 180, 255, ${0.2 + current.strength * 0.2})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(-10 * speed, 0);
        ctx.lineTo(10 * speed, 0);
        ctx.lineTo(7 * speed, -3);
        ctx.moveTo(10 * speed, 0);
        ctx.lineTo(7 * speed, 3);
        ctx.stroke();

        ctx.restore();
      }
    }
  });
};

const drawEvents = (ctx: CanvasRenderingContext2D, state: SimulationState) => {
  state.events.forEach(event => {
    if (!event.active) return;

    const colors = {
      chemical_spike: 'rgba(255, 200, 0, 0.3)',
      microbial_bloom: 'rgba(0, 255, 100, 0.3)',
      pressure_gradient: 'rgba(200, 0, 255, 0.3)',
      turbidity: 'rgba(150, 150, 150, 0.4)',
    };

    ctx.fillStyle = colors[event.type];
    ctx.beginPath();
    ctx.arc(event.x, event.y, event.radius, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = colors[event.type].replace('0.3', '0.6');
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
    ctx.font = '11px monospace';
    ctx.fillText(event.type.replace('_', ' ').toUpperCase(), event.x - 40, event.y - event.radius - 10);
  });
};

const drawMicrobes = (ctx: CanvasRenderingContext2D, state: SimulationState) => {
  state.microbes.forEach(microbe => {
    const baseSize = 3;
    const glowSize = baseSize + microbe.glowIntensity * 10;

    if (microbe.glowIntensity > 0) {
      const gradient = ctx.createRadialGradient(microbe.x, microbe.y, 0, microbe.x, microbe.y, glowSize);
      gradient.addColorStop(0, `rgba(0, 255, 150, ${microbe.glowIntensity * 0.8})`);
      gradient.addColorStop(0.5, `rgba(0, 200, 255, ${microbe.glowIntensity * 0.4})`);
      gradient.addColorStop(1, 'rgba(0, 150, 255, 0)');

      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(microbe.x, microbe.y, glowSize, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.fillStyle = microbe.bioluminescent
      ? `rgba(100, 255, 200, ${0.6 + microbe.glowIntensity * 0.4})`
      : 'rgba(150, 150, 200, 0.5)';
    ctx.beginPath();
    ctx.arc(microbe.x, microbe.y, baseSize, 0, Math.PI * 2);
    ctx.fill();
  });
};

const drawShell = (ctx: CanvasRenderingContext2D, state: SimulationState) => {
  const { shell } = state;

  ctx.fillStyle = 'rgba(80, 120, 160, 0.9)';
  ctx.strokeStyle = 'rgba(150, 200, 255, 0.8)';
  ctx.lineWidth = 3;

  ctx.beginPath();
  ctx.arc(shell.x, shell.y, 35, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = 'rgba(100, 150, 200, 0.7)';
  ctx.beginPath();
  ctx.arc(shell.x, shell.y, 25, 0, Math.PI * 2);
  ctx.fill();

  for (let i = 0; i < 8; i++) {
    const angle = (i / 8) * Math.PI * 2;
    const x1 = shell.x + Math.cos(angle) * 25;
    const y1 = shell.y + Math.sin(angle) * 25;
    const x2 = shell.x + Math.cos(angle) * 35;
    const y2 = shell.y + Math.sin(angle) * 35;

    ctx.strokeStyle = 'rgba(150, 200, 255, 0.6)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
  }

  ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
  ctx.font = 'bold 12px monospace';
  ctx.textAlign = 'center';
  ctx.fillText('SHELL', shell.x, shell.y + 4);
  ctx.textAlign = 'left';
};

const drawPods = (ctx: CanvasRenderingContext2D, state: SimulationState) => {
  state.pods.forEach(pod => {
    if (pod.lightBeamActive) {
      const gradient = ctx.createRadialGradient(pod.x, pod.y, 0, pod.x, pod.y, pod.scanningRadius);
      gradient.addColorStop(0, 'rgba(100, 200, 255, 0.3)');
      gradient.addColorStop(1, 'rgba(100, 200, 255, 0)');

      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(pod.x, pod.y, pod.scanningRadius, 0, Math.PI * 2);
      ctx.fill();

      ctx.strokeStyle = 'rgba(100, 200, 255, 0.5)';
      ctx.lineWidth = 2;
      ctx.setLineDash([3, 3]);
      ctx.beginPath();
      ctx.arc(pod.x, pod.y, pod.scanningRadius, 0, Math.PI * 2);
      ctx.stroke();
      ctx.setLineDash([]);
    }

    const stateColors = {
      docked: 'rgba(100, 100, 100, 0.8)',
      idle: 'rgba(100, 150, 200, 0.9)',
      scanning: 'rgba(100, 255, 200, 0.95)',
      returning: 'rgba(255, 200, 100, 0.9)',
      moving: 'rgba(150, 150, 255, 0.9)',
    };

    ctx.fillStyle = stateColors[pod.state];
    ctx.strokeStyle = 'rgba(200, 230, 255, 0.8)';
    ctx.lineWidth = 2;

    ctx.beginPath();
    ctx.arc(pod.x, pod.y, 12, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    const energyAngle = (pod.energy / pod.maxEnergy) * Math.PI * 2;
    ctx.strokeStyle = pod.energy > POD_CONFIG.PASSIVE_THRESHOLD
      ? 'rgba(100, 255, 100, 0.9)'
      : 'rgba(255, 100, 100, 0.9)';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(pod.x, pod.y, 8, -Math.PI / 2, -Math.PI / 2 + energyAngle);
    ctx.stroke();

    if (pod.state === 'moving' || pod.state === 'returning') {
      const speed = Math.sqrt(pod.velocityX ** 2 + pod.velocityY ** 2);
      if (speed > 0.1) {
        const angle = Math.atan2(pod.velocityY, pod.velocityX);

        ctx.save();
        ctx.translate(pod.x, pod.y);
        ctx.rotate(angle + Math.PI);

        ctx.fillStyle = 'rgba(100, 200, 255, 0.6)';
        ctx.beginPath();
        ctx.moveTo(-8, 0);
        ctx.lineTo(-15, -4);
        ctx.lineTo(-15, 4);
        ctx.closePath();
        ctx.fill();

        ctx.restore();
      }
    }
  });
};
