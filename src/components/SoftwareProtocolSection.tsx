import React, { useState } from 'react';
import { Terminal, Copy, Check, Play, HardDrive, ShieldCheck, AlertCircle } from 'lucide-react';

interface CommandScript {
  id: string;
  name: string;
  command: string;
  description: string;
  target: 'SO' | 'SSD' | 'HDD' | 'Red';
  outputSimulation: string[];
}

const COMMANDS: CommandScript[] = [
  {
    id: 'dism',
    name: 'Reparación de Almacén de Componentes Windows (DISM)',
    command: 'DISM /Online /Cleanup-Image /RestoreHealth',
    description: 'Compara los archivos del sistema con los binarios oficiales de Windows Update y descarga copias limpias para reparar corrupciones profundas.',
    target: 'SO',
    outputSimulation: [
      'Deployment Image Servicing and Management tool',
      'Version: 10.0.22621.1',
      'Image Version: 10.0.22621.2428',
      '[==========================100.0%==========================]',
      'The restore operation completed successfully.',
      'The component store corruption was repaired.',
      'The operation completed successfully.'
    ]
  },
  {
    id: 'sfc',
    name: 'Comprobador de Archivos de Sistema (SFC)',
    command: 'sfc /scannow',
    description: 'Examina todos los archivos protegidos del sistema operativo y reemplaza los archivos dañados por copias en caché desde WinSxS.',
    target: 'SO',
    outputSimulation: [
      'Iniciando examen en el sistema. Este proceso tardará algún tiempo.',
      'Iniciando la fase de comprobación del examen del sistema.',
      'Se completó la comprobación al 100%.',
      'Protección de recursos de Windows encontró archivos dañados y los reparó correctamente.',
      'Los detalles de la reparación están incluidos en CBS.Log windir\\Logs\\CBS\\CBS.log'
    ]
  },
  {
    id: 'trim',
    name: 'Optimización y Comando TRIM para Unidades SSD / NVMe',
    command: 'defrag C: /O',
    description: 'Envía la instrucción TRIM al controlador del SSD informando qué bloques lógicos de datos ya no están en uso para que el Garbage Collector los borre físicamente.',
    target: 'SSD',
    outputSimulation: [
      'Optimizador de unidades de Microsoft',
      'Invocando optimización en (C:)...',
      'Comando TRIM emitido a 184 bloques no asignados.',
      'Tiempo transcurrido: 00:00:03',
      'Estado: La unidad de estado sólido (SSD) se optimizó correctamente.'
    ]
  },
  {
    id: 'chkdsk',
    name: 'Comprobación de Integridad de Disco y Sistema NTFS',
    command: 'chkdsk C: /f /r',
    description: 'Verifica la estructura de la tabla maestra de archivos (MFT), analiza descriptores de seguridad y busca sectores defectuosos.',
    target: 'HDD',
    outputSimulation: [
      'El tipo del sistema de archivos es NTFS.',
      'No se puede bloquear la unidad actual.',
      '¿Desea que se prepare este volumen para que sea revisado la próxima vez que se reinicie el sistema? (S/N): S',
      'Este volumen se revisará la próxima vez que se reinicie el sistema.'
    ]
  },
  {
    id: 'flushdns',
    name: 'Purga de Caché de Resolución DNS y Pila de Red',
    command: 'ipconfig /flushdns',
    description: 'Vacía la memoria caché de nombres de dominio locales para resolver fallas de conexión a servidores tras infecciones o cambios de DNS.',
    target: 'Red',
    outputSimulation: [
      'Configuración IP de Windows',
      'Se vació correctamente la caché de resolución de DNS.'
    ]
  }
];

export const SoftwareProtocolSection: React.FC = () => {
  const [activeCommandId, setActiveCommandId] = useState<string>('dism');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [terminalLines, setTerminalLines] = useState<string[]>(COMMANDS[0].outputSimulation);
  const [isRunning, setIsRunning] = useState<boolean>(false);

  const activeCommand = COMMANDS.find(c => c.id === activeCommandId) || COMMANDS[0];

  const handleCopy = (cmd: CommandScript) => {
    navigator.clipboard.writeText(cmd.command);
    setCopiedId(cmd.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleRunSimulation = (cmd: CommandScript) => {
    setActiveCommandId(cmd.id);
    setIsRunning(true);
    setTerminalLines([`C:\\Windows\\system32> ${cmd.command}`, 'Ejecutando comando con privilegios de Administrador...']);
    
    setTimeout(() => {
      setTerminalLines([`C:\\Windows\\system32> ${cmd.command}`, ...cmd.outputSimulation]);
      setIsRunning(false);
    }, 800);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-mono font-bold text-cyan-600 dark:text-cyan-400 tracking-wider">
          <Terminal className="w-4 h-4 text-cyan-500" />
          <span>FASE 04 · PROTOCOLO DE INTERVENCIÓN LÓGICA</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight mt-1">
          Mantenimiento Lógico y del Sistema Operativo
        </h2>
        <p className="text-slate-600 dark:text-slate-300 mt-2 text-sm sm:text-base leading-relaxed max-w-4xl">
          El mantenimiento físico debe complementarse con la reparación de la integridad de archivos del sistema, optimización de celdas NAND en unidades de estado sólido y eliminación sistemática de basura digital.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left: Commands List */}
        <div className="lg:col-span-6 space-y-3">
          <div className="text-xs font-mono font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-2">
            Comandos de Consola Certificados (CMD como Administrador)
          </div>

          {COMMANDS.map((cmd) => {
            const isSelected = cmd.id === activeCommand.id;
            return (
              <div
                key={cmd.id}
                className={`p-4 sm:p-5 rounded-2xl border transition-all ${
                  isSelected
                    ? 'bg-cyan-50/70 dark:bg-slate-900 border-cyan-500 text-cyan-950 dark:text-cyan-300 shadow-sm ring-1 ring-cyan-500/30'
                    : 'bg-white dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center justify-between gap-3 mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-cyan-700 dark:text-cyan-300 border border-slate-200 dark:border-slate-700">
                      {cmd.target}
                    </span>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                      {cmd.name}
                    </h4>
                  </div>
                  
                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      onClick={() => handleCopy(cmd)}
                      title="Copiar comando"
                      className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors border border-slate-200 dark:border-slate-700"
                    >
                      {copiedId === cmd.id ? <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400" /> : <Copy className="w-4 h-4" />}
                    </button>
                    <button
                      onClick={() => handleRunSimulation(cmd)}
                      title="Simular en consola"
                      className="p-1.5 rounded-lg bg-cyan-500 text-slate-950 hover:bg-cyan-400 transition-colors shadow-xs"
                    >
                      <Play className="w-4 h-4 fill-current" />
                    </button>
                  </div>
                </div>

                <div className="bg-slate-100 dark:bg-slate-950 p-3 rounded-xl border border-slate-200 dark:border-slate-800 font-mono text-xs text-cyan-800 dark:text-cyan-300 select-all mb-2 flex items-center justify-between">
                  <code>{cmd.command}</code>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  {cmd.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* Right: Simulated Terminal & SSD vs HDD Table */}
        <div className="lg:col-span-6 space-y-6">
          
          {/* Interactive PowerShell / CMD Terminal Window */}
          <div className="bg-slate-950 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
            {/* Terminal Top Bar */}
            <div className="bg-slate-900 px-4 py-3 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-rose-500/80" />
                <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                <span className="text-xs font-mono text-slate-400 ml-2">
                  Administrador: Símbolo del sistema (CMD)
                </span>
              </div>
              <Terminal className="w-4 h-4 text-slate-500" />
            </div>

            {/* Terminal Body */}
            <div className="p-5 font-mono text-xs leading-relaxed text-slate-200 min-h-[260px] overflow-x-auto space-y-1">
              <div className="text-slate-500 mb-2">
                Microsoft Windows [Versión 10.0.22621.2428]
                <br />
                (c) Microsoft Corporation. Todos los derechos reservados.
              </div>

              {terminalLines.map((line, idx) => (
                <div 
                  key={idx} 
                  className={
                    line.includes('successfully') || line.includes('correctamente')
                      ? 'text-emerald-400 font-semibold'
                      : line.includes('C:\\Windows')
                      ? 'text-cyan-300 font-bold'
                      : 'text-slate-300'
                  }
                >
                  {line}
                </div>
              ))}

              {isRunning && (
                <div className="text-cyan-400 animate-pulse font-bold mt-2">
                  _ Procesando bloques del sistema...
                </div>
              )}
            </div>
          </div>

          {/* SSD vs HDD Operational Rules Card */}
          <div className="bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-7 space-y-4 shadow-sm dark:shadow-cyan-950/20">
            <div className="flex items-center gap-2">
              <HardDrive className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              <h4 className="text-sm font-extrabold text-slate-900 dark:text-white uppercase tracking-wider">
                Regla de Oro en Almacenamiento: SSD vs HDD
              </h4>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-2xl bg-rose-50 dark:bg-slate-950 border border-rose-200 dark:border-slate-800">
                <div className="font-bold text-rose-700 dark:text-rose-400 mb-1 flex items-center gap-1.5">
                  <AlertCircle className="w-4 h-4 text-rose-500" />
                  NUNCA Desfragmentar un SSD
                </div>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                  Las unidades SSD y NVMe tienen tiempo de acceso aleatorio casi instantáneo (0.1ms). Desfragmentarlos no mejora su velocidad y causa escrituras innecesarias en las celdas NAND, agotando prematuramente su límite de TBW.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-slate-950 border border-emerald-200 dark:border-slate-800">
                <div className="font-bold text-emerald-700 dark:text-emerald-400 mb-1 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  Ejecutar TRIM Regularmente
                </div>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                  El comando TRIM (<code className="text-cyan-700 dark:text-cyan-300 font-bold">defrag C: /O</code>) marca las páginas de memoria borradas para que el controlador SSD las limpie en segundo plano, manteniendo las velocidades sostenidas.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
