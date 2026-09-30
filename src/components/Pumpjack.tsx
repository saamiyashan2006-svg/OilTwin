import { useRef, useEffect } from 'react';
import { useTwin } from '@/lib/twin-context';

interface PumpjackProps {
  interactive?: boolean;
  className?: string;
}

export default function Pumpjack({ interactive = true, className = '' }: PumpjackProps) {
  const { params, derived } = useTwin();
  const rafRef = useRef<number>(0);
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;

    const beam = svg.querySelector('#pj-beam') as SVGGElement | null;
    const horsehead = svg.querySelector('#pj-horsehead') as SVGGElement | null;
    const rod = svg.querySelector('#pj-rod') as SVGLineElement | null;
    const counterweight = svg.querySelector('#pj-cw') as SVGGElement | null;
    const pitmanL = svg.querySelector('#pj-pitman-l') as SVGLineElement | null;
    const pitmanR = svg.querySelector('#pj-pitman-r') as SVGLineElement | null;
    const surfaceRod = svg.querySelector('#pj-surface-rod') as SVGLineElement | null;

    const pivot = { x: 300, y: 200 };
    const crankCenter = { x: 300, y: 330 };
    const crankRadius = 55;
    const beamLength = 200;
    const pitmanLength = 150;

    let t = 0;
    const baseSpeed = 0.018;
    const speedMul = params.pumpSpeed / 7.2;

    const animate = () => {
      const sp = (params.pumpSpeed / 7.2) * baseSpeed;
      t += sp;
      speedMul;

      const crankAngle = t;
      const crankPinX = crankCenter.x + crankRadius * Math.cos(crankAngle);
      const crankPinY = crankCenter.y + crankRadius * Math.sin(crankAngle);

      // Solve beam angle via pitman constraint
      // beam pivot at (300,200), beam endpoint at pivot + beamLength*(cos,sin)
      // pitman connects crank pin to beam endpoint, length = pitmanLength
      const dx = crankPinX - pivot.x;
      const dy = crankPinY - pivot.y;
      const d = Math.sqrt(dx * dx + dy * dy);
      // angle from pivot to crank pin
      const phi = Math.atan2(dy, dx);
      // law of cosines: find beam angle
      const a = beamLength;
      const b = pitmanLength;
      const c = d;
      const cosBeta = (a * a + c * c - b * b) / (2 * a * c);
      const beta = Math.acos(Math.max(-1, Math.min(1, cosBeta)));
      const beamAngle = phi - beta; // beam points toward upper area

      const beamEndX = pivot.x + beamLength * Math.cos(beamAngle);
      const beamEndY = pivot.y + beamLength * Math.sin(beamAngle);

      // Horsehead is at beam end, rotates with beam
      const beamDeg = (beamAngle * 180) / Math.PI;
      if (beam) beam.setAttribute('transform', `rotate(${beamDeg} ${pivot.x} ${pivot.y})`);
      if (horsehead) horsehead.setAttribute('transform', `rotate(${beamDeg} ${pivot.x} ${pivot.y})`);

      // Pitman lines from crank pin to beam end
      if (pitmanL)
        pitmanL.setAttribute('points', `${crankPinX - 6},${crankPinY} ${beamEndX},${beamEndY}`);
      if (pitmanR)
        pitmanR.setAttribute('points', `${crankPinX + 6},${crankPinY} ${beamEndX},${beamEndY}`);

      // Surface rod (polished rod) — vertical, moves up/down with horsehead
      const horseX = beamEndX + 40 * Math.cos(beamAngle + Math.PI / 2);
      const horseY = beamEndY + 40 * Math.sin(beamAngle + Math.PI / 2);
      const rodTopY = horseY + 20;
      if (surfaceRod) surfaceRod.setAttribute('y1', `${rodTopY}`);

      // Counterweight on crank (opposite side)
      const cwAngle = crankAngle + Math.PI;
      const cwX = crankCenter.x + 35 * Math.cos(cwAngle);
      const cwY = crankCenter.y + 35 * Math.sin(cwAngle);
      if (counterweight) counterweight.setAttribute('transform', `translate(${cwX - 300} ${cwY - 330})`);

      // Rod line from horsehead down to wellhead
      if (rod) {
        rod.setAttribute('x1', `${horseX}`);
        rod.setAttribute('y1', `${horseY + 30}`);
      }

      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafRef.current);
  }, [params.pumpSpeed]);

  const healthColor =
    derived.equipmentHealth > 95 ? '#3dd68c' : derived.equipmentHealth > 85 ? '#f0a830' : '#f0505a';

  return (
    <div className={`relative ${className}`}>
      <svg
        ref={svgRef}
        viewBox="0 0 600 700"
        className="w-full h-full"
        style={{ filter: 'drop-shadow(0 0 20px rgba(200,155,44,0.15))' }}
      >
        <defs>
          <linearGradient id="metalGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#3a4356" />
            <stop offset="50%" stopColor="#1e232e" />
            <stop offset="100%" stopColor="#0f1218" />
          </linearGradient>
          <linearGradient id="metalGradLight" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#4a5468" />
            <stop offset="100%" stopColor="#2a3040" />
          </linearGradient>
          <radialGradient id="glowAmber" cx="0.5" cy="0.5" r="0.5">
            <stop offset="0%" stopColor="rgba(200,155,44,0.5)" />
            <stop offset="100%" stopColor="rgba(200,155,44,0)" />
          </radialGradient>
          <filter id="blur1"><feGaussianBlur stdDeviation="3" /></filter>
        </defs>

        {/* Ground line */}
        <line x1="0" y1="480" x2="600" y2="480" stroke="#2a3040" strokeWidth="1" strokeDasharray="4 8" opacity="0.5" />

        {/* Base / skid frame */}
        <rect x="200" y="460" width="280" height="20" fill="url(#metalGrad)" stroke="#3a4356" strokeWidth="1" />
        <rect x="210" y="455" width="260" height="6" fill="#2a3040" />

        {/* Samson post (A-frame) */}
        <polygon points="300,160 270,455 290,455 300,200" fill="url(#metalGrad)" stroke="#3a4356" strokeWidth="1" />
        <polygon points="300,160 330,455 310,455 300,200" fill="url(#metalGrad)" stroke="#3a4356" strokeWidth="1" />

        {/* Beam */}
        <g id="pj-beam" style={{ transformOrigin: '300px 200px' }}>
          <rect x="120" y="194" width="210" height="12" rx="2" fill="url(#metalGradLight)" stroke="#4a5468" strokeWidth="1" />
          {/* Highlight line */}
          <line x1="125" y1="197" x2="325" y2="197" stroke="rgba(200,155,44,0.2)" strokeWidth="1" />
        </g>

        {/* Horsehead */}
        <g id="pj-horsehead" style={{ transformOrigin: '300px 200px' }}>
          <path
            d="M 120 195 Q 95 175 90 205 Q 88 225 100 235 L 115 230 L 130 210 Z"
            fill="url(#metalGrad)"
            stroke="#4a5468"
            strokeWidth="1"
          />
          {/* Bridle */}
          <line x1="100" y1="230" x2="100" y2="430" stroke="#6b7689" strokeWidth="2" opacity="0.8" />
        </g>

        {/* Crank (rotating disc) */}
        <circle cx="300" cy="330" r="65" fill="none" stroke="#2a3040" strokeWidth="2" opacity="0.4" />
        <circle cx="300" cy="330" r="55" fill="url(#metalGrad)" stroke="#3a4356" strokeWidth="1.5" />
        <circle cx="300" cy="330" r="8" fill="#1e232e" stroke="#4a5468" strokeWidth="1" />

        {/* Counterweight */}
        <g id="pj-cw">
          <rect x="-18" y="-12" width="36" height="24" rx="3" fill="#161a23" stroke="#3a4356" strokeWidth="1" />
          <circle cx="0" cy="0" r="4" fill="#2a3040" />
        </g>

        {/* Pitman arms (connecting rods) */}
        <line id="pj-pitman-l" stroke="#4a5468" strokeWidth="4" strokeLinecap="round" />
        <line id="pj-pitman-r" stroke="#3a4356" strokeWidth="4" strokeLinecap="round" />

        {/* Surface polished rod */}
        <line id="pj-surface-rod" x1="100" y1="430" x2="100" y2="480" stroke="#6b7689" strokeWidth="3" />
        {/* Wellhead */}
        <rect x="88" y="470" width="24" height="16" fill="#2a3040" stroke="#3a4356" strokeWidth="1" />
        <rect x="82" y="466" width="36" height="6" fill="#1e232e" />

        {/* String rod going underground */}
        <line id="pj-rod" x1="100" y1="480" x2="100" y2="690" stroke="#4a5468" strokeWidth="2" opacity="0.4" strokeDasharray="6 4" />

        {/* Glow at pivot */}
        <circle cx="300" cy="200" r="15" fill="url(#glowAmber)" />
        <circle cx="300" cy="200" r="4" fill={healthColor} opacity="0.8">
          <animate attributeName="opacity" values="0.4;0.9;0.4" dur="2s" repeatCount="indefinite" />
        </circle>
        {/* Glow at crank pin */}
        <circle cx="300" cy="330" r="12" fill="url(#glowAmber)" opacity="0.5" />

        {/* Scan line overlay on hover */}
        {interactive && (
          <rect className="animate-scan" x="60" y="150" width="340" height="350" fill="none" stroke="rgba(45,184,184,0.15)" strokeWidth="1" />
        )}
      </svg>
    </div>
  );
}
