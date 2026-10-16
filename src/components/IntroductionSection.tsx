import React, { useState } from 'react';
import { soundFx } from '../utils/audio';
import { 
  ShieldCheck, Wrench, Activity, Sparkles, AlertTriangle, 
  Clock, CheckCircle2, TrendingUp, Layers, Cpu, ArrowRight 
} from 'lucide-react';

interface MaintenanceType {
  id: string;
  name: string;
  subtitle: string;
  badge: string;
  badgeColor: string;
  focus: 'Planificado' | 'Reactivo' | 'Basado en Telemetría' | 'Evolutivo';
  frequency: string;
  costImpact: 'Muy Bajo' | 'Alto a Crítico' | 'Moderado' | 'Inversión Retornable';
  downtime: 'Programado (1-2h)' | 'No Planificado (Horas a Días)' | 'Cero (Predictivo)' | 'Programado (30m)';
  description: string;
  keyActions: string[];
  riskIfIgnored: string;
  idealFor: string;
}

const MAINTENANCE_TYPES: MaintenanceType[] = [
  {
    id: 'preventivo',
    name: 'Mantenimiento Preventivo',
    subtitle: 'Intervención periódica programada para mitigar el desgaste',
    badge: 'ESTÁNDAR RECOMENDADO',
    badgeColor: 'border-cyan-500/40 bg-cyan-500/10 text-cyan-700 dark:text-cyan-300',
    focus: 'Planificado',
    frequency: 'Cada 6 a 12 meses',
    costImpact: 'Muy Bajo',
    downtime: 'Programado (1-2h)',
    description: 'Conjunto de acciones de limpieza física profunda, sustitución de interfaz térmica (pasta y thermal pads), lubricación de rodamientos y depuración del sistema operativo ejecutadas antes de que ocurra cualquier síntoma de avería.',
    keyActions: [
      'Soplado de disipadores con bloqueo mecánico de aspas de ventiladores.',
      'Sustitución de pasta térmica degradada por compuesto de alta conductividad (>8.5 W/mK).',
      'Limpieza química de contactos dorados de RAM y ranuras PCIe con isopropílico 99.8%.',
      'Optimización lógica: comandos DISM, SFC scannow y comando TRIM en unidades SSD.'
    ],
    riskIfIgnored: 'El polvo crea una capa de aislamiento térmico; los ventiladores aumentan sus RPM generando ruido y desgaste prematuro, provocando thermal throttling y degradación por electromigración.',
    idealFor: 'Todos los equipos de cómputo en funcionamiento continuo, oficinas, workstations de renderizado y PC gamers.'
  },
  {
    id: 'correctivo',
    name: 'Mantenimiento Correctivo',
    subtitle: 'Reparación y sustitución reactiva ante la manifestación de una falla',
    badge: 'INTERVENCIÓN DE EMERGENCIA',
    badgeColor: 'border-rose-500/40 bg-rose-500/10 text-rose-700 dark:text-rose-300',
    focus: 'Reactivo',
    frequency: 'Bajo demanda (inmediatamente al presentarse la falla)',
    costImpact: 'Alto a Crítico',
    downtime: 'No Planificado (Horas a Días)',
    description: 'Se divide en Contingente (falla crítica que paraliza el equipo, como una fuente de poder en corto o GPU sin video) y Programado (se detecta una pieza deteriorada que aún permite operar temporalmente, programando su recambio inmediato).',
    keyActions: [
      'Aislamiento del componente fallido mediante códigos de sonido POST o EZ Debug LEDs.',
      'Medición de rieles de voltaje ATX (+12V, +5V, +3.3V) con multímetro digital True-RMS.',
      'Sustitución de componentes averiados (fuente de poder, tarjeta madre, módulos de RAM).',
      'Recuperación de sistema operativo tras corrupción severa de sectores o fallo de arranque.'
    ],
    riskIfIgnored: 'Un componente en cortocircuito (como un MOSFET VRM degradado) puede enviar picos de sobretensión al microprocesador, destruyéndolo de forma irreversible.',
    idealFor: 'Equipos que ya presentan anomalías evidentes: apagados súbitos, pantallas azules BSOD, reinicios o ausencia de señal de video.'
  },
  {
    id: 'predictivo',
    name: 'Mantenimiento Predictivo',
    subtitle: 'Monitoreo en tiempo real de telemetría y variables físicas',
    badge: 'INDUSTRIA 4.0 / PROACTIVO',
    badgeColor: 'border-violet-500/40 bg-violet-500/10 text-violet-700 dark:text-violet-300',
    focus: 'Basado en Telemetría',
    frequency: 'Monitoreo continuo mediante software de telemetría',
    costImpact: 'Moderado',
    downtime: 'Cero (Predictivo)',
    description: 'Técnica avanzada que evalúa la salud de los componentes a través del análisis de datos de sensores: temperatura del CPU/GPU Package, consumo de corriente (Amperios), desgaste de celdas NAND (TBW), y atributos SMART en discos duros.',
    keyActions: [
      'Supervisión de atributos SMART: 05 (Sectores Reasignados), 05/C5 en SSDs y horas de encendido.',
      'Monitoreo de curvas de temperatura y respuesta de ventiladores mediante HWiNFO64.',
      'Detección de caídas de tensión (vDroop) en la línea de +12V bajo cargas de estrés Cinebench/FurMark.',
      'Cálculo de vida útil remanente (DWPD / TBW) en unidades de estado sólido.'
    ],
    riskIfIgnored: 'Pérdida imprevista de datos críticos cuando un SSD agota sus ciclos de lectura/escritura sin previo aviso físico.',
    idealFor: 'Servidores, centros de datos, estaciones de trabajo de misión crítica y laboratorios corporativos.'
  },
  {
    id: 'evolutivo',
    name: 'Mantenimiento Evolutivo (Upgrades)',
    subtitle: 'Actualización y modernización para extender la vida útil tecnológica',
    badge: 'OPTIMIZACIÓN DE VALOR',
    badgeColor: 'border-emerald-500/40 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300',
    focus: 'Evolutivo',
    frequency: 'Cada 2 a 4 años según requerimientos de software',
    costImpact: 'Inversión Retornable',
    downtime: 'Programado (30m)',
    description: 'Sustitución estratégica de componentes clave para evitar la obsolescencia programada y multiplicar el rendimiento general sin necesidad de desechar todo el equipo.',
    keyActions: [
      'Migración obligatoria de discos mecánicos HDD a unidades de estado sólido SSD NVMe Gen4/Gen5.',
      'Ampliación de memoria RAM a configuraciones Dual-Channel de 32GB o 64GB.',
      'Actualización de firmware BIOS/UEFI a la última versión AGESA/Microcode estable.',
      'Reemplazo de disipadores de stock por torres de refrigeración de heatpipes de cobre o AIO.'
    ],
    riskIfIgnored: 'Incompatibilidad con nuevos estándares de software y cuellos de botella de rendimiento severos.',
    idealFor: 'Equipos funcionales que necesitan mayor fluidez para diseño, programación o multitarea exigente.'
  }
];

export const IntroductionSection: React.FC = () => {
  const [selectedTypeId, setSelectedTypeId] = useState<string>('preventivo');
  const activeType = MAINTENANCE_TYPES.find(t => t.id === selectedTypeId) || MAINTENANCE_TYPES[0];

  return (
    <div className="space-y-10">
      
      {/* Top Banner: What is Computer Maintenance? */}
      <div className="tech-card rounded-3xl p-6 sm:p-8 relative overflow-hidden bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm dark:shadow-cyan-950/20">
        {/* Glow corner */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/5 dark:bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 max-w-4xl space-y-4">
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-cyan-700 dark:text-cyan-400 uppercase tracking-wider">
            <Sparkles className="w-4 h-4 text-cyan-500" />
            <span>FUNDAMENTOS DE INGENIERÍA · CONCEPTO CLAVE</span>
          </div>

          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight">
            ¿Qué es el Mantenimiento de Equipos de Cómputo?
          </h2>

          <p className="text-sm sm:text-base text-slate-700 dark:text-slate-200 leading-relaxed">
            El <strong>Mantenimiento de Equipos de Cómputo</strong> es el conjunto sistemático y estandarizado de procedimientos técnicos —tanto físicos (hardware) como lógicos (software)— diseñados para preservar la integridad operativa, maximizar la tasa de transferencia térmica, prevenir fallas catastróficas y extender la vida útil de los semiconductores y periféricos.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-slate-200 dark:border-slate-800/80">
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800">
              <div className="text-xs font-mono font-bold text-cyan-700 dark:text-cyan-400 mb-1">01. PREVENCIÓN TÉRMICA</div>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                El calor excesivo degrada la silicona y causa <em>electromigración</em>. Mantener el delta térmico bajo previene la muerte prematura del silicio.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800">
              <div className="text-xs font-mono font-bold text-violet-700 dark:text-violet-400 mb-1">02. SALVAGUARDA DE DATOS</div>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                El polvo y la falta de TRIM en SSDs colapsan los índices de archivos y aceleran el desgaste de celdas de almacenamiento.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800">
              <div className="text-xs font-mono font-bold text-emerald-700 dark:text-emerald-400 mb-1">03. RETORNO DE INVERSIÓN (ROI)</div>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                Un mantenimiento preventivo regular cuesta menos del 5% del valor de sustitución de una tarjeta madre o tarjeta gráfica gamer averiada.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* The 4 Types of Maintenance Grid */}
      <div className="space-y-6">
        <div>
          <div className="text-xs font-mono font-bold text-cyan-700 dark:text-cyan-400 tracking-wider">
            TAXONOMÍA OPERATIVA
          </div>
          <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight mt-1">
            Los 4 Tipos Fundamentales de Mantenimiento
          </h3>
          <p className="text-slate-600 dark:text-slate-300 text-sm mt-1 max-w-3xl">
            Comprende las diferencias metodológicas, costos, impacto en el tiempo de inactividad (*downtime*) y riesgos asociados a cada estrategia de mantenimiento.
          </p>
        </div>

        {/* 4 Interactive Selector Tabs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {MAINTENANCE_TYPES.map(type => {
            const isSelected = type.id === activeType.id;
            return (
              <button
                key={type.id}
                onClick={() => {
                  soundFx.click();
                  setSelectedTypeId(type.id);
                }}
                className={`p-4 rounded-2xl text-left border transition-all relative overflow-hidden ${
                  isSelected
                    ? 'bg-cyan-50 dark:bg-cyan-950/40 border-cyan-500 shadow-sm ring-1 ring-cyan-500/50'
                    : 'bg-white dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border ${type.badgeColor}`}>
                    {type.focus}
                  </span>
                  {isSelected && <span className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse" />}
                </div>

                <div className="text-sm font-bold text-slate-900 dark:text-white mb-1">
                  {type.name}
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">
                  {type.subtitle}
                </div>
              </button>
            );
          })}
        </div>

        {/* Active Type Deep Breakdown Card */}
        <div className="tech-card rounded-3xl p-6 sm:p-8 space-y-6 bg-white dark:bg-slate-900 border border-cyan-500/30 shadow-sm dark:shadow-cyan-950/20">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800/80">
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <span className={`text-xs font-mono font-bold px-2.5 py-0.5 rounded-full border ${activeType.badgeColor}`}>
                  {activeType.badge}
                </span>
                <span className="text-xs font-mono text-slate-500 dark:text-slate-400">· {activeType.focus}</span>
              </div>
              <h4 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                {activeType.name}
              </h4>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-1 max-w-2xl">
                {activeType.subtitle}
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 shrink-0 text-xs font-mono">
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800">
                <span className="text-slate-500 dark:text-slate-400 block text-[10px]">FRECUENCIA</span>
                <span className="text-cyan-700 dark:text-cyan-300 font-bold">{activeType.frequency}</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800">
                <span className="text-slate-500 dark:text-slate-400 block text-[10px]">COSTO RELATIVO</span>
                <span className="text-emerald-700 dark:text-emerald-400 font-bold">{activeType.costImpact}</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 col-span-2 sm:col-span-1">
                <span className="text-slate-500 dark:text-slate-400 block text-[10px]">DOWNTIME</span>
                <span className="text-amber-700 dark:text-amber-300 font-bold">{activeType.downtime}</span>
              </div>
            </div>
          </div>

          {/* Description & Key actions */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-7 space-y-4">
              <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-200 leading-relaxed">
                {activeType.description}
              </p>

              <div>
                <h5 className="text-xs font-bold font-mono text-cyan-700 dark:text-cyan-400 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-cyan-500" />
                  <span>Protocolo de Acciones Principales</span>
                </h5>
                <div className="space-y-2">
                  {activeType.keyActions.map((action, idx) => (
                    <div key={idx} className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800/80 text-xs text-slate-800 dark:text-slate-200">
                      <span className="w-5 h-5 rounded-full bg-cyan-500/10 dark:bg-cyan-500/20 text-cyan-700 dark:text-cyan-300 font-mono font-bold flex items-center justify-center shrink-0 mt-0.5 text-[11px]">
                        {idx + 1}
                      </span>
                      <span className="leading-relaxed">{action}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 space-y-4">
              {/* Critical Risk if ignored */}
              <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/50 space-y-1.5">
                <div className="flex items-center gap-2 text-xs font-bold text-rose-700 dark:text-rose-300 uppercase tracking-wider">
                  <AlertTriangle className="w-4 h-4 text-rose-500" />
                  <span>Riesgo Crítico si se Omite</span>
                </div>
                <p className="text-xs text-rose-900 dark:text-rose-200/90 leading-relaxed">
                  {activeType.riskIfIgnored}
                </p>
              </div>

              {/* Ideal Audience / Application */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/90 border border-slate-200 dark:border-slate-800 space-y-1.5">
                <div className="flex items-center gap-2 text-xs font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider">
                  <TrendingUp className="w-4 h-4 text-emerald-500" />
                  <span>Ámbito de Aplicación Óptimo</span>
                </div>
                <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                  {activeType.idealFor}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
