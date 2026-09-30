import { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function Underground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let w = (canvas.width = canvas.offsetWidth);
    let h = (canvas.height = canvas.offsetHeight);

    // Oil particles flowing toward wellbore (center top)
    const particles = Array.from({ length: 80 }, () => ({
      x: Math.random() * w,
      y: h * 0.3 + Math.random() * h * 0.7,
      angle: 0,
      speed: 0.3 + Math.random() * 0.8,
      size: 1 + Math.random() * 2,
      alpha: 0.2 + Math.random() * 0.5,
    }));

    let raf = 0;
    const animate = () => {
      ctx.clearRect(0, 0, w, h);
      const wellX = w * 0.5;

      particles.forEach((p) => {
        // Move toward wellbore (up and toward center)
        const dx = wellX - p.x;
        const dy = h * 0.25 - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 30) {
          // Reset to bottom edges
          p.x = Math.random() * w;
          p.y = h * 0.4 + Math.random() * h * 0.6;
          p.alpha = 0.2 + Math.random() * 0.5;
        } else {
          p.x += (dx / dist) * p.speed;
          p.y += (dy / dist) * p.speed;
        }
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(200, 155, 44, ${p.alpha})`;
        ctx.fill();
      });

      raf = requestAnimationFrame(animate);
    };
    animate();

    const onResize = () => {
      w = canvas.width = canvas.offsetWidth;
      h = canvas.height = canvas.offsetHeight;
    };
    window.addEventListener('resize', onResize);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', onResize);
    };
  }, []);

  const layers = [
    { name: 'SURFACE', depth: '0 — 50 ft', color: '#1a1e26', y: '8%' },
    { name: 'WELL CASING', depth: '50 — 1,200 ft', color: '#1e232e', y: '16%' },
    { name: 'PRODUCTION TUBING', depth: '1,200 — 4,800 ft', color: '#161a23', y: '30%' },
    { name: 'RESERVOIR ROCK', depth: '4,800 — 6,200 ft', color: '#1c1410', y: '52%' },
    { name: 'OIL ZONE', depth: '6,200 — 8,000 ft', color: '#241a08', y: '72%' },
  ];

  return (
    <section id="twin" className="relative min-h-screen w-full overflow-hidden bg-base-black py-24">
      <div className="absolute inset-0 grid-bg opacity-20" />
      <div
        className="absolute inset-0"
        style={{ background: 'radial-gradient(ellipse at 50% 70%, rgba(200,155,44,0.08) 0%, transparent 60%)' }}
      />

      {/* Section header */}
      <div className="relative z-10 max-w-[1600px] mx-auto px-6 lg:px-10 mb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex items-center gap-3 mb-4"
        >
          <span className="w-8 h-px bg-oil-400" />
          <span className="label-tag text-oil-300">SUBSURFACE DIGITAL MODEL</span>
        </motion.div>
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="font-display text-4xl lg:text-6xl font-bold tracking-tight text-steel-100 max-w-3xl"
        >
          DESCEND INTO THE<br />
          <span className="text-oil-300 text-glow-oil">RESERVOIR.</span>
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="mt-4 text-steel-400 text-sm max-w-lg"
        >
          A digital geological simulation extends beneath every well — modeling casing,
          tubing, reservoir rock and oil migration in real time.
        </motion.p>
      </div>

      {/* Underground cutaway visualization */}
      <div className="relative z-10 max-w-[1200px] mx-auto px-6">
        <div className="relative h-[600px] rounded-sm overflow-hidden border border-white/5">
          {/* Layered geological strata */}
          <div className="absolute inset-0">
            {layers.map((layer, i) => (
              <motion.div
                key={layer.name}
                initial={{ opacity: 0, scaleX: 0.8 }}
                whileInView={{ opacity: 1, scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15, duration: 0.5 }}
                className="absolute left-0 right-0 border-t border-white/5"
                style={{
                  top: layer.y,
                  height: i < layers.length - 1 ? layers[i + 1].y : '100%',
                  backgroundColor: layer.color,
                }}
              >
                {/* Rock texture */}
                <div
                  className="absolute inset-0 opacity-30"
                  style={{
                    backgroundImage: `repeating-linear-gradient(${45 + i * 15}deg, transparent, transparent 20px, rgba(255,255,255,0.02) 20px, rgba(255,255,255,0.02) 21px)`,
                  }}
                />
                {/* Label */}
                <div className="absolute left-4 top-3 flex flex-col">
                  <span className="font-mono text-[10px] uppercase tracking-wider text-steel-300">{layer.name}</span>
                  <span className="font-mono text-[9px] text-steel-400">{layer.depth}</span>
                </div>
                {/* Depth indicator on right */}
                <div className="absolute right-4 top-3 font-mono text-[9px] text-oil-400/50">
                  {String(i + 1).padStart(2, '0')}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Oil flow particles canvas */}
          <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />

          {/* Wellbore — vertical structure in center */}
          <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-12">
            {/* Casing (outer) */}
            <div className="absolute inset-y-0 left-0 right-0 border-x-2 border-steel-500/30" />
            {/* Tubing (inner) */}
            <div className="absolute inset-y-0 left-2 right-2 border-x border-oil-400/30" />
            {/* Cement annulus */}
            <div className="absolute inset-y-0 left-0 w-2 bg-steel-500/10" />
            <div className="absolute inset-y-0 right-0 w-2 bg-steel-500/10" />

            {/* Flowing oil animation inside tubing */}
            <div className="absolute inset-y-0 left-4 right-4 overflow-hidden">
              {[0, 1, 2, 3, 4].map((i) => (
                <motion.div
                  key={i}
                  className="absolute left-0 right-0 h-12"
                  style={{
                    background: 'linear-gradient(to bottom, transparent, rgba(200,155,44,0.3), transparent)',
                  }}
                  animate={{ y: ['100%', '-20%'] }}
                  transition={{
                    duration: 3 + i * 0.5,
                    repeat: Infinity,
                    delay: i * 0.6,
                    ease: 'linear',
                  }}
                />
              ))}
            </div>
          </div>

          {/* Pressure zone indicators */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.8 }}
            className="absolute left-[20%] top-[58%] flex items-center gap-2"
          >
            <motion.div
              className="w-32 h-32 rounded-full border border-oil-400/20"
              animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.5, 0.3] }}
              transition={{ duration: 3, repeat: Infinity }}
            />
            <span className="font-mono text-[9px] uppercase tracking-wider text-oil-400">PRESSURE ZONE</span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 1.0 }}
            className="absolute right-[18%] top-[65%] flex items-center gap-2"
          >
            <motion.div
              className="w-24 h-24 rounded-full border border-accent-400/20"
              animate={{ scale: [1, 1.15, 1], opacity: [0.2, 0.4, 0.2] }}
              transition={{ duration: 3, repeat: Infinity, delay: 1 }}
            />
            <span className="font-mono text-[9px] uppercase tracking-wider text-accent-400">OIL FLOW</span>
          </motion.div>

          {/* Reservoir label */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 1.2 }}
            className="absolute right-6 top-[50%] flex flex-col gap-1"
          >
            <span className="font-mono text-[10px] uppercase tracking-wider text-oil-300">RESERVOIR</span>
            <div className="w-20 h-px bg-oil-400/40" />
            <span className="font-mono text-[9px] text-steel-400">6,200 ft</span>
          </motion.div>

          {/* Wellbore label */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 1.4 }}
            className="absolute left-[calc(50%+2rem)] top-[20%] flex flex-col gap-1"
          >
            <span className="font-mono text-[10px] uppercase tracking-wider text-steel-200">WELLBORE</span>
            <div className="w-16 h-px bg-steel-300/40" />
          </motion.div>

          {/* Surface indicator */}
          <div className="absolute top-0 left-0 right-0 flex items-center gap-2 px-4 py-2 border-b border-white/10 bg-base-900/50">
            <motion.span
              className="w-1.5 h-1.5 rounded-full bg-status-green"
              animate={{ opacity: [0.4, 1, 0.4] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <span className="font-mono text-[9px] uppercase tracking-wider text-steel-300">SURFACE LEVEL</span>
            <span className="ml-auto font-mono text-[9px] text-oil-400">DEPTH SCAN: ACTIVE</span>
          </div>
        </div>
      </div>
    </section>
  );
}
