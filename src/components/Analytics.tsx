import { useRef, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, Brain, Zap, TrendingDown } from 'lucide-react';
import { useTwin } from '@/lib/twin-context';

interface Series {
  name: string;
  color: string;
  baseValue: number;
  amplitude: number;
  data: number[];
  unit: string;
}

const SERIES_CONFIG: Omit<Series, 'data'>[] = [
  { name: 'PRODUCTION RATE', color: '#c89b2c', baseValue: 842, amplitude: 20, unit: 'BPD' },
  { name: 'PRESSURE', color: '#2db8b8', baseValue: 2840, amplitude: 40, unit: 'PSI' },
  { name: 'TEMPERATURE', color: '#e0b848', baseValue: 72, amplitude: 3, unit: '°F' },
  { name: 'VIBRATION', color: '#f0a830', baseValue: 4.2, amplitude: 1.5, unit: 'mm/s' },
  { name: 'PUMP SPEED', color: '#8a95a8', baseValue: 7.2, amplitude: 0.3, unit: 'SPM' },
  { name: 'EQUIPMENT HEALTH', color: '#3dd68c', baseValue: 96.8, amplitude: 1.2, unit: '%' },
];

const POINTS = 60;

export default function Analytics() {
  const { derived, params } = useTwin();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [series, setSeries] = useState<Series[]>(
    SERIES_CONFIG.map((s) => ({ ...s, data: Array(POINTS).fill(s.baseValue) }))
  );
  const [anomalyState, setAnomalyState] = useState<'normal' | 'anomaly' | 'predictive'>('normal');
  const [tick, setTick] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

  // Detect in view
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold: 0.3 }
    );
    if (containerRef.current) obs.observe(containerRef.current);
    return () => obs.disconnect();
  }, []);

  // Live data generation
  useEffect(() => {
    if (!inView) return;
    const interval = setInterval(() => {
      setTick((t) => t + 1);
      setSeries((prev) =>
        prev.map((s, idx) => {
          const config = SERIES_CONFIG[idx];
          const noise = (Math.random() - 0.5) * config.amplitude * 0.4;
          const wave = Math.sin(tick * 0.08 + idx) * config.amplitude * 0.3;
          // Vibration gets anomalous at certain ticks
          let val = config.baseValue + wave + noise;
          if (idx === 3 && tick > 30 && tick < 50) {
            val += (tick - 30) * 0.3; // rising vibration anomaly
          }
          if (idx === 0 && tick > 30 && tick < 50) {
            val -= (tick - 30) * 2; // dropping production
          }
          return { ...s, data: [...s.data.slice(1), val] };
        })
      );

      // Anomaly sequence
      if (tick === 32) setAnomalyState('anomaly');
      if (tick === 45) setAnomalyState('predictive');
      if (tick === 60) {
        setAnomalyState('normal');
        setTick(0);
      }
    }, 120);
    return () => clearInterval(interval);
  }, [inView, tick]);

  // Draw graphs
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const dpr = window.devicePixelRatio || 1;
    const w = (canvas.width = canvas.offsetWidth * dpr);
    const h = (canvas.height = canvas.offsetHeight * dpr);
    ctx.scale(dpr, dpr);
    const cw = canvas.offsetWidth;
    const ch = canvas.offsetHeight;

    ctx.clearRect(0, 0, w, h);

    // Grid
    ctx.strokeStyle = 'rgba(255,255,255,0.03)';
    ctx.lineWidth = 1;
    for (let i = 0; i <= 4; i++) {
      const y = (ch / 4) * i;
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(cw, y);
      ctx.stroke();
    }

    // Draw each series in its own horizontal band
    const bandHeight = ch / series.length;
    series.forEach((s, idx) => {
      const bandTop = idx * bandHeight;
      const bandCenter = bandTop + bandHeight / 2;

      // Baseline
      ctx.strokeStyle = 'rgba(255,255,255,0.05)';
      ctx.setLineDash([2, 4]);
      ctx.beginPath();
      ctx.moveTo(0, bandCenter);
      ctx.lineTo(cw, bandCenter);
      ctx.stroke();
      ctx.setLineDash([]);

      // Min/max for normalization
      const min = Math.min(...s.data);
      const max = Math.max(...s.data);
      const range = max - min || 1;

      // Fill area
      ctx.beginPath();
      ctx.moveTo(0, bandTop + bandHeight);
      s.data.forEach((val, i) => {
        const x = (i / (POINTS - 1)) * cw;
        const y = bandTop + bandHeight - ((val - min) / range) * (bandHeight * 0.7) - bandHeight * 0.15;
        if (i === 0) ctx.lineTo(x, y);
        else ctx.lineTo(x, y);
      });
      ctx.lineTo(cw, bandTop + bandHeight);
      ctx.closePath();
      ctx.fillStyle = `${s.color}15`;
      ctx.fill();

      // Line
      ctx.beginPath();
      ctx.strokeStyle = s.color;
      ctx.lineWidth = 1.5;
      s.data.forEach((val, i) => {
        const x = (i / (POINTS - 1)) * cw;
        const y = bandTop + bandHeight - ((val - min) / range) * (bandHeight * 0.7) - bandHeight * 0.15;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      });
      ctx.stroke();

      // Last point dot
      const lastVal = s.data[s.data.length - 1];
      const lastY = bandTop + bandHeight - ((lastVal - min) / range) * (bandHeight * 0.7) - bandHeight * 0.15;
      ctx.beginPath();
      ctx.arc(cw, lastY, 3, 0, Math.PI * 2);
      ctx.fillStyle = s.color;
      ctx.fill();
      ctx.beginPath();
      ctx.arc(cw, lastY, 6, 0, Math.PI * 2);
      ctx.strokeStyle = `${s.color}40`;
      ctx.stroke();
    });
  }, [series]);

  return (
    <section id="analytics" ref={containerRef} className="relative min-h-screen w-full overflow-hidden bg-base-900 py-24">
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
            <Brain className="w-4 h-4 text-oil-400" />
            <span className="label-tag text-oil-300">AI ANALYTICS LAYER</span>
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="font-display text-4xl lg:text-6xl font-bold tracking-tight text-steel-100 max-w-4xl"
          >
            THE TWIN THINKS<br />
            <span className="text-oil-300 text-glow-oil">BEFORE THE WELL STOPS.</span>
          </motion.h2>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Graph panel — 2 cols */}
          <div className="lg:col-span-2">
            <div className="glass-panel rounded-sm relative overflow-hidden">
              <div className="flex items-center justify-between px-5 py-3 border-b border-white/5">
                <div className="flex items-center gap-3">
                  <motion.span
                    className="w-1.5 h-1.5 rounded-full bg-status-green"
                    animate={{ opacity: [0.4, 1, 0.4] }}
                    transition={{ duration: 1, repeat: Infinity }}
                  />
                  <span className="font-mono text-[10px] uppercase tracking-wider text-steel-300">LIVE SENSOR STREAM</span>
                </div>
                <span className="font-mono text-[9px] text-steel-400">6 CHANNELS · {tick}ms</span>
              </div>

              {/* Canvas graph */}
              <div className="relative h-[420px]">
                <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
                {/* Series labels overlay */}
                <div className="absolute left-3 top-2 space-y-1 pointer-events-none">
                  {series.map((s) => (
                    <div key={s.name} className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-sm" style={{ backgroundColor: s.color }} />
                      <span className="font-mono text-[8px] uppercase tracking-wider text-steel-400">{s.name}</span>
                      <span className="font-mono text-[8px]" style={{ color: s.color }}>
                        {s.data[s.data.length - 1].toFixed(1)} {s.unit}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Anomaly panel — 1 col */}
          <div className="space-y-4">
            {/* Status */}
            <div className="glass-panel rounded-sm">
              <div className="px-4 py-3 border-b border-white/5">
                <span className="label-tag">SYSTEM STATUS</span>
              </div>
              <div className="p-4">
                <AnimatePresence mode="wait">
                  {anomalyState === 'normal' && (
                    <motion.div
                      key="normal"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex items-center gap-3"
                    >
                      <div className="w-10 h-10 rounded-sm bg-status-green/10 flex items-center justify-center">
                        <Zap className="w-5 h-5 text-status-green" />
                      </div>
                      <div>
                        <div className="font-display text-base text-status-green">ALL SYSTEMS NORMAL</div>
                        <div className="font-mono text-[10px] text-steel-400">No anomalies detected</div>
                      </div>
                    </motion.div>
                  )}

                  {anomalyState === 'anomaly' && (
                    <motion.div
                      key="anomaly"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                    >
                      <div className="flex items-center gap-3 mb-3">
                        <motion.div
                          className="w-10 h-10 rounded-sm bg-status-amber/10 flex items-center justify-center"
                          animate={{ boxShadow: ['0 0 0px rgba(240,168,48,0)', '0 0 20px rgba(240,168,48,0.3)', '0 0 0px rgba(240,168,48,0)'] }}
                          transition={{ duration: 1.5, repeat: Infinity }}
                        >
                          <AlertTriangle className="w-5 h-5 text-status-amber" />
                        </motion.div>
                        <div>
                          <div className="font-display text-base text-status-amber">ANOMALY DETECTED</div>
                          <div className="font-mono text-[10px] text-steel-400">VIBRATION CHANNEL</div>
                        </div>
                      </div>
                      <p className="text-sm text-steel-300 leading-relaxed">
                        Abnormal vibration pattern detected on pumping unit. Amplitude
                        exceeds baseline by 34%.
                      </p>
                    </motion.div>
                  )}

                  {anomalyState === 'predictive' && (
                    <motion.div
                      key="predictive"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                    >
                      <div className="flex items-center gap-3 mb-3">
                        <motion.div
                          className="w-10 h-10 rounded-sm bg-status-red/10 flex items-center justify-center"
                          animate={{ boxShadow: ['0 0 0px rgba(240,80,90,0)', '0 0 20px rgba(240,80,90,0.4)', '0 0 0px rgba(240,80,90,0)'] }}
                          transition={{ duration: 1.5, repeat: Infinity }}
                        >
                          <TrendingDown className="w-5 h-5 text-status-red" />
                        </motion.div>
                        <div>
                          <div className="font-display text-base text-status-red">PREDICTIVE ALERT</div>
                          <div className="font-mono text-[10px] text-steel-400">AI FORECAST · 72H</div>
                        </div>
                      </div>
                      <p className="text-sm text-steel-300 leading-relaxed mb-3">
                        Potential equipment degradation. Bearing failure probability
                        reaches 78% within 72 hours if current pattern continues.
                      </p>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-mono text-steel-400">FAILURE PROBABILITY</span>
                          <span className="font-mono text-status-red">78%</span>
                        </div>
                        <div className="h-1 bg-base-700 overflow-hidden">
                          <motion.div
                            className="h-full bg-status-red"
                            initial={{ width: '0%' }}
                            animate={{ width: '78%' }}
                            transition={{ duration: 0.8 }}
                          />
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Quick metrics */}
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: 'ANOMALIES TODAY', value: '3', color: '#f0a830' },
                { label: 'PREDICTIONS', value: '12', color: '#2db8b8' },
                { label: 'UPTIME', value: '99.2%', color: '#3dd68c' },
                { label: 'DATA POINTS', value: '1.2M', color: '#c89b2c' },
              ].map((m) => (
                <div key={m.label} className="glass-panel rounded-sm p-3">
                  <div className="label-tag mb-1">{m.label}</div>
                  <div className="font-display text-xl" style={{ color: m.color }}>{m.value}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
