import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Radio, MapPin, Activity, Thermometer, Gauge, Wrench, AlertTriangle } from 'lucide-react';
import AnimatedNumber from './AnimatedNumber';

interface Well {
  id: string;
  name: string;
  status: 'ONLINE' | 'WARNING' | 'OFFLINE';
  x: number;
  y: number;
  production: number;
  pressure: number;
  temperature: number;
  health: number;
  anomaly: string;
}

const WELLS: Well[] = [
  { id: 'A01', name: 'WELL A01', status: 'ONLINE', x: 20, y: 30, production: 842, pressure: 2840, temperature: 72, health: 97.2, anomaly: 'NONE' },
  { id: 'A02', name: 'WELL A02', status: 'ONLINE', x: 35, y: 55, production: 910, pressure: 2920, temperature: 68, health: 98.1, anomaly: 'NONE' },
  { id: 'B07', name: 'WELL B07', status: 'WARNING', x: 50, y: 25, production: 680, pressure: 2450, temperature: 84, health: 78.4, anomaly: 'VIBRATION' },
  { id: 'C03', name: 'WELL C03', status: 'ONLINE', x: 65, y: 50, production: 1120, pressure: 3100, temperature: 71, health: 96.8, anomaly: 'NONE' },
  { id: 'D11', name: 'WELL D11', status: 'ONLINE', x: 80, y: 35, production: 755, pressure: 2680, temperature: 75, health: 94.3, anomaly: 'NONE' },
  { id: 'D14', name: 'WELL D14', status: 'ONLINE', x: 28, y: 70, production: 890, pressure: 2810, temperature: 69, health: 95.6, anomaly: 'NONE' },
  { id: 'E08', name: 'WELL E08', status: 'ONLINE', x: 72, y: 70, production: 1020, pressure: 3050, temperature: 73, health: 97.9, anomaly: 'NONE' },
];

const STATUS_COLOR: Record<Well['status'], string> = {
  ONLINE: '#3dd68c',
  WARNING: '#f0a830',
  OFFLINE: '#f0505a',
};

export default function LiveField() {
  const [selected, setSelected] = useState<Well>(WELLS[2]); // B07 default
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [pulse, setPulse] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => setPulse((p) => p + 1), 2000);
    return () => clearInterval(interval);
  }, []);

  // Draw connection lines between wells
  useEffect(() => {
    const canvas = canvasRef.current;
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

    // Connection lines — hub topology (connect to nearest neighbors)
    const connections: [number, number][] = [
      [0, 1], [0, 5], [1, 2], [2, 3], [3, 4], [3, 6], [5, 6], [1, 5],
    ];

    connections.forEach(([a, b]) => {
      const wa = WELLS[a];
      const wb = WELLS[b];
      const x1 = (wa.x / 100) * w;
      const y1 = (wa.y / 100) * h;
      const x2 = (wb.x / 100) * w;
      const y2 = (wb.y / 100) * h;

      ctx.strokeStyle = 'rgba(200,155,44,0.15)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();

      // Animated data packet along line
      const t = ((pulse * 0.3) + (a + b) * 0.1) % 1;
      const px = x1 + (x2 - x1) * t;
      const py = y1 + (y2 - y1) * t;
      ctx.beginPath();
      ctx.arc(px, py, 2, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(200,155,44,0.6)';
      ctx.fill();
    });
  }, [pulse]);

  return (
    <section id="field" className="relative min-h-screen w-full overflow-hidden bg-base-900 py-24">
      <div className="absolute inset-0 grid-bg opacity-15" />
      <div className="absolute inset-0 bg-gradient-to-b from-base-black via-transparent to-base-black" />

      <div className="relative z-10 max-w-[1600px] mx-auto px-6 lg:px-10">
        {/* Header */}
        <div className="mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex items-center gap-3 mb-4"
          >
            <Radio className="w-4 h-4 text-oil-400" />
            <span className="label-tag text-oil-300">LIVE OILFIELD CONTROL CENTER</span>
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="font-display text-4xl lg:text-6xl font-bold tracking-tight text-steel-100 max-w-4xl"
          >
            EVERY WELL.<br />
            <span className="text-oil-300 text-glow-oil">ONE VIEW.</span>
          </motion.h2>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Well map — 2 cols */}
          <div className="lg:col-span-2">
            <div className="glass-panel rounded-sm">
              <div className="flex items-center justify-between px-5 py-3 border-b border-white/5">
                <span className="label-tag">FIELD MAP · 7 WELLS</span>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-status-green" />
                    <span className="font-mono text-[9px] text-steel-400">ONLINE</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-status-amber" />
                    <span className="font-mono text-[9px] text-steel-400">WARNING</span>
                  </div>
                </div>
              </div>

              <div className="relative h-[500px] overflow-hidden">
                {/* Topographic grid background */}
                <div className="absolute inset-0 blueprint-bg opacity-30" />

                {/* Connection lines canvas */}
                <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />

                {/* Well markers */}
                {WELLS.map((well) => (
                  <button
                    key={well.id}
                    onClick={() => setSelected(well)}
                    className="absolute -translate-x-1/2 -translate-y-1/2 group"
                    style={{ left: `${well.x}%`, top: `${well.y}%` }}
                  >
                    {/* Pulse ring */}
                    <motion.span
                      className="absolute inset-0 rounded-full"
                      style={{ backgroundColor: STATUS_COLOR[well.status] }}
                      animate={{ scale: [1, 2.5], opacity: [0.4, 0] }}
                      transition={{ duration: 2, repeat: Infinity, delay: (well.x + well.y) * 0.01 }}
                    />
                    {/* Core dot */}
                    <span
                      className="relative block w-3 h-3 rounded-full border-2 transition-transform group-hover:scale-150"
                      style={{
                        backgroundColor: STATUS_COLOR[well.status],
                        borderColor: selected.id === well.id ? '#e0b848' : 'transparent',
                        boxShadow: `0 0 12px ${STATUS_COLOR[well.status]}80`,
                      }}
                    />
                    {/* Label */}
                    <span
                      className={`absolute top-4 left-1/2 -translate-x-1/2 whitespace-nowrap font-mono text-[9px] uppercase tracking-wider transition-opacity ${
                        selected.id === well.id ? 'text-oil-300 opacity-100' : 'text-steel-400 opacity-60 group-hover:opacity-100'
                      }`}
                    >
                      {well.name}
                    </span>
                  </button>
                ))}

                {/* Scan effect overlay */}
                <motion.div
                  className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-oil-400/30 to-transparent"
                  animate={{ top: ['0%', '100%', '0%'] }}
                  transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
                />
              </div>
            </div>
          </div>

          {/* Well detail panel — 1 col */}
          <div>
            <div className="glass-panel rounded-sm">
              <div className="px-5 py-3 border-b border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-oil-400" />
                  <span className="font-display text-sm text-steel-100">{selected.name}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <motion.span
                    className="w-1.5 h-1.5 rounded-full"
                    style={{ backgroundColor: STATUS_COLOR[selected.status] }}
                    animate={{ opacity: [0.4, 1, 0.4] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  />
                  <span className="font-mono text-[9px] uppercase" style={{ color: STATUS_COLOR[selected.status] }}>
                    {selected.status}
                  </span>
                </div>
              </div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={selected.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="p-5 space-y-4"
                >
                  {/* Metrics */}
                  {[
                    { icon: Activity, label: 'PRODUCTION', value: selected.production, unit: 'BPD', color: '#c89b2c' },
                    { icon: Gauge, label: 'PRESSURE', value: selected.pressure, unit: 'PSI', color: '#2db8b8' },
                    { icon: Thermometer, label: 'TEMPERATURE', value: selected.temperature, unit: '°F', color: '#e0b848' },
                    { icon: Wrench, label: 'HEALTH', value: selected.health, decimals: 1, unit: '%', color: selected.health > 90 ? '#3dd68c' : selected.health > 80 ? '#f0a830' : '#f0505a' },
                  ].map((m) => {
                    const Icon = m.icon;
                    return (
                      <div key={m.label} className="flex items-center justify-between border-b border-white/5 pb-3">
                        <div className="flex items-center gap-2.5">
                          <Icon className="w-4 h-4 text-steel-400" />
                          <span className="font-mono text-[10px] uppercase tracking-wider text-steel-400">{m.label}</span>
                        </div>
                        <span className="font-display text-lg tabular-nums" style={{ color: m.color }}>
                          <AnimatedNumber
                            value={m.value}
                            decimals={m.decimals || 0}
                            suffix={` ${m.unit}`}
                          />
                        </span>
                      </div>
                    );
                  })}

                  {/* Anomaly status */}
                  <div className="pt-2">
                    <div className="flex items-center gap-2 mb-2">
                      <AlertTriangle className="w-4 h-4" style={{ color: selected.anomaly === 'NONE' ? '#3dd68c' : '#f0a830' }} />
                      <span className="font-mono text-[10px] uppercase tracking-wider text-steel-400">ANOMALY STATUS</span>
                    </div>
                    <div
                      className="glass-panel rounded-sm px-3 py-2 font-mono text-xs"
                      style={{ color: selected.anomaly === 'NONE' ? '#3dd68c' : '#f0a830' }}
                    >
                      {selected.anomaly === 'NONE' ? 'No anomalies detected' : `Detected: ${selected.anomaly}`}
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Summary stats */}
            <div className="grid grid-cols-3 gap-3 mt-4">
              <div className="glass-panel rounded-sm p-3 text-center">
                <div className="label-tag mb-1">TOTAL</div>
                <div className="font-display text-xl text-steel-100">{WELLS.length}</div>
              </div>
              <div className="glass-panel rounded-sm p-3 text-center">
                <div className="label-tag mb-1">ONLINE</div>
                <div className="font-display text-xl text-status-green">
                  {WELLS.filter((w) => w.status === 'ONLINE').length}
                </div>
              </div>
              <div className="glass-panel rounded-sm p-3 text-center">
                <div className="label-tag mb-1">ALERTS</div>
                <div className="font-display text-xl text-status-amber">
                  {WELLS.filter((w) => w.status === 'WARNING').length}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
