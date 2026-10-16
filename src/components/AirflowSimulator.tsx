import React, { useState } from 'react';
import { Wind, Gauge, Shield, AlertTriangle, CheckCircle2, RotateCw } from 'lucide-react';

export const AirflowSimulator: React.FC = () => {
  // Fan configurations
  const [frontFansCount, setFrontFansCount] = useState<number>(3);
  const [frontFansRpm, setFrontFansRpm] = useState<number>(1200);

  const [topFansCount, setTopFansCount] = useState<number>(2);
  const [topFansRpm, setTopFansRpm] = useState<number>(1100);
  const [topIsExhaust, setTopIsExhaust] = useState<boolean>(true);

  const [rearFansRpm, setRearFansRpm] = useState<number>(1300);

  // Approximate CFM per 120mm fan at given RPM: CFM ≈ (RPM / 1500) * 55
  const cfmPerFan = (rpm: number) => (rpm / 1500) * 55;

  const intakeFrontCfm = frontFansCount * cfmPerFan(frontFansRpm);
  const topCfm = topFansCount * cfmPerFan(topFansRpm);
  const rearExhaustCfm = cfmPerFan(rearFansRpm);

  const totalIntakeCfm = intakeFrontCfm + (!topIsExhaust ? topCfm : 0);
  const totalExhaustCfm = rearExhaustCfm + (topIsExhaust ? topCfm : 0);

  const netCfmDelta = Math.round(totalIntakeCfm - totalExhaustCfm);

  let pressureType: 'positiva' | 'negativa' | 'balanceada' = 'balanceada';
  if (netCfmDelta > 12) pressureType = 'positiva';
  else if (netCfmDelta < -12) pressureType = 'negativa';
  else pressureType = 'balanceada';

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-mono font-bold text-cyan-600 dark:text-cyan-400 tracking-wider">
          <Wind className="w-4 h-4 text-cyan-500" />
          <span>LABORATORIO VIRTUAL · TERMODINÁMICA DE GABINETE</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight mt-1">
          Simulador de Presión y Flujo de Aire (Airflow Dynamics)
        </h2>
        <p className="text-slate-600 dark:text-slate-300 mt-2 text-sm sm:text-base leading-relaxed max-w-4xl">
          El aire frío debe barrer los componentes calientes y ser evacuado rápidamente. La relación entre ventiladores de admisión (intake) y extracción (exhaust) determina la presión estática del chasis y la velocidad con la que se acumula polvo en su interior.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left: Interactive Chassis SVG Visualization */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-7 flex flex-col justify-between shadow-sm dark:shadow-cyan-950/20">
          <div>
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <Wind className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Visualización de Corrientes Térmicas en el Chasis ATX
                </h3>
              </div>
              <div className="text-xs font-mono">
                <span className="text-sky-600 dark:text-sky-400 font-bold">{Math.round(totalIntakeCfm)} CFM IN</span>
                <span className="text-slate-400 mx-2">/</span>
                <span className="text-rose-600 dark:text-rose-400 font-bold">{Math.round(totalExhaustCfm)} CFM OUT</span>
              </div>
            </div>

            {/* Chassis SVG Viewport */}
            <div className="relative bg-slate-950 rounded-2xl p-4 sm:p-6 border border-slate-800/90 overflow-hidden flex items-center justify-center min-h-[360px] shadow-inner">
              <div className="absolute top-2 left-3 flex items-center gap-1.5 text-[10px] font-mono text-cyan-400/80">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
                <span>CHASSIS THERMAL PRESSURE CHAMBER</span>
              </div>

              <svg viewBox="0 0 540 360" className="w-full h-auto max-w-[500px] pt-3">
                {/* Chassis Outer Shell */}
                <rect x="50" y="30" width="440" height="300" rx="12" fill="#0b0f19" stroke="#475569" strokeWidth="3" />
                <rect x="55" y="35" width="430" height="290" rx="10" fill="#030712" />
                
                {/* PSU Shroud (Bottom tunnel) */}
                <rect x="55" y="270" width="430" height="55" fill="#0f172a" stroke="#334155" />
                <text x="75" y="303" fill="#94a3b8" fontSize="11" fontWeight="bold">TÚNEL FUENTE ATX</text>

                {/* Motherboard Backplate */}
                <rect x="130" y="65" width="260" height="195" rx="6" fill="#064e3b" stroke="#059669" strokeWidth="1.5" />
                
                {/* CPU Tower Cooler / Radiator */}
                <rect x="230" y="85" width="70" height="65" rx="4" fill="#1e293b" stroke="#38bdf8" strokeWidth="1.5" />
                <text x="242" y="122" fill="#38bdf8" fontSize="10" fontWeight="bold">CPU COOLER</text>

                {/* Graphics Card (GPU) */}
                <rect x="180" y="175" width="170" height="42" rx="4" fill="#1e293b" stroke="#10b981" strokeWidth="1.5" />
                <text x="210" y="200" fill="#34d399" fontSize="10" fontWeight="bold">TARJETA GPU</text>

                {/* FRONT INTAKE FANS */}
                <g transform="translate(450, 45)">
                  {Array.from({ length: frontFansCount }).map((_, i) => (
                    <g key={i} transform={`translate(0, ${i * 72})`}>
                      <rect x="0" y="0" width="25" height="58" rx="4" fill="#0284c7" stroke="#38bdf8" strokeWidth="1" />
                      <text x="-48" y="34" fill="#38bdf8" fontSize="9" fontWeight="bold">INTAKE</text>
                      <path d="M 12 29 L -18 29" stroke="#38bdf8" strokeWidth="2.5" />
                    </g>
                  ))}
                </g>

                {/* REAR EXHAUST FAN */}
                <g transform="translate(65, 85)">
                  <rect x="0" y="0" width="25" height="60" rx="4" fill="#be123c" stroke="#fb7185" strokeWidth="1" />
                  <text x="32" y="35" fill="#fb7185" fontSize="9" fontWeight="bold">EXHAUST</text>
                  <path d="M 12 30 L -18 30" stroke="#fb7185" strokeWidth="2.5" />
                </g>

                {/* TOP FANS */}
                <g transform="translate(200, 40)">
                  {Array.from({ length: topFansCount }).map((_, i) => (
                    <g key={i} transform={`translate(${i * 80}, 0)`}>
                      <rect x="0" y="0" width="60" height="20" rx="3" fill={topIsExhaust ? '#be123c' : '#0284c7'} stroke={topIsExhaust ? '#fb7185' : '#38bdf8'} strokeWidth="1" />
                      <text x="8" y="14" fill="#ffffff" fontSize="8" fontWeight="bold">
                        {topIsExhaust ? 'EXHAUST' : 'INTAKE'}
                      </text>
                      <path d={topIsExhaust ? "M 30 5 L 30 -12" : "M 30 -10 L 30 10"} stroke={topIsExhaust ? '#fb7185' : '#38bdf8'} strokeWidth="2" />
                    </g>
                  ))}
                </g>

                {/* Airflow Flow Streamlines */}
                <path d="M 430 100 C 350 100, 310 110, 230 115" fill="none" stroke="#38bdf8" strokeWidth="2" strokeDasharray="6 4" opacity="0.8" />
                <path d="M 430 195 C 370 195, 360 200, 350 200" fill="none" stroke="#38bdf8" strokeWidth="2" strokeDasharray="6 4" opacity="0.8" />
                
                {/* Hot air exhaust paths */}
                <path d="M 230 115 C 160 115, 120 115, 95 115" fill="none" stroke="#f43f5e" strokeWidth="2.5" strokeDasharray="6 4" opacity="0.9" />
                <path d="M 270 85 C 270 70, 270 65, 270 50" fill="none" stroke="#f43f5e" strokeWidth="2.5" strokeDasharray="6 4" opacity="0.9" />
              </svg>
            </div>
          </div>

          {/* Resulting Pressure Summary Card */}
          <div className={`mt-6 p-4 rounded-2xl border flex items-center justify-between gap-4 ${
            pressureType === 'positiva'
              ? 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-300 dark:border-emerald-500/40 text-emerald-900 dark:text-emerald-200'
              : pressureType === 'balanceada'
              ? 'bg-cyan-50 dark:bg-cyan-950/30 border-cyan-300 dark:border-cyan-500/40 text-cyan-900 dark:text-cyan-200'
              : 'bg-amber-50 dark:bg-amber-950/30 border-amber-300 dark:border-amber-500/40 text-amber-900 dark:text-amber-200'
          }`}>
            <div className="flex items-center gap-3">
              <div className={`p-2.5 rounded-xl ${
                pressureType === 'positiva'
                  ? 'bg-emerald-500/20 text-emerald-700 dark:text-emerald-400'
                  : pressureType === 'balanceada'
                  ? 'bg-cyan-500/20 text-cyan-700 dark:text-cyan-400'
                  : 'bg-amber-500/20 text-amber-700 dark:text-amber-400'
              }`}>
                {pressureType === 'positiva' ? <Shield className="w-5 h-5" /> : <AlertTriangle className="w-5 h-5" />}
              </div>
              <div>
                <div className="text-xs uppercase font-mono font-bold tracking-wider text-slate-500 dark:text-slate-400">
                  ESTADO DE PRESIÓN ESTÁTICA
                </div>
                <div className="text-sm sm:text-base font-extrabold capitalize">
                  Presión {pressureType} ({netCfmDelta > 0 ? `+${netCfmDelta}` : netCfmDelta} CFM)
                </div>
              </div>
            </div>

            <div className="text-right text-xs max-w-xs hidden sm:block leading-relaxed">
              {pressureType === 'positiva' && 'Excelente contra el polvo. El aire sobrante escapa por las rendijas sin filtro.'}
              {pressureType === 'balanceada' && 'Flujo óptimo. Gran balance térmico y acústico.'}
              {pressureType === 'negativa' && 'Atención: Aspira polvo del ambiente por todas las rendijas traseras sin filtro.'}
            </div>
          </div>
        </div>

        {/* Right: Fan Controls */}
        <div className="lg:col-span-5 space-y-5">
          
          {/* Front Fans Control */}
          <div className="bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 sm:p-6 space-y-3 shadow-sm dark:shadow-cyan-950/20">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-sky-700 dark:text-sky-400 uppercase tracking-wider">
                Ventiladores Frontales (Intake)
              </span>
              <span className="text-xs font-mono font-bold text-slate-900 dark:text-white">
                {frontFansCount} ventiladores · {frontFansRpm} RPM
              </span>
            </div>

            <div className="flex items-center gap-2">
              {[1, 2, 3].map((count) => (
                <button
                  key={count}
                  onClick={() => setFrontFansCount(count)}
                  className={`flex-1 py-1.5 text-xs font-bold rounded-xl border transition-all ${
                    frontFansCount === count
                      ? 'bg-sky-500 text-slate-950 border-sky-400 shadow-sm'
                      : 'bg-slate-50 dark:bg-slate-950 text-slate-700 dark:text-slate-400 border-slate-200 dark:border-slate-800 hover:bg-slate-100'
                  }`}
                >
                  {count} Fans
                </button>
              ))}
            </div>

            <div>
              <div className="flex justify-between text-[11px] text-slate-500 mb-1">
                <span>Velocidad:</span>
                <span className="font-mono text-sky-700 dark:text-sky-300 font-bold">{frontFansRpm} RPM</span>
              </div>
              <input
                type="range"
                min="600"
                max="2200"
                step="50"
                value={frontFansRpm}
                onChange={(e) => setFrontFansRpm(parseInt(e.target.value))}
                className="w-full accent-sky-500 h-2 bg-slate-200 dark:bg-slate-800 rounded-lg cursor-pointer"
              />
            </div>
          </div>

          {/* Top Fans Control */}
          <div className="bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 sm:p-6 space-y-3 shadow-sm dark:shadow-cyan-950/20">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                Ventiladores Superiores (Techo)
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setTopIsExhaust(!topIsExhaust)}
                  className={`px-2 py-0.5 text-[10px] font-mono font-bold rounded-full border ${
                    topIsExhaust 
                      ? 'bg-rose-50 dark:bg-rose-950/30 text-rose-700 dark:text-rose-300 border-rose-300 dark:border-rose-800' 
                      : 'bg-sky-50 dark:bg-sky-950/30 text-sky-700 dark:text-sky-300 border-sky-300 dark:border-sky-800'
                  }`}
                >
                  {topIsExhaust ? 'Modo EXHAUST' : 'Modo INTAKE'}
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {[0, 1, 2, 3].map((count) => (
                <button
                  key={count}
                  onClick={() => setTopFansCount(count)}
                  className={`flex-1 py-1.5 text-xs font-bold rounded-xl border transition-all ${
                    topFansCount === count
                      ? 'bg-cyan-500 text-slate-950 border-cyan-400 shadow-sm'
                      : 'bg-slate-50 dark:bg-slate-950 text-slate-700 dark:text-slate-400 border-slate-200 dark:border-slate-800 hover:bg-slate-100'
                  }`}
                >
                  {count} {count === 1 ? 'Fan' : 'Fans'}
                </button>
              ))}
            </div>

            {topFansCount > 0 && (
              <div>
                <div className="flex justify-between text-[11px] text-slate-500 mb-1">
                  <span>Velocidad Techo:</span>
                  <span className="font-mono text-cyan-700 dark:text-cyan-300 font-bold">{topFansRpm} RPM</span>
                </div>
                <input
                  type="range"
                  min="600"
                  max="2000"
                  step="50"
                  value={topFansRpm}
                  onChange={(e) => setTopFansRpm(parseInt(e.target.value))}
                  className="w-full accent-cyan-500 h-2 bg-slate-200 dark:bg-slate-800 rounded-lg cursor-pointer"
                />
              </div>
            )}
          </div>

          {/* Rear Fan Control */}
          <div className="bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 sm:p-6 space-y-3 shadow-sm dark:shadow-cyan-950/20">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-rose-700 dark:text-rose-400 uppercase tracking-wider">
                Ventilador Trasero (Exhaust Primario)
              </span>
              <span className="text-xs font-mono font-bold text-slate-900 dark:text-white">
                1 ventilador · {rearFansRpm} RPM
              </span>
            </div>

            <div>
              <div className="flex justify-between text-[11px] text-slate-500 mb-1">
                <span>Velocidad Extracción:</span>
                <span className="font-mono text-rose-700 dark:text-rose-400 font-bold">{rearFansRpm} RPM</span>
              </div>
              <input
                type="range"
                min="600"
                max="2200"
                step="50"
                value={rearFansRpm}
                onChange={(e) => setRearFansRpm(parseInt(e.target.value))}
                className="w-full accent-rose-500 h-2 bg-slate-200 dark:bg-slate-800 rounded-lg cursor-pointer"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
