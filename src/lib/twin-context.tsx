import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';

export interface TwinParams {
  pumpSpeed: number;
  pressure: number;
  flowRate: number;
  temperature: number;
  reservoirPressure: number;
}

export interface TwinDerived {
  strokeRate: number;
  production: number;
  equipmentHealth: number;
  anomalyRisk: 'LOW' | 'MODERATE' | 'HIGH';
  riskColor: string;
}

interface TwinContextValue {
  params: TwinParams;
  derived: TwinDerived;
  setParam: (key: keyof TwinParams, value: number) => void;
  setParams: (p: Partial<TwinParams>) => void;
}

const TwinContext = createContext<TwinContextValue | null>(null);

function computeDerived(p: TwinParams): TwinDerived {
  const strokeRate = p.pumpSpeed * 1.1;
  const production = Math.round(p.flowRate * 11.5 * (p.pressure / 2800));
  const stress =
    Math.abs(p.pressure - 2800) / 2800 +
    Math.abs(p.temperature - 72) / 72 +
    Math.abs(p.pumpSpeed - 7) / 10 +
    Math.abs(p.reservoirPressure - 3200) / 3200;
  const equipmentHealth = Math.max(72, Math.min(99.5, 99 - stress * 12));
  let anomalyRisk: TwinDerived['anomalyRisk'] = 'LOW';
  let riskColor = '#3dd68c';
  if (stress > 0.45) {
    anomalyRisk = 'MODERATE';
    riskColor = '#f0a830';
  }
  if (stress > 0.75) {
    anomalyRisk = 'HIGH';
    riskColor = '#f0505a';
  }
  return { strokeRate, production, equipmentHealth, anomalyRisk, riskColor };
}

export function TwinProvider({ children }: { children: ReactNode }) {
  const [params, setParamsState] = useState<TwinParams>({
    pumpSpeed: 7.2,
    pressure: 2840,
    flowRate: 73,
    temperature: 72,
    reservoirPressure: 3200,
  });

  const setParam = useCallback((key: keyof TwinParams, value: number) => {
    setParamsState((prev) => ({ ...prev, [key]: value }));
  }, []);

  const setParams = useCallback((p: Partial<TwinParams>) => {
    setParamsState((prev) => ({ ...prev, ...p }));
  }, []);

  const derived = computeDerived(params);

  return (
    <TwinContext.Provider value={{ params, derived, setParam, setParams }}>
      {children}
    </TwinContext.Provider>
  );
}

export function useTwin() {
  const ctx = useContext(TwinContext);
  if (!ctx) throw new Error('useTwin must be used within TwinProvider');
  return ctx;
}
