import { motion } from 'framer-motion';
import { TrendingUp, Clock, ShieldCheck, Eye, ArrowUpRight, Cpu } from 'lucide-react';

const IMPACTS = [
  {
    icon: TrendingUp,
    label: 'PRODUCTION OPTIMIZATION',
    value: '+18.4%',
    description: 'Average production increase across digital twin monitored wells through real-time parameter tuning.',
    color: '#c89b2c',
  },
  {
    icon: Clock,
    label: 'REDUCED DOWNTIME',
    value: '−42%',
    description: 'Unplanned downtime reduction via predictive maintenance alerts issued before equipment failure.',
    color: '#3dd68c',
  },
  {
    icon: ShieldCheck,
    label: 'PREDICTIVE MAINTENANCE',
    value: '72h',
    description: 'Average lead time for degradation warnings — enabling scheduled intervention instead of reactive repair.',
    color: '#2db8b8',
  },
  {
    icon: Eye,
    label: 'OPERATIONAL VISIBILITY',
    value: '100%',
    description: 'Complete surface and subsurface visibility across all assets, from reservoir to surface facilities.',
    color: '#e0b848',
  },
];

export default function Impact() {
  return (
    <section id="impact" className="relative min-h-screen w-full overflow-hidden bg-base-black py-24">
      <div className="absolute inset-0 grid-bg opacity-20" />
      <div
        className="absolute inset-0"
        style={{ background: 'radial-gradient(ellipse at 50% 50%, rgba(200,155,44,0.06) 0%, transparent 60%)' }}
      />

      <div className="relative z-10 max-w-[1600px] mx-auto px-6 lg:px-10">
        {/* Header */}
        <div className="mb-16 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex items-center justify-center gap-3 mb-4"
          >
            <span className="w-8 h-px bg-oil-400" />
            <span className="label-tag text-oil-300">REAL-WORLD IMPACT</span>
            <span className="w-8 h-px bg-oil-400" />
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="font-display text-4xl lg:text-6xl font-bold tracking-tight text-steel-100"
          >
            THE NUMBERS<br />
            <span className="text-oil-300 text-glow-oil">SPEAK FOR THEMSELVES.</span>
          </motion.h2>
        </div>

        {/* Impact grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
          {IMPACTS.map((item, i) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15, duration: 0.6 }}
                className="glass-panel rounded-sm p-6 relative group hover:border-oil-400/30 transition-colors duration-500"
              >
                {/* Corner accent */}
                <span className="absolute top-0 left-0 w-3 h-3 border-t border-l border-oil-400/40" />

                <div
                  className="w-12 h-12 rounded-sm flex items-center justify-center mb-4 transition-transform group-hover:scale-110"
                  style={{ backgroundColor: `${item.color}15` }}
                >
                  <Icon className="w-6 h-6" style={{ color: item.color }} />
                </div>

                <div className="font-display text-4xl font-bold mb-2" style={{ color: item.color }}>
                  {item.value}
                </div>
                <div className="label-tag mb-3">{item.label}</div>
                <p className="text-sm text-steel-400 leading-relaxed">{item.description}</p>

                {/* Hover arrow */}
                <ArrowUpRight className="absolute top-6 right-6 w-4 h-4 text-steel-500 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 group-hover:-translate-y-1 transition-all duration-300" />
              </motion.div>
            );
          })}
        </div>

        {/* CTA block */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="glass-panel rounded-sm p-10 lg:p-16 text-center relative overflow-hidden"
        >
          <div className="absolute inset-0 grid-bg opacity-30" />
          <div
            className="absolute inset-0"
            style={{ background: 'radial-gradient(ellipse at center, rgba(200,155,44,0.08) 0%, transparent 70%)' }}
          />

          <div className="relative z-10">
            <Cpu className="w-8 h-8 text-oil-400 mx-auto mb-6" />
            <h3 className="font-display text-3xl lg:text-5xl font-bold text-steel-100 mb-4">
              YOUR FIELD IS READY<br />
              <span className="text-oil-300 text-glow-oil">FOR ITS DIGITAL TWIN.</span>
            </h3>
            <p className="text-steel-400 text-sm max-w-xl mx-auto mb-8">
              Connect sensors, ingest live data, and deploy predictive intelligence across
              your entire oilfield operation.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <button className="group relative px-8 py-4 bg-oil-400 text-base-black font-display font-semibold text-sm uppercase tracking-wider overflow-hidden transition-all duration-300 hover:shadow-[0_0_30px_rgba(200,155,44,0.4)]">
                <span className="relative z-10">Request Deployment</span>
              </button>
              <button className="px-8 py-4 border border-steel-400/30 text-steel-200 font-display font-semibold text-sm uppercase tracking-wider hover:border-oil-400/60 hover:text-oil-300 transition-all duration-300">
                View Documentation
              </button>
            </div>
          </div>
        </motion.div>

        {/* Footer */}
        <div className="mt-20 pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="relative w-6 h-6">
              <div className="absolute inset-0 border border-oil-400/50 rounded-sm rotate-45" />
            </div>
            <span className="font-display font-bold text-sm tracking-[0.2em] text-steel-200">
              OIL<span className="text-oil-400"> TWIN</span>
            </span>
          </div>
          <span className="font-mono text-[9px] uppercase tracking-wider text-steel-500">
            AI-POWERED DIGITAL OILFIELD PLATFORM · SIMULATED DEMO DATA
          </span>
        </div>
      </div>
    </section>
  );
}
