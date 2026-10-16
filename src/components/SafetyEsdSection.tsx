import React, { useState } from 'react';
import { ShieldAlert, Zap, AlertOctagon, CheckCircle2, RefreshCw, Info, Sparkles } from 'lucide-react';

export const SafetyEsdSection: React.FC = () => {
  // Capacitor drain simulation state
  const [psuPlugged, setPsuPlugged] = useState(true);
  const [powerButtonPressed, setPowerButtonPressed] = useState(false);
  const [capacitorVoltage, setCapacitorVoltage] = useState(325);
  const [isDraining, setIsDraining] = useState(false);

  const handleDrainCapacitors = () => {
    if (psuPlugged) return;
    setIsDraining(true);
    setPowerButtonPressed(true);
    let currentV = capacitorVoltage;
    const interval = setInterval(() => {
      currentV = Math.max(0, currentV - 45);
      setCapacitorVoltage(currentV);
      if (currentV <= 0) {
        clearInterval(interval);
        setIsDraining(false);
      }
    }, 150);
  };

  const resetPsuSim = () => {
    setPsuPlugged(true);
    setPowerButtonPressed(false);
    setCapacitorVoltage(325);
    setIsDraining(false);
  };

  return (
    <div className="space-y-8">
      {/* Section Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-mono font-bold text-cyan-600 dark:text-cyan-400 tracking-wider">
          <ShieldAlert className="w-4 h-4 text-cyan-500" />
          <span>FASE 01 · PROTOCOLO DE PREVENCIÓN CRÍTICA</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight mt-1">
          Seguridad Eléctrica y Control de Descargas Electrostáticas (ESD)
        </h2>
        <p className="text-slate-600 dark:text-slate-300 mt-2 text-sm sm:text-base leading-relaxed max-w-4xl">
          El cuerpo humano puede acumular más de 15,000 voltios de electricidad estática por simple fricción (efecto triboeléctrico). Mientras una persona solo siente una chispa a partir de los 3,000V, un transistor MOSFET moderno se destruye con apenas 30V a 100V. El daño por ESD suele ser latente: el equipo funciona temporalmente pero falla catastróficamente semanas después por degradación de óxido de silicio.
        </p>
      </div>

      {/* Grid: Interactive Workstation + Capacitor Draining Simulator */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: Workstation Schematic Diagram */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-7 shadow-sm dark:shadow-cyan-950/20">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Esquema de Banco de Trabajo Antiestático Certificado (ANSI/ESD S20.20)
              </h3>
            </div>
            <span className="text-xs font-mono font-bold text-cyan-600 dark:text-cyan-400 px-2.5 py-1 rounded-full bg-cyan-50 dark:bg-cyan-950/60 border border-cyan-200 dark:border-cyan-800">
              1 MΩ RESISTENCIA
            </span>
          </div>

          {/* SVG Diagram Viewport */}
          <div className="relative bg-slate-950 rounded-2xl p-4 sm:p-6 border border-slate-800/90 overflow-hidden shadow-inner">
            <div className="absolute top-2 left-3 flex items-center gap-1.5 text-[10px] font-mono text-cyan-400/80">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
              <span>EQUIPOTENTIAL BONDING SCHEMATIC</span>
            </div>

            <svg viewBox="0 0 700 360" className="w-full h-auto text-slate-300 pt-3">
              {/* Background Bench */}
              <rect x="50" y="70" width="600" height="230" rx="8" fill="#0f172a" stroke="#334155" strokeWidth="2" />
              <text x="70" y="100" fill="#94a3b8" fontSize="12" fontWeight="600">SUPERFICIE DE BANCO DE TRABAJO</text>
              
              {/* ESD Dissipative Mat */}
              <rect x="70" y="120" width="460" height="160" rx="6" fill="#082f49" stroke="#0284c7" strokeWidth="2" strokeDasharray="4 2" />
              <text x="90" y="145" fill="#38bdf8" fontSize="12" fontWeight="700">TAPETE DISIPATIVO (10⁶ - 10⁹ Ω/sq)</text>
              
              {/* Component on Mat */}
              <rect x="180" y="165" width="140" height="95" rx="4" fill="#064e3b" stroke="#10b981" strokeWidth="1.5" />
              <text x="195" y="195" fill="#6ee7b7" fontSize="11" fontWeight="600">PLACA MADRE</text>
              <rect x="235" y="205" width="30" height="30" fill="#047857" stroke="#34d399" />
              <text x="242" y="224" fill="#a7f3d0" fontSize="9">CPU</text>

              {/* Wrist Strap & Operator */}
              <circle cx="590" cy="170" r="28" fill="#1e293b" stroke="#64748b" strokeWidth="2" />
              <text x="568" y="174" fill="#cbd5e1" fontSize="11" fontWeight="600">TÉCNICO</text>
              <circle cx="565" cy="188" r="8" fill="#0284c7" stroke="#38bdf8" strokeWidth="2" />
              <text x="560" y="210" fill="#38bdf8" fontSize="10">Pulsera</text>

              {/* Ground Wire with 1M Ohm resistor from wrist strap */}
              <path d="M 557 190 C 510 230, 480 290, 420 320" fill="none" stroke="#38bdf8" strokeWidth="2.5" strokeDasharray="5 3" />
              
              {/* Mat ground snap wire */}
              <path d="M 85 270 C 85 310, 150 330, 420 320" fill="none" stroke="#0ea5e9" strokeWidth="2" />

              {/* Common Ground Point (CPG) with 1M Ohm box */}
              <rect x="420" y="305" width="110" height="32" rx="4" fill="#1e1b4b" stroke="#818cf8" strokeWidth="1.5" />
              <text x="430" y="325" fill="#c7d2fe" fontSize="10" fontWeight="700">Resistor 1 MΩ</text>

              {/* Earth Ground connection */}
              <line x1="530" y1="321" x2="610" y2="321" stroke="#22c55e" strokeWidth="3" />
              {/* Earth symbol */}
              <line x1="610" y1="311" x2="610" y2="331" stroke="#22c55e" strokeWidth="3" />
              <line x1="617" y1="315" x2="617" y2="327" stroke="#22c55e" strokeWidth="2.5" />
              <line x1="624" y1="318" x2="624" y2="324" stroke="#22c55e" strokeWidth="2" />
              <text x="575" y="348" fill="#4ade80" fontSize="11" fontWeight="700">TOMA A TIERRA FÍSICA</text>
            </svg>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4 text-xs">
            <div className="p-3.5 bg-slate-50 dark:bg-slate-950/60 rounded-2xl border border-slate-200 dark:border-slate-800">
              <span className="font-bold text-cyan-700 dark:text-cyan-300 block mb-1">Función del Resistor de 1 MΩ:</span>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                Garantiza que la carga estática se disipe suavemente en menos de 0.1s, al tiempo que protege al técnico impidiendo que una descarga de red pase al cuerpo con corriente letal.
              </p>
            </div>
            <div className="p-3.5 bg-slate-50 dark:bg-slate-950/60 rounded-2xl border border-slate-200 dark:border-slate-800">
              <span className="font-bold text-emerald-700 dark:text-emerald-300 block mb-1">Humedad Relativa Óptima:</span>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                Mantener el laboratorio entre 40% y 60% HR. Ambientes secos (&lt;30%) incrementan la generación estática por fricción en más de un 800%.
              </p>
            </div>
          </div>
        </div>

        {/* Right: Interactive PSU Capacitor Draining Simulator */}
        <div className="lg:col-span-5 bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-7 flex flex-col justify-between shadow-sm dark:shadow-cyan-950/20">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Zap className="w-5 h-5 text-amber-500" />
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Simulador: Drenado de Condensadores de la Fuente (PSU)
              </h3>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
              Los condensadores electrolíticos de filtrado primario retienen más de 300V DC aun con la computadora apagada. Desconectar y drenar previene arcos eléctricos y choques dolorosos.
            </p>

            {/* Gauge Display */}
            <div className="p-4 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 mb-4 shadow-xs">
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="text-slate-600 dark:text-slate-400 font-mono font-medium">Voltaje Residual Primario</span>
                <span className={`font-mono font-bold text-sm ${capacitorVoltage > 50 ? 'text-rose-600 dark:text-rose-400' : 'text-emerald-600 dark:text-emerald-400'}`}>
                  {capacitorVoltage} V DC
                </span>
              </div>
              
              {/* Progress bar */}
              <div className="w-full bg-slate-200 dark:bg-slate-800 h-3 rounded-full overflow-hidden">
                <div 
                  className={`h-full transition-all duration-200 ${
                    capacitorVoltage > 50 
                      ? 'bg-gradient-to-r from-amber-500 to-rose-500' 
                      : 'bg-emerald-500'
                  }`}
                  style={{ width: `${(capacitorVoltage / 325) * 100}%` }}
                />
              </div>

              <div className="mt-3 flex items-center gap-2 text-xs">
                {capacitorVoltage > 50 ? (
                  <div className="flex items-center gap-1.5 text-rose-700 dark:text-rose-400 font-medium">
                    <AlertOctagon className="w-4 h-4 shrink-0 text-rose-500" />
                    <span>PELIGRO: Carga de alto voltaje activa. Riesgo de arco eléctrico.</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-1.5 text-emerald-700 dark:text-emerald-400 font-medium">
                    <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-500" />
                    <span>ESTADO SEGURO: Condensadores drenados a 0V. Manipulación permitida.</span>
                  </div>
                )}
              </div>
            </div>

            {/* Step Controls */}
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60">
                <div className="text-xs">
                  <div className="font-bold text-slate-900 dark:text-white">Paso 1: Desconectar cable AC</div>
                  <div className="text-slate-500 dark:text-slate-400 text-[11px]">Corta el flujo de la red eléctrica externa</div>
                </div>
                <button
                  onClick={() => {
                    setPsuPlugged(!psuPlugged);
                    if (!psuPlugged) resetPsuSim();
                  }}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors border ${
                    psuPlugged 
                      ? 'bg-rose-50 dark:bg-rose-500/20 text-rose-700 dark:text-rose-300 border-rose-300 dark:border-rose-500/40 hover:bg-rose-100' 
                      : 'bg-emerald-50 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border-emerald-300 dark:border-emerald-500/40'
                  }`}
                >
                  {psuPlugged ? 'Desconectar Cable' : 'Cable Desconectado ✓'}
                </button>
              </div>

              <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60">
                <div className="text-xs">
                  <div className="font-bold text-slate-900 dark:text-white">Paso 2: Pulsar botón de Power por 10s</div>
                  <div className="text-slate-500 dark:text-slate-400 text-[11px]">Consume la energía residual a través de la placa</div>
                </div>
                <button
                  disabled={psuPlugged || capacitorVoltage === 0 || isDraining}
                  onClick={handleDrainCapacitors}
                  className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors border ${
                    psuPlugged
                      ? 'bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 border-slate-200 dark:border-slate-700 cursor-not-allowed'
                      : capacitorVoltage === 0
                      ? 'bg-emerald-50 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border-emerald-300 dark:border-emerald-500/30 cursor-default'
                      : 'bg-cyan-500 text-slate-950 hover:bg-cyan-400 border-cyan-400 shadow-sm'
                  }`}
                >
                  {isDraining ? 'Drenando...' : capacitorVoltage === 0 ? 'Drenado Completo ✓' : 'Presionar Power'}
                </button>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <span className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1 font-medium">
              <Info className="w-3.5 h-3.5 text-cyan-500" />
              Siempre realiza este paso antes de desensamblar
            </span>
            <button
              onClick={resetPsuSim}
              className="text-xs font-medium text-slate-600 dark:text-slate-400 hover:text-cyan-600 dark:hover:text-white flex items-center gap-1 transition-colors"
            >
              <RefreshCw className="w-3 h-3" />
              Reiniciar simulador
            </button>
          </div>
        </div>
      </div>

      {/* Reglas de Oro de Seguridad */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="text-xs font-mono font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider mb-1">REGLA 1 · AISLAMIENTO</div>
          <h4 className="text-sm font-bold text-slate-900 dark:text-white">Prohibición de Apertura de la PSU</h4>
          <p className="mt-1.5 text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            Bajo ninguna circunstancia abras el chasis de la fuente de poder para limpiarla por dentro, salvo que seas técnico electrónico especializado en fuentes conmutadas y osciloscopio aislado. El polvo se extrae solo con soplado exterior.
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="text-xs font-mono font-bold text-cyan-600 dark:text-cyan-400 uppercase tracking-wider mb-1">REGLA 2 · ROPA Y SUPERFICIE</div>
          <h4 className="text-sm font-bold text-slate-900 dark:text-white">Vestimenta 100% Algodón</h4>
          <p className="mt-1.5 text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            Nunca uses prendas de lana, poliéster, polar o suéteres sintéticos. Trabaja sobre pisos de cerámica o madera sin alfombras, y con calzado con suela de goma o calzado de seguridad disipativo.
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider mb-1">REGLA 3 · QUÍMICOS</div>
          <h4 className="text-sm font-bold text-slate-900 dark:text-white">Disolventes Dieléctricos</h4>
          <p className="mt-1.5 text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            Únicamente utiliza alcohol isopropílico de 99.8% o limpiador de contactos electrónicos de residuo cero. El agua del alcohol etílico común causa electrólisis y sulfatación en las pistas de cobre.
          </p>
        </div>
      </div>
    </div>
  );
};
