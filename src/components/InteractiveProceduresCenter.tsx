import React, { useState, useEffect } from 'react';
import { soundFx } from '../utils/audio';
import { Play, Pause, RotateCcw, FastForward, CheckCircle2, AlertTriangle, Layers, Info, Sparkles, Cpu, ShieldCheck } from 'lucide-react';

interface AnimatedProcedure {
  id: string;
  title: string;
  phase: string;
  totalDurationSec: number;
  summary: string;
  steps: {
    sec: number;
    title: string;
    description: string;
    criticalRule: string;
    diagramType: 'esd' | 'twist' | 'ram' | 'psu' | 'terminal';
  }[];
}

const PROCEDURES: AnimatedProcedure[] = [
  {
    id: 'proc-desensamble-esd',
    title: 'Protocolo de Seguridad Eléctrica y Desensamble Antiestático (ESD)',
    phase: 'Seguridad & Desensamble',
    totalDurationSec: 16,
    summary: 'Procedimiento de aislamiento contra descargas electrostáticas y desenergización de condensadores primarios de la fuente ATX.',
    steps: [
      {
        sec: 0,
        title: 'Desconexión de Línea AC y Drenado',
        description: 'Desconectar cable de 110V/220V de la pared y pulsar botón frontal por 10 segundos para vaciar la reserva de los condensadores primarios.',
        criticalRule: 'NUNCA abrir la carcasa metálica de la fuente; los condensadores retienen 320V DC peligrosos.',
        diagramType: 'esd'
      },
      {
        sec: 5,
        title: 'Conexión de Pulsera Antiestática a Tierra',
        description: 'Ajustar la banda elástica a la muñeca no dominante y fijar el caimán con resistencia de 1 MΩ a una parte metálica sin pintura del chasis.',
        criticalRule: 'El cuerpo acumula hasta 15,000V por fricción. La compuerta de un MOSFET se destruye con apenas 40V.',
        diagramType: 'esd'
      },
      {
        sec: 11,
        title: 'Retiro de Paneles de Vidrio Templado',
        description: 'Colocar el chasis horizontalmente sobre el tapete disipativo antes de retirar los tornillos del panel de vidrio para evitar caídas o tensiones de torsión.',
        criticalRule: 'El vidrio templado sobre baldosas cerámicas sufre microimpactos térmicos y puede estallar por choque de dureza.',
        diagramType: 'esd'
      }
    ]
  },
  {
    id: 'proc-cooler-twist',
    title: 'Extracción sin Torsión de Disipadores de CPU (Técnica de Cizallamiento)',
    phase: 'Mecánica de Procesador',
    totalDurationSec: 16,
    summary: 'Técnica obligatoria para despegar disipadores pegados al vacío sin arrancar procesadores PGA (AMD AM4) ni doblar pines microscópicos.',
    steps: [
      {
        sec: 0,
        title: 'Aflojar Tornillos en Secuencia Cruzada',
        description: 'Girar los tornillos de retención 1 a 2 vueltas por ciclo en diagonal para reducir la presión sin desbalancear la placa base.',
        criticalRule: 'No soltar completamente un tornillo mientras los otros están apretados a fondo.',
        diagramType: 'twist'
      },
      {
        sec: 6,
        title: 'Torsión Tangencial de 5° a 10°',
        description: 'Efectuar un movimiento suave de cizallamiento horizontal en sentido horario y antihorario para romper el sello térmico de la silicona seca.',
        criticalRule: '¡JAMÁS tirar hacia arriba en vertical! En procesadores PGA, el seguro no retiene el chip contra tracción axial violenta.',
        diagramType: 'twist'
      },
      {
        sec: 12,
        title: 'Separación Suave y Limpieza Inmediata',
        description: 'Una vez libre la adhesión, levantar verticalmente con las dos manos y colocar el disipador sobre el banco con la base hacia arriba.',
        criticalRule: 'Limpiar el IHS de inmediato con alcohol isopropílico al 99.8% antes de que caigan pelusas dentro del zócalo abierto.',
        diagramType: 'twist'
      }
    ]
  },
  {
    id: 'proc-ram-gold',
    title: 'Micro-Pulido de Contactos Dorados de Memoria RAM',
    phase: 'Buses de Memoria DDR4/DDR5',
    totalDurationSec: 16,
    summary: 'Técnica de limpieza con goma de borrar blanca y alcohol dieléctrico para restaurar la impedancia en frecuencias superiores a 3200MHz.',
    steps: [
      {
        sec: 0,
        title: 'Extracción por Bordes del PCB',
        description: 'Abrir los pestillos del slot DIMM y retirar el módulo tomándolo exclusivamente de los cantos laterales sin tocar chips ni contactos dorados.',
        criticalRule: 'Los ácidos grasos del sudor de las manos inician corrosión galvánica sobre el enchapado de oro.',
        diagramType: 'ram'
      },
      {
        sec: 6,
        title: 'Frotado con Goma Blanca No Abrasiva',
        description: 'Pasar suavemente una goma blanca de migajón sobre ambos lados de los pines dorados hasta que recuperen su brillo espejado.',
        criticalRule: 'No utilizar gomas de tinta azul o gomas duras que contengan partículas de piedra pómez; desgastarán la capa de oro.',
        diagramType: 'ram'
      },
      {
        sec: 11,
        title: 'Cepillado Antiestático e Isopropílico',
        description: 'Retirar cualquier brizna con cepillo ESD de cerdas de carbono y limpiar con paño de microfibra humedecido en alcohol isopropílico.',
        criticalRule: 'Asegurar que la ranura esté libre de virutas antes de insertar el módulo de nuevo.',
        diagramType: 'ram'
      }
    ]
  },
  {
    id: 'proc-psu-multimetro',
    title: 'Medición con Multímetro del Conector ATX de 24 Pines',
    phase: 'Diagnóstico de Energía ATX 3.0',
    totalDurationSec: 16,
    summary: 'Verificación de tolerancia de voltajes (+12V, +5V, +3.3V y señal Power Good) bajo especificación ATX True RMS.',
    steps: [
      {
        sec: 0,
        title: 'Prueba de Arranque en Banco (Puente PS-ON)',
        description: 'Unir con un clip el Pin 16 (cable verde PS-ON) con cualquier Pin negro (COM) para arrancar la fuente sin placa madre conectada.',
        criticalRule: 'Conectar un ventilador o carga resistiva mínima antes de puentear para estabilizar los lazos de regulación PWM.',
        diagramType: 'psu'
      },
      {
        sec: 6,
        title: 'Medición del Riel de +12V (Tolerancia ±5%)',
        description: 'Sondear el Pin 10 (+12V cable amarillo) con la punta roja y masa con la punta negra. El valor debe situarse entre 11.40V y 12.60V.',
        criticalRule: 'Valores inferiores a 11.40V bajo carga causan apagados repentinos por activación de protección UVP.',
        diagramType: 'psu'
      },
      {
        sec: 12,
        title: 'Verificación de Señal Power Good (Pin 8 Gris)',
        description: 'Comprobar que el pin 8 entregue +5V estables tras un retardo de 100 a 500 ms tras el encendido.',
        criticalRule: 'Si PG fluctúa o no alcanza los 5V, la placa madre no liberará la línea RESET del procesador y el PC no arrancará.',
        diagramType: 'psu'
      }
    ]
  }
];

export const InteractiveProceduresCenter: React.FC = () => {
  const [activeProcId, setActiveProcId] = useState<string>(PROCEDURES[0].id);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [currentSec, setCurrentSec] = useState<number>(0);
  const [playSpeed, setPlaySpeed] = useState<number>(1);

  const activeProc = PROCEDURES.find(p => p.id === activeProcId) || PROCEDURES[0];

  // Active step calculation based on currentSec
  const activeStepIndex = activeProc.steps.findIndex((s, idx) => {
    const nextSec = activeProc.steps[idx + 1]?.sec ?? activeProc.totalDurationSec;
    return currentSec >= s.sec && currentSec < nextSec;
  });
  const currentStep = activeProc.steps[activeStepIndex >= 0 ? activeStepIndex : 0];

  // Animation timer loop
  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setCurrentSec(prev => {
        const next = prev + 1;
        if (next >= activeProc.totalDurationSec) {
          return 0; // loop
        }
        return next;
      });
    }, 1000 / playSpeed);

    return () => clearInterval(interval);
  }, [isPlaying, playSpeed, activeProc.totalDurationSec]);

  const handleSelectProcedure = (id: string) => {
    soundFx.click();
    setActiveProcId(id);
    setCurrentSec(0);
    setIsPlaying(true);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-mono font-bold text-cyan-600 dark:text-cyan-400 tracking-wider">
          <Sparkles className="w-4 h-4 text-cyan-500" />
          <span>LABORATORIO AUDIOVISUAL INTERACTIVO · 100% DISPONIBLE</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight mt-1">
          Centro de Procedimientos Técnicos Animados
        </h2>
        <p className="text-slate-600 dark:text-slate-300 mt-2 text-sm sm:text-base leading-relaxed max-w-4xl">
          Visualiza animaciones vectoriales de alta precisión paso a paso para cada maniobra técnica fundamental, sin depender de reproductores externos que puedan fallar o ser bloqueados.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left: Interactive Animated Visual Player */}
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm dark:shadow-cyan-950/20">
            
            {/* Visual Screen Canvas / SVG Area */}
            <div className="relative aspect-video w-full bg-slate-950 rounded-2xl border border-slate-800/90 overflow-hidden flex flex-col justify-between p-6 shadow-inner">
              
              {/* Screen Header Info */}
              <div className="flex items-center justify-between text-xs font-mono z-10">
                <span className="text-cyan-400 font-bold flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                  SIMULACIÓN EN VIVO · {activeProc.phase.toUpperCase()}
                </span>
                <span className="text-slate-400">
                  {currentSec}s / {activeProc.totalDurationSec}s
                </span>
              </div>

              {/* Dynamic SVG Visuals based on diagramType */}
              <div className="my-auto flex items-center justify-center">
                {currentStep.diagramType === 'esd' && (
                  <svg viewBox="0 0 400 200" className="w-full max-w-md h-auto">
                    <rect x="20" y="140" width="360" height="40" fill="#0f172a" stroke="#334155" rx="4" />
                    <rect x="40" y="130" width="320" height="20" fill="#0369a1" stroke="#38bdf8" rx="2" />
                    <text x="50" y="144" fill="#e0f2fe" fontSize="9" fontWeight="bold">TAPETE DISIPATIVO 1MΩ</text>
                    <circle cx="200" cy="80" r="35" fill="#1e293b" stroke="#38bdf8" strokeWidth="2" />
                    <text x="175" y="84" fill="#ffffff" fontSize="10" fontWeight="bold">PULSERA ESD</text>
                    <path d="M 200 115 C 200 135, 120 135, 100 160" fill="none" stroke="#22c55e" strokeWidth="2.5" strokeDasharray="4 2" />
                    <text x="70" y="175" fill="#4ade80" fontSize="9" fontWeight="bold">TIERRA FÍSICA ✓</text>
                  </svg>
                )}

                {currentStep.diagramType === 'twist' && (
                  <svg viewBox="0 0 400 200" className="w-full max-w-md h-auto">
                    <rect x="130" y="130" width="140" height="30" fill="#065f46" stroke="#10b981" rx="3" />
                    <text x="165" y="150" fill="#a7f3d0" fontSize="10" fontWeight="bold">SOCKET AM4/AM5</text>
                    <rect x="145" y="120" width="110" height="10" fill="#cbd5e1" stroke="#94a3b8" />
                    <rect 
                      x="135" 
                      y="60" 
                      width="130" 
                      height="58" 
                      fill="#1e293b" 
                      stroke="#38bdf8" 
                      strokeWidth="2" 
                      rx="4"
                      className="transition-transform duration-500"
                      style={{ 
                        transformOrigin: '200px 90px',
                        transform: currentSec >= 6 && currentSec < 12 ? 'rotate(8deg)' : currentSec >= 12 ? 'translateY(-20px)' : 'none'
                      }}
                    />
                    <text x="165" y="94" fill="#38bdf8" fontSize="10" fontWeight="bold">DISIPADOR</text>
                    <path d="M 100 85 C 95 65, 115 50, 130 50" fill="none" stroke="#f59e0b" strokeWidth="3" />
                    <text x="70" y="45" fill="#fbbf24" fontSize="9" fontWeight="bold">GIRO HORIZONTAL 10°</text>
                  </svg>
                )}

                {currentStep.diagramType === 'ram' && (
                  <svg viewBox="0 0 400 200" className="w-full max-w-md h-auto">
                    <rect x="60" y="60" width="280" height="70" fill="#0f766e" stroke="#14b8a6" strokeWidth="2" rx="4" />
                    <rect x="80" y="75" width="40" height="30" fill="#0f172a" stroke="#334155" />
                    <rect x="140" y="75" width="40" height="30" fill="#0f172a" stroke="#334155" />
                    <rect x="200" y="75" width="40" height="30" fill="#0f172a" stroke="#334155" />
                    <rect x="260" y="75" width="40" height="30" fill="#0f172a" stroke="#334155" />
                    <line x1="65" y1="130" x2="335" y2="130" stroke="#f59e0b" strokeWidth="4" strokeDasharray="4 2" />
                    <rect x="180" y="125" width="45" height="25" fill="#f8fafc" stroke="#94a3b8" rx="3" className="animate-pulse" />
                    <text x="188" y="141" fill="#0f172a" fontSize="8" fontWeight="bold">GOMA</text>
                  </svg>
                )}

                {currentStep.diagramType === 'psu' && (
                  <svg viewBox="0 0 400 200" className="w-full max-w-md h-auto">
                    <rect x="60" y="40" width="110" height="130" fill="#0f172a" stroke="#eab308" strokeWidth="2" rx="6" />
                    <rect x="75" y="55" width="80" height="35" fill="#022c22" stroke="#059669" rx="3" />
                    <text x="90" y="78" fill="#34d399" fontSize="14" fontWeight="bold" fontFamily="monospace">12.06 V</text>
                    <rect x="230" y="50" width="120" height="110" fill="#1e293b" stroke="#64748b" rx="4" />
                    <text x="245" y="70" fill="#cbd5e1" fontSize="9" fontWeight="bold">CONECTOR ATX 24P</text>
                    <path d="M 140 140 C 180 140, 200 90, 250 90" fill="none" stroke="#ef4444" strokeWidth="2.5" />
                    <circle cx="250" cy="90" r="4" fill="#eab308" />
                  </svg>
                )}
              </div>

              {/* Progress Scrub Bar */}
              <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden border border-slate-800">
                <div 
                  className="h-full bg-gradient-to-r from-cyan-500 to-emerald-400 transition-all duration-300"
                  style={{ width: `${(currentSec / activeProc.totalDurationSec) * 100}%` }}
                />
              </div>
            </div>

            {/* Playback Controls Strip */}
            <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    soundFx.click();
                    setIsPlaying(!isPlaying);
                  }}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-cyan-400 text-slate-950 font-bold text-xs uppercase transition-colors hover:bg-cyan-300 shadow-sm"
                >
                  {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current" />}
                  <span>{isPlaying ? 'Pausar' : 'Reproducir'}</span>
                </button>

                <button
                  onClick={() => {
                    soundFx.click();
                    setCurrentSec(0);
                  }}
                  title="Reiniciar animación"
                  className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 transition-colors"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>

              {/* Speed Buttons */}
              <div className="flex items-center gap-1.5 bg-slate-50 dark:bg-slate-950 p-1.5 rounded-2xl border border-slate-200 dark:border-slate-800 text-xs font-mono">
                <span className="text-slate-500 dark:text-slate-400 px-2 text-[11px] font-medium">Velocidad:</span>
                {[1, 1.5, 2].map(speed => (
                  <button
                    key={speed}
                    onClick={() => {
                      soundFx.click();
                      setPlaySpeed(speed);
                    }}
                    className={`px-2.5 py-1 rounded-xl transition-colors font-bold ${
                      playSpeed === speed
                        ? 'bg-cyan-500 text-slate-950 shadow-xs'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-950 dark:hover:text-white'
                    }`}
                  >
                    {speed}x
                  </button>
                ))}
              </div>
            </div>

            {/* Current Step Description Card */}
            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-cyan-700 dark:text-cyan-400">
                  FASE ACTIVA: {currentStep.title}
                </span>
                <span className="text-[10px] font-mono text-slate-500">
                  {currentSec}s
                </span>
              </div>

              <p className="text-xs sm:text-sm text-slate-800 dark:text-slate-200 leading-relaxed">
                {currentStep.description}
              </p>

              <div className="p-3.5 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 flex items-start gap-2.5 text-xs text-amber-900 dark:text-amber-200">
                <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-amber-800 dark:text-amber-300 block mb-0.5">Regla Técnica Crítica:</span>
                  {currentStep.criticalRule}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Procedure Selector List */}
        <div className="lg:col-span-4 space-y-3">
          <div className="text-xs font-mono font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-2">
            Catálogo de Procedimientos ({PROCEDURES.length})
          </div>

          {PROCEDURES.map((proc) => {
            const isSelected = proc.id === activeProc.id;
            return (
              <div
                key={proc.id}
                onClick={() => handleSelectProcedure(proc.id)}
                className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                  isSelected
                    ? 'bg-cyan-50/70 dark:bg-slate-900 border-cyan-500 text-cyan-950 dark:text-cyan-300 shadow-sm ring-1 ring-cyan-500/40'
                    : 'bg-white dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-1.5 font-mono">
                  <span className="text-cyan-700 dark:text-cyan-400 font-bold">{proc.phase}</span>
                  <span>{proc.totalDurationSec}s</span>
                </div>

                <h4 className="text-sm font-bold text-slate-900 dark:text-white line-clamp-2">
                  {proc.title}
                </h4>

                <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-1 mt-1">
                  {proc.summary}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
