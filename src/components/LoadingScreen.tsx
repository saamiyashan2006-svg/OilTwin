import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const SYSTEMS = [
  'SENSOR NETWORK',
  'WELL MODEL',
  'AI ENGINE',
  'PREDICTION ENGINE',
  'DIGITAL TWIN',
];

export default function LoadingScreen({ onComplete }: { onComplete: () => void }) {
  const [progress, setProgress] = useState(0);
  const [activeSystem, setActiveSystem] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((p) => {
        const next = p + 100 / (SYSTEMS.length * 14);
        const idx = Math.min(SYSTEMS.length - 1, Math.floor((next / 100) * SYSTEMS.length));
        setActiveSystem(idx);
        if (next >= 100) {
          clearInterval(interval);
          setDone(true);
          setTimeout(onComplete, 900);
          return 100;
        }
        return next;
      });
    }, 50);
    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-base-black"
          exit={{ opacity: 0, transition: { duration: 0.8 } }}
        >
          <div className="absolute inset-0 grid-bg opacity-20" />
          <div className="absolute inset-0 bg-gradient-radial from-base-800/40 via-transparent to-transparent" 
               style={{ background: 'radial-gradient(ellipse at center, rgba(15,18,24,0.6) 0%, transparent 70%)' }} />

          <div className="relative z-10 flex flex-col items-center w-full max-w-md px-8">
            {/* Logo */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="mb-2"
            >
              <h1 className="font-display text-5xl font-bold tracking-[0.15em] text-steel-100 text-glow-oil">
                OIL TWIN
              </h1>
            </motion.div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="label-tag mb-12"
            >
              INITIALIZING DIGITAL FIELD
            </motion.p>

            {/* Progress bar */}
            <div className="w-full mb-8">
              <div className="flex justify-between mb-2">
                <span className="font-mono text-[10px] text-steel-400">{Math.round(progress)}%</span>
                <span className="font-mono text-[10px] text-oil-400">CONNECTING</span>
              </div>
              <div className="h-[2px] w-full bg-base-700 overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-oil-500 to-oil-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            {/* Systems list */}
            <div className="w-full space-y-2">
              {SYSTEMS.map((sys, i) => (
                <motion.div
                  key={sys}
                  className="flex items-center gap-3 font-mono text-[11px] uppercase tracking-wider"
                  initial={{ opacity: 0.2 }}
                  animate={{
                    opacity: i <= activeSystem ? 1 : 0.2,
                    color: i < activeSystem ? '#3dd68c' : i === activeSystem ? '#e0b848' : '#3a4356',
                  }}
                >
                  <span style={{ color: i < activeSystem ? '#3dd68c' : i === activeSystem ? '#e0b848' : '#3a4356' }}>
                    {i < activeSystem ? '✓' : i === activeSystem ? '◉' : '○'}
                  </span>
                  <span>{sys}</span>
                  {i === activeSystem && (
                    <motion.span
                      className="ml-auto"
                      animate={{ opacity: [0.3, 1, 0.3] }}
                      transition={{ duration: 1, repeat: Infinity }}
                    >
                      ...
                    </motion.span>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
