import { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Activity, Gauge, Thermometer, Droplet, AlertTriangle, TrendingUp } from 'lucide-react';
import Pumpjack from './Pumpjack';
import ParticleField from './ParticleField';
import HudPanel from './HudPanel';
import AnimatedNumber from './AnimatedNumber';
import { useTwin } from '@/lib/twin-context';

export default function Hero() {
  const { derived, params } = useTwin();
  const sectionRef = useRef<HTMLElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (!sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      setMousePos({ x, y });
    };
    window.addEventListener('mousemove', handler);
    return () => window.removeEventListener('mousemove', handler);
  }, []);

  const parallaxStyle = (depth: number) => ({
    transform: `translate3d(${mousePos.x * depth}px, ${mousePos.y * depth}px, 0)`,
  });

  return (
    <section
      ref={sectionRef}
      id="hero"
      className="relative min-h-screen w-full overflow-hidden bg-base-black"
    >
      {/* Layered backgrounds */}
      <div className="absolute inset-0 grid-bg opacity-30" style={parallaxStyle(8)} />
      <div className="absolute inset-0 blueprint-bg opacity-40" style={parallaxStyle(4)} />
      <div
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse at 70% 40%, rgba(200,155,44,0.06) 0%, transparent 50%), radial-gradient(ellipse at 20% 80%, rgba(45,184,184,0.04) 0%, transparent 50%)',
        }}
      />
      <ParticleField density={50} className="absolute inset-0" color="rgba(200,155,44,0.35)" />

      {/* Fog overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-base-black/40 via-transparent to-base-black/80" />

      {/* Data flow lines — decorative SVG */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none" preserveAspectRatio="none">
        <defs>
          <linearGradient id="flowLine" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="rgba(200,155,44,0)" />
            <stop offset="50%" stopColor="rgba(200,155,44,0.3)" />
            <stop offset="100%" stopColor="rgba(200,155,44,0)" />
          </linearGradient>
        </defs>
        <motion.path
          d="M 10% 60% Q 35% 50%, 50% 55% T 90% 45%"
          fill="none"
          stroke="url(#flowLine)"
          strokeWidth="1"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 0.6 }}
          transition={{ duration: 2, delay: 1 }}
        />
        <motion.path
          d="M 15% 70% Q 40% 65%, 55% 60% T 85% 50%"
          fill="none"
          stroke="url(#flowLine)"
          strokeWidth="0.5"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 0.4 }}
          transition={{ duration: 2.5, delay: 1.5 }}
        />
      </svg>

      {/* Hero content */}
      <div className="relative z-10 max-w-[1600px] mx-auto px-6 lg:px-10 pt-32 pb-20 min-h-screen flex flex-col lg:flex-row items-center">
        {/* Left — text */}
        <div className="flex-1 max-w-xl lg:pr-8" style={parallaxStyle(6)}>
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="flex items-center gap-3 mb-6"
          >
            <span className="w-8 h-px bg-oil-400" />
            <span className="label-tag text-oil-300">AI-POWERED DIGITAL OILFIELD</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.7 }}
            className="font-display text-5xl lg:text-7xl font-bold leading-[1.05] tracking-tight text-steel-100"
          >
            THE OIL FIELD,<br />
            <span className="text-oil-300 text-glow-oil">DIGITALLY</span> ALIVE.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.6 }}
            className="mt-6 font-display text-xl text-steel-300 tracking-wide"
          >
            Monitor. Simulate. Predict. Optimize.
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.0, duration: 0.6 }}
            className="mt-4 text-sm text-steel-400 leading-relaxed max-w-md"
          >
            Oil Twin creates a live digital representation of oil-field operations to
            monitor assets, detect anomalies and support predictive decisions.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2, duration: 0.6 }}
            className="mt-10 flex flex-wrap gap-4"
          >
            <a
              href="#twin"
              className="group relative px-7 py-3.5 bg-oil-400 text-base-black font-display font-semibold text-sm uppercase tracking-wider overflow-hidden transition-all duration-300 hover:bg-oil-300 hover:shadow-[0_0_30px_rgba(200,155,44,0.4)]"
            >
              <span className="relative z-10">Explore Digital Twin</span>
              <span className="absolute inset-0 bg-oil-300 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
            </a>
            <a
              href="#simulator"
              className="group relative px-7 py-3.5 border border-steel-400/30 text-steel-200 font-display font-semibold text-sm uppercase tracking-wider overflow-hidden transition-all duration-300 hover:border-oil-400/60 hover:text-oil-300"
            >
              <span className="relative z-10">Launch Simulation</span>
              <span className="absolute inset-0 bg-oil-400/5 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
            </a>
          </motion.div>
        </div>

        {/* Right — pumpjack + HUD */}
        <div className="flex-1 relative w-full h-[600px] lg:h-[700px]" style={parallaxStyle(-10)}>
          {/* Pumpjack */}
          <div
            className="absolute inset-0 flex items-center justify-center"
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
          >
            <div className="relative w-full max-w-[500px] h-full" style={parallaxStyle(-5)}>
              <Pumpjack />

              {/* Component labels on hover */}
              {hovered && (
                <>
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="absolute top-[22%] right-[8%] glass-panel px-3 py-2 rounded-sm"
                  >
                    <div className="label-tag mb-1">PUMPING UNIT</div>
                    <div className="font-mono text-xs text-steel-100">Stroke: 42 in</div>
                    <div className="font-mono text-xs text-steel-100">Speed: {params.pumpSpeed.toFixed(1)} SPM</div>
                    <div className="font-mono text-xs" style={{ color: derived.riskColor }}>
                      Health: {derived.equipmentHealth.toFixed(1)}%
                    </div>
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="absolute top-[45%] left-[2%] glass-panel px-3 py-2 rounded-sm"
                  >
                    <div className="label-tag mb-1">CRANK ASSEMBLY</div>
                    <div className="font-mono text-xs text-steel-100">RPM: {(params.pumpSpeed * 0.42).toFixed(2)}</div>
                  </motion.div>
                </>
              )}
            </div>
          </div>

          {/* Floating HUD panels */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1.3, duration: 0.6 }}
            className="absolute top-[8%] right-[2%] w-48"
          >
            <HudPanel title="WELL STATUS" status="ONLINE" delay={1.3}>
              <div className="flex items-center gap-2">
                <Droplet className="w-3.5 h-3.5 text-oil-400" />
                <span className="font-display text-lg text-steel-100">
                  <AnimatedNumber value={derived.production} suffix=" BPD" />
                </span>
              </div>
            </HudPanel>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1.5, duration: 0.6 }}
            className="absolute top-[30%] left-[0%] w-44"
          >
            <HudPanel title="EQUIPMENT HEALTH" status="OPTIMAL" statusColor={derived.riskColor} delay={1.5} accent="#2db8b8">
              <div className="font-display text-2xl" style={{ color: derived.riskColor }}>
                <AnimatedNumber value={derived.equipmentHealth} decimals={1} suffix="%" />
              </div>
            </HudPanel>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1.7, duration: 0.6 }}
            className="absolute top-[55%] right-[4%] w-44"
          >
            <HudPanel title="PRESSURE" delay={1.7}>
              <div className="flex items-end gap-2">
                <span className="font-display text-lg text-steel-100">
                  <AnimatedNumber value={params.pressure} suffix=" PSI" />
                </span>
              </div>
              <div className="flex items-center gap-1 mt-1">
                <TrendingUp className="w-3 h-3 text-status-green" />
                <span className="font-mono text-[10px] text-status-green">+2.4%</span>
              </div>
            </HudPanel>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1.9, duration: 0.6 }}
            className="absolute bottom-[12%] left-[3%] w-44"
          >
            <HudPanel title="ANOMALY ENGINE" status={derived.anomalyRisk} statusColor={derived.riskColor} delay={1.9} accent="#2db8b8">
              <div className="flex items-center gap-2">
                <Activity className="w-3.5 h-3.5" style={{ color: derived.riskColor }} />
                <span className="font-mono text-xs" style={{ color: derived.riskColor }}>
                  RISK: {derived.anomalyRisk}
                </span>
              </div>
            </HudPanel>
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.5 }}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <span className="label-tag">SCROLL TO DESCEND</span>
        <motion.div
          className="w-px h-10 bg-gradient-to-b from-oil-400 to-transparent"
          animate={{ scaleY: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      </motion.div>
    </section>
  );
}
