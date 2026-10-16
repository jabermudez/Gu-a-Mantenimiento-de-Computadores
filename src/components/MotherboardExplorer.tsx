import React, { useState } from 'react';
import { soundFx } from '../utils/audio';
import { Cpu, Zap, Layers, AlertCircle, CheckCircle2, Info, Search, Sparkles } from 'lucide-react';

interface ComponentInfo {
  id: string;
  name: string;
  category: string;
  coords: { x: number; y: number; w: number; h: number };
  spec: string;
  maintenanceProtocol: string;
  failureSymptom: string;
  proTip: string;
}

const COMPONENTS: ComponentInfo[] = [
  {
    id: 'socket',
    name: 'Socket CPU (LGA 1718 / AM5 & LGA 1700)',
    category: 'Procesamiento',
    coords: { x: 195, y: 75, w: 90, h: 90 },
    spec: 'Matriz de pines Land Grid Array (LGA) con contactos de aleación dorada con resorte microscópico.',
    maintenanceProtocol: 'NUNCA tocar los pines con los dedos, pinceles, paños o aire a alta presión a corta distancia. Para retirar una pelusa caída en el socket, utilizar una aguja de acupuntura bajo microscopio.',
    failureSymptom: 'Un solo pin torcido o con suciedad puede deshabilitar el controlador de memoria integrado (IMC), provocando que uno de los dos canales de RAM no sea detectado.',
    proTip: 'Al instalar el CPU, alinearlo únicamente por la marca del triángulo dorado en la esquina sin ejercer presión hacia abajo; la palanca ILM aplica la fuerza necesaria.'
  },
  {
    id: 'vrm',
    name: 'Fases de Poder VRM (Voltage Regulator Module)',
    category: 'Alimentación',
    coords: { x: 100, y: 65, w: 85, h: 105 },
    spec: 'Etapas de potencia MOSFETs Smart Power Stages (SPS 60A-105A), bobinas de ferrita Chokes y disipador de aluminio anodizado.',
    maintenanceProtocol: 'Inspeccionar los thermal pads entre los MOSFETs y los disipadores. Si están desintegrados o rezuman aceite de silicona degradado, sustituirlos por pads de 1.0mm o 1.5mm con conductividad >6.0 W/mK.',
    failureSymptom: 'Thermal Throttling severo del procesador (la frecuencia cae a 800MHz súbitamente) si el VRM supera los 105°C de temperatura.',
    proTip: 'Limpiar el polvo entre las aletas del disipador de VRM con aire comprimido en ráfagas suaves.'
  },
  {
    id: 'dimm',
    name: 'Ranuras DIMM DDR5 (Dual Channel)',
    category: 'Memoria',
    coords: { x: 300, y: 65, w: 75, h: 125 },
    spec: '4 zócalos de 288 pines con contactos bañados en oro duro de 15 a 30 micro-pulgadas.',
    maintenanceProtocol: 'Instalar siempre en las ranuras prioritarias 2 y 4 (A2 y B2) para configuraciones de dos módulos. La topología Daisy Chain de la placa base requiere esta disposición para evitar reflexiones de señal a altas frecuencias (>6000MT/s).',
    failureSymptom: 'Pitidos continuos al encender, reinicios aleatorios o fallo al activar el perfil XMP/EXPO.',
    proTip: 'Soplar aire dentro de la ranura y limpiar los contactos dorados del módulo de RAM con goma blanca suave.'
  },
  {
    id: 'pcie',
    name: 'Ranura PCIe 5.0 x16 Reforzada (Steel Armor)',
    category: 'Expansión / Gráficos',
    coords: { x: 110, y: 195, w: 180, h: 28 },
    spec: 'Bus serie de alta velocidad (hasta 128 GB/s en PCIe 5.0) con refuerzo metálico de anclaje para tarjetas gráficas de triple ventilador.',
    maintenanceProtocol: 'Presionar SIEMPRE la pestaña de liberación plástica (latch o botón PCIe Release) antes de tirar de la tarjeta gráfica hacia arriba. Tirar con el seguro bloqueado arranca el zócalo de la placa base.',
    failureSymptom: 'Pantalla negra, distorsiones visuales (artefactos) o el GPU opera en modo degradado a x4 o x1 en lugar de x16.',
    proTip: 'Aplicar limpiador de contactos electrónicos de residuo cero en la ranura PCIe si el equipo estuvo en ambientes con humo o polvo.'
  },
  {
    id: 'm2',
    name: 'Disipador y Ranura M.2 NVMe PCIe 4.0/5.0',
    category: 'Almacenamiento',
    coords: { x: 130, y: 235, w: 120, h: 32 },
    spec: 'Interfaz M-Key de 4 carriles PCIe. Incluye disipador de aluminio extruido con thermal pad azul.',
    maintenanceProtocol: '¡ATENCIÓN! Retirar siempre el film plástico transparente protector del thermal pad antes de colocar el disipador metálico sobre el SSD. Dejar el plástico actúa como aislante y sobrecalienta el controlador a más de 85°C.',
    failureSymptom: 'El disco NVMe desaparece en mitad de transferencias pesadas o la velocidad de lectura cae de 7000 MB/s a 50 MB/s por estrangulamiento térmico.',
    proTip: 'Asegurar el tornillo M.2 con destornillador de precisión PH00 sin apretar excesivamente para no flexionar el PCB del SSD.'
  },
  {
    id: 'front-panel',
    name: 'Cabezal del Panel Frontal (JFP1 / Front Panel)',
    category: 'Control / E/S',
    coords: { x: 300, y: 310, w: 60, h: 35 },
    spec: 'Bloque de pines para POWER_SW, RESET_SW, HDD_LED (con polaridad +/-) y POWER_LED.',
    maintenanceProtocol: 'Los pines de interruptores (Power y Reset) no tienen polaridad (son solo un contacto momentáneo a tierra). Los pines de LEDs sí tienen polaridad estricta (+ hacia ánodo, - hacia cátodo).',
    failureSymptom: 'El equipo no enciende al presionar el botón frontal del gabinete, o la luz de actividad del disco permanece apagada.',
    proTip: 'Para probar la placa fuera del gabinete, puentear momentáneamente los dos pines de POWER_SW con la punta de un destornillador plano.'
  },
  {
    id: 'debug-leds',
    name: 'LEDs de Diagnóstico Rápido (EZ Debug LEDs)',
    category: 'Diagnóstico',
    coords: { x: 345, y: 40, w: 35, h: 22 },
    spec: '4 micro-diodos SMD: CPU (rojo), DRAM (amarillo), VGA (blanco), BOOT (verde).',
    maintenanceProtocol: 'Observar cuál LED queda encendido de forma fija durante el POST para identificar qué subsistema impide el arranque sin necesidad de altavoz de beeps.',
    failureSymptom: 'Si el LED DRAM queda fijo, la placa base no puede negociar frecuencias con la memoria RAM instalada.',
    proTip: 'Si cambias de procesador o memoria, el primer arranque con DDR5 puede tardar hasta 2 minutos entrenando la memoria (Memory Training); no apagar el equipo mientras DRAM parpadea.'
  }
];

export const MotherboardExplorer: React.FC = () => {
  const [activeCompId, setActiveCompId] = useState<string>('socket');

  const activeComp = COMPONENTS.find(c => c.id === activeCompId) || COMPONENTS[0];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-mono font-bold text-cyan-600 dark:text-cyan-400 tracking-wider">
          <Cpu className="w-4 h-4 text-cyan-500" />
          <span>ARQUITECTURA DE HARDWARE · ESQUEMA TOPOLÓGICO</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight mt-1">
          Explorador de Componentes Críticos de la Placa Madre
        </h2>
        <p className="text-slate-600 dark:text-slate-300 mt-2 text-sm sm:text-base leading-relaxed max-w-4xl">
          Selecciona cada bloque funcional del diagrama para conocer su especificación técnica, síntomas de falla por suciedad o desgaste y protocolo estandarizado de limpieza.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left: Interactive Motherboard Schematic */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-7 shadow-sm dark:shadow-cyan-950/20">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <Cpu className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Esquema ATX (Zócalo, VRMs, DIMMs y Buses)
              </h3>
            </div>
            <span className="text-xs font-mono font-bold text-cyan-600 dark:text-cyan-400 px-2.5 py-1 rounded-full bg-cyan-50 dark:bg-cyan-950/60 border border-cyan-200 dark:border-cyan-800">
              {COMPONENTS.length} PUNTOS DE INSPECCIÓN
            </span>
          </div>

          {/* High-Tech Technical Viewport */}
          <div className="relative bg-slate-950 rounded-2xl p-4 sm:p-6 border border-slate-800/90 flex items-center justify-center overflow-hidden shadow-inner">
            <div className="absolute top-2 left-3 flex items-center gap-1.5 text-[10px] font-mono text-cyan-400/80">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
              <span>PCB TOPOLOGY · ATX FORM FACTOR</span>
            </div>
            <div className="absolute bottom-2 right-3 text-[10px] font-mono text-slate-500">
              CLIC PARA INSPECCIONAR BLOQUE
            </div>

            <svg viewBox="0 0 420 370" className="w-full h-auto max-w-[460px] pt-4 pb-2">
              {/* PCB Base */}
              <rect x="20" y="20" width="380" height="330" rx="10" fill="#064e3b" stroke="#059669" strokeWidth="2.5" />
              
              {/* Motherboard Grid Lines (Copper traces) */}
              <path d="M 40 50 L 100 50 L 100 120" stroke="#047857" strokeWidth="1.5" fill="none" />
              <path d="M 285 100 L 300 100" stroke="#047857" strokeWidth="2" fill="none" />
              <path d="M 120 225 L 120 270 L 220 270" stroke="#047857" strokeWidth="1.5" fill="none" />

              {/* Rear I/O Shield Area */}
              <rect x="25" y="25" width="45" height="150" fill="#1e293b" stroke="#475569" rx="3" />
              <text x="32" y="105" fill="#94a3b8" fontSize="8" fontWeight="bold" transform="rotate(-90, 32, 105)">PUERTOS TRASEROS I/O</text>

              {/* Motherboard 24-Pin ATX Power Header */}
              <rect x="365" y="80" width="25" height="90" fill="#0f172a" stroke="#475569" rx="2" />
              <text x="372" y="130" fill="#cbd5e1" fontSize="7" fontWeight="bold" transform="rotate(90, 372, 130)">ATX 24P</text>

              {/* Chipset PCH Heatsink */}
              <rect x="280" y="225" width="75" height="70" fill="#1e293b" stroke="#475569" rx="4" />
              <text x="295" y="262" fill="#94a3b8" fontSize="9" fontWeight="bold">CHIPSET</text>

              {/* Interactive Component Zones */}
              {COMPONENTS.map(comp => {
                const isSelected = comp.id === activeCompId;
                return (
                  <g
                    key={comp.id}
                    onClick={() => {
                      soundFx.click();
                      setActiveCompId(comp.id);
                    }}
                    className="cursor-pointer group"
                  >
                    <rect
                      x={comp.coords.x}
                      y={comp.coords.y}
                      width={comp.coords.w}
                      height={comp.coords.h}
                      rx="4"
                      fill={isSelected ? '#0284c7' : '#0f172a'}
                      fillOpacity={isSelected ? 0.9 : 0.85}
                      stroke={isSelected ? '#38bdf8' : '#475569'}
                      strokeWidth={isSelected ? 2.5 : 1.5}
                      className="transition-all duration-200 group-hover:stroke-cyan-400 group-hover:fill-cyan-900/60"
                    />
                    <text
                      x={comp.coords.x + comp.coords.w / 2}
                      y={comp.coords.y + comp.coords.h / 2 + 3}
                      fill={isSelected ? '#ffffff' : '#cbd5e1'}
                      fontSize="8"
                      fontWeight="bold"
                      textAnchor="middle"
                      className="pointer-events-none select-none tracking-tight"
                    >
                      {comp.name.split(' ')[0]}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>

          {/* Quick Component Buttons Ribbon */}
          <div className="flex items-center gap-2 overflow-x-auto pt-4 scrollbar-none">
            {COMPONENTS.map(c => (
              <button
                key={c.id}
                onClick={() => {
                  soundFx.click();
                  setActiveCompId(c.id);
                }}
                className={`px-3 py-1.5 text-xs rounded-xl whitespace-nowrap font-medium transition-colors shrink-0 border ${
                  c.id === activeCompId
                    ? 'bg-cyan-500 text-slate-950 font-bold border-cyan-400 shadow-sm'
                    : 'bg-slate-100 dark:bg-slate-950 text-slate-700 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white border-slate-200 dark:border-slate-800 hover:bg-slate-200 dark:hover:bg-slate-900'
                }`}
              >
                {c.name.split(' (')[0]}
              </button>
            ))}
          </div>
        </div>

        {/* Right: Active Component Inspector */}
        <div className="lg:col-span-5 bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-7 space-y-5 shadow-sm dark:shadow-cyan-950/20">
          <div className="pb-3 border-b border-slate-200 dark:border-slate-800">
            <span className="text-xs font-mono font-bold text-cyan-600 dark:text-cyan-400 uppercase tracking-wider">
              {activeComp.category}
            </span>
            <h3 className="text-xl font-extrabold text-slate-900 dark:text-white mt-1">
              {activeComp.name}
            </h3>
          </div>

          <div>
            <span className="text-xs font-bold font-mono text-slate-600 dark:text-slate-400 uppercase tracking-wider block mb-1.5">
              Especificación de Ingeniería
            </span>
            <p className="text-xs sm:text-sm text-cyan-900 dark:text-cyan-300 leading-relaxed font-mono bg-cyan-50/70 dark:bg-slate-950 p-3.5 rounded-2xl border border-cyan-200 dark:border-slate-800">
              {activeComp.spec}
            </p>
          </div>

          <div>
            <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider block mb-1.5 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              Protocolo Estandarizado de Mantenimiento
            </span>
            <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
              {activeComp.maintenanceProtocol}
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/50 space-y-1">
            <span className="text-xs font-bold text-rose-700 dark:text-rose-300 uppercase tracking-wider block flex items-center gap-1.5">
              <AlertCircle className="w-4 h-4 text-rose-500" />
              Síntomas Típicos de Falla / Suciedad
            </span>
            <p className="text-xs text-rose-900 dark:text-rose-200 leading-relaxed">
              {activeComp.failureSymptom}
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-amber-50 dark:bg-slate-950 border border-amber-200 dark:border-slate-800 text-xs text-slate-800 dark:text-slate-300 space-y-1">
            <span className="font-bold text-amber-800 dark:text-amber-300 block">
              Consejo Práctico de Laboratorio:
            </span>
            <p className="leading-relaxed">
              {activeComp.proTip}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
