import React, { useState } from 'react';
import { Thermometer, AlertCircle, CheckCircle2, Info, RefreshCw, Cpu } from 'lucide-react';

type CpuSocket = 'am5' | 'lga1700' | 'standard';
type PatternType = 'dot' | 'cross' | 'five-dots' | 'line' | 'spatula';

interface PatternConfig {
  name: string;
  description: string;
  bestFor: string;
  baseCoverage: number; // at 100% pressure
  overflowRisk: 'Bajo' | 'Moderado' | 'Alto';
  airPocketRisk: 'Mínimo' | 'Bajo' | 'Moderado' | 'Alto';
  deltaTempRating: number; // lower temp is better
}

const PATTERNS: Record<PatternType, PatternConfig> = {
  dot: {
    name: 'Punto Central (Grano de Arveja)',
    description: 'Una gota redonda de 4-5 mm en el centro exacto del IHS.',
    bestFor: 'Sockets cuadrados tradicionales (AM4, LGA1200). En procesadores alargados deja las esquinas sin cubrir.',
    baseCoverage: 78,
    overflowRisk: 'Bajo',
    airPocketRisk: 'Mínimo',
    deltaTempRating: 75
  },
  cross: {
    name: 'Cruz en X',
    description: 'Dos líneas finas diagonales formando una X de esquina a esquina sin llegar a los bordes.',
    bestFor: 'Procesadores rectangulares (Intel LGA1700/1851) y AMD Ryzen AM5 (con dies descentralizados).',
    baseCoverage: 96,
    overflowRisk: 'Moderado',
    airPocketRisk: 'Bajo',
    deltaTempRating: 69
  },
  'five-dots': {
    name: 'Cinco Puntos (Patrón de Dado)',
    description: 'Un punto central moderado y cuatro gotas diminutas en las cuatro esquinas.',
    bestFor: 'Disipadores de gran base de contacto plana o coldplates de refrigeración líquida AIO.',
    baseCoverage: 92,
    overflowRisk: 'Moderado',
    airPocketRisk: 'Bajo',
    deltaTempRating: 71
  },
  line: {
    name: 'Línea Central Longitudinal',
    description: 'Una tira delgada recta a lo largo del eje mayor del procesador.',
    bestFor: 'CPUs Intel de 12va a 14va generación para alinearse con la orientación del silicio.',
    baseCoverage: 84,
    overflowRisk: 'Bajo',
    airPocketRisk: 'Bajo',
    deltaTempRating: 73
  },
  spatula: {
    name: 'Espátula (Capa Fina Manual)',
    description: 'Esparcir manualmente una capa micrométrica homogénea con paleta de plástico.',
    bestFor: 'Técnicos experimentados y aplicación de compuestos de alta viscosidad o metal líquido.',
    baseCoverage: 99,
    overflowRisk: 'Alto',
    airPocketRisk: 'Moderado',
    deltaTempRating: 68
  }
};

export const ThermalSimulator: React.FC = () => {
  const [socket, setSocket] = useState<CpuSocket>('am5');
  const [pattern, setPattern] = useState<PatternType>('cross');
  const [pressure, setPressure] = useState<number>(85); // 0 to 100%

  const currentPattern = PATTERNS[pattern];

  // Dynamic coverage calculation based on socket geometry & pressure
  let effectiveCoverage = Math.round(
    currentPattern.baseCoverage * (0.45 + (pressure / 100) * 0.55)
  );

  // Intel LGA1700 is elongated; dot pattern covers less
  if (socket === 'lga1700' && pattern === 'dot') {
    effectiveCoverage = Math.round(effectiveCoverage * 0.82);
  }

  // AM5 has cutouts; spatula or too much pressure risks overflowing into SMD capacitors
  const overflowLikelihood = 
    pressure > 85 && currentPattern.overflowRisk === 'Alto'
      ? '¡ALTO! Pasta invadiendo transistores SMD'
      : pressure > 90
      ? 'Moderado en los bordes'
      : 'Bajo (Confinada en el IHS)';

  const estimatedTempLoad = Math.round(
    currentPattern.deltaTempRating + (100 - effectiveCoverage) * 0.22 - (pressure > 80 ? 2 : 0)
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-mono font-bold text-cyan-600 dark:text-cyan-400 tracking-wider">
          <Thermometer className="w-4 h-4 text-cyan-500" />
          <span>LABORATORIO VIRTUAL · DINÁMICA DE FLUIDOS TÉRMICOS</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight mt-1">
          Simulador Interactivo de Aplicación de Pasta Térmica
        </h2>
        <p className="text-slate-600 dark:text-slate-300 mt-2 text-sm sm:text-base leading-relaxed max-w-4xl">
          El aire atrapado entre el procesador y el disipador es un pésimo conductor térmico (0.026 W/m·K) comparado con la pasta térmica (&gt;8.5 W/m·K). Experimenta cómo se expande cada patrón bajo presión mecánica y evalúa el riesgo de desbordamiento hacia los componentes SMD.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left: Interactive Canvas / SVG Area */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-7 flex flex-col justify-between shadow-sm dark:shadow-cyan-950/20">
          <div>
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <Cpu className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Visualización del IHS y Expansión Térmica
                </h3>
              </div>
              <span className="text-xs font-mono font-bold text-cyan-600 dark:text-cyan-400 px-2.5 py-1 rounded-full bg-cyan-50 dark:bg-cyan-950/60 border border-cyan-200 dark:border-cyan-800">
                PRESIÓN: {pressure}%
              </span>
            </div>

            {/* Socket Graphic Simulation Viewport */}
            <div className="relative bg-slate-950 rounded-2xl p-6 border border-slate-800/90 flex items-center justify-center min-h-[340px] overflow-hidden shadow-inner">
              <div className="absolute top-2 left-3 flex items-center gap-1.5 text-[10px] font-mono text-cyan-400/80">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
                <span>THERMAL FLUID DYNAMICS ENGINE</span>
              </div>

              {/* Motherboard Surface Background */}
              <div className="w-64 h-64 sm:w-72 sm:h-72 relative bg-emerald-950/70 rounded-2xl border-2 border-emerald-800/70 p-4 shadow-inner flex items-center justify-center">
                
                {/* SMD Capacitors around socket in AM5 style */}
                {socket === 'am5' && (
                  <>
                    <div className="absolute top-1 left-16 flex gap-1">
                      <div className="w-2.5 h-1 bg-amber-400 rounded-xs" />
                      <div className="w-2.5 h-1 bg-amber-400 rounded-xs" />
                      <div className="w-2.5 h-1 bg-amber-400 rounded-xs" />
                    </div>
                    <div className="absolute bottom-1 right-16 flex gap-1">
                      <div className="w-2.5 h-1 bg-amber-400 rounded-xs" />
                      <div className="w-2.5 h-1 bg-amber-400 rounded-xs" />
                    </div>
                    <div className="absolute left-1 top-20 flex flex-col gap-1">
                      <div className="w-1 h-2.5 bg-amber-400 rounded-xs" />
                      <div className="w-1 h-2.5 bg-amber-400 rounded-xs" />
                    </div>
                  </>
                )}

                {/* Metal CPU IHS */}
                <div 
                  className={`relative bg-gradient-to-br from-slate-300 via-slate-400 to-slate-500 rounded-xl shadow-xl border border-slate-200 transition-all duration-300 flex items-center justify-center overflow-hidden ${
                    socket === 'lga1700' 
                      ? 'w-48 h-60' 
                      : socket === 'am5'
                      ? 'w-52 h-52'
                      : 'w-52 h-52'
                  }`}
                >
                  <div className="absolute top-2 left-3 text-[10px] font-mono text-slate-800 font-bold select-none opacity-70">
                    {socket === 'am5' ? 'AMD RYZEN™ AM5' : socket === 'lga1700' ? 'INTEL® CORE™ LGA1700' : 'PROCESSOR IHS'}
                  </div>

                  {/* Thermal Paste Layer */}
                  <div
                    className="absolute shadow-lg border border-slate-400 transition-all duration-300"
                    style={{
                      backgroundColor: '#64748b',
                      opacity: 0.92,
                      borderRadius: pattern === 'dot' ? '50%' : pattern === 'cross' ? '30%' : pattern === 'spatula' ? '8px' : '40%',
                      width: `${Math.max(25, (effectiveCoverage / 100) * (socket === 'lga1700' ? 170 : 190))}px`,
                      height: `${Math.max(25, (effectiveCoverage / 100) * (socket === 'lga1700' ? 220 : 190))}px`,
                      transform: pattern === 'cross' ? 'rotate(5deg)' : 'none',
                      filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.4))'
                    }}
                  >
                    <div className="w-full h-full bg-gradient-to-tr from-slate-700/40 to-slate-300/40 rounded-inherit" />
                  </div>

                  {/* Real-time Coverage Overlay Stamp */}
                  <div className="absolute bottom-2 right-2 bg-slate-900/90 backdrop-blur-xs px-2.5 py-1 rounded-lg text-[11px] font-mono font-bold text-cyan-300 border border-slate-700 shadow-sm">
                    {effectiveCoverage}% Cobertura
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Slider: Mounting Pressure */}
          <div className="mt-6 p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between mb-2">
              <label htmlFor="pressure-slider" className="text-xs font-mono font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                Fuerza de Apriete del Disipador (Tornillos en Cruz)
              </label>
              <span className="text-xs font-mono font-bold text-cyan-700 dark:text-cyan-400 tabular-nums">
                {pressure}% de torque nominal
              </span>
            </div>
            <input
              id="pressure-slider"
              type="range"
              min="15"
              max="100"
              value={pressure}
              onChange={(e) => setPressure(parseInt(e.target.value))}
              className="w-full accent-cyan-500 h-2 bg-slate-200 dark:bg-slate-800 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[11px] text-slate-500 mt-1.5 font-mono">
              <span>Apenas apoyado (15%)</span>
              <span>Ajuste medio (50%)</span>
              <span>Torque simétrico recomendado (85-100%)</span>
            </div>
          </div>
        </div>

        {/* Right: Controls & Diagnostics */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Socket Selector */}
          <div className="bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 sm:p-6 shadow-sm dark:shadow-cyan-950/20">
            <label className="text-xs font-mono font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider block mb-2.5">
              1. Selecciona Arquitectura de Socket
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'am5', label: 'AMD AM5' },
                { id: 'lga1700', label: 'Intel LGA1700' },
                { id: 'standard', label: 'AM4 / LGA1200' }
              ].map(s => (
                <button
                  key={s.id}
                  onClick={() => setSocket(s.id as CpuSocket)}
                  className={`p-2.5 text-xs font-bold rounded-xl border transition-all text-center ${
                    socket === s.id
                      ? 'bg-cyan-500 text-slate-950 border-cyan-400 shadow-sm'
                      : 'bg-slate-50 dark:bg-slate-950 text-slate-700 dark:text-slate-400 border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-900'
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          {/* Pattern Selector */}
          <div className="bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 sm:p-6 shadow-sm dark:shadow-cyan-950/20">
            <label className="text-xs font-mono font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider block mb-2.5">
              2. Método de Dosificación de Pasta
            </label>
            <div className="space-y-2">
              {(Object.keys(PATTERNS) as PatternType[]).map((key) => {
                const isSelected = pattern === key;
                const p = PATTERNS[key];
                return (
                  <button
                    key={key}
                    onClick={() => setPattern(key)}
                    className={`w-full p-3 rounded-2xl border text-left transition-all ${
                      isSelected
                        ? 'bg-cyan-50/70 dark:bg-cyan-950/40 border-cyan-500 ring-1 ring-cyan-500/30'
                        : 'bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className={`text-xs font-bold ${isSelected ? 'text-cyan-800 dark:text-cyan-300' : 'text-slate-900 dark:text-white'}`}>
                        {p.name}
                      </span>
                      <span className="text-[10px] font-mono text-cyan-600 dark:text-cyan-400 font-bold">
                        {p.baseCoverage}% Cobertura
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-1 line-clamp-1">
                      {p.description}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Real-Time Analysis & Telemetry Panel */}
          <div className="bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 sm:p-6 space-y-3.5 shadow-sm dark:shadow-cyan-950/20">
            <h4 className="text-xs font-mono font-bold text-cyan-700 dark:text-cyan-400 uppercase tracking-wider">
              Diagnóstico Termodinámico en Tiempo Real
            </h4>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                <span className="text-slate-500 dark:text-slate-400 block text-[11px] font-medium">Temperatura en Carga</span>
                <span className="text-lg font-bold font-mono text-emerald-600 dark:text-emerald-400 tabular-nums">
                  ~{estimatedTempLoad} °C
                </span>
                <span className="text-[10px] text-slate-500 block">Cinebench R23 100%</span>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                <span className="text-slate-500 dark:text-slate-400 block text-[11px] font-medium">Riesgo Desborde a SMDs</span>
                <span className={`text-sm font-bold font-mono ${
                  overflowLikelihood.includes('ALTO') ? 'text-rose-600 dark:text-rose-400' : 'text-slate-800 dark:text-slate-200'
                }`}>
                  {overflowLikelihood}
                </span>
                <span className="text-[10px] text-slate-500 block">Capacitores del sustrato</span>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-amber-50 dark:bg-slate-950 border border-amber-200 dark:border-slate-800 text-xs text-slate-800 dark:text-slate-300 leading-relaxed">
              <span className="font-bold text-amber-800 dark:text-amber-300 block mb-1">
                Veredicto para {socket.toUpperCase()}:
              </span>
              {currentPattern.bestFor}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
