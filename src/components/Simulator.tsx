import { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Sliders, Gauge, Thermometer, Droplet, Activity, Layers } from 'lucide-react';
import { useTwin } from '@/lib/twin-context';
import AnimatedNumber from './AnimatedNumber';
import Pumpjack from './Pumpjack';

const SLIDER_CONFIG = [
  { key: 'pumpSpeed' as const, label: 'PUMP SPEED', min: 2, max: 14, step: 0.1, unit: 'SPM', icon: Gauge },
  { key: 'pressure' as const, label: 'WELL PRESSURE', min: 1500, max: 4500, step: 10, unit: 'PSI', icon: Activity },
  { key: 'flowRate' as const, label: 'FLOW RATE', min: 30, max: 120, step: 1, unit: 'BBL/h', icon: Droplet },
  { key: 'temperature' as const, label: 'TEMPERATURE', min: 40, max: 120, step: 1, unit: '°F', icon: Thermometer },
  { key: 'reservoirPressure' as const, label: 'RESERVOIR PRESSURE', min: 2000, max: 5000, step: 10, unit: 'PSI', icon: Layers },
];

export default function Simulator() {
  const { params, derived, setParam } = useTwin();
  const graphCanvasRef = useRef<HTMLCanvasElement>(null);

  // Draw mini production graph
  useEffect(() => {
    const canvas = graphCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const dpr = window.devicePixelRatio || 1;
    canvas.width = canvas.offsetWidth * dpr;
    canvas.height = canvas.offsetHeight * dpr;
    ctx.scale(dpr, dpr);
    const w = canvas.offsetWidth;
    const h = canvas.offsetHeight;

    ctx.clearRect(0, 0, w, h);

    // Generate graph based on current params
    const points = 40;
    const data: number[] = [];
    for (let i = 0; i < points; i++) {
      const noise = (Math.random() - 0.5) * derived.production * 0.05;
      const wave = Math.sin(i * 0.3) * derived.production * 0.03;
      data.push(derived.production + wave + noise);
    }
    const min = Math.min(...data) * 0.95;
    const max = Math.max(...data) * 1.05;
    const range = max - min || 1;

    // Grid
    ctx.strokeStyle = 'rgba(255,255,255,0.04)';
    for (let i = 0; i <= 3; i++) {
      ctx.beginPath();
      ctx.moveTo(0, (h / 3) * i);
      ctx.lineTo(w, (h / 3) * i);
      ctx.stroke();
    }

    // Fill
    ctx.beginPath();
    ctx.moveTo(0, h);
    data.forEach((v, i) => {
      const x = (i / (points - 1)) * w;
      const y = h - ((v - min) / range) * (h * 0.8) - h * 0.1;
      ctx.lineTo(x, y);
    });
    ctx.lineTo(w, h);
    ctx.closePath();
    ctx.fillStyle = 'rgba(200,155,44,0.08)';
    ctx.fill();

    // Line
    ctx.beginPath();
    ctx.strokeStyle = '#c89b2c';
    ctx.lineWidth = 1.5;
    data.forEach((v, i) => {
      const x = (i / (points - 1)) * w;
      const y = h - ((v - min) / range) * (h * 0.8) - h * 0.1;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.stroke();
  }, [derived.production, params]);

  return (
    <section id="simulator" className="relative min-h-screen w-full overflow-hidden bg-base-black py-24">
      <div className="absolute inset-0 grid-bg opacity-20" />
      <div
        className="absolute inset-0"
        style={{ background: 'radial-gradient(ellipse at 30% 50%, rgba(200,155,44,0.05) 0%, transparent 60%)' }}
      />

      <div className="relative z-10 max-w-[1600px] mx-auto px-6 lg:px-10">
        {/* Header */}
        <div className="mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex items-center gap-3 mb-4"
          >
            <Sliders className="w-4 h-4 text-oil-400" />
            <span className="label-tag text-oil-300">DIGITAL TWIN SIMULATOR</span>
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="font-display text-4xl lg:text-6xl font-bold tracking-tight text-steel-100 max-w-4xl"
          >
            RUN THE FIELD<br />
            <span className="text-oil-300 text-glow-oil">BEFORE YOU RUN THE FIELD.</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="mt-4 text-steel-400 text-sm max-w-lg"
          >
            Adjust operating parameters and watch the digital twin respond in real time —
            production, health, and risk all recalculate instantly.
          </motion.p>
        </div>

        <div className="grid lg:grid-cols-12 gap-6">
          {/* Sliders panel — 4 cols */}
          <div className="lg:col-span-4">
            <div className="glass-panel rounded-sm">
              <div className="px-5 py-3 border-b border-white/5">
                <span className="label-tag">CONTROL PARAMETERS</span>
              </div>
              <div className="p-5 space-y-6">
                {SLIDER_CONFIG.map((cfg) => {
                  const Icon = cfg.icon;
                  const val = params[cfg.key];
                  const pct = ((val - cfg.min) / (cfg.max - cfg.min)) * 100;
                  return (
                    <div key={cfg.key}>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Icon className="w-3.5 h-3.5 text-oil-400" />
                          <span className="font-mono text-[10px] uppercase tracking-wider text-steel-300">{cfg.label}</span>
                        </div>
                        <span className="font-mono text-xs text-oil-300">
                          {val.toFixed(cfg.step < 1 ? 1 : 0)} {cfg.unit}
                        </span>
                      </div>
                      <div className="relative">
                        <input
                          type="range"
                          min={cfg.min}
                          max={cfg.max}
                          step={cfg.step}
                          value={val}
                          onChange={(e) => setParam(cfg.key, parseFloat(e.target.value))}
                          className="w-full h-1 bg-base-700 appearance-none cursor-pointer rounded-full oil-slider"
                          style={{
                            background: `linear-gradient(to right, #c89b2c ${pct}%, #1e232e ${pct}%)`,
                          }}
                        />
                        <div
                          className="absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-oil-300 pointer-events-none shadow-[0_0_10px_rgba(200,155,44,0.5)]"
                          style={{ left: `calc(${pct}% - 6px)` }}
                        />
                      </div>
                      <div className="flex justify-between mt-1">
                        <span className="font-mono text-[8px] text-steel-400">{cfg.min}</span>
                        <span className="font-mono text-[8px] text-steel-400">{cfg.max}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Live pumpjack preview — 4 cols */}
          <div className="lg:col-span-4">
            <div className="glass-panel rounded-sm h-full">
              <div className="px-5 py-3 border-b border-white/5 flex items-center justify-between">
                <span className="label-tag">TWIN PREVIEW</span>
                <div className="flex items-center gap-1.5">
                  <motion.span
                    className="w-1.5 h-1.5 rounded-full bg-status-green"
                    animate={{ opacity: [0.4, 1, 0.4] }}
                    transition={{ duration: 1, repeat: Infinity }}
                  />
                  <span className="font-mono text-[9px] text-status-green">SYNCED</span>
                </div>
              </div>
              <div className="relative h-[400px] flex items-center justify-center">
                <Pumpjack interactive={false} className="w-full max-w-[300px] h-full" />
              </div>
              <div className="px-5 py-3 border-t border-white/5 grid grid-cols-2 gap-3">
                <div>
                  <div className="label-tag">STROKE RATE</div>
                  <div className="font-mono text-sm text-steel-100">{derived.strokeRate.toFixed(1)} SPM</div>
                </div>
                <div>
                  <div className="label-tag">PUMP SPEED</div>
                  <div className="font-mono text-sm text-steel-100">{params.pumpSpeed.toFixed(1)} SPM</div>
                </div>
              </div>
            </div>
          </div>

          {/* Output metrics — 4 cols */}
          <div className="lg:col-span-4 space-y-4">
            {/* Production output */}
            <div className="glass-panel rounded-sm">
              <div className="px-5 py-3 border-b border-white/5">
                <span className="label-tag">PRODUCTION OUTPUT</span>
              </div>
              <div className="p-5">
                <div className="flex items-baseline gap-2 mb-3">
                  <AnimatedNumber
                    value={derived.production}
                    suffix=" BPD"
                    className="font-display text-4xl text-oil-300 text-glow-oil"
                  />
                </div>
                <canvas ref={graphCanvasRef} className="w-full h-20" />
              </div>
            </div>

            {/* Equipment health */}
            <div className="glass-panel rounded-sm">
              <div className="px-5 py-3 border-b border-white/5">
                <span className="label-tag">EQUIPMENT HEALTH</span>
              </div>
              <div className="p-5">
                <div className="flex items-baseline gap-2 mb-3">
                  <span className="font-display text-4xl tabular-nums" style={{ color: derived.riskColor }}>
                    <AnimatedNumber
                      value={derived.equipmentHealth}
                      decimals={1}
                      suffix="%"
                    />
                  </span>
                </div>
                <div className="h-2 bg-base-700 overflow-hidden rounded-full">
                  <motion.div
                    className="h-full rounded-full"
                    style={{ backgroundColor: derived.riskColor }}
                    animate={{ width: `${derived.equipmentHealth}%` }}
                    transition={{ duration: 0.5 }}
                  />
                </div>
                <div className="flex justify-between mt-2">
                  <span className="font-mono text-[9px] text-steel-400">0%</span>
                  <span className="font-mono text-[9px]" style={{ color: derived.riskColor }}>
                    {derived.equipmentHealth > 95 ? 'OPTIMAL' : derived.equipmentHealth > 85 ? 'CAUTION' : 'CRITICAL'}
                  </span>
                  <span className="font-mono text-[9px] text-steel-400">100%</span>
                </div>
              </div>
            </div>

            {/* Risk indicator */}
            <div className="glass-panel rounded-sm">
              <div className="px-5 py-3 border-b border-white/5">
                <span className="label-tag">ANOMALY RISK</span>
              </div>
              <div className="p-5 flex items-center gap-4">
                <motion.div
                  className="w-16 h-16 rounded-full border-2 flex items-center justify-center"
                  style={{ borderColor: derived.riskColor }}
                  animate={{ boxShadow: [`0 0 0px ${derived.riskColor}00`, `0 0 20px ${derived.riskColor}40`, `0 0 0px ${derived.riskColor}00`] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <span className="font-display text-lg" style={{ color: derived.riskColor }}>
                    {derived.anomalyRisk === 'LOW' ? 'L' : derived.anomalyRisk === 'MODERATE' ? 'M' : 'H'}
                  </span>
                </motion.div>
                <div>
                  <div className="font-display text-2xl" style={{ color: derived.riskColor }}>
                    {derived.anomalyRisk}
                  </div>
                  <div className="font-mono text-[10px] text-steel-400">
                    {derived.anomalyRisk === 'LOW'
                      ? 'Operating within normal parameters'
                      : derived.anomalyRisk === 'MODERATE'
                      ? 'Elevated stress detected — monitor closely'
                      : 'Critical risk — intervention recommended'}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .oil-slider::-webkit-slider-thumb {
          -webkit-appearance: none;
          width: 14px;
          height: 14px;
          border-radius: 50%;
          background: #e0b848;
          cursor: pointer;
          box-shadow: 0 0 10px rgba(200,155,44,0.5);
          border: 2px solid #050608;
        }
        .oil-slider::-moz-range-thumb {
          width: 14px;
          height: 14px;
          border-radius: 50%;
          background: #e0b848;
          cursor: pointer;
          border: 2px solid #050608;
        }
      `}</style>
    </section>
  );
}
