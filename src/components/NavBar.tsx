import { useEffect, useState } from 'react';
import { motion, useScroll, useMotionValueEvent } from 'framer-motion';

const NAV_ITEMS = [
  { label: 'OVERVIEW', href: '#hero' },
  { label: 'DIGITAL TWIN', href: '#twin' },
  { label: 'LIVE FIELD', href: '#field' },
  { label: 'AI ANALYTICS', href: '#analytics' },
  { label: 'SIMULATION', href: '#simulator' },
  { label: 'IMPACT', href: '#impact' },
];

export default function NavBar() {
  const [scrolled, setScrolled] = useState(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, 'change', (y) => {
    setScrolled(y > 60);
  });

  return (
    <motion.nav
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.3, duration: 0.6 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled ? 'bg-base-black/80 backdrop-blur-md border-b border-white/5' : 'bg-transparent'
      }`}
    >
      <div className="max-w-[1600px] mx-auto px-6 lg:px-10 h-16 flex items-center justify-between">
        {/* Logo */}
        <a href="#hero" className="flex items-center gap-2.5 group">
          <div className="relative w-7 h-7">
            <div className="absolute inset-0 border border-oil-400/50 rounded-sm rotate-45 group-hover:rotate-[135deg] transition-transform duration-700" />
            <div className="absolute inset-1.5 bg-oil-400/20 rounded-sm rotate-45" />
          </div>
          <span className="font-display font-bold text-sm tracking-[0.2em] text-steel-100">
            OIL<span className="text-oil-400"> TWIN</span>
          </span>
        </a>

        {/* Nav items */}
        <div className="hidden lg:flex items-center gap-1">
          {NAV_ITEMS.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.15em] text-steel-400 hover:text-oil-300 transition-colors duration-300 relative group"
            >
              {item.label}
              <span className="absolute bottom-0 left-1/2 w-0 h-px bg-oil-400 group-hover:w-full group-hover:left-0 transition-all duration-300" />
            </a>
          ))}
        </div>

        {/* Live indicator */}
        <div className="flex items-center gap-2 glass-panel px-3 py-1.5 rounded-sm">
          <motion.span
            className="w-1.5 h-1.5 rounded-full bg-status-green"
            animate={{ opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
          <span className="font-mono text-[9px] uppercase tracking-wider text-steel-300">LIVE SYSTEM</span>
        </div>
      </div>
    </motion.nav>
  );
}
