import { motion } from 'framer-motion';
import { type ReactNode } from 'react';

interface HudPanelProps {
  title: string;
  status?: string;
  statusColor?: string;
  children: ReactNode;
  className?: string;
  delay?: number;
  accent?: string;
}

export default function HudPanel({
  title,
  status,
  statusColor = '#3dd68c',
  children,
  className = '',
  delay = 0,
  accent = '#c89b2c',
}: HudPanelProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ delay, duration: 0.5, ease: 'easeOut' }}
      className={`glass-panel rounded-sm relative ${className}`}
      style={{ boxShadow: `0 0 30px rgba(0,0,0,0.5), inset 0 0 20px rgba(${accent === '#c89b2c' ? '200,155,44' : '45,184,184'},0.05)` }}
    >
      {/* Corner accents */}
      <span className="absolute top-0 left-0 w-2 h-2 border-t border-l" style={{ borderColor: accent, opacity: 0.6 }} />
      <span className="absolute top-0 right-0 w-2 h-2 border-t border-r" style={{ borderColor: accent, opacity: 0.6 }} />
      <span className="absolute bottom-0 left-0 w-2 h-2 border-b border-l" style={{ borderColor: accent, opacity: 0.6 }} />
      <span className="absolute bottom-0 right-0 w-2 h-2 border-b border-r" style={{ borderColor: accent, opacity: 0.6 }} />

      <div className="flex items-center justify-between px-3 py-2 border-b border-white/5">
        <span className="label-tag">{title}</span>
        {status && (
          <div className="flex items-center gap-1.5">
            <motion.span
              className="w-1.5 h-1.5 rounded-full"
              style={{ backgroundColor: statusColor }}
              animate={{ opacity: [0.4, 1, 0.4] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <span className="font-mono text-[9px] uppercase tracking-wider" style={{ color: statusColor }}>
              {status}
            </span>
          </div>
        )}
      </div>
      <div className="px-3 py-2.5">{children}</div>
    </motion.div>
  );
}
