import React, { useState } from 'react';
import { Cpu, Wind, ShieldCheck, AlertTriangle, Layers, Disc, CheckCircle, Wrench } from 'lucide-react';

interface ProtocolStep {
  id: string;
  number: string;
  title: string;
  subtitle: string;
  procedure: string[];
  criticalRule: string;
  technicalReason: string;
  diagramType: 'fans' | 'cooler' | 'ram' | 'torque';
}

const STEPS: ProtocolStep[] = [
  {
    id: 'ventiladores',
    number: '01',
    title: 'Soplado Seguro de Polvo y Bloqueo de Aspas',
    subtitle: 'Protección absoluta contra inducción de fem inversa (fuerza contraelectromotriz)',
    procedure: [
      'Trabar físicamente las aspas del ventilador insertando un spudger de plástico, palillo de madera o sujetándolo con un dedo antes de disparar aire comprimido.',
      'Soplar en ráfagas cortas de 2 a 3 segundos a unos 15 cm de distancia.',
      'Limpiar el frente y el reverso del marco y las aspas con un paño humedecido en alcohol isopropílico para retirar la película de hollín electrostático.',
      'Comprobar la suavidad de giro manual; si produce chirrido, el rodamiento (bearing) está desgastado y requiere cambio.'
    ],
    criticalRule: '¡NUNCA PERMITAS QUE UN VENTILADOR GIRE A REVOLUCIONES EXTREMAS POR ACCIÓN DEL AIRE A PRESIÓN!',
    technicalReason: 'Un motor DC sin escobillas actúa como generador eléctrico (efecto dinamo). Al girar forzado a más de 5,000 RPM, inyecta corriente inversa de vuelta a los cabezales PWM de 4 pines de la placa madre, quemando transistores SMD y dañando los bujes por fricción térmica.',
    diagramType: 'fans'
  },
  {
    id: 'cooler-cpu',
    number: '02',
    title: 'Desmontaje de Disipador de CPU y Técnica de Giro',
    subtitle: 'Prevención de extracción accidental del procesador del socket (PGA / AM4)',
    procedure: [
      'Aflojar los tornillos o ganchos de retención del disipador de forma alternada y progresiva.',
      'NUNCA jalar el disipador verticalmente hacia arriba de golpe. Si la pasta térmica original está seca o cristalizada, actúa como un pegamento epóxico.',
      'Efectuar un movimiento de torsión suave (girar en sentido horario y antihorario unos 5 a 10 grados) hasta sentir que la pasta cede.',
      'Retirar el bloque hacia arriba una vez liberada la tensión de vacío.',
      'Limpiar el IHS de la CPU con una toalla de microfibra humedecida en isopropílico al 99.8% desde el centro hacia afuera.'
    ],
    criticalRule: 'Jalar verticalmente un disipador con pasta reseca en un socket PGA (ej. AMD AM4) arrancará el procesador del socket bloqueado, doblando o partiendo pines microscópicos.',
    technicalReason: 'La rotura por tensión superficial de compuestos térmicos de silicona solidificada requiere cizallamiento tangencial (giro), no tracción axial directa.',
    diagramType: 'cooler'
  },
  {
    id: 'ram-pcie',
    number: '03',
    title: 'Limpieza de Memoria RAM y Contactos Dorados',
    subtitle: 'Eliminación de micro-óxidos y polvo en los buses de alta frecuencia DDR4/DDR5',
    procedure: [
      'Desbloquear los clips eyectores superiores del zócalo DIMM y retirar el módulo sujetándolo únicamente por los extremos del PCB.',
      'Frotar con suavidad una goma de borrar de migajón blanca (libre de abrasivos) sobre los contactos dorados para remover la película de óxido superficial.',
      'Limpiar cualquier residuo de goma con un cepillo antiestático y pasar un paño con alcohol isopropílico al 99.8%.',
      'Soplar aire dentro de la ranura DIMM de la placa para expulsar pelusas.',
      'Reinstalar en las ranuras prioritarias (A2 y B2 en placas de 4 slots para habilitar Dual Channel óptimo) presionando firmemente hasta escuchar el clic.'
    ],
    criticalRule: 'No tocar jamás los contactos dorados con los dedos desnudos: los aceites y ácidos grasos naturales de la piel aceleran la corrosión galvánica del enchapado en oro.',
    technicalReason: 'A frecuencias de 3200MHz a 6400MHz, la impedancia de contacto es ultra sensible. Una micropartícula de polvo o grasa distorsiona la integridad de señal, provocando cuelgues aleatorios y BSODs.',
    diagramType: 'ram'
  },
  {
    id: 'secuencia-torque',
    number: '04',
    title: 'Fijación Mecánica y Torque en Cruz',
    subtitle: 'Presión homogénea sobre el IHS para evitar flexión del socket y del silicio',
    procedure: [
      'Colocar el bloque del disipador perfectamente alineado sobre los postes sin deslizarlo lateralmente para no deformar el patrón de pasta térmica.',
      'Comenzar con el tornillo superior izquierdo (1) girando solo 1 vuelta sin apretar a fondo.',
      'Pasar al tornillo inferior derecho en diagonal (2) y girar 1 vuelta.',
      'Pasar al tornillo superior derecho (3) girando 1 vuelta, y finalmente al inferior izquierdo (4).',
      'Repetir el ciclo de 1 vuelta por tornillo hasta que los topes de resorte hagan contacto firme con los postes.'
    ],
    criticalRule: 'Apretar un tornillo al 100% antes de iniciar los demás provoca que la pasta térmica sea empujada hacia un solo extremo y dobla las pistas internas del PCB de la placa madre.',
    technicalReason: 'La presión irregular en sockets densos (LGA1700 con 1700 pines o AM5 con 1718 pines) hace que ciertos pines pierdan contacto con los pads del CPU, inutilizando canales de RAM o carriles PCIe.',
    diagramType: 'torque'
  }
];

export const HardwareProtocolSection: React.FC = () => {
  const [activeStepId, setActiveStepId] = useState<string>('ventiladores');
  const currentStep = STEPS.find(s => s.id === activeStepId) || STEPS[0];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-mono font-bold text-cyan-600 dark:text-cyan-400 tracking-wider">
          <Wrench className="w-4 h-4 text-cyan-500" />
          <span>FASE 03 · PROTOCOLO DE INTERVENCIÓN FÍSICA</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight mt-1">
          Ejecución del Mantenimiento Preventivo de Hardware
        </h2>
        <p className="text-slate-600 dark:text-slate-300 mt-2 text-sm sm:text-base leading-relaxed max-w-4xl">
          Protocolos estandarizados de taller para desensamble seguro, preservación de circuitería integrada, técnicas de limpieza de contactos y fijación mecánica sin fatiga de materiales.
        </p>
      </div>

      {/* Steps Navigation Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {STEPS.map((step) => {
          const isActive = step.id === activeStepId;
          return (
            <button
              key={step.id}
              onClick={() => setActiveStepId(step.id)}
              className={`p-4 rounded-2xl text-left border transition-all ${
                isActive
                  ? 'bg-cyan-50/70 dark:bg-slate-900 border-cyan-500 text-cyan-950 dark:text-cyan-300 shadow-sm ring-1 ring-cyan-500/30'
                  : 'bg-white dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className={`text-xs font-mono font-bold ${isActive ? 'text-cyan-700 dark:text-cyan-400' : 'text-slate-500'}`}>
                  PASO {step.number}
                </span>
                {isActive && <CheckCircle className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />}
              </div>
              <div className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white truncate">
                {step.title}
              </div>
            </button>
          );
        })}
      </div>

      {/* Active Step Presentation */}
      <div className="bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm dark:shadow-cyan-950/20">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
          <div>
            <div className="text-xs font-mono text-cyan-600 dark:text-cyan-400 font-bold mb-1">
              PROCEDIMIENTO OPERATIVO ESTANDARIZADO · PASO {currentStep.number}
            </div>
            <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
              {currentStep.title}
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-1">
              {currentStep.subtitle}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-6">
          {/* Left: Procedure steps */}
          <div className="lg:col-span-7 space-y-4">
            <h4 className="text-xs font-mono font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
              Secuencia de Ejecución de Taller
            </h4>
            
            <div className="space-y-3">
              {currentStep.procedure.map((item, index) => (
                <div key={index} className="flex items-start gap-3 p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800/80">
                  <span className="w-6 h-6 rounded-full bg-cyan-100 dark:bg-cyan-500/10 border border-cyan-300 dark:border-cyan-500/30 text-cyan-800 dark:text-cyan-300 text-xs font-mono font-bold flex items-center justify-center shrink-0 mt-0.5">
                    {index + 1}
                  </span>
                  <p className="text-xs sm:text-sm text-slate-800 dark:text-slate-200 leading-relaxed">
                    {item}
                  </p>
                </div>
              ))}
            </div>

            {/* Critical Rule Box */}
            <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/50 mt-4">
              <div className="flex items-start gap-2.5">
                <AlertTriangle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
                <div>
                  <span className="text-xs font-bold text-rose-700 dark:text-rose-300 uppercase tracking-wider">
                    Regla de Oro Inviolable
                  </span>
                  <p className="text-xs sm:text-sm text-rose-900 dark:text-rose-200 mt-1 font-medium leading-relaxed">
                    {currentStep.criticalRule}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Technical Reason & Visual Schematic */}
          <div className="lg:col-span-5 space-y-4 flex flex-col justify-between">
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
              <h5 className="text-xs font-mono font-bold text-cyan-700 dark:text-cyan-400 uppercase tracking-wider mb-2">
                Fundamento Físico e Ingeniería
              </h5>
              <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                {currentStep.technicalReason}
              </p>
            </div>

            {/* Schematic Visual Box based on diagramType */}
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-center min-h-[220px] shadow-inner">
              {currentStep.diagramType === 'fans' && (
                <div className="text-center w-full">
                  <div className="relative w-36 h-36 mx-auto mb-3">
                    <svg viewBox="0 0 100 100" className="w-full h-full">
                      {/* Fan Frame */}
                      <rect x="5" y="5" width="90" height="90" rx="8" fill="#0f172a" stroke="#38bdf8" strokeWidth="2" />
                      {/* Center Hub */}
                      <circle cx="50" cy="50" r="18" fill="#1e293b" stroke="#0ea5e9" strokeWidth="2" />
                      {/* Blades */}
                      <path d="M 50 32 C 60 15, 75 15, 68 30 Z" fill="#38bdf8" opacity="0.8" />
                      <path d="M 68 50 C 85 60, 85 75, 70 68 Z" fill="#38bdf8" opacity="0.8" />
                      <path d="M 50 68 C 40 85, 25 85, 32 70 Z" fill="#38bdf8" opacity="0.8" />
                      <path d="M 32 50 C 15 40, 15 25, 30 32 Z" fill="#38bdf8" opacity="0.8" />
                      {/* Blocking Tool / Spudger */}
                      <line x1="5" y1="20" x2="52" y2="40" stroke="#f43f5e" strokeWidth="4" strokeLinecap="round" />
                      <text x="10" y="16" fill="#f43f5e" fontSize="7" fontWeight="bold">BLOQUEO OBLIGATORIO</text>
                    </svg>
                  </div>
                  <span className="text-[11px] text-slate-400 font-mono">
                    Spudger o dedo bloqueando aspas contra rotación libre
                  </span>
                </div>
              )}

              {currentStep.diagramType === 'cooler' && (
                <div className="text-center w-full">
                  <div className="relative w-40 h-28 mx-auto mb-2">
                    <svg viewBox="0 0 120 80" className="w-full h-full">
                      {/* CPU Socket & Base */}
                      <rect x="25" y="55" width="70" height="15" rx="2" fill="#064e3b" stroke="#10b981" />
                      <text x="42" y="66" fill="#6ee7b7" fontSize="8" fontWeight="bold">SOCKET / CPU</text>
                      {/* Thermal Paste Layer */}
                      <rect x="35" y="50" width="50" height="5" fill="#94a3b8" />
                      {/* Cooler Base */}
                      <rect x="20" y="20" width="80" height="30" rx="3" fill="#1e293b" stroke="#38bdf8" strokeWidth="1.5" />
                      <text x="35" y="38" fill="#38bdf8" fontSize="9" fontWeight="bold">DISIPADOR</text>
                      {/* Twisting Arrows */}
                      <path d="M 12 35 C 10 25, 20 15, 30 15" fill="none" stroke="#f59e0b" strokeWidth="2" />
                      <path d="M 108 35 C 110 45, 100 55, 90 55" fill="none" stroke="#f59e0b" strokeWidth="2" />
                    </svg>
                  </div>
                  <span className="text-[11px] text-amber-300 font-semibold font-mono">
                    Giro lateral de 5° a 10° para romper la adhesión antes de alzar
                  </span>
                </div>
              )}

              {currentStep.diagramType === 'ram' && (
                <div className="text-center w-full">
                  <div className="relative w-44 h-24 mx-auto mb-2">
                    <svg viewBox="0 0 140 70" className="w-full h-full">
                      {/* RAM PCB */}
                      <rect x="10" y="15" width="120" height="30" rx="2" fill="#0f766e" stroke="#14b8a6" strokeWidth="1.5" />
                      {/* Memory Chips */}
                      <rect x="20" y="20" width="18" height="15" fill="#0f172a" stroke="#334155" />
                      <rect x="45" y="20" width="18" height="15" fill="#0f172a" stroke="#334155" />
                      <rect x="75" y="20" width="18" height="15" fill="#0f172a" stroke="#334155" />
                      <rect x="100" y="20" width="18" height="15" fill="#0f172a" stroke="#334155" />
                      {/* Gold Pins */}
                      <line x1="12" y1="46" x2="128" y2="46" stroke="#fbbf24" strokeWidth="3" strokeDasharray="3 1" />
                      {/* White Eraser */}
                      <rect x="58" y="44" width="24" height="14" rx="2" fill="#f8fafc" stroke="#94a3b8" />
                      <text x="61" y="54" fill="#0f172a" fontSize="7" fontWeight="bold">GOMA</text>
                    </svg>
                  </div>
                  <span className="text-[11px] text-slate-400 font-mono">
                    Goma blanca suave sobre contactos dorados + isopropílico 99.8%
                  </span>
                </div>
              )}

              {currentStep.diagramType === 'torque' && (
                <div className="text-center w-full">
                  <div className="relative w-36 h-36 mx-auto mb-2">
                    <svg viewBox="0 0 100 100" className="w-full h-full">
                      {/* Cooler Plate */}
                      <rect x="15" y="15" width="70" height="70" rx="8" fill="#0f172a" stroke="#38bdf8" strokeWidth="2" />
                      {/* CPU Center */}
                      <rect x="35" y="35" width="30" height="30" fill="#065f46" stroke="#34d399" />
                      <text x="39" y="52" fill="#a7f3d0" fontSize="8" fontWeight="bold">IHS CPU</text>
                      {/* Screws 1 to 4 with Cross Arrows */}
                      <circle cx="25" cy="25" r="7" fill="#ef4444" />
                      <text x="22" y="28" fill="#fff" fontSize="9" fontWeight="bold">1</text>
                      
                      <circle cx="75" cy="75" r="7" fill="#ef4444" />
                      <text x="72" y="78" fill="#fff" fontSize="9" fontWeight="bold">2</text>
                      
                      <circle cx="75" cy="25" r="7" fill="#3b82f6" />
                      <text x="72" y="28" fill="#fff" fontSize="9" fontWeight="bold">3</text>
                      
                      <circle cx="25" cy="75" r="7" fill="#3b82f6" />
                      <text x="22" y="78" fill="#fff" fontSize="9" fontWeight="bold">4</text>

                      {/* Diagonal lines */}
                      <line x1="28" y1="28" x2="72" y2="72" stroke="#ef4444" strokeWidth="1.5" strokeDasharray="3 2" />
                      <line x1="72" y1="28" x2="28" y2="72" stroke="#3b82f6" strokeWidth="1.5" strokeDasharray="3 2" />
                    </svg>
                  </div>
                  <span className="text-[11px] text-cyan-300 font-semibold font-mono">
                    Secuencia 1 → 2 → 3 → 4 progresiva (1/2 vuelta por ciclo)
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
